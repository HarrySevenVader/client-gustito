'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/DashboardLayout';
import NewsTrashCard from '../../../../../components/NewsTrashCard';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { useActivity } from '../../../../../contexts/ActivityContext';
import styles from '../../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../../components/swalHelper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { API_URL } from '../../../../../lib/config';

const ITEMS_POR_PAGINA = 6;

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
  const { addActivity } = useActivity();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const router = useRouter();
  const { theme } = useTheme();

  const fetchNoticiasEliminadas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/noticias/papelera`);
      const data = await response.json();

      console.log('🗑️ Respuesta papelera:', data);

      if (data.ok && data.data) {
        console.log('✅ Noticias eliminadas:', data.data.length);
        setNoticias(data.data);
      } else {
        console.error('❌ Error al cargar papelera:', data.mensaje);
        toastError('Error al cargar noticias eliminadas');
      }
    } catch (error) {
      console.error('❌ Error al cargar noticias eliminadas:', error);
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
      // Obtener título de la noticia antes de restaurar
      const noticia = noticias.find(n => n.id_noticia === id);
      const tituloNoticia = noticia?.titulo || 'Noticia';
      
      const response = await fetch(`${API_URL}/api/noticias/${id}/restaurar`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Noticia restaurada exitosamente');
        
        // Registrar actividad
        addActivity({
          type: 'noticia',
          action: 'restaurar',
          title: 'Noticia restaurada',
          description: tituloNoticia,
          icon: '♻️'
        });
        
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
      const response = await fetch(`${API_URL}/api/noticias/${id}/permanente`, {
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

  // Cálculo de paginación
  const totalPaginas = Math.ceil(noticias.length / ITEMS_POR_PAGINA);
  const indiceFinal = paginaActual * ITEMS_POR_PAGINA;
  const indiceInicial = indiceFinal - ITEMS_POR_PAGINA;
  const noticiasPaginadas = noticias.slice(indiceInicial, indiceFinal);

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
          <LoadingSpinner message="Cargando papelera..." />
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {noticiasPaginadas.map((noticia) => (
                <NewsTrashCard
                  key={noticia.id_noticia}
                  id={noticia.id_noticia}
                  titulo={noticia.titulo}
                  contenido={noticia.contenido}
                  imagen={noticia.imagen}
                  fecha={noticia.fecha_publicacion}
                  onRestore={handleRestore}
                  onDeletePermanently={handleDeletePermanently}
                />
              ))}
            </div>
            
            {noticiasPaginadas.length === 0 && (
              <div className={styles.emptyTrash}>
                <p>🗑️ La papelera está vacía</p>
                <p>No hay noticias eliminadas</p>
              </div>
            )}
            
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
