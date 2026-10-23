/**
 * Refresh the monthly and quarterly series behind /national-accounts.
 *
 *   npm run accounts:refresh
 *
 * Pulls straight from each publisher and rewrites src/data/national-accounts/series.json:
 *   - ONS time series API: DTWM, YBHA, AA6H (UK Economic Accounts), MGWY, MGSX (labour market)
 *   - Alaska Department of Revenue: Permanent Fund Dividend payment history
 *   - Norges Bank Investment Management: fund market value
 *   - Statistics Norway, table 09189: nominal GDP
 * Annual tables (unions, share ownership, housing, wealth, OECD) are hand-maintained in
 * reference.json. Commit the result and the next deploy picks it up.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../../src/data/national-accounts/series.json', import.meta.url));
const UA = { 'User-Agent': 'Mozilla/5.0 (generative-futures national-accounts refresh)' };
const MONTHS = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'.split(' ');

async function get(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { ...UA, ...init.headers } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}
const ons = async (path) => JSON.parse(await get(`https://www.ons.gov.uk/${path}/data`));
const strip = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const londonDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'long', year: 'numeric' });
const isoDate = (text) => (text ? new Date(`${text} 12:00 UTC`).toISOString().slice(0, 10) : '');

const releases = [];
const noteRelease = (series, title, d) => releases.push({
  series,
  title,
  publisher: 'ONS',
  last_release: londonDate(d.description.releaseDate),
  next_release: d.description.nextRelease ?? '',
  next_release_iso: isoDate(d.description.nextRelease),
});

// Wage share inputs and current account, annual
const [dtwm, ybha, aa6h] = await Promise.all([
  ons('economy/grossdomesticproductgdp/timeseries/dtwm/ukea'),
  ons('economy/grossdomesticproductgdp/timeseries/ybha/ukea'),
  ons('economy/nationalaccounts/balanceofpayments/timeseries/aa6h/ukea'),
]);
const gdp = new Map(ybha.years.map((y) => [y.date, Number(y.value)]));
const wage_share = dtwm.years
  .filter((y) => gdp.has(y.date))
  .map((y) => ({ year: Number(y.date), compensation_gbp_m: Number(y.value), gdp_gbp_m: gdp.get(y.date) }));
const current_account = aa6h.years.map((y) => ({ year: Number(y.date), balance_pct_gdp: Number(y.value) }));
noteRelease('Wage share and current account', 'UK Economic Accounts (DTWM, YBHA, AA6H)', dtwm);

// Unemployment by age: rolling three-month LFS periods, labelled by their middle month
const [mgwy, mgsx] = await Promise.all([
  ons('employmentandlabourmarket/peoplenotinwork/unemployment/timeseries/mgwy/lms'),
  ons('employmentandlabourmarket/peoplenotinwork/unemployment/timeseries/mgsx/lms'),
]);
const allAges = new Map(mgsx.months.map((m) => [m.date, Number(m.value)]));
const unemployment = mgwy.months.map((m) => {
  const [y, mon] = m.date.split(' ');
  return {
    month: `${y}-${String(MONTHS.indexOf(mon) + 1).padStart(2, '0')}`,
    period: m.label,
    youth_pct: Number(m.value),
    all_pct: allAges.get(m.date) ?? null,
  };
});
noteRelease('Unemployment by age', 'Labour market overview (MGWY, MGSX)', mgwy);

// Alaska Permanent Fund Dividend, every year since 1982
const pfdHtml = await get('https://pfd.alaska.gov/Division-Info/summary-of-dividend-applications-payments');
const alaska_pfd = [...pfdHtml.matchAll(/<tr[\s\S]*?<\/tr>/g)]
  .map((tr) => [...tr[0].matchAll(/<t[dh][\s\S]*?<\/t[dh]>/g)].map((c) => strip(c[0]).trim()))
  .filter((cells) => /^\d{4}$/.test(cells[0] ?? ''))
  .map((cells) => {
    const n = (s) => Number(s.replace(/[^\d.]/g, ''));
    return { year: Number(cells[0]), dividend_usd: n(cells[4]), applications_paid: n(cells[3]), population: n(cells[1]) };
  })
  .sort((a, b) => a.year - b.year);
if (!alaska_pfd.length) throw new Error('Alaska PFD table not found');
releases.push({
  series: 'Alaska dividend amounts',
  title: 'Summary of dividend applications and payments',
  publisher: 'Alaska Dept of Revenue',
  last_release: `${alaska_pfd.at(-1).year} dividend`,
  next_release: 'Each October',
  next_release_iso: `${alaska_pfd.at(-1).year + 1}-10-31`,
});

// Norway: fund value (NBIM) and nominal GDP (SSB 09189)
const nbim = strip(await get('https://www.nbim.no/en/the-fund/market-value/'));
const nv = /At end of the (.+?) of (\d{4}), the fund's value was ([\d,]+) billion kroner/.exec(nbim);
if (!nv) throw new Error('NBIM market value sentence not found');
const ssb = JSON.parse(await get('https://data.ssb.no/api/v0/en/table/09189/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: [
      { code: 'Makrost', selection: { filter: 'item', values: ['bnpb.nr23_9'] } },
      { code: 'ContentsCode', selection: { filter: 'item', values: ['Priser'] } },
      { code: 'Tid', selection: { filter: 'top', values: ['1'] } },
    ],
    response: { format: 'json-stat2' },
  }),
}));
const norway_fund = {
  fund: 'Government Pension Fund Global',
  place: 'Norway',
  assets_bn: Number(nv[3].replace(/,/g, '')),
  currency: 'NOK',
  assets_as_of: `End of ${nv[1]} ${nv[2]}`,
  gdp_bn: Math.round(ssb.value[0] / 100) / 10,
  gdp_year: Number(Object.keys(ssb.dimension.Tid.category.index)[0]),
  pays_dividend: 'No (funds the state budget)',
  source: 'nbim',
};

const out = { generated: new Date().toISOString(), wage_share, current_account, unemployment, alaska_pfd, norway_fund, releases };
await writeFile(OUT, `${JSON.stringify(out, null, 1)}\n`);
console.log(`series.json: ${wage_share.length} years of accounts, ${unemployment.length} labour market periods, ${alaska_pfd.length} dividends; latest LFS ${unemployment.at(-1).period}`);
