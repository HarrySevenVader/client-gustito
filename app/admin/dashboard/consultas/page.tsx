'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import QueryList from '../../../../components/QueryList';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { toastSuccess, toastError } from '../../../../components/swalHelper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../../../../lib/config';
import styles from '../../../../components/adminStyles.module.css';

const ITEMS_POR_PAGINA = 8;

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
  const [paginaActual, setPaginaActual] = useState(1);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/consultas`);
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
      const response = await fetch(`${API_URL}/api/consultas/${id}`, {
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

  // Cálculo de paginación
  const totalPaginas = Math.ceil(consultas.length / ITEMS_POR_PAGINA);
  const indiceFinal = paginaActual * ITEMS_POR_PAGINA;
  const indiceInicial = indiceFinal - ITEMS_POR_PAGINA;
  const consultasPaginadas = consultas.slice(indiceInicial, indiceFinal);

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <DashboardLayout>
      <section>
        <h1>Consultas</h1>
        <p>Visualiza y gestiona las consultas realizadas por usuarios.</p>

        <div style={{ height: 12 }} />


        {loading ? (
          <LoadingSpinner message="Cargando consultas..." />
        ) : (
          <>
            <QueryList rows={consultasPaginadas} onDelete={handleDelete} />
            {totalPaginas > 1 && (
              <div className={styles.paginationContainer}>
                <button
                  onClick={handlePaginaAnterior}
                  disabled={paginaActual === 1}
                  className={styles.paginationButton}
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className={styles.paginationIndicator}>
                  {paginaActual}
                </div>

                <button
                  onClick={handlePaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  className={styles.paginationButton}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
