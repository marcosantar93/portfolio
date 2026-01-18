import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../../content/blog';
import styles from './Blog.module.css';

const Blog: React.FC = () => {
  return (
    <div className={styles.blog}>
      <Helmet>
        <title>Blog | Marco Santar</title>
        <meta name="description" content="Thoughts and findings on mechanistic interpretability, LLM safety, and AI research by Marco Santar." />
        <link rel="canonical" href="https://marcosantar.com/blog" />
      </Helmet>

      <h1 className={styles.pageTitle}>Blog</h1>
      <p className={styles.description}>
        Thoughts and findings on mechanistic interpretability, LLM safety, and AI research.
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
        <p className={styles.noPosts}>No blog posts yet. Check back soon!</p>
      )}
    </div>
  );
};

export default Blog;
