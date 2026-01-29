import { BlogPost } from '../../types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'empathy-structure-validated',
    title: 'Council-Validated: Empathy Structure is Real, Independent, and Emerges at Layer 1',
    date: '2026-01-29',
    excerpt: 'A council-driven research process validates that empathy structure in LLMs is real (not a length artifact), emerges immediately at Layer 1, and is completely independent of formality. We also discovered that cosine similarity between probes is fundamentally broken as a metric.',
    tags: ['Mechanistic Interpretability', 'Empathy', 'Research Methodology', 'Research'],
    readTime: '8 min read',
    content: `
## Follow-Up: Validating Empathy Structure

This is a follow-up to my [previous work on empathetic language bandwidth](/blog/empathetic-language-bandwidth). After those initial findings, I implemented a **council-driven research process** to rigorously validate the results and address potential confounds.

The council consists of four roles: Principal Investigator (research direction), Statistician (methodology rigor), Engineer (implementation), and Devil's Advocate (assumption challenging). Each experiment requires consensus before execution.

## Key Findings

### 1. Cosine Similarity Between Probes is Broken

**This is a methodological warning for the field.**

Our initial analysis used cosine similarity between linear probe weight vectors to measure concept structure. The council challenged this: what if cosine reflects classifier geometry rather than concept-specific neural organization?

We tested by computing cosine similarity for:
- Empathy probe directions
- Random permuted labels (100 permutations)

**Result:** Random labels achieved cosine ~0.7—nearly identical to meaningful concepts. Cosine similarity doesn't distinguish real structure from noise.

**Implication:** Studies claiming concept decomposition based on probe cosines should be re-evaluated.

### 2. Four Alternative Metrics All Work

We tested four metrics that correctly distinguish empathy from random:

| Metric | Empathy | Random | Interpretation |
|--------|---------|--------|----------------|
| d-prime | **12.1** | 1.0 | Massive effect size |
| Probe Agreement | **0.96** | 0.70 | Stable cross-validation |
| Clustering Purity | **0.97** | 0.42 | Clear natural grouping |
| AUROC | **1.00** | 0.44 | Perfect classification |

All four metrics show empathy massively beats random. The d-prime of 12.1 is an enormous effect size—this isn't marginal.

### 3. Empathy Structure Survives Length Residualization

The Devil's Advocate raised a critical concern: what if "empathy structure" is just response length? Cognitive responses might simply be longer.

**Confound Analysis:**
- Chi-square test: p < 0.0001 (significant association)
- Cognitive responses: 379 chars mean
- Affective responses: 315 chars mean

Length IS confounded with empathy type. But does it explain the structure?

**Residualization Experiment:**
1. Regressed each activation dimension on response length
2. Used residuals as "length-free" activations
3. Recomputed all metrics

| Metric | Original | After Removing Length | % Retained |
|--------|----------|----------------------|------------|
| d-prime | 12.1 | **11.0** | 91% |
| Probe Agreement | 0.96 | **0.86** | 90% |
| Clustering Purity | 0.97 | **0.84** | 87% |
| AUROC | 1.00 | **0.96** | 96% |

**Length explains only 4.7% of activation variance.** After removing length, empathy structure retains 91% of its signal. Empathy is NOT a length artifact.

### 4. Empathy Emerges at Layer 1

We extracted activations from all 33 layers (embeddings + 32 transformer blocks) and computed cross-validated AUROC per layer.

| Layer Range | Mean AUROC | Interpretation |
|-------------|------------|----------------|
| Layer 0 (embeddings) | 0.50 | No signal |
| Layer 1-7 (early) | 0.93 | Strong emergence |
| Layer 8-23 (middle) | 0.99 | Near-perfect |
| Layer 24-32 (late) | 0.98 | Maintained |
| Random baseline | 0.53 | Chance level |

**Empathy structure appears immediately at Layer 1** (AUROC = 0.96) and peaks at Layer 2 (AUROC = 1.0). This is much earlier than expected—most semantic concepts emerge in middle-to-late layers.

### 5. Early Emergence is Not Empathy-Specific

Is Layer 1 emergence special to empathy? We compared against formality (formal vs. casual language):

| Feature | Emergence Layer | Peak Layer | Peak AUROC |
|---------|-----------------|------------|------------|
| Empathy | Layer 1 | Layer 2 | 1.00 |
| Formality | Layer 1 | Layer 1 | 1.00 |

Both features emerge at Layer 1 with identical patterns. Early emergence is a general property of discriminable linguistic features, not empathy-specific.

### 6. Empathy is 100% Independent of Formality

The critical question: is empathy structure entangled with formality, or independent?

**Experiment:**
1. Computed formality direction from probe weights
2. Projected formality out of empathy activations
3. Measured empathy classification on residualized activations

| Metric | Value |
|--------|-------|
| Original empathy AUROC | 1.000 |
| After removing formality | 1.000 |
| Retention | **100%** |
| Cosine(empathy, formality) | 0.35 |

**Removing the formality direction has zero effect on empathy classification.** The cosine of 0.35 shows partial geometric alignment, but not enough to matter functionally.

## What This Means

### For AI Safety

If you want to steer empathy in LLM outputs, you can do so **without affecting formality** (and vice versa). The directions are sufficiently orthogonal for targeted intervention. This has practical implications for building more controllable systems.

### For Interpretability Research

1. **Don't use cosine similarity between probes** to measure concept structure—it's broken
2. **Use AUROC, d-prime, probe agreement, or clustering purity** instead
3. **Always check for confounds** (length, formality, etc.) and residualize
4. **Layer-wise analysis reveals processing dynamics**—empathy is computed very early

### For Understanding LLM Cognition

The model encodes empathy and formality as **orthogonal linguistic features** that both emerge immediately after embeddings. This suggests:

- Early layers encode multiple discriminable features simultaneously
- These features occupy distinct subspaces despite early emergence
- Empathy is not reducible to surface-level stylistic differences

## Metric Recommendations

Based on this work, here's a practical guide:

| Metric | Use For | Threshold |
|--------|---------|-----------|
| AUROC | Classification accuracy | >0.9 = strong |
| d-prime | Effect size | >2 = meaningful |
| Probe Agreement | Cross-validation | >0.8 = stable |
| Clustering Purity | Natural grouping | >0.8 = clear |
| **Cosine** | **DO NOT USE** | Broken |

## Methodology: Council Process

Each cycle followed this protocol:

1. **Proposal** - PI proposes experiment
2. **Review** - Statistician, Engineer, Devil's Advocate critique
3. **Consensus** - Green light only when all concerns addressed
4. **Execution** - Run experiment (Mistral-7B on RunPod GPU)
5. **Analysis** - Interpret and plan next cycle

The Devil's Advocate role proved crucial—it caught the length confound that could have invalidated our conclusions.

## Summary

| Finding | Implication |
|---------|-------------|
| Cosine broken | Use AUROC/d-prime instead |
| 91% retention after length | Empathy is real, not artifact |
| Layer 1 emergence | Processed very early |
| 100% independence from formality | Orthogonal features |

**Bottom line:** Empathy structure in LLMs is real, emerges immediately, and is independent of other linguistic features. The original findings hold up under rigorous scrutiny.

---

*Repository with full code and data: [GitHub - Empathetic Language Bandwidth](https://github.com/marcosantar93/empathetic-language-bandwidth)*

*This follow-up validates and extends the [original empathetic bandwidth study](/blog/empathetic-language-bandwidth).*
    `,
    contentEs: `
## Seguimiento: Validando la Estructura de Empatía

Este es un seguimiento de mi [trabajo previo sobre empathetic language bandwidth](/blog/empathetic-language-bandwidth). Después de esos findings iniciales, implementé un **proceso de investigación council-driven** para validar rigurosamente los resultados y abordar posibles confounds.

El council consiste en cuatro roles: Principal Investigator (dirección de investigación), Statistician (rigor metodológico), Engineer (implementación), y Devil's Advocate (cuestionamiento de suposiciones). Cada experimento requiere consenso antes de su ejecución.

## Findings Clave

### 1. Cosine Similarity Entre Probes Está Rota

**Esta es una advertencia metodológica para el campo.**

Nuestro análisis inicial usó cosine similarity entre vectores de pesos de linear probes para medir estructura de conceptos. El council cuestionó esto: ¿y si cosine refleja geometría del clasificador en lugar de organización neural específica del concepto?

Probamos computando cosine similarity para:
- Direcciones de empathy probe
- Labels permutados aleatoriamente (100 permutaciones)

**Resultado:** Labels aleatorios alcanzaron cosine ~0.7—casi idéntico a conceptos significativos. Cosine similarity no distingue estructura real de ruido.

**Implicación:** Estudios que afirman descomposición de conceptos basados en cosines de probes deberían ser reevaluados.

### 2. Cuatro Métricas Alternativas Funcionan

Probamos cuatro métricas que correctamente distinguen empatía de aleatorio:

| Métrica | Empatía | Aleatorio | Interpretación |
|---------|---------|-----------|----------------|
| d-prime | **12.1** | 1.0 | Effect size masivo |
| Probe Agreement | **0.96** | 0.70 | Cross-validation estable |
| Clustering Purity | **0.97** | 0.42 | Agrupamiento natural claro |
| AUROC | **1.00** | 0.44 | Clasificación perfecta |

Las cuatro métricas muestran que empatía supera masivamente a aleatorio. El d-prime de 12.1 es un effect size enorme—esto no es marginal.

### 3. La Estructura de Empatía Sobrevive Length Residualization

El Devil's Advocate planteó una preocupación crítica: ¿y si "estructura de empatía" es solo longitud de respuesta? Las respuestas cognitivas podrían simplemente ser más largas.

**Análisis de Confound:**
- Chi-square test: p < 0.0001 (asociación significativa)
- Respuestas cognitivas: 379 caracteres promedio
- Respuestas afectivas: 315 caracteres promedio

La longitud SÍ está confundida con tipo de empatía. ¿Pero explica la estructura?

**Experimento de Residualización:**
1. Regresamos cada dimensión de activación sobre longitud de respuesta
2. Usamos residuales como activaciones "libres de longitud"
3. Recomputamos todas las métricas

| Métrica | Original | Después de Remover Longitud | % Retenido |
|---------|----------|----------------------------|------------|
| d-prime | 12.1 | **11.0** | 91% |
| Probe Agreement | 0.96 | **0.86** | 90% |
| Clustering Purity | 0.97 | **0.84** | 87% |
| AUROC | 1.00 | **0.96** | 96% |

**La longitud explica solo 4.7% de la varianza de activación.** Después de remover longitud, la estructura de empatía retiene 91% de su señal. La empatía NO es un artefacto de longitud.

### 4. La Empatía Emerge en Layer 1

Extrajimos activaciones de los 33 layers (embeddings + 32 transformer blocks) y computamos AUROC cross-validated por layer.

| Rango de Layer | AUROC Promedio | Interpretación |
|----------------|----------------|----------------|
| Layer 0 (embeddings) | 0.50 | Sin señal |
| Layer 1-7 (temprano) | 0.93 | Emergencia fuerte |
| Layer 8-23 (medio) | 0.99 | Casi perfecto |
| Layer 24-32 (tardío) | 0.98 | Mantenido |
| Baseline aleatorio | 0.53 | Nivel de chance |

**La estructura de empatía aparece inmediatamente en Layer 1** (AUROC = 0.96) y alcanza su pico en Layer 2 (AUROC = 1.0). Esto es mucho más temprano de lo esperado—la mayoría de conceptos semánticos emergen en layers medio-tardíos.

### 5. La Emergencia Temprana No Es Específica de Empatía

¿Es la emergencia en Layer 1 especial para empatía? Comparamos contra formalidad (lenguaje formal vs. casual):

| Feature | Layer de Emergencia | Layer Pico | AUROC Pico |
|---------|---------------------|------------|------------|
| Empatía | Layer 1 | Layer 2 | 1.00 |
| Formalidad | Layer 1 | Layer 1 | 1.00 |

Ambas features emergen en Layer 1 con patrones idénticos. La emergencia temprana es una propiedad general de features lingüísticas discriminables, no específica de empatía.

### 6. La Empatía es 100% Independiente de Formalidad

La pregunta crítica: ¿está la estructura de empatía entrelazada con formalidad, o es independiente?

**Experimento:**
1. Computamos dirección de formalidad desde pesos de probe
2. Proyectamos formalidad fuera de activaciones de empatía
3. Medimos clasificación de empatía en activaciones residualizadas

| Métrica | Valor |
|---------|-------|
| AUROC de empatía original | 1.000 |
| Después de remover formalidad | 1.000 |
| Retención | **100%** |
| Cosine(empatía, formalidad) | 0.35 |

**Remover la dirección de formalidad tiene cero efecto en clasificación de empatía.** El cosine de 0.35 muestra alineamiento geométrico parcial, pero no suficiente para importar funcionalmente.

## Qué Significa Esto

### Para AI Safety

Si querés hacer steering de empatía en outputs de LLM, podés hacerlo **sin afectar formalidad** (y viceversa). Las direcciones son suficientemente ortogonales para intervención targeted. Esto tiene implicaciones prácticas para construir sistemas más controlables.

### Para Interpretability Research

1. **No uses cosine similarity entre probes** para medir estructura de conceptos—está rota
2. **Usá AUROC, d-prime, probe agreement, o clustering purity** en su lugar
3. **Siempre verificá confounds** (longitud, formalidad, etc.) y residualizá
4. **El análisis layer-wise revela dinámicas de procesamiento**—la empatía se computa muy temprano

### Para Entender Cognición de LLM

El modelo codifica empatía y formalidad como **features lingüísticas ortogonales** que ambas emergen inmediatamente después de embeddings. Esto sugiere:

- Los layers tempranos codifican múltiples features discriminables simultáneamente
- Estas features ocupan subspaces distintos a pesar de emergencia temprana
- La empatía no es reducible a diferencias estilísticas superficiales

## Recomendaciones de Métricas

Basado en este trabajo, acá hay una guía práctica:

| Métrica | Usar Para | Threshold |
|---------|-----------|-----------|
| AUROC | Precisión de clasificación | >0.9 = fuerte |
| d-prime | Effect size | >2 = significativo |
| Probe Agreement | Cross-validation | >0.8 = estable |
| Clustering Purity | Agrupamiento natural | >0.8 = claro |
| **Cosine** | **NO USAR** | Rota |

## Metodología: Proceso de Council

Cada ciclo siguió este protocolo:

1. **Propuesta** - PI propone experimento
2. **Revisión** - Statistician, Engineer, Devil's Advocate critican
3. **Consenso** - Green light solo cuando todas las preocupaciones se abordan
4. **Ejecución** - Ejecutar experimento (Mistral-7B en RunPod GPU)
5. **Análisis** - Interpretar y planificar siguiente ciclo

El rol de Devil's Advocate resultó crucial—detectó el confound de longitud que podría haber invalidado nuestras conclusiones.

## Resumen

| Finding | Implicación |
|---------|-------------|
| Cosine roto | Usar AUROC/d-prime en su lugar |
| 91% retención después de longitud | Empatía es real, no artefacto |
| Emergencia en Layer 1 | Procesado muy temprano |
| 100% independencia de formalidad | Features ortogonales |

**Conclusión:** La estructura de empatía en LLMs es real, emerge inmediatamente, y es independiente de otras features lingüísticas. Los findings originales se sostienen bajo escrutinio riguroso.

---

*Repositorio con código completo y datos: [GitHub - Empathetic Language Bandwidth](https://github.com/marcosantar93/empathetic-language-bandwidth)*

*Este seguimiento valida y extiende el [estudio original de empathetic bandwidth](/blog/empathetic-language-bandwidth).*
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
