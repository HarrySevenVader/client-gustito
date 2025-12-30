'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import QueryList from '../../../../components/QueryList';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { toastSuccess, toastError } from '../../../../components/swalHelper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <button
                  onClick={handlePaginaAnterior}
                  disabled={paginaActual === 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px',
                    border: '2px solid #FF6B35',
                    background: paginaActual === 1 ? '#f5f5f5' : 'white',
                    color: paginaActual === 1 ? '#ccc' : '#FF6B35',
                    cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '70px',
                  height: '45px',
                  borderRadius: '8px',
                  background: '#FF6B35',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  padding: '0 1rem',
                }}>
                  {paginaActual}
                </div>

                <button
                  onClick={handlePaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '45px',
                    height: '45px',
                    borderRadius: '8px',
                    border: '2px solid #FF6B35',
                    background: paginaActual === totalPaginas ? '#f5f5f5' : 'white',
                    color: paginaActual === totalPaginas ? '#ccc' : '#FF6B35',
                    cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
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
