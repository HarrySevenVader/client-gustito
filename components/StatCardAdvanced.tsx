'use client';

import styles from './StatCardAdvanced.module.css';

interface StatCardAdvancedProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  subtitle?: string;
}

export default function StatCardAdvanced({ 
  title, 
  value, 
  trend, 
  icon = '📊', 
  color = 'blue',
  subtitle 
}: StatCardAdvancedProps) {
  
  const colorClasses: Record<string, string> = {
    green: styles.green,
    blue: styles.blue,
    purple: styles.purple,
    orange: styles.orange,
    red: styles.red,
  };

  return (
    <div className={`${styles.card} ${colorClasses[color]}`}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{icon}</span>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
      
      <div className={styles.value}>{value}</div>
      
      {trend && (
        <div className={styles.trendContainer}>
          <span className={`${styles.trend} ${trend.isPositive ? styles.trendPositive : styles.trendNegative}`}>
            <span className={styles.trendIcon}>{trend.isPositive ? '↗' : '↘'}</span>
            <span className={styles.trendValue}>{Math.abs(trend.value)}%</span>
          </span>
          <span className={styles.trendText}>vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
