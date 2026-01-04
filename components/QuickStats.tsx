'use client';

import styles from './QuickStats.module.css';
import { useTheme } from '../contexts/ThemeContext';

interface QuickStatItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface QuickStatsProps {
  stats: QuickStatItem[];
  loading?: boolean;
}

export default function QuickStats({ stats, loading = false }: QuickStatsProps) {
  const { theme } = useTheme();
  if (loading) {
    return (
      <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
        <h3 className={styles.title}>Estadísticas Rápidas</h3>
        <div className={styles.grid}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <span className={styles.loadingText}>Cargando estadísticas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
      <h3 className={styles.title}>Estadísticas Rápidas</h3>
      <div className={styles.grid}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={styles.statItem}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              borderLeftColor: stat.color 
            }}
          >
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{stat.icon}</span>
            </div>
            <div className={styles.content}>
              <div className={styles.label}>{stat.label}</div>
              <div className={styles.value}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
