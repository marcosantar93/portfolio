import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../hooks/useTranslation';
import { blogPosts } from '../../content/blog';
import styles from './BlogPost.module.css';

// Simple markdown renderer with table support
const renderMarkdown = (markdown: string): string => {
  let html = markdown;

  // Handle tables
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => `<th>${h.trim()}</th>`).join('');
    const rowsHtml = rows.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  });

  return html
    // Horizontal rules
    .replace(/^---$/gim, '<hr>')
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Code blocks
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // Numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hultpre]|<\/[hultpre]|<li|<table|<hr)(.*$)/gim, '<p>$1</p>')
    // Cleanup
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hultpre])/g, '$1')
    .replace(/(<\/[hultpre]>)<\/p>/g, '$1');
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useTranslation();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className={styles.blogPost}>
        <h1 className={styles.title}>Post Not Found</h1>
        <p className={styles.notFound}>
          The blog post you're looking for doesn't exist.
        </p>
        <Link to="/blog" className={styles.backLink}>
          ← {t.common.backToBlog}
        </Link>
      </div>
    );
  }

  const translatedPost = t.blogPosts[post.slug as keyof typeof t.blogPosts];
  const displayTitle = translatedPost?.title || post.title;
  const displayExcerpt = translatedPost?.excerpt || post.excerpt;
  const displayReadTime = translatedPost?.readTime || post.readTime;

  // Get content in the appropriate language
  const displayContent = language === 'es' && post.contentEs ? post.contentEs : post.content;

  const pageTitle = `${displayTitle} | Marco Santarcangelo Zazzetta`;
  const pageUrl = `https://marcosantar.com/blog/${post.slug}`;

  return (
    <div className={styles.blogPost}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={displayExcerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayExcerpt} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content="Marco Santarcangelo Zazzetta" />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={displayExcerpt} />
        <meta name="twitter:creator" content="@marcosantar93" />

        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <Link to="/blog" className={styles.backLink}>
        ← {t.common.backToBlog}
      </Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{displayTitle}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>{post.date}</span>
            {displayReadTime && <span className={styles.readTime}>• {displayReadTime}</span>}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className={styles.content}>
          {displayContent ? (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(displayContent) }} />
          ) : (
            <>
              <p>{post.excerpt}</p>
              <p className={styles.comingSoon}>
                Full blog post content coming soon. This is a placeholder for the complete article.
              </p>
            </>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
