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
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const { theme } = useTheme();
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
