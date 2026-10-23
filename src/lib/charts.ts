/**
 * Scale helpers for the build-time charts on /national-accounts.
 * Charts are drawn in percentages so they reflow at any width without client JS.
 */

/** A d3-style "nice" step: 1, 2 or 5 times a power of ten. */
export function tickStep(min: number, max: number, count: number) {
  const raw = (max - min || 1) / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const err = raw / pow;
  return pow * (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1);
}

/** A linear y scale with nice bounds. `at(v)` is the distance from the bottom, in %. */
export function niceScale(min: number, max: number, count = 5) {
  const step = tickStep(min, max, count);
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { lo, hi, ticks, at: (v: number) => (hi === lo ? 0 : ((v - lo) / (hi - lo)) * 100) };
}

/** Round to one decimal place. */
export const r1 = (v: number) => Math.round(v * 10) / 10;

/** Format with a true minus sign and a fixed number of decimals. */
export function fmt(v: number, decimals = 1, unit = '', signed = false) {
  const s = Math.abs(v).toFixed(decimals);
  const sign = v < 0 ? '−' : signed && v > 0 ? '+' : '';
  return `${sign}${s}${unit}`;
}
