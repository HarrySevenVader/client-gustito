'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/DashboardLayout';
import NewsTrashList from '../../../../../components/NewsTrashList';
import styles from '../../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../../components/swalHelper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_POR_PAGINA = 8;

interface Noticia {
  id_noticia: number;
  titulo: string;
  contenido: string;
  imagen: string | null;
  fecha_publicacion: string;
  estado: 'activo' | 'inactivo' | 'eliminado';
  fec_creacion: string;
}

export default function PapeleraNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const router = useRouter();

  const fetchNoticiasEliminadas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/noticias/papelera');
      const data = await response.json();

      if (data.ok && data.data) {
        setNoticias(data.data);
      } else {
        console.error('Error al cargar noticias eliminadas:', data.mensaje);
      }
    } catch (error) {
      console.error('Error al cargar noticias eliminadas:', error);
      toastError('Error al cargar la papelera');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticiasEliminadas();
  }, []);

  const handleRestore = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/noticias/${id}/restaurar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Noticia restaurada exitosamente');
        fetchNoticiasEliminadas();
      } else {
        toastError(data.mensaje || 'Error al restaurar noticia');
      }
    } catch (error) {
      console.error('Error al restaurar noticia:', error);
      toastError('Error al conectar con el servidor');
    }
  };

  const handleDeletePermanently = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/noticias/${id}/permanente`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Noticia eliminada permanentemente');
        fetchNoticiasEliminadas();
      } else {
        toastError(data.mensaje || 'Error al eliminar noticia');
      }
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
      toastError('Error al conectar con el servidor');
    }
  };

  // Transformar las noticias al formato esperado
  const noticiasFormateadas = noticias.map((n) => ({
    id: n.id_noticia,
    title: n.titulo,
    date: new Date(n.fecha_publicacion).toLocaleDateString('es-CL'),
    description: n.contenido.substring(0, 100) + '...',
    image: n.imagen || '/placeholder.svg',
  }));

  // Cálculo de paginación
  const totalPaginas = Math.ceil(noticiasFormateadas.length / ITEMS_POR_PAGINA);
  const indiceFinal = paginaActual * ITEMS_POR_PAGINA;
  const indiceInicial = indiceFinal - ITEMS_POR_PAGINA;
  const noticiasPaginadas = noticiasFormateadas.slice(indiceInicial, indiceFinal);

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <DashboardLayout>
      <section>
        <h1>🗑️ Papelera de Noticias</h1>
        <p>Aquí puedes ver las noticias eliminadas. Puedes restaurarlas o eliminarlas permanentemente.</p>

        <div style={{ height: 12 }} />

        <div style={{ marginBottom: 12 }}>
          <button 
            className={styles.addBtn} 
            onClick={() => router.push('/admin/dashboard/noticias')}
          >
            ← Volver a Noticias
          </button>
        </div>

        {loading ? (
          <p>Cargando noticias eliminadas...</p>
        ) : (
          <>
            <NewsTrashList 
              rows={noticiasPaginadas} 
              onRestore={handleRestore}
              onDeletePermanently={handleDeletePermanently}
            />
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
