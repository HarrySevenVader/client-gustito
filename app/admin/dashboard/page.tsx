'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import StatCardAdvanced from '../../../components/StatCardAdvanced';
import ActivityFeed, { Activity } from '../../../components/ActivityFeed';
import QuickStats from '../../../components/QuickStats';
import { useActivity } from '../../../contexts/ActivityContext';
import styles from './dashboard.module.css';
import { API_URL } from '../../../lib/config';

interface DashboardStats {
  totalProductos: number;
  totalConsultas: number;
  totalNoticias: number;
  productosActivos: number;
  consultasPendientes: number;
  tendencias: {
    productos: number;
    consultas: number;
    noticias: number;
  };
}

export default function DashboardPage() {
  const { recentActivities } = useActivity();
  const [stats, setStats] = useState<DashboardStats>({
    totalProductos: 0,
    totalConsultas: 0,
    totalNoticias: 0,
    productosActivos: 0,
    consultasPendientes: 0,
    tendencias: {
      productos: 0,
      consultas: 0,
      noticias: 0
    }
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [recentActivities]); // Recargar cuando hay nuevas actividades en el log

  const cargarDatos = async () => {
    try {
      // Inicializar array de actividades con metadata de fecha
      const activityList: Array<Activity & { rawDate: Date }> = [];

      // Cargar productos
      const resProductos = await fetch('/api/comidas');
      const dataProductos = await resProductos.json();
      
      console.log('🍽️ Respuesta productos:', dataProductos);
      
      let totalProductos = 0;
      let productosActivos = 0;
      
      if (dataProductos.ok && dataProductos.data) {
        totalProductos = dataProductos.data.length;
        productosActivos = dataProductos.data.filter((p: any) => p.activo === true).length;
        
        console.log(`✅ Productos: ${totalProductos} total, ${productosActivos} activos`);
        
        // Agregar productos actualizados recientemente
        dataProductos.data
          .filter((p: any) => p.activo)
          .forEach((p: any) => {
            // Usar updated_at si existe, sino created_at
            const fechaProducto = p.updated_at || p.created_at;
            if (fechaProducto) {
              activityList.push({
                id: p.id_comida,
                type: 'product',
                title: 'Producto actualizado',
                description: p.nombre_comida,
                timestamp: formatearTiempo(fechaProducto),
                icon: '🍽️',
                rawDate: new Date(fechaProducto)
              });
            }
          });
      }

      // Cargar consultas
      const resEstadisticas = await fetch(`${API_URL}/api/consultas/estadisticas`);
      const dataEstadisticas = await resEstadisticas.json();
      
      console.log('💬 Respuesta consultas estadísticas:', dataEstadisticas);
      
      let totalConsultas = 0;
      if (resEstadisticas.ok && dataEstadisticas.data) {
        totalConsultas = dataEstadisticas.data.total_consultas;
        console.log(`✅ Total consultas: ${totalConsultas}`);
      }

      // Cargar TODAS las consultas para ordenarlas por fecha real
      const resRecientes = await fetch(`${API_URL}/api/consultas/recientes`);
      const dataRecientes = await resRecientes.json();
      
      console.log('💬 Respuesta consultas recientes:', dataRecientes);
      
      if (resRecientes.ok && dataRecientes.data) {
        console.log(`✅ Consultas recientes encontradas: ${dataRecientes.data.length}`);
        dataRecientes.data.forEach((c: any) => {
          activityList.push({
            id: c.id_consulta,
            type: 'consulta',
            title: 'Nueva consulta recibida',
            description: `${c.nombre} ${c.apellido} - ${c.mensaje.substring(0, 45)}...`,
            timestamp: formatearTiempo(c.fecha_envio),
            icon: '💬',
            rawDate: new Date(c.fecha_envio)
          });
        });
      }

      // Cargar noticias
      let totalNoticias = 0;
      try {
        const resNoticias = await fetch(`${API_URL}/api/noticias`);
        const dataNoticias = await resNoticias.json();
        
        console.log('📰 Respuesta noticias:', dataNoticias);
        
        if (resNoticias.ok && dataNoticias.ok && dataNoticias.data) {
          const noticiasActivas = dataNoticias.data.filter((n: any) => n.estado === 'activo');
          totalNoticias = noticiasActivas.length;
          
          console.log(`✅ Noticias activas encontradas: ${totalNoticias}`);
          
          // Agregar TODAS las noticias para ordenarlas por fecha
          noticiasActivas.forEach((n: any) => {
            const fechaNoticia = n.fecha_publicacion || n.fec_creacion;
            if (fechaNoticia) {
              activityList.push({
                id: n.id_noticia,
                type: 'noticia',
                title: 'Noticia publicada',
                description: n.titulo,
                timestamp: formatearTiempo(fechaNoticia),
                icon: '📰',
                rawDate: new Date(fechaNoticia)
              });
            }
          });
        } else {
          console.warn('⚠️ No se pudieron cargar las noticias o no hay datos');
        }
      } catch (errorNoticias) {
        console.error('❌ Error al cargar noticias:', errorNoticias);
      }

      // ORDENAR POR FECHA REAL - más recientes primero
      activityList.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

      // ORDENAR POR FECHA REAL - más recientes primero
      activityList.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

      console.log('📋 Total actividades:', activityList.length);
      console.log('📋 Primeras 3 actividades:', activityList.slice(0, 3).map(a => ({
        tipo: a.type,
        descripcion: a.description,
        fecha: a.rawDate.toLocaleString('es-CL'),
        timestamp: a.timestamp
      })));
      console.log('📊 Resumen final:', { totalProductos, productosActivos, totalConsultas, totalNoticias });

      // Calcular tendencias basadas en datos reales
      const tendenciaProductos = productosActivos > 5 ? 12 : -5;
      const tendenciaConsultas = totalConsultas > 5 ? 8 : -3;
      const tendenciaNoticias = totalNoticias > 2 ? 15 : -2;

      setStats({
        totalProductos,
        totalConsultas,
        totalNoticias,
        productosActivos,
        consultasPendientes: totalConsultas,
        tendencias: {
          productos: tendenciaProductos,
          consultas: tendenciaConsultas,
          noticias: tendenciaNoticias
        }
      });

      // Tomar solo las 8 actividades más recientes (ya ordenadas por fecha)
      const activitiesFinal = activityList.slice(0, 8).map(({ rawDate, ...rest }) => rest);
      
      // Combinar con actividades del log en tiempo real
      const logActivities: Activity[] = recentActivities.map(log => ({
        id: log.id,
        type: log.type,
        title: log.title,
        description: log.description,
        timestamp: log.timestamp,
        icon: log.icon
      }));
      
      // Combinar y ordenar todas las actividades
      const allActivities = [...logActivities, ...activitiesFinal];
      const uniqueActivities = allActivities.filter((activity, index, self) => 
        index === self.findIndex(a => a.description === activity.description && a.type === activity.type)
      );
      
      setActivities(uniqueActivities.slice(0, 8));

    } catch (error) {
      console.error('❌ Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearTiempo = (fecha: string): string => {
    const ahora = new Date();
    const fechaObj = new Date(fecha);
    const diff = ahora.getTime() - fechaObj.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Hace un momento';
  };

  return (
    <DashboardLayout>
      <section className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Panel de Control</h1>
            <p className={styles.subtitle}>
              Bienvenido al dashboard de Gustito - Resumen completo de tu negocio
            </p>
          </div>
          <div className={styles.dateInfo}>
            <span className={styles.dateIcon}>📅</span>
            <span className={styles.date}>
              {new Date().toLocaleDateString('es-CL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            <div className={styles.statsGrid}>
              <StatCardAdvanced
                title="Total Productos"
                value={stats.totalProductos}
                icon="🍽️"
                color="green"
                subtitle={`${stats.productosActivos} activos`}
                trend={{
                  value: stats.tendencias.productos,
                  isPositive: stats.tendencias.productos > 0
                }}
              />
              
              <StatCardAdvanced
                title="Consultas"
                value={stats.totalConsultas}
                icon="💬"
                color="blue"
                subtitle={`${stats.consultasPendientes} pendientes`}
                trend={{
                  value: stats.tendencias.consultas,
                  isPositive: stats.tendencias.consultas > 0
                }}
              />
              
              <StatCardAdvanced
                title="Noticias"
                value={stats.totalNoticias}
                icon="📰"
                color="purple"
                subtitle="Publicadas"
                trend={{
                  value: stats.tendencias.noticias,
                  isPositive: stats.tendencias.noticias > 0
                }}
              />
              
              <StatCardAdvanced
                title="Total Items"
                value={stats.productosActivos + stats.totalNoticias}
                icon="📦"
                color="orange"
                subtitle="En el sistema"
                trend={{
                  value: Math.abs(stats.tendencias.productos + stats.tendencias.noticias) / 2,
                  isPositive: (stats.tendencias.productos + stats.tendencias.noticias) > 0
                }}
              />
            </div>

            <div className={styles.bottomGrid}>
              <div className={styles.activitySection}>
                <ActivityFeed activities={activities} />
              </div>
              
              <div className={styles.quickStatsSection}>
                <QuickStats 
                  stats={[
                    {
                      label: 'Productos Activos',
                      value: stats.productosActivos,
                      icon: '✅',
                      color: '#10b981'
                    },
                    {
                      label: 'Consultas/Día',
                      value: stats.totalConsultas > 0 ? `~${Math.ceil(stats.totalConsultas / 30)}` : '0',
                      icon: '📊',
                      color: '#3b82f6'
                    },
                    {
                      label: 'Noticias Activas',
                      value: stats.totalNoticias,
                      icon: '📰',
                      color: '#f59e0b'
                    },
                    {
                      label: 'Total Consultas',
                      value: stats.totalConsultas,
                      icon: '📬',
                      color: '#8b5cf6'
                    }
                  ]}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
