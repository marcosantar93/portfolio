import React, { ReactNode, useEffect, useState } from 'react';
import Navigation from '../../components/common/Navigation/Navigation';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.layout}>
      {/* Parallax Cityscape Background */}
      <div className={styles.parallaxBackground}>
        {/* Far Background - Stars */}
        <div
          className={styles.cityLayer}
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-${i}`}
              className={styles.star}
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Far Buildings Layer */}
        <div
          className={`${styles.cityLayer} ${styles.farLayer}`}
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <div className={styles.building} style={{ left: '8%', height: '120px', width: '40px' }} />
          <div className={styles.building} style={{ left: '25%', height: '140px', width: '50px' }} />
          <div className={styles.building} style={{ left: '50%', height: '160px', width: '45px' }} />
          <div className={styles.building} style={{ left: '75%', height: '130px', width: '40px' }} />
        </div>

        {/* Mid Buildings Layer */}
        <div
          className={`${styles.cityLayer} ${styles.midLayer}`}
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        >
          <div className={styles.building} style={{ left: '15%', height: '200px', width: '60px' }} />
          <div className={styles.building} style={{ left: '40%', height: '220px', width: '70px' }} />
          <div className={styles.building} style={{ left: '68%', height: '210px', width: '65px' }} />
        </div>

        {/* Near Buildings Layer */}
        <div
          className={`${styles.cityLayer} ${styles.nearLayer}`}
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        >
          <div className={styles.building} style={{ left: '5%', height: '280px', width: '80px' }} />
          <div className={styles.building} style={{ left: '32%', height: '320px', width: '90px' }} />
          <div className={styles.building} style={{ left: '60%', height: '300px', width: '85px' }} />
          <div className={styles.building} style={{ left: '85%', height: '290px', width: '75px' }} />
        </div>
      </div>

      <Navigation />
      <main className={styles.main}>
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
