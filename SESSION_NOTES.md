# Session Notes - January 30, 2026

## Overview

This session focused on finalizing the empathy research blog post for social media publishing and fixing various UI/translation issues.

---

## Work Completed

### 1. Blog Post Refinements for Social Media Publishing

**File:** `src/content/blog/index.ts`

Made the empathy research blog post more methodologically rigorous:

- **Softened "broken" language**: Changed "Is the methodology broken?" to "Is there something wrong with our metric?" (both EN and ES)
- **Added "Theoretical Context: The Read/Write Distinction" section**: Cites Liv Gorton's work on non-linear feature representations to explain why cosine similarity fails for separately-trained probes
- **Added Liv Gorton reference** to the References section
- **Updated TL;DR #1**: Now ends with "for measuring concept relationships" instead of "for this use case"

### 2. Mobile Navigation Fix

**File:** `src/components/common/Navigation/Navigation.module.css`

Fixed overlapping navigation elements on mobile:

- Added `padding-right: 100px` to `navContent` to leave room for controls (language selector + theme toggle)
- Created separate breakpoint for very small screens (480px)
- Adjusted gaps and font sizes for better mobile layout

### 3. Spanish Translation Completeness

**Files:**
- `src/translations/es.ts`
- `src/translations/en.ts`
- `src/pages/BlogPost/BlogPost.tsx`

Completed all Spanish translations:

| Item | English | Spanish |
|------|---------|---------|
| Skills title | Skills | Habilidades |
| Rotating title | Wannabe Mech Interp Researcher | Aspirante a Mech Interp Researcher |
| Degree | Computer Engineering | Ingeniería en Computación |
| Education description | software engineering, embedded systems, computer architecture | ingeniería de software, sistemas embebidos, arquitectura de computadoras |
| WeHaus description | smart homes | hogares inteligentes |
| Post not found | Post Not Found | Post No Encontrado |
| Post not found message | The blog post you're looking for doesn't exist. | El post que estás buscando no existe. |
| Empathy blog title | We Tried to Measure Empathy in LLMs... | Intentamos Medir Empatía en LLMs... |
| Empathy blog excerpt | (full translation) | (full translation) |

**Technical terms kept in English** (would sound unnatural translated):
- Mechanistic interpretability, activation steering, representation analysis
- LLM, AI safety, computer vision, full-stack, IoT
- Layer-specific, jailbreak, probes, steering vectors, AUROC, d-prime

---

## Commits Made

```
1ca3480 Complete Spanish translations for all UI text
89a0e80 Fix mobile navigation layout to prevent overlapping with controls
beff95d Add theoretical context section and refine language for social media
```

---

## Deployments

All changes deployed to:
- **S3 Bucket:** `marcosantar.com`
- **CloudFront Distribution:** `EONAIEAJ6WT2O`
- **Live URL:** https://marcosantar.com

---

## Related Repositories

1. **Portfolio (this repo):** https://github.com/marcosantar93/portfolio
2. **Empathy Research:** https://github.com/marcosantar93/empathetic-language-bandwidth (public)

---

## Blog Posts on Site

1. **Empathy Structure Validated** (`/blog/empathy-structure-validated`)
   - Main research blog post about cosine similarity pitfall and empathy representation
   - Full content in both EN and ES
   - Ready for social media publishing

2. **Layer-Specific Safety Vulnerabilities** (`/blog/layer-specific-safety-vulnerabilities`)
   - 83% jailbreak rate via activation steering on Mistral-7B
   - Full content in both EN and ES

3. **Empathetic Language Bandwidth** (`/blog/empathetic-language-bandwidth`)
   - Original empathy bandwidth measurement study
   - Full content in both EN and ES

---

## Infrastructure Notes

- **Domain:** marcosantar.com (Route53)
- **SSL:** ACM Certificate (TLS 1.2+)
- **CDN:** CloudFront with custom error responses for SPA routing (404/403 → /index.html)
- **Deploy command:**
  ```bash
  npm run build && aws s3 sync build/ s3://marcosantar.com/ --delete && aws cloudfront create-invalidation --distribution-id EONAIEAJ6WT2O --paths "/*"
  ```

---

## Future Work / TODO

- [ ] Consider adding more blog posts
- [ ] Human evaluation of steered outputs (for empathy research)
- [ ] Potential newsletter subscription feature
- [ ] Comments system for blog posts

---

## Key Files Reference

| Purpose | File Path |
|---------|-----------|
| Blog content | `src/content/blog/index.ts` |
| English translations | `src/translations/en.ts` |
| Spanish translations | `src/translations/es.ts` |
| Navigation styles | `src/components/common/Navigation/Navigation.module.css` |
| Blog list page | `src/pages/Blog/Blog.tsx` |
| Blog post page | `src/pages/BlogPost/BlogPost.tsx` |
| Project instructions | `CLAUDE.md` |
