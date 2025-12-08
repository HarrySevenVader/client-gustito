'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import StatCard from '../../../components/StatCard';
import EntityTable from '../../../components/EntityTable';
import styles from '../../../components/adminStyles.module.css';

export default function DashboardPage() {
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalConsultas, setTotalConsultas] = useState(0);
  const [consultasRecientes, setConsultasRecientes] = useState([]);
  const [productosRecientes, setProductosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar estadísticas de consultas
      const resEstadisticas = await fetch('http://localhost:4000/api/consultas/estadisticas');
      const dataEstadisticas = await resEstadisticas.json();
      if (resEstadisticas.ok && dataEstadisticas.data) {
        setTotalConsultas(dataEstadisticas.data.total_consultas);
      }

      // Cargar consultas recientes
      const resRecientes = await fetch('http://localhost:4000/api/consultas/recientes');
      const dataRecientes = await resRecientes.json();
      if (resRecientes.ok && dataRecientes.data) {
        // Formatear consultas para EntityTable
        const consultasFormateadas = dataRecientes.data.map((c: any) => ({
          id: c.id_consulta,
          title: `${c.nombre} ${c.apellido} - ${c.mensaje.substring(0, 50)}${c.mensaje.length > 50 ? '...' : ''}`,
          date: new Date(c.fecha_envio).toLocaleDateString('es-CL')
        }));
        setConsultasRecientes(consultasFormateadas);
      }

      // Cargar productos
      const resProductos = await fetch('/api/comidas');
      const dataProductos = await resProductos.json();
      if (dataProductos.ok && dataProductos.data) {
        const productosActivos = dataProductos.data.filter((p: any) => p.activo === true);
        setTotalProductos(productosActivos.length);
        
        // Obtener los 5 productos más recientes
        const productosFormateados = productosActivos
          .slice(0, 5)
          .map((p: any) => ({
            id: p.id_comida,
            title: p.nombre_comida,
            date: p.created_at ? new Date(p.created_at).toLocaleDateString('es-CL') : '-'
          }));
        setProductosRecientes(productosFormateados);
      }

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Panel de administrador</h1>
        </div>

        <div style={{ height: 18 }} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando datos...
          </div>
        ) : (
          <>
            <div className={styles.cards}>
              <StatCard title="Productos" value={totalProductos} />
              <StatCard title="Noticias" value={0} />
              <StatCard title="Consultas" value={totalConsultas} />
            </div>

            <div style={{ height: 18 }} />

            {productosRecientes.length > 0 && (
              <>
                <EntityTable title="Productos recientes" rows={productosRecientes} />
                <div style={{ height: 14 }} />
              </>
            )}

            {consultasRecientes.length > 0 && (
              <EntityTable title="Consultas recientes" rows={consultasRecientes} />
            )}
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
