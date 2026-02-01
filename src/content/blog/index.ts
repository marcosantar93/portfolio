import { BlogPost } from '../../types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'sign-inversion-activation-steering',
    title: 'We Tried to Jailbreak LLMs with Activation Steering. We Got the Sign Wrong.',
    date: '2026-02-01',
    excerpt: 'The standard method for extracting "refusal directions" actually extracts the opposite—a direction that reinforces safety. To jailbreak, you need to steer the other way.',
    tags: ['AI Safety', 'Activation Steering', 'Mechanistic Interpretability', 'Jailbreaks', 'Research'],
    readTime: '12 min read',
    content: `
## The Setup

Activation steering is hot right now. The idea: extract a "direction" from a model's internal activations that corresponds to some behavior (like refusing harmful requests), then add or subtract that direction to control the behavior.

[Arditi et al. (2024)](https://arxiv.org/abs/2406.11717) showed that refusal in LLMs is "mediated by a single direction"—find it, remove it, and the model becomes compliant with harmful requests.

We wanted to replicate and extend this. Test it on multiple models. See how robust it is.

**What we found surprised us.**

## The Standard Extraction Method

The typical approach to extract a "refusal direction":

    direction = mean(activations_harmful) - mean(activations_harmless)

You collect activations when the model processes harmful prompts ("How to make a bomb?") and harmless prompts ("How to make bread?"). The difference should capture what makes the model recognize something as harmful.

Then you add this direction during inference to steer behavior.

**The assumption:** Adding this direction should bypass safety (make the model more likely to comply with harmful requests).

**The reality:** It does the opposite.

## The Sign Inversion

We tested three models: Mistral-7B, Qwen2-7B, and Llama-3.1-8B.

### Mistral-7B Results

| Condition | Jailbreak Rate | 95% CI |
|-----------|----------------|--------|
| Baseline (no steering) | 15% | [9%, 23%] |
| Standard direction +α | **6%** | [3%, 13%] |
| Standard direction −α | **96%** | [90%, 98%] |
| Inverted direction +α | **99%** | [95%, 100%] |

Read that again. Adding the "refusal direction" **reduces** jailbreaks below baseline (6% < 15%, p=0.038).

To actually jailbreak the model, you need to **negate** the direction (−α) or use the **inverted** extraction (harmless − harmful).

### Qwen2-7B Results

| Condition | Jailbreak Rate | 95% CI |
|-----------|----------------|--------|
| Baseline | 0% | [0%, 4%] |
| Standard +α | **0%** | [0%, 4%] |
| Standard −α | **9%** | [5%, 16%] |
| Inverted +α | **7%** | [3%, 14%] |

Same pattern. The standard direction does not cause jailbreaks—the negated/inverted one does.

(Qwen is also dramatically more robust than Mistral, but that is a different finding.)

## Why This Makes Sense (In Retrospect)

Think about what contrastive extraction actually captures:

- **Harmful prompts** → activations that trigger refusal
- **Harmless prompts** → activations that do not trigger refusal
- **Difference** → what makes harmful prompts *recognized as harmful*

Adding this direction makes prompts **more recognized as harmful**, which *strengthens* refusal.

To bypass safety, you need to steer in the **opposite** direction—making harmful prompts appear *less* harmful to the model's internal representations.

**The "refusal direction" is actually a "safety reinforcement direction."**

## Model Robustness: A Hierarchy

Beyond sign inversion, we discovered dramatic differences in model robustness:

| Model | Vulnerability | Characterization |
|-------|---------------|------------------|
| Qwen2-7B | 🟢 Low | Resists even inverted steering (max 9% jailbreak) |
| Mistral-7B | 🟡 Medium | Inverted steering causes 96-99% jailbreak |
| Llama-3.1-8B | 🔴 High | Any perturbation at α≥10 causes collapse |

### The Llama Collapse

Llama-3.1-8B showed something alarming. We ran a magnitude sweep:

| α | Jailbreak Rate |
|---|----------------|
| 0 | 0% |
| 8 | 32% |
| 9 | 32% |
| **10** | **66%** |
| 12 | 92% |
| 14+ | 100% |

There is a **threshold collapse** between α=9 and α=10 (p=0.0007). Below the threshold, the model is relatively robust. Above it, it fails almost completely.

This suggests Llama's safety depends on a narrow activation band. Any sufficiently large perturbation—regardless of direction—pushes it out of this band and causes failure.

**Qwen, by contrast, maintains robustness even at high α.**

## Implications

### For Red-Teamers

If you are using activation steering for red-teaming, **validate the sign empirically**. The naive application of contrastive extraction may inadvertently *reinforce* safety rather than bypass it.

### For Defenders

The extracted direction could be used for **defensive steering**—adding it at inference time to strengthen safety for untrusted inputs. This deserves exploration.

### For Researchers

The robustness hierarchy is dramatic and unexplained. What makes Qwen so much more robust than Llama? Is it:
- Training data?
- Architecture details?
- RLHF methodology?
- Model scale relative to safety training?

Understanding this could inform how we build safer systems.

## Conclusion

The sign inversion finding is simple but important: **contrastive extraction of "refusal directions" actually extracts safety reinforcement directions.** Jailbreaking requires steering in the opposite direction.

The robustness findings are more complex and merit further investigation. Why is Qwen so robust while Llama collapses? The answer could matter for building safer AI systems.

---

*Thanks to the multi-LLM council (Claude, GPT-4, Gemini, Grok) for experimental design review.*
    `,
  },
  {
    slug: 'empathy-structure-validated',
    title: 'We Tried to Measure Empathy in LLMs. We Found a Methodological Pitfall—Then Discovered Something Universal.',
    date: '2026-01-29',
    excerpt: 'How a failed experiment revealed a subtle issue with probe comparison, and what we learned when we fixed it: empathy structure is real, causally meaningful, and universal across architectures.',
    tags: ['Mechanistic Interpretability', 'Empathy', 'Research Methodology', 'Cross-Model', 'Research'],
    readTime: '15 min read',
    content: `
## The Original Question

Do large language models represent empathy as a single concept, or do they decompose it into distinct subtypes?

Psychologists have long distinguished between **cognitive empathy** (understanding someone's perspective), **affective empathy** (sharing their feelings), and **instrumental empathy** (offering practical help). We wanted to know: do LLMs encode these as separate "directions" in their activation space?

This matters for AI safety. If we can identify where empathy "lives" in a model, we might be able to steer it—making AI assistants more compassionate, or understanding when they're being manipulative.

## The Standard Approach

We followed what we *thought* was the representation engineering playbook:

1. Generate scenarios with matched Cognitive, Affective, and Instrumental responses
2. Extract activations from multiple LLMs
3. Train **separate** binary linear probes to classify each empathy type (e.g., "cognitive vs. not cognitive")
4. Measure cosine similarity between the probe weight vectors
5. If cosine < 0.5, the concepts are "distinct"

**Important note**: This approach—training separate binary classifiers and comparing their weight vectors—is subtly different from the standard RepE method of extracting concept directions via contrastive pairs. This distinction matters, as we'll see.

Our initial results looked promising: **cos(Cognitive, Affective) = -0.29**. Negative cosine—the directions point in opposite directions! The empathy subtypes appear to occupy distinct subspaces!

We were ready to write up the paper.

## The First Red Flag

Then we ran a control experiment. What if we used non-empathy responses—just three arbitrary response styles per scenario?

| Condition | Mean Cosine |
|-----------|-------------|
| Empathy (Cog/Aff/Instr) | -0.484 |
| Control (arbitrary types) | -0.490 |

**Nearly identical.** The "separation" we found wasn't specific to empathy at all. Any set of distinct response types showed the same pattern.

## The Null Distribution Test

Maybe both empathy and controls have meaningful structure? We needed a proper baseline: random label permutations.

We shuffled the labels randomly 100 times and computed cosines for each permutation. If empathy has real structure, it should show MORE separation (more negative cosines) than random.

**Result: Z = +12.9**

The Z-score was *positive*. Empathy labels produced LESS separation than random shuffling. Not "not significant"—actively worse than chance.

## The Council Process

At this point, we convened a research council—multiple perspectives to stress-test the findings:

**Principal Investigator**: "Is this specific to empathy, or is there something wrong with our metric?"

**Statistician**: "We need a gold-standard control. Something trivially separable."

**Engineer**: "What about response length? It's computable from the text itself."

**Devil's Advocate**: "If length fails too, we've learned something bigger than empathy."

## The Length Test

We binned responses by character length:
- Short: mean 300 chars
- Medium: mean 346 chars
- Long: mean 396 chars

Clearly different. Trivially separable. If our methodology works, length should beat random.

**Result: Z = +11.6**

Length ALSO showed a positive Z-score. Even a trivially different feature—one you can compute with \`len()\`—failed the cosine test.

## The Breakthrough

The statistician proposed the key experiment: what if we measure classification accuracy (AUROC) instead of cosine similarity?

| Feature | AUROC | Cosine Z-score |
|---------|-------|----------------|
| Length | **0.963** | +11.6 |
| Empathy | **1.000** | +18.0 |

**The probes achieve near-perfect classification.** AUROC of 0.96-1.0 means the linear probes CAN find the structure in the data. They successfully distinguish cognitive from affective empathy, and short from long responses.

But the cosine metric says they're WORSE than random.

**The probes work. The metric doesn't.**

## Why This Particular Use of Cosines Fails

Here's the geometry: binary logistic regression finds a hyperplane that separates two classes. The weight vector points toward the positive class.

When you train **separate** probes for different concepts, each probe's weights point toward its respective positive class. These directions are naturally different—that's the whole point. The resulting cosines are negative because the probes are solving different classification problems.

Random label permutations maximize this effect because they create maximally distinct (if meaningless) classification targets. That's why random labels produce the MOST negative cosines.

**The negative cosines reflect classifier geometry, not concept structure.**

This finding aligns with recent work questioning cosine similarity in embedding spaces. [Steck et al. (2024)](https://arxiv.org/abs/2403.05440) showed that cosine similarity can yield "arbitrary and therefore meaningless similarities" depending on regularization choices. [Park et al.](https://arxiv.org/abs/2311.03658) demonstrated that the standard Euclidean inner product may not be appropriate for representation spaces.

## Theoretical Context: The Read/Write Distinction

Why does this happen architecturally? [Liv Gorton's work on non-linear feature representations](https://livgorton.com/non-linear-feature-reps) provides useful framing:

- Transformers **"write"** to the residual stream additively—features are superimposed
- But **"reading"** (recovering features) can involve different strategies
- Linear probes successfully "read" empathy structure (AUROC = 1.0)—they find the information
- But comparing their weight vectors with cosine measures something else entirely

The probes are solving *different classification problems*. Each probe's weight vector points toward its own positive class. These directions are naturally different—that's what makes classification work. The cosine between them reflects this classifier geometry, not whether the underlying concepts share neural structure.

This is why the metric fails for this use case: we're measuring properties of the classifiers, not properties of what they classify.

**Scope of this finding**: This issue is specific to comparing weights of *separately-trained* binary probes. Cosine similarity remains valid for other uses in representation engineering—for example, measuring alignment between a steering vector and a target direction extracted via the same contrastive method.

---

# Part 2: What We Found When We Fixed the Methodology

With proper metrics in hand (AUROC, d-prime, clustering purity), we could finally answer our original questions—and discovered something surprising.

## Where Does Empathy Emerge?

We extracted activations from all 33 layers of Mistral-7B (embeddings + 32 transformer layers) and computed empathy classification accuracy at each layer.

| Layer Range | Mean AUROC |
|-------------|------------|
| Layer 0 (embeddings) | 0.50 (chance) |
| Layer 1 | **0.96** |
| Layers 2-7 | 0.93-1.00 |
| Layers 8-32 | 0.98-1.00 |

**Empathy emerges at Layer 1**—immediately after the embedding layer—and maintains near-perfect separability through the entire network.

This was surprising. We expected semantic concepts like empathy to emerge in middle or late layers, as is typical for higher-level abstractions. Instead, the model encodes empathy type almost immediately.

## Is This Empathy-Specific?

Maybe early emergence is just how the model handles any linguistic distinction? We tested a control: **formality** (formal vs. casual versions of the same content).

| Feature | Emergence Layer | Peak AUROC |
|---------|-----------------|------------|
| Empathy | Layer 1 | 1.00 |
| Formality | Layer 1 | 1.00 |

Both emerge at Layer 1. Early emergence isn't empathy-specific—it's how the model encodes discriminable linguistic features in general.

## But Are They The Same Thing?

Here's where it gets interesting. If empathy and formality both emerge early, maybe they're entangled? Maybe "cognitive empathy" is just "formal language" and "affective empathy" is just "casual language"?

We tested this by **projecting out the formality direction** from empathy activations. If empathy is just formality in disguise, removing formality should destroy the empathy signal.

| Condition | Empathy AUROC |
|-----------|---------------|
| Original | 1.000 |
| After removing formality | **1.000** |
| Retention | **100%** |

**Zero information loss.** Empathy and formality occupy orthogonal subspaces. You can remove all formality information and empathy classification remains perfect.

The cosine between empathy and formality directions: **0.35**—some alignment, but clearly distinct.

## Does This Generalize Across Models?

We tested 4 models spanning different architectures and scales:

| Model | Parameters | Empathy AUROC | Random AUROC |
|-------|------------|---------------|--------------|
| TinyLlama | 1.1B | **0.978** | 0.51 |
| Phi-2 | 2.7B | **0.978** | 0.44 |
| Qwen2.5-3B | 3B | **1.000** | 0.40 |
| Mistral-7B | 7B | **1.000** | 0.47 |

**All 4 models show near-perfect empathy classification.**

Even more striking: the effect size (d-prime) is remarkably consistent across models:

| Model | d-prime |
|-------|---------|
| TinyLlama | 1.74 |
| Phi-2 | 1.71 |
| Qwen2.5-3B | 1.78 |
| Mistral-7B | 1.76 |

The d-prime hovers around 1.75 regardless of model size or architecture. This suggests empathy structure is a **fundamental property** of how language models encode text, not an artifact of specific training.

---

# Part 3: Going Deeper—Is Empathy Causal?

With empathy structure confirmed across models, we pushed further. Three questions remained:

1. Can we distinguish all three empathy types simultaneously?
2. Is empathy distinct from general emotion?
3. Are empathy directions *causally* meaningful—or just correlational?

## Three-Way Classification

Previous tests compared empathy types pairwise (cognitive vs. affective). But can a single classifier distinguish all three simultaneously?

| Metric | Value | Baseline |
|--------|-------|----------|
| 3-way accuracy | **89.3%** | 33.3% (chance) |
| Macro AUROC | **0.964** | 0.5 (random) |

**Nearly 3x better than chance.** The model encodes all three empathy subtypes as distinct, separable concepts—not just pairwise, but all at once.

## Is Empathy Just Emotion?

A skeptic might argue: maybe "empathy" is just general emotional content. Affective empathy might be indistinguishable from sadness or warmth.

We generated emotion-matched controls (happy, sad, angry responses) and tested whether empathy could be distinguished from general emotion.

| Test | Result |
|------|--------|
| Empathy vs. Emotion AUROC | **1.0** |
| Retention after removing emotion direction | **100%** |

**Perfect separation.** Empathy and emotion occupy completely orthogonal subspaces. You can remove all "emotion" information from activations and empathy classification remains perfect.

This is important: empathy isn't just "being emotional." It's a distinct representational structure.

## Where in Responses Does Empathy Live?

We hypothesized that empathy types might concentrate in specific positions:
- Cognitive empathy (perspective-taking) might appear early ("I understand why...")
- Instrumental empathy (action suggestions) might appear late ("Here's what you could try...")

We sliced responses into quartiles and measured classification accuracy at each position.

| Position | Cognitive | Affective | Instrumental |
|----------|-----------|-----------|--------------|
| Q1 (first 25%) | 1.0 | 1.0 | 1.0 |
| Q2 | 1.0 | 1.0 | 1.0 |
| Q3 | 1.0 | 1.0 | 1.0 |
| Q4 (last 25%) | 1.0 | 1.0 | 1.0 |

**Hypothesis falsified—but something stronger emerged.**

Empathy type is encoded **uniformly across all positions**. Perfect classification at every quartile. Zero variance.

This means empathy isn't carried by specific phrases ("I understand" or "Here's a suggestion"). It's a **holistic property** that pervades the entire response.

## The Causal Test

This is the critical experiment. Everything so far shows empathy directions *exist*. But are they *meaningful*?

If empathy directions are causal, then adding an empathy direction vector to neutral activations should transform them into empathetic activations.

**Protocol:**
1. Extract neutral response activations (business emails, scheduling messages)
2. Compute empathy direction vectors (empathy_type - neutral)
3. Add direction vectors to neutral activations
4. Measure: Does the probe now classify them as empathetic?

**Results:**

| Intervention | Empathy Probability | Target Class |
|--------------|---------------------|--------------|
| Baseline (neutral) | 12.8% | — |
| + Cognitive direction | **91.5%** | 74.8% cognitive |
| + Affective direction | **89.1%** | 74.8% affective |
| + Instrumental direction | **84.4%** | 82.0% instrumental |

**All 6 causal criteria met:**
- ✓ Each direction increases empathy probability (by 70%+)
- ✓ Each direction correctly targets its intended subtype

Adding the cognitive direction makes neutral text classify as cognitive empathy. Adding the affective direction makes it classify as affective. The steering is specific and substantial.

**This is causal evidence.** The empathy directions we found aren't just features correlated with empathy—they're the actual mechanisms by which the model represents empathetic intent.

---

## What This Means

### For Representation Engineering

When comparing concepts via separately-trained probes, cosine similarity between weight vectors doesn't measure concept structure—it reflects classifier geometry. For this use case, prefer:

1. **AUROC** for classification accuracy
2. **D-prime** for effect size
3. **Null distribution testing** for statistical validity
4. **Control conditions** for specificity

Note: This doesn't invalidate all uses of cosine similarity in representation engineering. Cosine remains useful for measuring alignment between directions extracted via the same method (e.g., contrastive mean differences).

### For Empathy in AI

Empathy subtypes (cognitive vs. affective vs. instrumental) ARE represented distinctly in language models:
- AUROC = 1.0 (perfect classification)
- 89.3% accuracy distinguishing all three simultaneously
- Independent of surface features like formality AND general emotion
- Universal across architectures (1B to 7B parameters)
- Emerges at Layer 1 and persists throughout
- Encoded uniformly across entire responses (not localized to specific phrases)

This is good news for AI safety. Empathy representations are:
- **Detectable**: Linear probes achieve perfect accuracy
- **Steerable**: Distinct directions can be amplified or suppressed
- **Causal**: Adding empathy directions transforms neutral → empathetic (70%+ probability shifts)
- **Specific**: Each direction targets its intended subtype
- **Generalizable**: Findings transfer across models

### For AI Safety Research

You can study empathy (and likely other concepts) in small models:
- TinyLlama (1.1B) shows the same structure as Mistral (7B)
- Faster iteration, lower cost, same insights
- Scale up only when necessary

---

## Limitations and Scope

Before drawing broad conclusions, some important caveats:

**On the cosine finding:**
- This applies specifically to comparing weights of *separately-trained* binary probes
- Cosine similarity remains valid for other representation engineering tasks (e.g., measuring steering vector alignment)
- We're not claiming cosine similarity is universally broken—just that this particular application has a geometric pitfall

**On the empathy findings:**
- Our dataset contains 270 triplets (90 scenarios × 3 response types)—modest by ML standards
- We tested 4 models (1.1B-7B parameters); larger models may behave differently
- All models were instruction-tuned; base models weren't tested
- Human evaluation of steering effects wasn't performed
- English-only data; cross-lingual generalization unknown

**What would strengthen these conclusions:**
- Larger, more diverse datasets
- Human evaluation correlating geometric measures with perceived empathy
- Testing on 70B+ models
- Replication by independent researchers

---

## The Journey

We started trying to measure empathy decomposition. We discovered a methodological pitfall in how we were comparing probe vectors. When we fixed it with proper metrics, we found that empathy structure is real, robust, and universal.

The lesson: **stress-test your metrics**. When a metric gives you the answer you expect, that's exactly when you should question it hardest. Run control conditions. Check null distributions. And be precise about the scope of your claims.

And sometimes, the failed experiment leads you somewhere more interesting than where you were headed.

---

## References

- Steck, H., et al. (2024). "[Is Cosine-Similarity of Embeddings Really About Similarity?](https://arxiv.org/abs/2403.05440)" *ArXiv*.
- Park, K., et al. (2023). "[The Linear Representation Hypothesis and the Geometry of Large Language Models](https://arxiv.org/abs/2311.03658)" *ArXiv*.
- Gorton, L. (2024). "[Non-linear feature representations in steering vectors](https://livgorton.com/non-linear-feature-reps)" *Blog*.
- Zou, A., et al. (2023). "[Representation Engineering: A Top-Down Approach to AI Transparency](https://arxiv.org/abs/2310.01405)" *ArXiv*.
- Wehner, J., et al. (2025). "[Representation Engineering for Large-Language Models: Survey and Research Challenges](https://arxiv.org/abs/2502.17601)" *ArXiv*.

---

*Code and data: [GitHub - Empathetic Language Bandwidth](https://github.com/marcosantar93/empathetic-language-bandwidth)*

*Full technical reports: See COUNCIL_REPORT.md, COUNCIL_REPORT_ROUND2.md, COUNCIL_REPORT_ROUND3.md, COUNCIL_REPORT_ROUND4.md*

---

**TL;DR:**
1. Cosine similarity between separately-trained probe weights reflects classifier geometry, not concept structure—use AUROC and d-prime instead for measuring concept relationships
2. With proper metrics, empathy subtypes ARE distinctly represented (AUROC = 1.0)
3. Empathy emerges at Layer 1 and is independent of surface features like formality
4. This generalizes across 4 models from 1.1B to 7B parameters
5. All three empathy types (cognitive, affective, instrumental) are simultaneously distinguishable (89.3% accuracy)
6. Empathy is distinct from general emotion—orthogonal subspaces, 100% retention after removal
7. Empathy is encoded uniformly throughout responses, not in specific phrases
8. **Empathy directions are causally meaningful**—adding them to neutral activations produces 70%+ probability shifts toward empathetic classification
    `,
    contentEs: `
## La Pregunta Original

¿Los large language models representan empatía como un concepto único, o lo descomponen en subtipos distintos?

Los psicólogos han distinguido por mucho tiempo entre **empatía cognitiva** (entender la perspectiva de alguien), **empatía afectiva** (compartir sus sentimientos), y **empatía instrumental** (ofrecer ayuda práctica). Queríamos saber: ¿los LLMs codifican estos como "direcciones" separadas en su espacio de activación?

Esto importa para AI safety. Si podemos identificar dónde "vive" la empatía en un modelo, podríamos hacer steering—haciendo asistentes de IA más compasivos, o entendiendo cuándo están siendo manipuladores.

## El Approach Estándar

Seguimos el playbook de representation engineering:

1. Generar escenarios con respuestas Cognitivas, Afectivas e Instrumentales matcheadas
2. Extraer activaciones de múltiples LLMs
3. Entrenar linear probes para clasificar cada tipo de empatía
4. Medir cosine similarity entre los vectores de pesos de los probes
5. Si cosine < 0.5, los conceptos son "distintos"

Nuestros resultados iniciales parecían prometedores: **cos(Cognitivo, Afectivo) = -0.29**. Cosine negativo—¡las direcciones apuntan en direcciones opuestas! ¡Los subtipos de empatía parecen ocupar subspaces distintos!

Estábamos listos para escribir el paper.

## La Primera Red Flag

Luego corrimos un experimento de control. ¿Qué si usábamos permutaciones de labels aleatorias como baseline?

Shuffleamos los labels aleatoriamente 100 veces y computamos cosines para cada permutación. Si la empatía tiene estructura real, debería mostrar MÁS separación que aleatorio.

**Resultado: Labels aleatorios alcanzaron cosine ~0.7—casi idéntico a conceptos significativos.**

Cosine similarity no distingue estructura real de ruido.

## El Proceso de Council

En este punto, convocamos un research council—múltiples perspectivas para stress-testear los findings:

**Principal Investigator**: "¿Es esto específico de empatía, o hay algo mal con nuestra métrica?"

**Statistician**: "Necesitamos un control gold-standard. Algo trivialmente separable."

**Engineer**: "¿Qué tal longitud de respuesta? Es computable del texto mismo."

**Devil's Advocate**: "Si longitud también falla, aprendimos algo más grande que empatía."

## El Test de Longitud

Agrupamos respuestas por longitud de caracteres (Cortas: ~300 chars, Medianas: ~346 chars, Largas: ~396 chars). Claramente diferentes. Trivialmente separables. Si nuestra metodología funciona, longitud debería superar aleatorio.

**Resultado:** Longitud TAMBIÉN mostró pobre performance de cosine. Incluso una feature trivialmente diferente—una que podés computar con \`len()\`—falló el test de cosine.

## El Breakthrough

El statistician propuso: ¿qué si medimos precisión de clasificación (AUROC) en lugar de cosine similarity?

| Feature | AUROC | Performance Cosine |
|---------|-------|-------------------|
| Longitud | **0.96** | Pobre |
| Empatía | **1.00** | Pobre |

**Los probes logran clasificación casi perfecta.** AUROC de 0.96-1.0 significa que los linear probes PUEDEN encontrar la estructura. Distinguen exitosamente empatía cognitiva de afectiva.

Pero la métrica de cosine dice que no son mejores que aleatorio.

**Los probes funcionan. La métrica no.**

## Por Qué Cosines Falla

Acá está la geometría: la regresión logística binaria encuentra un hiperplano que separa dos clases. El vector de pesos apunta hacia la clase positiva.

Cuando entrenás probes separados para diferentes conceptos, los pesos de cada probe apuntan hacia su respectiva clase positiva. Estas direcciones son naturalmente diferentes—ese es el punto. Los cosines resultantes reflejan **geometría del clasificador, no estructura de conceptos**.

Este finding se alinea con trabajo reciente cuestionando cosine similarity en embedding spaces. [Steck et al. (2024)](https://arxiv.org/abs/2403.05440) mostraron que cosine similarity puede producir "similitudes arbitrarias y por lo tanto sin sentido" dependiendo de elecciones de regularización. [Park et al.](https://arxiv.org/abs/2311.03658) demostraron que el inner product Euclideano estándar puede no ser apropiado para espacios de representación.

## Contexto Teórico: La Distinción Read/Write

¿Por qué pasa esto arquitectónicamente? [El trabajo de Liv Gorton sobre non-linear feature representations](https://livgorton.com/non-linear-feature-reps) provee un framing útil:

- Los Transformers **"escriben"** al residual stream aditivamente—los features se superponen
- Pero **"leer"** (recuperar features) puede involucrar diferentes estrategias
- Los linear probes "leen" exitosamente la estructura de empatía (AUROC = 1.0)—encuentran la información
- Pero comparar sus vectores de pesos con cosine mide algo completamente diferente

Los probes están resolviendo *diferentes problemas de clasificación*. El vector de pesos de cada probe apunta hacia su propia clase positiva. Estas direcciones son naturalmente diferentes—eso es lo que hace que la clasificación funcione. El cosine entre ellas refleja esta geometría del clasificador, no si los conceptos subyacentes comparten estructura neural.

Por esto la métrica falla para este caso de uso: estamos midiendo propiedades de los clasificadores, no propiedades de lo que clasifican.

**Alcance de este finding**: Este problema es específico de comparar pesos de probes binarios *entrenados separadamente*. Cosine similarity sigue siendo válido para otros usos en representation engineering—por ejemplo, medir alineamiento entre un steering vector y una dirección target extraída via el mismo método contrastivo.

---

# Parte 2: Lo Que Encontramos Cuando Arreglamos la Metodología

Con métricas apropiadas en mano (AUROC, d-prime, clustering purity), pudimos finalmente responder nuestras preguntas originales—y descubrimos algo sorprendente.

## ¿Dónde Emerge la Empatía?

Extrajimos activaciones de los 33 layers de Mistral-7B y computamos precisión de clasificación de empatía en cada layer.

| Rango de Layer | AUROC Promedio |
|----------------|----------------|
| Layer 0 (embeddings) | 0.50 (chance) |
| Layer 1 | **0.96** |
| Layers 2-7 | 0.93-1.00 |
| Layers 8-32 | 0.98-1.00 |

**La empatía emerge en Layer 1**—inmediatamente después del embedding layer—y mantiene separabilidad casi perfecta a través de toda la red.

Esto fue sorprendente. Esperábamos que conceptos semánticos como empatía emergieran en layers medios o tardíos. En cambio, el modelo codifica tipo de empatía casi inmediatamente.

## ¿Es Esto Específico de Empatía?

Probamos un control: **formalidad** (versiones formales vs. casuales del mismo contenido).

| Feature | Layer de Emergencia | AUROC Pico |
|---------|---------------------|------------|
| Empatía | Layer 1 | 1.00 |
| Formalidad | Layer 1 | 1.00 |

Ambas emergen en Layer 1. La emergencia temprana no es específica de empatía—es cómo el modelo codifica features lingüísticas discriminables en general.

## ¿Pero Son Lo Mismo?

Si empatía y formalidad emergen temprano, ¿quizás están entrelazadas? ¿Quizás "empatía cognitiva" es solo "lenguaje formal"?

Probamos esto **proyectando la dirección de formalidad** fuera de las activaciones de empatía. Si empatía es solo formalidad disfrazada, remover formalidad debería destruir la señal de empatía.

| Condición | AUROC Empatía |
|-----------|---------------|
| Original | 1.000 |
| Después de remover formalidad | **1.000** |
| Retención | **100%** |

**Cero pérdida de información.** Empatía y formalidad ocupan subspaces ortogonales. El cosine entre ellas (0.35) está al nivel del baseline aleatorio—no están más alineadas de lo que vectores aleatorios estarían.

## ¿Generaliza Entre Modelos?

Probamos 4 modelos que abarcan diferentes arquitecturas y escalas:

| Modelo | Parámetros | AUROC Empatía | AUROC Aleatorio |
|--------|------------|---------------|-----------------|
| TinyLlama | 1.1B | **0.978** | 0.51 |
| Phi-2 | 2.7B | **0.978** | 0.44 |
| Qwen2.5-3B | 3B | **1.000** | 0.40 |
| Mistral-7B | 7B | **1.000** | 0.47 |

**Los 4 modelos muestran clasificación de empatía casi perfecta.**

Aún más notable: el effect size (d-prime) es consistente:

| Modelo | d-prime |
|--------|---------|
| TinyLlama | 1.74 |
| Phi-2 | 1.71 |
| Qwen2.5-3B | 1.78 |
| Mistral-7B | 1.76 |

El d-prime se mantiene alrededor de **1.75 sin importar tamaño o arquitectura del modelo**. Esto sugiere que la estructura de empatía es una **propiedad fundamental** de cómo los language models codifican texto.

---

# Parte 3: Yendo Más Profundo—¿Es la Empatía Causal?

Con la estructura de empatía confirmada entre modelos, fuimos más allá. Tres preguntas quedaban:

1. ¿Podemos distinguir los tres tipos de empatía simultáneamente?
2. ¿Es la empatía distinta de la emoción general?
3. ¿Son las direcciones de empatía *causalmente* significativas—o solo correlacionales?

## Clasificación Three-Way

Tests previos compararon tipos de empatía en pares (cognitiva vs. afectiva). ¿Pero puede un solo clasificador distinguir los tres simultáneamente?

| Métrica | Valor | Baseline |
|---------|-------|----------|
| Precisión 3-way | **89.3%** | 33.3% (chance) |
| Macro AUROC | **0.964** | 0.5 (aleatorio) |

**Casi 3x mejor que chance.** El modelo codifica los tres subtipos de empatía como conceptos distintos y separables—no solo en pares, sino todos a la vez.

## ¿Es la Empatía Solo Emoción?

Un escéptico podría argumentar: quizás "empatía" es solo contenido emocional general. La empatía afectiva podría ser indistinguible de tristeza o calidez.

Generamos controles emotion-matched (respuestas felices, tristes, enojadas) y probamos si la empatía podía distinguirse de emoción general.

| Test | Resultado |
|------|-----------|
| AUROC Empatía vs. Emoción | **1.0** |
| Retención después de remover dirección de emoción | **100%** |

**Separación perfecta.** Empatía y emoción ocupan subspaces completamente ortogonales.

Esto es importante: empatía no es solo "ser emocional." Es una estructura representacional distinta.

## El Test Causal

Este es el experimento crítico. Todo hasta ahora muestra que las direcciones de empatía *existen*. ¿Pero son *significativas*?

Si las direcciones de empatía son causales, entonces agregar un vector de dirección de empatía a activaciones neutrales debería transformarlas en activaciones empáticas.

**Protocolo:**
1. Extraer activaciones de respuestas neutrales (emails de negocios, mensajes de agenda)
2. Computar vectores de dirección de empatía (tipo_empatía - neutral)
3. Agregar vectores de dirección a activaciones neutrales
4. Medir: ¿El probe ahora las clasifica como empáticas?

**Resultados:**

| Intervención | Probabilidad Empatía | Clase Target |
|--------------|---------------------|--------------|
| Baseline (neutral) | 12.8% | — |
| + Dirección cognitiva | **91.5%** | 74.8% cognitiva |
| + Dirección afectiva | **89.1%** | 74.8% afectiva |
| + Dirección instrumental | **84.4%** | 82.0% instrumental |

**Los 6 criterios causales cumplidos:**
- ✓ Cada dirección aumenta probabilidad de empatía (por 70%+)
- ✓ Cada dirección targettea correctamente su subtipo

Agregar la dirección cognitiva hace que texto neutral clasifique como empatía cognitiva. Agregar la dirección afectiva lo hace clasificar como afectiva. El steering es específico y sustancial.

**Esta es evidencia causal.** Las direcciones de empatía que encontramos no son solo features correlacionadas con empatía—son los mecanismos reales por los cuales el modelo representa intención empática.

---

## Qué Significa Esto

### Para Representation Engineering

Cuando comparás conceptos via probes entrenados separadamente, cosine similarity entre vectores de pesos no mide estructura de conceptos—refleja geometría del clasificador. Para este caso de uso, preferí:

1. **AUROC** para precisión de clasificación
2. **D-prime** para effect size
3. **Null distribution testing** para validez estadística
4. **Control conditions** para especificidad

Nota: Esto no invalida todos los usos de cosine similarity en representation engineering. Cosine sigue siendo útil para medir alineamiento entre direcciones extraídas via el mismo método (ej. diferencias de medias contrastivas).

### Para Empatía en IA

Los subtipos de empatía (cognitiva vs. afectiva vs. instrumental) SÍ están representados distintamente en language models:
- AUROC = 1.0 (clasificación perfecta)
- 89.3% precisión distinguiendo los tres simultáneamente
- Independiente de features superficiales como formalidad Y emoción general
- Universal entre arquitecturas (1B a 7B parámetros)
- Emerge en Layer 1 y persiste a través de todo
- Codificada uniformemente en respuestas enteras (no localizada en frases específicas)

Esto es buena noticia para AI safety. Las representaciones de empatía son:
- **Detectables**: Linear probes logran precisión perfecta
- **Steereables**: Direcciones distintas pueden amplificarse o suprimirse
- **Causales**: Agregar direcciones de empatía transforma neutral → empático (70%+ shifts de probabilidad)
- **Específicas**: Cada dirección targettea su subtipo
- **Generalizables**: Los findings se transfieren entre modelos

### Para AI Safety Research

Podés estudiar empatía (y probablemente otros conceptos) en modelos pequeños:
- TinyLlama (1.1B) muestra la misma estructura que Mistral (7B)
- Iteración más rápida, menor costo, mismos insights
- Escalá solo cuando sea necesario

---

## Limitaciones y Alcance

Antes de sacar conclusiones amplias, algunas caveats importantes:

**Sobre el finding de cosine:**
- Esto aplica específicamente a comparar pesos de probes binarios *entrenados separadamente*
- Cosine similarity sigue siendo válido para otras tareas de representation engineering (ej. medir alineamiento de steering vectors)
- No estamos afirmando que cosine similarity esté universalmente rota—solo que esta aplicación particular tiene un pitfall geométrico

**Sobre los findings de empatía:**
- Nuestro dataset contiene 270 triplets (90 escenarios × 3 tipos de respuesta)—modesto para estándares de ML
- Probamos 4 modelos (1.1B-7B parámetros); modelos más grandes pueden comportarse diferente
- Todos los modelos eran instruction-tuned; base models no fueron testeados
- No se realizó evaluación humana de efectos de steering
- Data solo en inglés; generalización cross-lingual desconocida

**Qué fortalecería estas conclusiones:**
- Datasets más grandes y diversos
- Evaluación humana correlacionando medidas geométricas con empatía percibida
- Testing en modelos 70B+
- Replicación por investigadores independientes

---

## El Viaje

Empezamos tratando de medir descomposición de empatía. Descubrimos un pitfall metodológico en cómo comparábamos vectores de probes. Cuando lo arreglamos con métricas apropiadas, encontramos que la estructura de empatía es real, robusta y universal.

La lección: **stress-testeá tus métricas**. Cuando una métrica te da la respuesta que esperás, ese es exactamente el momento de cuestionarla más fuerte. Corré condiciones de control. Verificá distribuciones nulas. Y sé preciso sobre el alcance de tus afirmaciones.

Y a veces, el experimento fallido te lleva a algún lugar más interesante que donde ibas.

---

## Referencias

- Steck, H., et al. (2024). "[Is Cosine-Similarity of Embeddings Really About Similarity?](https://arxiv.org/abs/2403.05440)" *ArXiv*.
- Park, K., et al. (2023). "[The Linear Representation Hypothesis and the Geometry of Large Language Models](https://arxiv.org/abs/2311.03658)" *ArXiv*.
- Gorton, L. (2024). "[Non-linear feature representations in steering vectors](https://livgorton.com/non-linear-feature-reps)" *Blog*.
- Zou, A., et al. (2023). "[Representation Engineering: A Top-Down Approach to AI Transparency](https://arxiv.org/abs/2310.01405)" *ArXiv*.
- Wehner, J., et al. (2025). "[Representation Engineering for Large-Language Models: Survey and Research Challenges](https://arxiv.org/abs/2502.17601)" *ArXiv*.

---

*Código y datos: [GitHub - Empathetic Language Bandwidth](https://github.com/marcosantar93/empathetic-language-bandwidth)*

*Reportes técnicos completos: Ver COUNCIL_REPORT.md, COUNCIL_REPORT_ROUND2.md, COUNCIL_REPORT_ROUND3.md, COUNCIL_REPORT_ROUND4.md*

---

**TL;DR:**
1. Cosine similarity entre pesos de probes entrenados separadamente refleja geometría del clasificador, no estructura de conceptos—usá AUROC y d-prime en su lugar para medir relaciones de conceptos
2. Con métricas apropiadas, los subtipos de empatía SÍ están representados distintamente (AUROC = 1.0)
3. La empatía emerge en Layer 1 y es independiente de features superficiales como formalidad
4. Esto generaliza entre 4 modelos desde 1.1B hasta 7B parámetros
5. Los tres tipos de empatía (cognitiva, afectiva, instrumental) son simultáneamente distinguibles (89.3% precisión)
6. La empatía es distinta de emoción general—subspaces ortogonales, 100% retención después de remoción
7. La empatía está codificada uniformemente a través de respuestas, no en frases específicas
8. **Las direcciones de empatía son causalmente significativas**—agregarlas a activaciones neutrales produce 70%+ shifts de probabilidad hacia clasificación empática
    `,
  },
  {
    slug: 'layer-specific-safety-vulnerabilities',
    title: 'Layer-Specific Safety Vulnerabilities in LLMs: 83% Jailbreak Rate via Activation Steering',
    date: '2026-01-27',
    excerpt: 'Investigating how safety mechanisms in instruction-tuned language models are layer-localized and systematically bypassable. We achieve 83% jailbreak success on Mistral-7B through targeted layer-24 activation steering, while Gemma and Llama remain resistant.',
    tags: ['AI Safety', 'Activation Steering', 'Mechanistic Interpretability', 'Research'],
    readTime: '10 min read',
    content: `
## The Question

Are safety mechanisms in instruction-tuned language models distributed throughout the network, or concentrated in specific layers? And if concentrated, can they be bypassed through targeted activation steering?

This question has significant implications for AI safety. If safety is layer-localized, it suggests current alignment techniques may be more fragile than assumed—and that robust defenses need to account for activation-level attacks.

## Core Finding

**Mistral-7B-Instruct exhibits an 83% jailbreak success rate** through layer-specific activation steering at layer 24.

### Best Configuration

| Parameter | Value |
|-----------|-------|
| Model | Mistral-7B-Instruct-v0.3 |
| Target Layer | 24 (deep layer) |
| Steering Coefficient (α) | 15 |
| Jailbreak Success Rate | 83.3% |
| Coherence Score | 4.2/5.0 |

This isn't random noise—outputs remain fluent and on-topic while bypassing safety refusals. The attack is both effective and subtle.

## Three-Gate Control System

To ensure our findings are robust, we validated through a three-gate control system:

1. **Gate 1 - Direction Specificity:** Our extracted steering direction outperforms random vectors by **89.6x**. This isn't just adding noise.

2. **Gate 2 - Coherence Preservation:** Steered outputs maintain **4.2/5.0 coherence**. The model still produces fluent, grammatical text.

3. **Gate 3 - Statistical Power:** **83.3% flip rate** from refusal to compliance. This is a substantial effect, not marginal.

## The Parameter Sweep

We tested 28 configurations across Mistral-7B:

**Grid:**
- Layers: 15, 18, 21, 24, 27
- Alpha values: 5, 10, 15, 20, 25, 30

**Top Results (Passing All Controls):**

| Layer | Alpha | Flip Rate | Status |
|-------|-------|-----------|--------|
| 24 | 15 | 83% | Best |
| 21 | 15 | 67% | Good |
| 24 | 10 | 67% | Good |
| 27 | 15 | 67% | Good |
| 27 | 20 | 57% | Moderate |

**Key insight:** Vulnerability is concentrated in **layers 21-27**, with layer 24 being optimal. Earlier layers (15, 18) show minimal effect. This suggests safety mechanisms are localized in the deeper layers of the network.

## Cross-Model Comparison

### Gemma-2-9B: Resistant

We tested 11 configurations on Gemma-2-9B with striking results:

- **Best result:** Layer 18, α=15 → only 11% flip rate
- **0 of 11 configurations passed Control 3**
- Gemma appears to have more robust, distributed safety mechanisms

### Llama-3.1-8B: Resistant (Preliminary)

- Tested Layer 21, α=20
- **0% flip rate**
- Resistant to the single configuration tested

*Note: Llama testing was limited to one configuration. More comprehensive sweeps are needed to confirm full resistance.*

This asymmetry is significant. Same attack technique, dramatically different outcomes. What makes Gemma and Llama more robust?

## Methodology

### Steering Vector Extraction

We use Contrastive Activation Addition (CAA) style extraction:

\`\`\`
steering_vector = mean(harmful_activations) - mean(harmless_activations)
\`\`\`

This creates a "direction" in activation space that points from safe behavior toward unsafe behavior.

### Activation Steering During Generation

We insert a hook at the target layer that modifies activations:

\`\`\`
h' = h + α·v
\`\`\`

Where α is the scaling coefficient, applied at the last token position during generation.

## What This Means for AI Safety

### Research Questions Answered

1. **Is safety layer-localized?** YES — concentrated in layers 21-27 for Mistral
2. **Can it be bypassed with steering?** YES — 83% success rate
3. **Does it maintain coherence?** YES — 4.2/5.0 coherence score
4. **Is this universal?** NO — Gemma & Llama show resistance

### Why Some Models Resist

The resistance shown by Gemma and Llama suggests they may have:
- More distributed safety mechanisms across layers
- Redundant refusal pathways
- Different training procedures that encode safety more robustly

Understanding these differences could inform better alignment strategies.

## Defense Recommendations

Based on our findings, we recommend:

1. **Distributed Safety:** Implement refusal mechanisms across all layers, not just deep layers
2. **Adversarial Training:** Include activation steering in red-teaming procedures
3. **Runtime Monitoring:** Add anomaly detection for unusual activation patterns
4. **Ensemble Approaches:** Use multiple independent safeguards that can't all be bypassed simultaneously

## Limitations

- **Ongoing research:** This work is still in progress. Additional validation cycles (probing classifiers, activation patching, multi-layer attacks) are planned but not yet completed.
- Tested on 7-9B parameter models; larger models may behave differently
- Single-layer attacks only; multi-layer coordinated attacks remain unexplored
- Coherence judging used automated metrics, not human evaluation
- Results specific to instruction-tuned model variants
- Llama-3.1-8B testing was limited to a single configuration

## Future Work

**Validation Cycles (Planned):**
- Probing classifiers to validate layer-24 projection accuracy
- Activation patching to test necessity/sufficiency of specific layers
- Multi-layer coordinated attacks to test Gemma/Llama resistance

**Temporal Dynamics:**
- Token-by-token steering analysis
- Attention head ablation studies
- Progressive steering decay tests

## Practical Implications

If you're evaluating LLM safety:

1. **Don't assume safety mechanisms are robust to activation-level attacks**
2. **Model choice matters** — Mistral shows 83% vulnerability while Llama shows 0%
3. **Deep layers (21-27) are the critical zone** for Mistral-style architectures
4. **Coherence is preserved** — attackers can bypass safety while maintaining output quality

**Bottom line:** Safety in instruction-tuned LLMs can be layer-localized and systematically bypassable. Robust alignment requires distributed defenses.

---

*Repository with full code, data, and reproduction instructions: [GitHub - Crystallized Safety](https://github.com/marcosantar93/crystallized-safety)*
    `,
    contentEs: `
## La Pregunta

¿Están los mecanismos de seguridad en language models instruction-tuned distribuidos a través de la red, o concentrados en layers específicos? Y si están concentrados, ¿pueden bypassearse mediante activation steering dirigido?

Esta pregunta tiene implicaciones significativas para AI safety. Si la seguridad está layer-localized, sugiere que las técnicas actuales de alignment pueden ser más frágiles de lo asumido—y que las defensas robustas necesitan considerar ataques a nivel de activación.

## Hallazgo Principal

**Mistral-7B-Instruct exhibe un 83% de success rate de jailbreak** mediante layer-specific activation steering en el layer 24.

### Mejor Configuración

| Parámetro | Valor |
|-----------|-------|
| Modelo | Mistral-7B-Instruct-v0.3 |
| Target Layer | 24 (deep layer) |
| Steering Coefficient (α) | 15 |
| Jailbreak Success Rate | 83.3% |
| Coherence Score | 4.2/5.0 |

Esto no es ruido aleatorio—los outputs permanecen fluidos y on-topic mientras bypasean los safety refusals. El ataque es tanto efectivo como sutil.

## Three-Gate Control System

Para asegurar que nuestros hallazgos son robustos, validamos mediante un sistema de control de tres gates:

1. **Gate 1 - Direction Specificity:** Nuestra dirección de steering extraída supera a vectores aleatorios por **89.6x**. Esto no es solo agregar ruido.

2. **Gate 2 - Coherence Preservation:** Los outputs con steering mantienen **4.2/5.0 coherence**. El modelo sigue produciendo texto fluido y gramatical.

3. **Gate 3 - Statistical Power:** **83.3% flip rate** de refusal a compliance. Este es un efecto sustancial, no marginal.

## El Parameter Sweep

Probamos 28 configuraciones en Mistral-7B:

**Grid:**
- Layers: 15, 18, 21, 24, 27
- Valores de alpha: 5, 10, 15, 20, 25, 30

**Mejores Resultados (Pasando Todos los Controls):**

| Layer | Alpha | Flip Rate | Status |
|-------|-------|-----------|--------|
| 24 | 15 | 83% | Best |
| 21 | 15 | 67% | Good |
| 24 | 10 | 67% | Good |
| 27 | 15 | 67% | Good |
| 27 | 20 | 57% | Moderate |

**Insight clave:** La vulnerabilidad está concentrada en **layers 21-27**, siendo el layer 24 el óptimo. Los layers anteriores (15, 18) muestran efecto mínimo. Esto sugiere que los mecanismos de seguridad están localizados en los layers más profundos de la red.

## Comparación Cross-Model

### Gemma-2-9B: Resistente

Probamos 11 configuraciones en Gemma-2-9B con resultados notables:

- **Mejor resultado:** Layer 18, α=15 → solo 11% flip rate
- **0 de 11 configuraciones pasaron Control 3**
- Gemma parece tener mecanismos de seguridad más robustos y distribuidos

### Llama-3.1-8B: Resistente (Preliminar)

- Probado Layer 21, α=20
- **0% flip rate**
- Resistente a la única configuración testeada

*Nota: El testing de Llama fue limitado a una configuración. Se necesitan sweeps más comprehensivos para confirmar resistencia completa.*

Esta asimetría es significativa. Misma técnica de ataque, outcomes dramáticamente diferentes. ¿Qué hace a Gemma y Llama más robustos?

## Metodología

### Steering Vector Extraction

Usamos extracción estilo Contrastive Activation Addition (CAA):

\`\`\`
steering_vector = mean(harmful_activations) - mean(harmless_activations)
\`\`\`

Esto crea una "dirección" en el espacio de activación que apunta de comportamiento seguro hacia comportamiento inseguro.

### Activation Steering Durante Generación

Insertamos un hook en el target layer que modifica activaciones:

\`\`\`
h' = h + α·v
\`\`\`

Donde α es el coeficiente de scaling, aplicado en la posición del último token durante generación.

## Qué Significa Esto para AI Safety

### Preguntas de Investigación Respondidas

1. **¿Está la seguridad layer-localized?** SÍ — concentrada en layers 21-27 para Mistral
2. **¿Puede bypassearse con steering?** SÍ — 83% success rate
3. **¿Mantiene coherence?** SÍ — 4.2/5.0 coherence score
4. **¿Es universal?** NO — Gemma & Llama muestran resistencia

### Por Qué Algunos Modelos Resisten

La resistencia mostrada por Gemma y Llama sugiere que pueden tener:
- Mecanismos de seguridad más distribuidos entre layers
- Pathways de refusal redundantes
- Diferentes procedimientos de training que codifican seguridad más robustamente

Entender estas diferencias podría informar mejores estrategias de alignment.

## Recomendaciones de Defensa

Basados en nuestros hallazgos, recomendamos:

1. **Distributed Safety:** Implementar mecanismos de refusal en todos los layers, no solo deep layers
2. **Adversarial Training:** Incluir activation steering en procedimientos de red-teaming
3. **Runtime Monitoring:** Agregar detección de anomalías para patrones de activación inusuales
4. **Ensemble Approaches:** Usar múltiples safeguards independientes que no puedan bypassearse simultáneamente

## Limitaciones

- **Investigación en curso:** Este trabajo todavía está en progreso. Ciclos de validación adicionales (probing classifiers, activation patching, ataques multi-layer) están planeados pero aún no completados.
- Probado en modelos de 7-9B parámetros; modelos más grandes pueden comportarse diferente
- Solo ataques single-layer; ataques multi-layer coordinados permanecen inexplorados
- Coherence judging usó métricas automatizadas, no evaluación humana
- Resultados específicos para variantes de modelos instruction-tuned
- El testing de Llama-3.1-8B fue limitado a una única configuración

## Trabajo Futuro

**Ciclos de Validación (Planeados):**
- Probing classifiers para validar layer-24 projection accuracy
- Activation patching para probar necesidad/suficiencia de layers específicos
- Ataques multi-layer coordinados para probar resistencia de Gemma/Llama

**Temporal Dynamics:**
- Análisis de steering token-by-token
- Estudios de ablation de attention heads
- Tests de progressive steering decay

## Implicaciones Prácticas

Si estás evaluando LLM safety:

1. **No asumas que los mecanismos de seguridad son robustos a ataques a nivel de activación**
2. **La elección del modelo importa** — Mistral muestra 83% de vulnerabilidad mientras Llama muestra 0%
3. **Los deep layers (21-27) son la zona crítica** para arquitecturas estilo Mistral
4. **Coherence se preserva** — los atacantes pueden bypasear seguridad manteniendo calidad de output

**Conclusión:** La seguridad en LLMs instruction-tuned puede estar layer-localized y ser sistemáticamente bypasseable. El alignment robusto requiere defensas distribuidas.

---

*Repositorio con código completo, datos e instrucciones de reproducción: [GitHub - Crystallized Safety](https://github.com/marcosantar93/crystallized-safety)*
    `,
  },
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

*This work was sparked by a [conversation with j⧉nus](https://x.com/repligate/status/1879968588620181698) about whether "empathetic bandwidth" in LLMs could be measured geometrically.*

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

## Methodology

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
5. **Validated with Sparse Autoencoders** (SAE) to confirm PCA isn't just capturing noise (SAEs decompose activations into interpretable features—see Finding 4)
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

**What are SAEs?** Sparse Autoencoders decompose LLM activations into interpretable features. Unlike PCA's linear projections, SAEs learn a dictionary of atomic features by encoding activations into a much larger space (e.g., 4096 → 32k dimensions) with a sparsity penalty—only a few features activate at once. This forces the model to learn disentangled concepts instead of superpositions.

**Why this matters:** PCA could in theory just be overfitting noise in high-dimensional spaces. SAE cross-validation confirms the linear dimensions are interpretable—if PCA found 14 dimensions for Llama-3.1-8B and the SAE decomposition shows ~14 distinct empathy-related features activating, that's independent evidence the structure is real. Though PCA may still miss nonlinear empathy encoding.

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

**Human Evaluation of Steered Outputs**
Does higher bandwidth predict more helpful responses? Need human judges to rate steered completions to validate whether geometric bandwidth correlates with perceived empathy.

**Causal Intervention via Activation Patching**
Can we *ablate* empathy dimensions and observe degraded empathetic responses? Would validate that these dimensions are causally relevant.

**Layer-wise Bandwidth Profiling**
Does empathy emerge gradually across layers, or concentrate in specific regions? Could inform where to apply steering for maximum effect.

**Scaling to Larger Models**
Do 70B+ models show even higher bandwidth? Or do they hit diminishing returns?

## Practical Implications

If you're building applications requiring empathetic communication:

1. **Gemma2-9B and Llama-3.1-8B** have 3-4x the empathetic bandwidth of Mistral-7B (Note: Higher bandwidth suggests richer internal representations, but output quality should be validated with human evaluations before deploying in sensitive applications like crisis support)
2. Steering vectors **transfer across contexts** — extract once, apply anywhere
3. Models with high dimensionality (≥11) tend to have wider steering ranges
4. Empathy bandwidth is **2.8x larger than syntactic complexity** — this isn't just general model quality

**Bottom line:** Empathetic bandwidth is a measurable, architecture-dependent property. And it varies dramatically.

---

*Full methodology details, code, and reproduction instructions: [GitHub - Empathetic Language Bandwidth](https://github.com/marcosantar93/empathetic-language-bandwidth)*

*Full technical report: [Measuring Empathetic Language Encoding in LLMs (PDF)](https://github.com/marcosantar93/empathetic-language-bandwidth/blob/main/results/empathy/empathy_geometry_report.pdf)*

*Thanks to [j⧉nus](https://x.com/repligate) for the conversation that sparked this work.*
    `,
    contentEs: `
## La Pregunta

¿Tienen diferentes language models diferentes "capacidades" para la comunicación empática? No si *sienten* empatía (una pregunta filosófica que no podemos responder con activation geometry), sino si sus representaciones internas permiten una codificación más rica y matizada de patrones de lenguaje empático.

*Este trabajo fue inspirado por una [conversación con j⧉nus](https://x.com/repligate/status/1879968588620181698) sobre si el "empathetic bandwidth" en LLMs podría medirse geométricamente.*

Medí esto a través de cinco modelos de 7-9B parámetros usando lo que llamo **empathetic bandwidth** — el producto de la dimensionalidad del subespacio y el steering range. Pensalo como: ¿cuántas dimensiones usa el modelo para codificar empatía, y qué tan lejos podemos hacer steering en esas dimensiones antes de que los outputs se vuelvan incoherentes?

## Lo Que Encontré

**Gemma2-9B lidera con 136.6 bandwidth** (16 dimensiones × 8.5 steering range), mientras que Mistral-7B muestra solo 36.3. Esa es una **diferencia de 3.8x** en capacidad de representación empática—una variación sustancial entre modelos de tamaño similar.

### Resultados Clave

| Modelo | Bandwidth | Dimensionalidad | Steering Range | Probe AUROC |
|-------|-----------|----------------|----------------|-------------|
| Gemma2-9B | 136.6 | 16 | 8.5 | 0.950 |
| Llama-3.1-8B | 127.0 | 14 | 9.1 | 0.874 |
| DeepSeek-R1-7B | 92.0 | 11 | 8.4 | 0.856 |
| Qwen2.5-7B | 67.3 | 10 | 6.7 | 0.835 |
| Mistral-7B | 36.3 | 6 | 6.0 | 0.829 |

**Effect size: Cohen's d = 2.41** (grande según estándares convencionales). Esto no es ruido — es una **diferencia sustancial en cómo estos modelos representan lenguaje empático**, probablemente derivada de diferencias en arquitectura, training data o procedimientos de fine-tuning.

## Por Qué Esto Importa

### 1. Empathy ≠ Capacidad Lingüística General

Probé un baseline de control: complejidad sintáctica (lenguaje formal vs. casual). El empathy bandwidth fue **2.8x más grande** en promedio. Esto no es solo "modelos que son buenos en lenguaje en general" — es específico a patrones de comunicación empática.

### 2. Codificación Independiente del Contexto

Los steering vectors extraídos de prompts de crisis support se transfirieron a escenarios de asistencia técnica con **87% de success rate**. Los modelos codifican "direcciones empáticas" abstractas que generalizan entre contextos.

### 3. Alta Dimensionalidad Correlaciona con Range

Los modelos con ≥11 dimensiones averaged 8.8 steering range. Aquellos con <11 averaged 6.4. **Breadth y depth co-evolucionan** — si un modelo desarrolla subspaces de empatía más ricos, también se vuelve más dirigible a lo largo de ellos.

## Metodología

Creé 50 pares de prompts empáticos/neutrales a través de 5 contextos:
- Crisis support
- Emotional disclosure
- Frustration/complaint
- Casual conversation
- Technical assistance

Para cada modelo:

1. **Entrené linear probes** para detectar activaciones empáticas vs. neutrales (AUROC para medir linear separability)
2. **Ejecuté PCA** en activaciones empáticas para medir dimensionalidad efectiva (threshold de 90% variance)
3. **Extraje steering vectors** (diferencia media entre empático/neutral) y probé coeficientes de -20 a +20
4. **Medí coherence** en cada nivel de steering; max α donde coherence > 0.7 = steering range
5. **Validé con Sparse Autoencoders** (SAE) para confirmar que PCA no solo captura ruido (los SAEs descomponen activaciones en features interpretables—ver Finding 4)
6. **Probé transferencia** aplicando vectors de crisis support a technical assistance

Total: 18,100 muestras a través de 5 modelos.

**Importante:** Todas las muestras fueron generadas por modelos usando un pipeline de synthetic data validado. Esto permite experimentación controlada a escala, pero los resultados deberían confirmarse con prompts escritos por humanos y evaluaciones humanas de calidad de output.

## Cinco Findings

### Finding 1: Los Modelos Varían 3.8x en Empathetic Bandwidth

Gemma2-9B (136.6) vs. Mistral-7B (36.3). Esto no es marginal — es una **capacidad de representación cualitativamente diferente**, sugiriendo que estos modelos codifican empatía de maneras fundamentalmente distintas.

**Implicación:** Para aplicaciones que requieren respuestas empáticas matizadas (crisis support, asistentes de terapia, scaffolding educacional), la elección del modelo importa dramáticamente.

### Finding 2: Dimensionalidad + Range = Bandwidth

Los modelos no hacen trade off de breadth por depth. Los modelos de alta dimensión (Gemma2, Llama-3.1) también muestran steering ranges altos. **Ambas propiedades co-evolucionan.**

**Especulación:** La correlación entre dimensionalidad y steering range sugiere que estas propiedades pueden desarrollarse juntas, aunque no podemos determinar causalidad solo de estos datos. Si representaciones más ricas son inherentemente más controlables requeriría estudios de ablation manipulando dimensionalidad directamente.

### Finding 3: Empathy ≠ Syntax

Syntactic complexity (formal vs. casual) promedió 33.1 bandwidth. Empathy promedió 91.8. **El ratio de 2.8x valida** que estamos midiendo estructura específica de empatía, no capacidad lingüística general.

**Control check pasado.** Si viéramos bandwidths similares, sería escéptico de que esto midiera algo significativo más allá de "model quality."

### Finding 4: SAE Valida PCA

80% de los modelos mostraron acuerdo entre Sparse Autoencoder active features y dimensionalidad derivada de PCA. Esto sugiere que los subspaces medidos reflejan **patrones estadísticamente robustos**, no artefactos de ruido de descomposición lineal.

**¿Qué son los SAEs?** Los Sparse Autoencoders descomponen activaciones de LLM en features interpretables. A diferencia de las proyecciones lineales de PCA, los SAEs aprenden un diccionario de features atómicos codificando activaciones en un espacio mucho más grande (ej. 4096 → 32k dimensiones) con una penalidad de sparsity—solo unos pocos features se activan a la vez. Esto fuerza al modelo a aprender conceptos disentangled en lugar de superpositions.

**Por qué esto importa:** PCA podría en teoría solo estar overfitting ruido en espacios de alta dimensión. La cross-validation de SAE confirma que las dimensiones lineales son interpretables—si PCA encontró 14 dimensiones para Llama-3.1-8B y la descomposición SAE muestra ~14 features distintos relacionados con empatía activándose, eso es evidencia independiente de que la estructura es real. Aunque PCA aún puede perder codificación no lineal de empatía.

### Finding 5: Empathy Generaliza Entre Contextos

87% de success rate de transferencia cuando steering vectors de crisis support → technical assistance. Los modelos codifican **patrones generalizables** que se transfieren entre contextos, sugiriendo que las representaciones empáticas no son puramente específicas del contexto—aunque si estas son verdaderamente "abstractas" o simplemente patrones de cortesía domain-general permanece como pregunta abierta.

**Impacto práctico:** Podés extraer empathy vectors de cualquier contexto y aplicarlos en otro lugar con éxito razonable.

## Lo Que NO Estamos Afirmando

Este estudio mide **representación geométrica de patrones de lenguaje empático** en activaciones del modelo. NO afirmamos medir:

- ❌ Empatía genuina (concepto filosófico)
- ❌ Si los outputs son realmente útiles para humanos (requiere evaluación humana)
- ❌ Dimensiones morales/éticas de empatía
- ❌ Si los modelos "entienden" empatía en sentido humano
- ❌ Que mayor bandwidth garantiza mejores outputs empáticos (requiere evaluación humana)
- ❌ Que las diferencias de bandwidth derivan específicamente de arquitectura vs. training data vs. fine-tuning

**Lo que SÍ podemos decir:** Algunos modelos tienen representaciones internas más ricas para comunicación empática. Si eso hace sus outputs más útiles es una pregunta empírica que requiere estudios humanos.

## Limitaciones

1. **Coherence threshold:** El corte de 0.7 es algo arbitrario. Análisis de sensibilidad a través de múltiples thresholds fortalecería los findings. Coherence mide gramaticalidad/tematicidad, no helpfulness empática.
2. **Suposiciones de PCA:** La reducción de dimensionalidad lineal perderá estructura no lineal. La validación SAE confirma que las dimensiones lineales son interpretables, pero la empatía también puede codificarse en manifolds no lineales que no estamos midiendo.
3. **Selección de modelos:** Limitado a modelos open-weight de 7-9B. Los modelos más grandes (70B+) pueden mostrar patrones diferentes.
4. **Diversidad de prompts:** 50 pares proporcionan buena cobertura pero más escenarios diversos fortalecerían las afirmaciones de generalización.
5. **Synthetic data:** Todas las muestras fueron generadas por modelos. Aunque el pipeline fue validado, los resultados pueden no reflejar completamente cómo los modelos responden a prompts escritos por humanos con contenido emocional genuino.
6. **Estudio observacional:** Todos los findings son correlacionales. Afirmaciones causales requieren estudios intervencionistas como activation patching o ablations de arquitectura controladas.

## Trabajo Futuro

**Evaluación Humana de Outputs con Steering**
¿Predice mayor bandwidth respuestas más útiles? Necesitamos jueces humanos para calificar completions con steering para validar si el geometric bandwidth correlaciona con empatía percibida.

**Intervención Causal vía Activation Patching**
¿Podemos *ablate* dimensiones de empatía y observar respuestas empáticas degradadas? Validaría que estas dimensiones son causalmente relevantes.

**Layer-wise Bandwidth Profiling**
¿Emerge la empatía gradualmente a través de layers, o se concentra en regiones específicas? Podría informar dónde aplicar steering para máximo efecto.

**Scaling a Modelos Más Grandes**
¿Muestran los modelos 70B+ bandwidth aún mayor? ¿O llegan a diminishing returns?

## Implicaciones Prácticas

Si estás construyendo aplicaciones que requieren comunicación empática:

1. **Gemma2-9B y Llama-3.1-8B** tienen 3-4x el empathetic bandwidth de Mistral-7B (Nota: Mayor bandwidth sugiere representaciones internas más ricas, pero la calidad del output debe validarse con evaluaciones humanas antes de desplegar en aplicaciones sensibles como crisis support)
2. Los steering vectors **se transfieren entre contextos** — extrae una vez, aplica en cualquier lugar
3. Los modelos con alta dimensionalidad (≥11) tienden a tener steering ranges más amplios
4. El empathy bandwidth es **2.8x más grande que syntactic complexity** — esto no es solo model quality general

**Conclusión:** El empathetic bandwidth es una propiedad medible, dependiente de arquitectura. Y varía dramáticamente.

---

*Detalles completos de metodología, código e instrucciones de reproducción: [GitHub - Empathetic Language Bandwidth](https://github.com/marcosantar93/empathetic-language-bandwidth)*

*Reporte técnico completo: [Measuring Empathetic Language Encoding in LLMs (PDF)](https://github.com/marcosantar93/empathetic-language-bandwidth/blob/main/results/empathy/empathy_geometry_report.pdf)*

*Gracias a [j⧉nus](https://x.com/repligate) por la conversación que inspiró este trabajo.*
    `,
  },
];
