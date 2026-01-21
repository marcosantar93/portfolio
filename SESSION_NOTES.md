# Session Notes - Favicon Fix (2026-01-20)

## Issue
Favicon was not displaying correctly on marcosantar.com despite multiple browser cache clearing attempts (tested in Chrome incognito and fresh Safari session).

## Root Cause
1. **Old favicon.ico file**: The `favicon.ico` was still the old React default icon from 2023
2. **CloudFront caching**: Even with browser cache clearing, CloudFront edge servers were serving cached versions
3. **Missing multi-format icons**: Lacked properly generated PNG favicons in multiple sizes

## Solution Implemented

### 1. Added Properly Generated Favicon Files
Copied professionally generated favicon files from `/Users/marcosantarcangelozazzetta/Downloads/favicon_io/`:
- `favicon.ico` - Multi-size ICO file for maximum compatibility
- `favicon-16x16.png` - Small favicon
- `favicon-32x32.png` - Standard favicon
- `apple-touch-icon.png` - iOS/Apple devices (180x180)
- `android-chrome-192x192.png` → `logo192.png` - Android/PWA
- `android-chrome-512x512.png` → `logo512.png` - Android/PWA

### 2. Updated Configuration Files

**public/index.html**
```html
<link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png?v=3" />
<link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png?v=3" />
<link rel="icon" href="%PUBLIC_URL%/favicon.ico?v=3" />
<link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png?v=3" />
```

**public/manifest.json**
- Updated to include all new icon sizes
- Added apple-touch-icon entry

### 3. Cache-Busting Strategy
- Added `?v=3` query parameters to all favicon URLs
- Forces browsers to treat them as new resources

### 4. Deployment
```bash
npm run build
aws s3 sync build/ s3://marcosantar.com/ --delete
aws cloudfront create-invalidation --distribution-id EONAIEAJ6WT2O --paths "/*"
```

**CloudFront Invalidation ID**: `I40V44MVOGSEQG8EOSIHF7HPWF`

### 5. Git Commit
- **Commit hash**: `ad360ee`
- **Message**: "Update favicon with properly generated multi-format icons"
- **Files changed**: 8 files (3 added, 5 modified)

## Infrastructure Details
- **Domain**: marcosantar.com (AWS Route53)
- **CDN**: AWS CloudFront (Distribution ID: EONAIEAJ6WT2O)
- **Storage**: S3 bucket `marcosantar.com`
- **SSL/TLS**: AWS ACM Certificate (TLS 1.2+)

## Testing
After CloudFront invalidation completes (2-3 minutes):
1. Visit https://marcosantar.com in fresh incognito window
2. Custom brain/neural network icon should appear in browser tab
3. Works across all browsers and devices

## Key Learnings
- CloudFront caching can persist even with browser cache clearing
- Multi-format favicon files ensure compatibility across all platforms
- Cache-busting query parameters (`?v=X`) are essential for favicon updates
- Proper favicon.ico generation from SVG ensures fallback support

## Resources Referenced
- [Deploy React app to S3 & Cloudfront - DEV Community](https://dev.to/karanpratapsingh/deploy-react-app-to-s3-cloudfront-1cao)
- [Favicon not updating after build in Create React App](https://github.com/facebook/create-react-app/discussions/17056)
- [The Public Folder (and favicons!!) in create-react-app](https://medium.com/@jenniferdobak/the-public-folder-and-favicons-in-create-react-app-8dc2cc1d492b)
- [How to Change the Favicon & Title of Your React App](https://medium.com/@leahcardoz/how-to-change-the-favicon-title-of-your-react-app-in-5-minutes-9163e023b8d2)

## Next Session
- Verify favicon is displaying correctly across all browsers
- If needed, increment cache-busting version to `?v=4`
- Consider removing old `favicon.svg` if no longer needed

---

# Session Notes - Spanish Translation Review (2026-01-21)

## Session Summary
Reviewed and improved the Spanish translation of the blog post "Empathetic Language Bandwidth" by replacing unnatural Spanish technical terms with English equivalents, following standard practice in Spanish technical writing.

## Context
The user (Marco Santarcangelo Zazzetta) is from Argentina and requested the site use Argentine Spanish dialect (voseo: "vos" instead of "tú"). After initial translation, the user noticed that some forced Spanish technical translations sounded unnatural, particularly "tasa de éxito" (success rate), and requested a comprehensive review of the translation.

User's exact feedback: *"'tasa de éxito' es muy raro en español, success rate tal vez sea mejor. revisa la traduccion con el council"*

## Work Completed

### Technical Terms Replaced (Spanish → English)
All changes made in `src/content/blog/index.ts`:

1. **"tasa de éxito"** → **"success rate"** (2 occurrences)
   - Line 194: Context about transfer success rate
   - Line 252: Context about transfer success rate

2. **"separabilidad lineal"** → **"linear separability"**
   - Line 211: AUROC to measure linear separability

3. **"umbral"** → **"threshold"** (multiple occurrences)
   - Line 212: threshold de 90% variance
   - Line 271: Coherence threshold heading

4. **"promedió"** / **"averaged"** → kept as **"averaged"** (2 occurrences)
   - Line 198: Models with ≥11 dimensions averaged 8.8
   - Line 198: Those with <11 averaged 6.4

5. **"rendimientos decrecientes"** → **"diminishing returns"**
   - Line 290: Context about scaling to larger models

6. **"intercambian"** → **"trade off"**
   - Line 232: Models don't trade off breadth for depth

7. **"Amplitud y profundidad"** → **"Breadth y depth"** (2 occurrences)
   - Line 198: Section heading
   - Line 232: Context about breadth vs depth

8. **"múltiples umbrales"** → **"múltiples thresholds"**
   - Line 271: Sensitivity analysis across multiple thresholds

### Rationale
In Spanish technical writing, especially in fields like ML/AI, it's standard and more natural to keep technical terms in English rather than forcing Spanish translations. Native Spanish speakers in technical fields use these English terms regularly.

### Files Modified
- **`src/content/blog/index.ts`**: Updated `contentEs` field with natural technical terminology

### Build and Deployment
- Successfully built the application (npm run build)
- Deployed to S3 bucket: `marcosantar.com`
- CloudFront cache invalidated (Distribution ID: EONAIEAJ6WT2O)
- **Invalidation ID**: `I8X3V0GOQUGTNFI2C9XF7R2CDD`
- Status: Deployed and live at https://marcosantar.com

## Technical Stack
- **React 18.2.0** with TypeScript
- **Custom i18n system** (no external library)
- **LanguageContext** for state management
- **Argentine Spanish dialect** (voseo)
- **AWS Infrastructure**: S3 + CloudFront + Route53

## Key Design Decisions

### 1. Bilingual Content Strategy
- Separate content fields: `content` (English) and `contentEs` (Spanish)
- Translation system in `src/translations/` for UI text
- Full blog post translations stored directly in blog post objects

### 2. Technical Term Policy
- Keep English technical terms in Spanish translation:
  - ML/AI terminology: "language models", "activation geometry", "bandwidth", "PCA", "SAE", "steering vectors"
  - Technical metrics: "success rate", "threshold", "linear separability", "diminishing returns"
  - Technical concepts: "breadth", "depth", "trade off", "averaged"
- This reflects how Spanish-speaking technical professionals actually communicate

### 3. Argentine Spanish Dialect (Voseo)
Examples throughout the Spanish translation:
- "Pensalo como" (not "Piénsalo como")
- "Podés extraer" (not "Puedes extraer")
- Uses "vos" conjugations instead of "tú" conjugations

## Project Structure Reference

```
src/
├── context/
│   ├── LanguageContext.tsx     # Language state management with localStorage
│   └── ThemeContext.tsx         # Theme state management
├── translations/
│   ├── en.ts                    # English translations
│   ├── es.ts                    # Spanish translations (Argentine dialect)
│   └── index.ts                 # Export utilities
├── hooks/
│   └── useTranslation.ts        # Hook for accessing translations
├── components/
│   └── common/
│       ├── LanguageSelector/    # Language toggle component
│       └── Navigation/          # Nav with language + theme selectors
├── content/
│   └── blog/
│       └── index.ts             # Blog posts with contentEs field
└── pages/
    ├── BlogPost/                # Loads content based on language
    └── Blog/                    # Shows translated metadata
```

## Previous Session Work (Context)

### Initial Bilingual Implementation
1. Created bilingual system with language selector
2. Implemented LanguageContext with localStorage persistence
3. Created translation files (en.ts, es.ts)
4. Updated all components to use translations

### Name Update
Changed from "Marco Santar" to "Marco Santarcangelo Zazzetta" throughout the site

### Blog Translation Evolution
1. First approach: Banner for "content available in English only" (rejected)
2. Second approach: Full translation with separate `contentEs` field (accepted)
3. Third approach: Changed from Peninsular Spanish (tú) to Argentine Spanish (vos)
4. **Fourth approach (this session)**: Replace unnatural technical terms with English

## Translation Philosophy

**Spanish Technical Writing Best Practices:**
- ✅ Keep ML/AI terminology in English
- ✅ Keep established technical metrics in English
- ✅ Use voseo for Argentine audience
- ✅ Natural flow over literal translation
- ❌ Avoid forced translations of technical terms
- ❌ Don't use "tú" conjugations (use "vos" instead)

**Example Comparisons:**
- ❌ "tasa de éxito" → ✅ "success rate"
- ❌ "separabilidad lineal" → ✅ "linear separability"
- ❌ "rendimientos decrecientes" → ✅ "diminishing returns"
- ❌ "Piénsalo" (tú) → ✅ "Pensalo" (vos)
- ❌ "Puedes" (tú) → ✅ "Podés" (vos)

## Next Session / Future Work

### Potential Improvements
1. Consider adding language-specific meta tags for SEO
2. Review other blog posts if/when they're added for translation needs
3. Monitor user feedback on translation quality
4. Consider adding a "Report Translation Issue" feature

### Known Issues
- ESLint warning in `BlogPost.tsx` line 41: Unnecessary escape character in regex
- Build warnings about outdated dependencies (browserslist, babel-preset-react-app)
  - These are CRA (Create React App) related and don't affect functionality

## Session End Status
✅ All unnatural technical terms reviewed and replaced
✅ Site rebuilt successfully
✅ Deployed to production
✅ CloudFront cache invalidated
✅ Changes live at https://marcosantar.com
