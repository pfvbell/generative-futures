---
title: "Why we don't understand AI models yet"
subtitle: "Breaking apart LLMs with Lee Sharkey"
description: "AI researcher Lee Sharkey explains mechanistic interpretability, reverse-engineering LLMs, why we grasp only ~1% of how they work, and why it matters for safety."
pubDate: 2025-08-15
type: podcast
durationMinutes: 55
youtubeId: "9aVu_-5-oEQ"
substackUrl: "https://genfutures.substack.com/p/why-we-dont-understand-ai-models"
topics: ["how-ai-works", "ai-safety-and-alignment"]
guest:
  name: "Lee Sharkey"
  bio: "AI interpretability researcher; co-founder of Apollo Research and interpretability lead at Goodfire AI, with a background in computational neuroscience."
summary: "Phil Bell interviews AI safety researcher Lee Sharkey on mechanistic interpretability, the science of reverse-engineering neural networks to understand their internal computation. The core argument: we can build powerful LLMs far more easily than we can explain them, with current understanding perhaps only 1% of what's needed. Borrowing tools from computational neuroscience, researchers use sparse autoencoders to surface interpretable 'features', but still can't trace step-by-step computation."
takeaways:
  - "Building AI is far easier than understanding it; we may grasp only ~1% of how LLMs work internally."
  - "Mechanistic interpretability borrows directly from computational neuroscience."
  - "Models encode concepts as activation patterns across very high-dimensional spaces that defy human intuition."
  - "Sparse autoencoders find recurring interpretable features (e.g. Anthropic's Golden Gate Bridge feature) but don't explain the full computation."
  - "Current interpretability is inadequate to verify the safety of superhuman systems; methods must improve and scale."
faqs:
  - question: "What is mechanistic interpretability?"
    answer: "It is the emerging science of reverse-engineering the internal computations of neural networks, identifying the features and circuits a model uses, so we can understand, not just observe, how AI produces its outputs."
  - question: "How well do we understand how LLMs work?"
    answer: "Very poorly. Sharkey estimates current understanding may be around 1% of what is needed, since models can be built and deployed without any clear account of their internal mechanisms."
  - question: "Why does interpretability matter for AI safety?"
    answer: "Without understanding internal mechanisms we cannot reliably verify that increasingly capable systems are safe. Better, scalable interpretability is needed to audit and steer them."
entities:
  - "Lee Sharkey"
  - "Apollo Research"
  - "Goodfire AI"
  - "Anthropic"
  - "Geoffrey Hinton"
  - "Mechanistic interpretability"
  - "Sparse autoencoders"
  - "Golden Gate Bridge feature"
  - "Monosemanticity"
keywords:
  - "mechanistic interpretability"
  - "understanding LLMs"
  - "sparse autoencoders"
  - "AI safety"
  - "Lee Sharkey"
  - "neural network features"
  - "Golden Gate Bridge feature"
  - "reverse-engineering AI"
---

We can build systems we cannot explain. That gap, between our ability to *make* powerful AI and our ability to *understand* it, is the subject of this conversation, and arguably the central problem in AI safety.

Lee Sharkey works on mechanistic interpretability: the attempt to reverse-engineer what's actually happening inside a neural network, borrowing tools from the field he trained in, computational neuroscience. His sobering estimate is that we currently understand perhaps 1% of how these models work. He walks through how researchers use sparse autoencoders to pull human-readable "features" out of the noise, including Anthropic's famous Golden Gate Bridge feature, and why that's progress but nowhere near enough.

If you want to grasp why "we don't really know how it works" is a literal statement about frontier AI, not a figure of speech, start here. It's also one of the clearest explanations of interpretability you'll find for a non-technical audience.
