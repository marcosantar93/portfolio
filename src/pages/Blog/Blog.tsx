import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../hooks/useTranslation';
import { blogPosts } from '../../content/blog';
import styles from './Blog.module.css';

const Blog: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.blog}>
      <Helmet>
        <title>{t.blog.pageTitle} | Marco Santar</title>
        <meta name="description" content={t.blog.metaDescription} />
        <link rel="canonical" href="https://marcosantar.com/blog" />
      </Helmet>

      <h1 className={styles.pageTitle}>{t.blog.pageTitle}</h1>
      <p className={styles.description}>
        {t.blog.description}
      </p>

      <div className={styles.posts}>
        {blogPosts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className={styles.postLink}>
            <article className={styles.postCard}>
              <div className={styles.postHeader}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <div className={styles.postMeta}>
                  <span className={styles.date}>{post.date}</span>
                  {post.readTime && <span className={styles.readTime}>{post.readTime}</span>}
                </div>
              </div>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {blogPosts.length === 0 && (
        <p className={styles.noPosts}>{t.blog.noPosts}</p>
      )}
    </div>
  );
};

export default Blog;
