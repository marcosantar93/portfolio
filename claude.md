# Personal Portfolio - Multi-Page React Application

## Project Overview

This is a React TypeScript portfolio website for Marco Santar, replacing the previous single-page HTML portfolio. The new version features multiple pages including a dedicated section for amateur ML research and a blog.

**Live Site:** https://marcosantar.com

## Current Infrastructure

### Deployment Architecture
- **Domain:** marcosantar.com (registered and managed via AWS Route53)
- **CDN:** AWS CloudFront (Distribution ID: EONAIEAJ6WT2O)
- **Storage:** AWS S3 bucket `marcosantar.com` (configured for static website hosting)
- **SSL/TLS:** AWS ACM Certificate (TLS 1.2+)
- **Email:** AWS SES configured for marcosantar.com domain

### Existing Portfolio Repository
- **Legacy Repository:** marcosantar93/portfolio (GitHub)
- **Content:** Single-page HTML portfolio currently deployed to S3
- **Files:** index.html, images, CNAME pointing to marcosantar.com

## Project Goals

Transform the portfolio from a single-page site into a multi-page React application with:

1. **Home/About Page** - Introduction and professional summary
2. **ML Research Section** - Showcase amateur machine learning research projects
3. **Blog** - Technical blog posts about ML experiments and findings
4. **Projects/Portfolio Page** - General software engineering projects
5. **Contact Information** - Professional contact details

## Technical Stack

### Frontend Framework
- **React 18.2.0** - UI library
- **TypeScript 4.9.5** - Type safety
- **React Router** - Client-side routing (to be added)
- **Create React App** - Build tooling

### Development Tools
- **React Scripts 5.0.1** - Development server and build tools
- **Testing Library** - Component testing
- **Web Vitals** - Performance monitoring

### Styling (To Be Decided)
Options to consider:
- Tailwind CSS - Utility-first CSS framework
- Styled Components - CSS-in-JS
- Material-UI - React component library
- Plain CSS/SCSS - Custom styling

## Project Structure

```
personal-portfolio/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components (Home, Research, Blog, etc.)
│   ├── styles/         # Global styles and theme
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Application entry point
├── package.json
└── tsconfig.json
```

## Planned Features

### ML Research Section
- Project cards with descriptions, methodologies, and results
- Code snippets and visualizations
- Links to GitHub repositories and papers
- Tags/categories for different ML topics (e.g., NLP, Computer Vision, Reinforcement Learning)

### Blog
- Markdown or MDX support for blog posts
- Post listing with pagination or infinite scroll
- Individual post pages with code syntax highlighting
- Tags/categories for organization
- Search functionality (optional)
- RSS feed (optional)

### General Features
- Responsive design for mobile, tablet, and desktop
- Dark mode toggle (optional)
- Smooth transitions and animations
- SEO optimization with meta tags
- Analytics integration (Google Analytics or similar)
- Performance optimization for fast loading

## Deployment Workflow

1. **Development:** Local development with `npm start`
2. **Build:** `npm run build` creates optimized production bundle in `build/` directory
3. **Deploy:**
   - Sync `build/` directory contents to S3 bucket `marcosantar.com`
   - Invalidate CloudFront cache for immediate updates
   - Command: `aws s3 sync build/ s3://marcosantar.com/ --delete && aws cloudfront create-invalidation --distribution-id EONAIEAJ6WT2O --paths "/*"`

## Development Guidelines

### Code Style
- Use functional components with hooks
- Prefer TypeScript strict mode
- Follow React best practices (composition over inheritance)
- Keep components small and focused
- Use meaningful variable and function names

### Performance Considerations
- Lazy load routes with React.lazy() and Suspense
- Optimize images (WebP format, appropriate sizes)
- Code splitting for better initial load time
- Minimize bundle size

### Content Management
- Blog posts stored as markdown files or in a CMS
- Research projects as JSON/YAML data or separate markdown files
- Images and media in public/assets or S3

## Environment Variables

Create a `.env` file for local development:
```
REACT_APP_SITE_URL=https://marcosantar.com
REACT_APP_ANALYTICS_ID=your-analytics-id
```

## Testing Strategy

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for page flows
- Accessibility testing (a11y)

## Future Enhancements

- Newsletter subscription
- Comments system for blog posts
- Interactive ML demos/visualizations
- Resume/CV download
- Projects filtering and search
- Contact form with backend integration

## Notes

- The current project is a fresh Create React App installation
- Previous portfolio was a static HTML site
- This new version should maintain the same deployment infrastructure (S3 + CloudFront)
- Consider migrating content from the old portfolio gradually
