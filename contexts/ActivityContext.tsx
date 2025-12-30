'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ActivityLog {
  id: string;
  type: 'product' | 'consulta' | 'noticia';
  action: 'crear' | 'editar' | 'eliminar' | 'restaurar';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  date: Date;
}

interface ActivityContextType {
  recentActivities: ActivityLog[];
  addActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp' | 'date'>) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);

  const addActivity = useCallback((activity: Omit<ActivityLog, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newActivity: ActivityLog = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random()}`,
      timestamp: 'Hace un momento',
      date: now
    };

    setRecentActivities(prev => {
      // Agregar nueva actividad al inicio
      const updated = [newActivity, ...prev];
      // Mantener solo las últimas 50 actividades
      return updated.slice(0, 50);
    });

    console.log('📌 Nueva actividad registrada:', newActivity);
  }, []);

  const clearActivities = useCallback(() => {
    setRecentActivities([]);
  }, []);

  return (
    <ActivityContext.Provider value={{ recentActivities, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    // Retornar valores por defecto si no está dentro del provider
    return {
      recentActivities: [],
      addActivity: () => {},
      clearActivities: () => {}
    };
  }
  return context;
}
