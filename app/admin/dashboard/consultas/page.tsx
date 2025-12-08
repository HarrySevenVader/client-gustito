'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import QueryList from '../../../../components/QueryList';
import { toastSuccess, toastError } from '../../../../components/swalHelper';

interface Consulta {
  id_consulta: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
  mensaje: string;
  fecha_envio: string;
}

export default function QueriesPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/consultas');
      const data = await response.json();

      if (data.ok && data.data) {
        setConsultas(data.data);
      } else {
        toastError(data.mensaje || 'Error al cargar consultas');
      }
    } catch (error) {
      console.error('Error al cargar consultas:', error);
      toastError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/consultas/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess(data.mensaje || 'Consulta eliminada exitosamente');
        // Recargar consultas
        fetchConsultas();
      } else {
        toastError(data.mensaje || 'Error al eliminar consulta');
      }
    } catch (error) {
      console.error('Error al eliminar consulta:', error);
      toastError('Error al conectar con el servidor');
    }
  };

  return (
    <DashboardLayout>
      <section>
        <h1>Consultas</h1>
        <p>Visualiza y gestiona las consultas realizadas por usuarios.</p>

        <div style={{ height: 12 }} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando consultas...
          </div>
        ) : (
          <QueryList rows={consultas} onDelete={handleDelete} />
        )}
      </section>
    </DashboardLayout>
  );
}
