import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../../content/blog';
import styles from './BlogPost.module.css';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className={styles.blogPost}>
        <h1 className={styles.title}>Post Not Found</h1>
        <p className={styles.notFound}>
          The blog post you're looking for doesn't exist.
        </p>
        <Link to="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.blogPost}>
      <Link to="/blog" className={styles.backLink}>
        ← Back to Blog
      </Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>{post.date}</span>
            {post.readTime && <span className={styles.readTime}>• {post.readTime}</span>}
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
          <p>{post.excerpt}</p>

          <p className={styles.comingSoon}>
            Full blog post content coming soon. This is a placeholder for the complete article.
          </p>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
