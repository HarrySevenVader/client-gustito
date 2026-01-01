// components/ActivityFeed.tsx
'use client';

import styles from './ActivityFeed.module.css';
import { useTheme } from '../contexts/ThemeContext';

export interface Activity {
  id: string | number;
  type: 'product' | 'consulta' | 'noticia';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  rawDate?: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const { theme } = useTheme();
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return styles.product;
      case 'consulta': return styles.consulta;
      case 'noticia': return styles.noticia;
      default: return '';
    }
  };

  return (
    <div className={`${styles.feedContainer} ${theme === 'dark' ? styles.dark : ''}`}>
      <h3 className={styles.title}>Actividad Reciente</h3>
      <div className={styles.feed}>
        {activities.length === 0 ? (
          <div className={styles.empty}>No hay actividad reciente</div>
        ) : (
          activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={styles.activityItem}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${styles.iconCircle} ${getTypeColor(activity.type)}`}>
                <span className={styles.icon}>{activity.icon}</span>
              </div>
              <div className={styles.content}>
                <div className={styles.activityTitle}>{activity.title}</div>
                <div className={styles.description}>{activity.description}</div>
                <div className={styles.timestamp}>{activity.timestamp}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
