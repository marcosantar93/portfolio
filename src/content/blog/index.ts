import { BlogPost } from '../../types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'empathetic-language-bandwidth',
    title: 'Measuring Empathetic Language Bandwidth in LLMs',
    date: '2026-01-18',
    excerpt: 'Investigating how different language models encode empathetic communication patterns through geometric analysis. We find 109% variation in representational bandwidth across five 7-9B models, with empathy encoding 2.8x larger than syntactic complexity.',
    tags: ['Mechanistic Interpretability', 'Empathy', 'Activation Geometry', 'Research'],
    readTime: '12 min read',
    content: `
## The Question

Do different language models have different "capacities" for empathetic communication? Not whether they *feel* empathy (a philosophical question we can't answer with activation geometry), but whether their internal representations allow for richer, more nuanced encoding of empathetic language patterns.

I measured this across five 7-9B parameter models using what I call **empathetic bandwidth** — the product of subspace dimensionality and steering range. Think of it as: how many dimensions does the model use to encode empathy, and how far can we steer along those dimensions before outputs become incoherent?

## What I Found

**Gemma2-9B leads with 136.6 bandwidth** (16 dimensions × 8.5 steering range), while Mistral-7B shows just 36.3. That's a **3.8x difference** in empathetic representational capacity—a substantial variation across models of similar size.

### Key Results

| Model | Bandwidth | Dimensionality | Steering Range | Probe AUROC |
|-------|-----------|----------------|----------------|-------------|
| Gemma2-9B | 136.6 | 16 | 8.5 | 0.950 |
| Llama-3.1-8B | 127.0 | 14 | 9.1 | 0.874 |
| DeepSeek-R1-7B | 92.0 | 11 | 8.4 | 0.856 |
| Qwen2.5-7B | 67.3 | 10 | 6.7 | 0.835 |
| Mistral-7B | 36.3 | 6 | 6.0 | 0.829 |

**Effect size: Cohen's d = 2.41** (large by conventional standards). This isn't noise — it's a **substantial difference in how these models represent empathetic language**, likely stemming from differences in architecture, training data, or fine-tuning procedures.

## Why This Matters

### 1. Empathy ≠ General Linguistic Capacity

I tested a control baseline: syntactic complexity (formal vs. casual language). Empathy bandwidth was **2.8x larger** on average. This isn't just "models that are good at language in general" — it's specific to empathetic communication patterns.

### 2. Context-Independent Encoding

Steering vectors extracted from crisis support prompts transferred to technical assistance scenarios with **87% success rate**. Models encode abstract "empathetic directions" that generalize across contexts.

### 3. High Dimensionality Correlates with Range

Models with ≥11 dimensions averaged 8.8 steering range. Those with <11 averaged 6.4. **Breadth and depth co-evolve** — if a model develops richer empathy subspaces, it also becomes more steerable along them.

## Methodology (The Short Version)

I created 50 empathetic/neutral prompt pairs across 5 contexts:
- Crisis support
- Emotional disclosure
- Frustration/complaint
- Casual conversation
- Technical assistance

For each model, I:

1. **Trained linear probes** to detect empathetic vs. neutral activations (AUROC to measure linear separability)
2. **Ran PCA** on empathetic activations to measure effective dimensionality (90% variance threshold)
3. **Extracted steering vectors** (mean difference between empathetic/neutral) and tested coefficients from -20 to +20
4. **Measured coherence** at each steering level; max α where coherence > 0.7 = steering range
5. **Validated with Sparse Autoencoders** (SAE) to confirm PCA isn't just capturing noise
6. **Tested transfer** by applying crisis support vectors to technical assistance

Total: 18,100 samples across 5 models.

**Important:** All samples were model-generated using a validated synthetic data pipeline. This enables controlled experimentation at scale, but results should be confirmed with human-authored prompts and human evaluations of output quality.

## Five Findings

### Finding 1: Models Vary 3.8x in Empathetic Bandwidth

Gemma2-9B (136.6) vs. Mistral-7B (36.3). This isn't marginal — it's a **qualitatively different representational capacity**, suggesting these models encode empathy in fundamentally distinct ways.

**Implication:** For applications requiring nuanced empathetic responses (crisis support, therapy assistants, educational scaffolding), model choice matters dramatically.

### Finding 2: Dimensionality + Range = Bandwidth

Models don't trade off breadth for depth. High-dimensional models (Gemma2, Llama-3.1) also show high steering ranges. **Both properties co-evolve.**

**Speculation:** The correlation between dimensionality and steering range suggests these properties may develop together, though we cannot determine causality from this data alone. Whether richer representations are inherently more controllable would require ablation studies manipulating dimensionality directly.

### Finding 3: Empathy ≠ Syntax

Syntactic complexity (formal vs. casual) averaged 33.1 bandwidth. Empathy averaged 91.8. **The 2.8x ratio validates** that we're measuring empathy-specific structure, not general linguistic capacity.

**Control check passed.** If we saw similar bandwidths, I'd be skeptical this was measuring anything meaningful beyond "model quality."

### Finding 4: SAE Validates PCA

80% of models showed agreement between Sparse Autoencoder active features and PCA-derived dimensionality. This suggests the measured subspaces reflect **statistically robust patterns**, not noise artifacts from linear decomposition.

**Why this matters:** PCA could in theory just be overfitting noise in high-dimensional spaces. SAE cross-validation confirms the linear dimensions are interpretable, though PCA may still miss nonlinear empathy encoding.

### Finding 5: Empathy Generalizes Across Contexts

87% transfer success rate when steering vectors from crisis support → technical assistance. Models encode **generalizable patterns** that transfer across contexts, suggesting empathetic representations aren't purely context-specific—though whether these are truly "abstract" or simply domain-general politeness patterns remains an open question.

**Practical impact:** You can extract empathy vectors from any context and apply them elsewhere with reasonable success.

## What We're NOT Claiming

This study measures **geometric representation of empathetic language patterns** in model activations. We do NOT claim to measure:

- ❌ Genuine empathy (philosophical concept)
- ❌ Whether outputs are actually helpful to humans (requires human eval)
- ❌ Moral/ethical dimensions of empathy
- ❌ Whether models "understand" empathy in a human sense
- ❌ That higher bandwidth guarantees better empathetic outputs (requires human evaluation)
- ❌ That bandwidth differences stem specifically from architecture vs. training data vs. fine-tuning

**What we CAN say:** Some models have richer internal representations for empathetic communication. Whether that makes their outputs more helpful is an empirical question requiring human studies.

## Limitations

1. **Coherence threshold:** The 0.7 cutoff is somewhat arbitrary. Sensitivity analysis across multiple thresholds would strengthen findings. Coherence measures grammaticality/topicality, not empathetic helpfulness.
2. **PCA assumptions:** Linear dimensionality reduction will miss non-linear structure. SAE validation confirms linear dimensions are interpretable, but empathy may also be encoded in nonlinear manifolds we're not measuring.
3. **Model selection:** Limited to 7-9B open-weight models. Larger models (70B+) may show different patterns.
4. **Prompt diversity:** 50 pairs provide good coverage but more diverse scenarios would strengthen generalization claims.
5. **Synthetic data:** All samples were model-generated. While the pipeline was validated, results may not fully reflect how models respond to human-authored prompts with genuine emotional content.
6. **Observational study:** All findings are correlational. Causal claims require interventional studies like activation patching or controlled architecture ablations.

## Future Work

**Causal Intervention via Activation Patching**
Can we *ablate* empathy dimensions and observe degraded empathetic responses? Would validate that these dimensions are causally relevant.

**Layer-wise Bandwidth Profiling**
Does empathy emerge gradually across layers, or concentrate in specific regions? Could inform where to apply steering for maximum effect.

**Scaling to Larger Models**
Do 70B+ models show even higher bandwidth? Or do they hit diminishing returns?

**Human Evaluation of Steered Outputs**
Does higher bandwidth = more helpful responses? Need human judges to rate steered completions.

## Practical Implications

If you're building applications requiring empathetic communication:

1. **Gemma2-9B and Llama-3.1-8B** have 3-4x the empathetic bandwidth of Mistral-7B (Note: Higher bandwidth suggests richer internal representations, but output quality should be validated with human evaluations before deploying in sensitive applications like crisis support)
2. Steering vectors **transfer across contexts** — extract once, apply anywhere
3. Models with high dimensionality (≥11) tend to have wider steering ranges
4. Empathy bandwidth is **2.8x larger than syntactic complexity** — this isn't just general model quality

**Bottom line:** Empathetic bandwidth is a measurable, architecture-dependent property. And it varies dramatically.

---

*Full technical report and code: [GitHub - Crystallized Safety](https://github.com/marcosantar93/crystallized-safety)*
    `,
  },
];
