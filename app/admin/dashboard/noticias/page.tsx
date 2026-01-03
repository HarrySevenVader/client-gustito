'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/DashboardLayout';
import NewsCard from '../../../../components/NewsCard';
import NewsFormModal from '../../../../components/NewsFormModal';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useActivity } from '../../../../contexts/ActivityContext';
import styles from '../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../components/swalHelper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../../../../lib/config';
import { useTheme } from '../../../../contexts/ThemeContext';

const ITEMS_POR_PAGINA = 6;

interface Noticia {
  id_noticia: number;
  titulo: string;
  contenido: string;
  imagen: string | null;
  fecha_publicacion: string;
  estado: 'activo' | 'inactivo' | 'eliminado';
  fec_creacion: string;
  fec_actualizacion: string;
}

export default function NoticiasPage() {
  const { addActivity } = useActivity();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [limiteInfo, setLimiteInfo] = useState<any>(null);
  const router = useRouter();
  const { theme } = useTheme();

  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/noticias`);
      const data = await response.json();

      console.log('📰 Respuesta API noticias:', data);

      if (data.ok && data.data) {
        console.log('✅ Noticias cargadas:', data.data.length);
        setNoticias(data.data);
      } else {
        console.error('❌ Error al cargar noticias:', data.mensaje);
        toastError('Error al cargar noticias');
      }
    } catch (error) {
      console.error('❌ Error al cargar noticias:', error);
      toastError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchLimite = async () => {
    try {
      const response = await fetch(`${API_URL}/api/noticias/limite`);
      const data = await response.json();
      if (data.ok) {
        setLimiteInfo(data.data);
      }
    } catch (error) {
      console.error('Error al cargar límite:', error);
    }
  };

  useEffect(() => {
    fetchNoticias();
    fetchLimite();
  }, []);

  const handleSuccess = () => {
    fetchNoticias();
    fetchLimite();
    setEditingNoticia(null);
  };

  const handleEdit = (id: number | string) => {
    const noticiaCompleta = noticias.find(n => n.id_noticia === id);
    if (noticiaCompleta) {
      setEditingNoticia(noticiaCompleta);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      // Obtener título de la noticia antes de eliminar
      const noticia = noticias.find(n => n.id_noticia === id);
      const tituloNoticia = noticia?.titulo || 'Noticia';
      
      const response = await fetch(`${API_URL}/api/noticias/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Noticia movida a la papelera');
        
        // Registrar actividad
        addActivity({
          type: 'noticia',
          action: 'eliminar',
          title: 'Noticia eliminada',
          description: tituloNoticia,
          icon: '🗑️'
        });
        
        fetchNoticias();
        fetchLimite();
      } else {
        toastError(data.mensaje || 'Error al borrar noticia');
      }
    } catch (error) {
      console.error('Error al borrar noticia:', error);
      toastError('Error al conectar con el servidor');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNoticia(null);
  };

  const handleAddNew = () => {
    if (limiteInfo && !limiteInfo.puedeAgregar) {
      toastError(`Límite máximo alcanzado (${limiteInfo.limite} noticias). Elimina alguna para agregar nuevas.`);
      return;
    }
    setIsModalOpen(true);
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
        <h1>Noticias</h1>
        <p>Desde aquí podrás gestionar noticias: crear, editar y borrar.</p>

        {limiteInfo && (
          <div className={`${styles.limiteBox} ${limiteInfo.puedeAgregar ? styles.success : styles.warning}`}>
            <strong>Límite:</strong> {limiteInfo.total} / {limiteInfo.limite} noticias
            {limiteInfo.disponibles > 0 && (
              <span className={styles.limiteSuccess}>
                (Puedes agregar {limiteInfo.disponibles} más)
              </span>
            )}
            {limiteInfo.disponibles === 0 && (
              <span className={styles.limiteWarning}>
                (Límite alcanzado)
              </span>
            )}
          </div>
        )}

        <div style={{ height: 12 }} />

        <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
          <button className={styles.addBtn} onClick={handleAddNew}>
            + Agregar noticia
          </button>
          <button 
            className={styles.trashBtn} 
            onClick={() => router.push('/admin/dashboard/noticias/papelera')}
          >
            🗑️ Papelera
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Cargando noticias..." />
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {noticiasPaginadas.map((noticia) => (
                <NewsCard
                  key={noticia.id_noticia}
                  id={noticia.id_noticia}
                  titulo={noticia.titulo}
                  contenido={noticia.contenido}
                  imagen={noticia.imagen}
                  fecha={noticia.fecha_publicacion}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            {noticiasPaginadas.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: '#f9fafb',
                borderRadius: '12px',
                color: '#6b7280'
              }}>
                <p style={{ fontSize: '18px', fontWeight: '600' }}>📰 No hay noticias publicadas</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Comienza agregando tu primera noticia</p>
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

      <NewsFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editMode={!!editingNoticia}
        noticiaId={editingNoticia?.id_noticia}
        initialData={editingNoticia ? {
          titulo: editingNoticia.titulo,
          contenido: editingNoticia.contenido,
          imagen: editingNoticia.imagen,
          estado: editingNoticia.estado === 'eliminado' ? 'inactivo' : editingNoticia.estado as 'activo' | 'inactivo',
        } : undefined}
      />
    </DashboardLayout>
  );
}
