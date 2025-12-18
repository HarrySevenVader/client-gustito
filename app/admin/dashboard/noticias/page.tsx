'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/DashboardLayout';
import NewsList from '../../../../components/NewsList';
import NewsFormModal from '../../../../components/NewsFormModal';
import styles from '../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../components/swalHelper';
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
  fec_actualizacion: string;
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [limiteInfo, setLimiteInfo] = useState<any>(null);
  const router = useRouter();

  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/noticias');
      const data = await response.json();

      if (data.ok && data.data) {
        setNoticias(data.data);
      } else {
        console.error('Error al cargar noticias:', data.mensaje);
      }
    } catch (error) {
      console.error('Error al cargar noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLimite = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/noticias/limite');
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
      const response = await fetch(`http://localhost:4000/api/noticias/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Noticia movida a la papelera');
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

  // Transformar las noticias al formato esperado por NewsList
  const noticiasFormateadas = noticias.map((n) => ({
    id: n.id_noticia,
    title: n.titulo,
    date: new Date(n.fecha_publicacion).toLocaleDateString('es-CL'),
    description: n.contenido.substring(0, 100) + '...',
    image: n.imagen || '/placeholder.svg',
    estado: n.estado,
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
        <h1>Noticias</h1>
        <p>Desde aquí podrás gestionar noticias: crear, editar y borrar.</p>

        {limiteInfo && (
          <div style={{ 
            padding: '12px', 
            background: limiteInfo.puedeAgregar ? '#e8f5e9' : '#fff3e0',
            borderRadius: '8px',
            marginTop: '12px',
            marginBottom: '12px'
          }}>
            <strong>Límite:</strong> {limiteInfo.total} / {limiteInfo.limite} noticias
            {limiteInfo.disponibles > 0 && (
              <span style={{ marginLeft: '10px', color: '#4caf50' }}>
                (Puedes agregar {limiteInfo.disponibles} más)
              </span>
            )}
            {limiteInfo.disponibles === 0 && (
              <span style={{ marginLeft: '10px', color: '#ff9800' }}>
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
          <p>Cargando noticias...</p>
        ) : (
          <>
            <NewsList 
              rows={noticiasPaginadas} 
              onEdit={handleEdit}
              onDelete={handleDelete}
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
          estado: editingNoticia.estado,
        } : undefined}
      />
    </DashboardLayout>
  );
}
