---
title: "Why LLMs can't count"
subtitle: "Are they System 2 processors yet?"
description: "LLMs fail at counting and arithmetic because their architecture pattern-matches rather than reasons. Three technical reasons why — and why chain-of-thought won't fix it."
pubDate: 2026-05-21
type: essay
substackUrl: "https://genfutures.substack.com/p/why-llms-cant-count"
topics: ["how-ai-works"]
summary: "Why do large language models struggle with precise counting and arithmetic over long sequences? Pre-training resembles fast, intuitive 'System 1' processing; post-training only approximates deliberate 'System 2' reasoning, yet both run on the same next-token mechanism. Three architectural causes — representational collapse, over-squashing, and softmax normalisation — blur the distinctions needed for exact counts. Even chain-of-thought and tool use fail on long enough sequences."
takeaways:
  - "LLM pre-training mimics System 1 (pattern-matching); post-training approximates System 2, but the distinction is behavioural, not mechanistic."
  - "Representational collapse makes long number sequences blur into overlapping embeddings."
  - "Over-squashing produces U-shaped performance where end-of-sequence tokens get swamped by earlier information."
  - "Softmax normalisation erases the absolute scale needed for accurate arithmetic."
  - "Chain-of-thought doesn't fix it, and corrupted intermediate data can propagate even into tool use."
faqs:
  - question: "Why can't LLMs count or do arithmetic reliably?"
    answer: "Their architecture pattern-matches rather than computes. Representational collapse, over-squashing, and softmax normalisation blur the fine distinctions between long sequences needed for exact counting."
  - question: "Does chain-of-thought reasoning fix LLM counting errors?"
    answer: "No. Step-by-step reasoning still fails on sufficiently long sequences, and corrupted intermediate results can propagate even when the model uses external tools."
  - question: "Are LLMs doing System 2 reasoning yet?"
    answer: "Not really. Post-training only behaviourally approximates deliberate System 2 reasoning, while still running on the same next-token-prediction mechanism as fast System 1 pattern-matching."
entities:
  - "Daniel Kahneman"
  - "Yoshua Bengio"
  - "Stanislas Dehaene"
  - "Federico Barbero"
  - "Yann LeCun"
  - "Google DeepMind"
  - "System 1 / System 2"
  - "Representational collapse"
  - "Over-squashing"
  - "Softmax"
  - "RLVR"
keywords:
  - "why LLMs can't count"
  - "LLM arithmetic limitations"
  - "System 1 System 2 LLM"
  - "transformer counting failures"
  - "over-squashing"
  - "representational collapse"
  - "chain-of-thought limitations"
  - "LLM reasoning"
---

It sounds like a party trick: a model that can pass the bar exam but miscounts the letters in "strawberry." But the failure is a window into how these systems actually work.

This essay uses Kahneman's System 1 / System 2 distinction to explain it. Pre-training builds something like fast, intuitive pattern-matching; the newer "reasoning" training only *behaves* like deliberate step-by-step thought while running on the very same next-token machinery. Underneath, three concrete architectural pressures — representational collapse, over-squashing, and softmax normalisation — destroy exactly the fine-grained distinctions counting requires.

The payoff isn't pedantry about arithmetic. It's a sharper picture of what "jagged" AI capability really is, and why patches like chain-of-thought or tool use don't make the underlying problem disappear.
