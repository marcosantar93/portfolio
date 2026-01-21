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

Los steering vectors extraídos de prompts de crisis support se transfirieron a escenarios de asistencia técnica con **87% de tasa de éxito**. Los modelos codifican "direcciones empáticas" abstractas que generalizan entre contextos.

### 3. Alta Dimensionalidad Correlaciona con Range

Los modelos con ≥11 dimensiones promediaron 8.8 steering range. Aquellos con <11 promediaron 6.4. **Amplitud y profundidad co-evolucionan** — si un modelo desarrolla subspaces de empatía más ricos, también se vuelve más dirigible a lo largo de ellos.

## Metodología

Creé 50 pares de prompts empáticos/neutrales a través de 5 contextos:
- Crisis support
- Emotional disclosure
- Frustration/complaint
- Casual conversation
- Technical assistance

Para cada modelo:

1. **Entrené linear probes** para detectar activaciones empáticas vs. neutrales (AUROC para medir separabilidad lineal)
2. **Ejecuté PCA** en activaciones empáticas para medir dimensionalidad efectiva (umbral de 90% variance)
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

Los modelos no intercambian amplitud por profundidad. Los modelos de alta dimensión (Gemma2, Llama-3.1) también muestran steering ranges altos. **Ambas propiedades co-evolucionan.**

**Especulación:** La correlación entre dimensionalidad y steering range sugiere que estas propiedades pueden desarrollarse juntas, aunque no podemos determinar causalidad solo de estos datos. Si representaciones más ricas son inherentemente más controlables requeriría estudios de ablation manipulando dimensionalidad directamente.

### Finding 3: Empathy ≠ Syntax

Syntactic complexity (formal vs. casual) promedió 33.1 bandwidth. Empathy promedió 91.8. **El ratio de 2.8x valida** que estamos midiendo estructura específica de empatía, no capacidad lingüística general.

**Control check pasado.** Si viéramos bandwidths similares, sería escéptico de que esto midiera algo significativo más allá de "model quality."

### Finding 4: SAE Valida PCA

80% de los modelos mostraron acuerdo entre Sparse Autoencoder active features y dimensionalidad derivada de PCA. Esto sugiere que los subspaces medidos reflejan **patrones estadísticamente robustos**, no artefactos de ruido de descomposición lineal.

**¿Qué son los SAEs?** Los Sparse Autoencoders descomponen activaciones de LLM en features interpretables. A diferencia de las proyecciones lineales de PCA, los SAEs aprenden un diccionario de features atómicos codificando activaciones en un espacio mucho más grande (ej. 4096 → 32k dimensiones) con una penalidad de sparsity—solo unos pocos features se activan a la vez. Esto fuerza al modelo a aprender conceptos disentangled en lugar de superpositions.

**Por qué esto importa:** PCA podría en teoría solo estar overfitting ruido en espacios de alta dimensión. La cross-validation de SAE confirma que las dimensiones lineales son interpretables—si PCA encontró 14 dimensiones para Llama-3.1-8B y la descomposición SAE muestra ~14 features distintos relacionados con empatía activándose, eso es evidencia independiente de que la estructura es real. Aunque PCA aún puede perder codificación no lineal de empatía.

### Finding 5: Empathy Generaliza Entre Contextos

87% de tasa de éxito de transferencia cuando steering vectors de crisis support → technical assistance. Los modelos codifican **patrones generalizables** que se transfieren entre contextos, sugiriendo que las representaciones empáticas no son puramente específicas del contexto—aunque si estas son verdaderamente "abstractas" o simplemente patrones de cortesía domain-general permanece como pregunta abierta.

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

1. **Umbral de coherence:** El corte de 0.7 es algo arbitrario. Análisis de sensibilidad a través de múltiples umbrales fortalecería los findings. Coherence mide gramaticalidad/tematicidad, no helpfulness empática.
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
¿Muestran los modelos 70B+ bandwidth aún mayor? ¿O llegan a rendimientos decrecientes?

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
