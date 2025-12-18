'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/DashboardLayout';
import TrashList from '../../../../../components/TrashList';
import styles from '../../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../../components/swalHelper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_POR_PAGINA = 8;

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_id: number;
  imagen_url: string;
  precio: number;
  activo: boolean;
  created_at?: string;
}

export default function PapeleraPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const router = useRouter();

  const fetchProductosEliminados = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/comidas/papelera');
      const data = await response.json();

      if (data.ok && data.data) {
        // Transformar los datos del backend al formato del frontend
        const productosTransformados = data.data.map((comida: any) => ({
          id: comida.id_comida,
          nombre: comida.nombre_comida,
          descripcion: comida.descripcion,
          categoria_id: comida.categoria_id,
          imagen_url: comida.imagen_url,
          precio: comida.precio,
          activo: comida.activo,
          created_at: comida.created_at,
        }));
        setProductos(productosTransformados);
      } else {
        console.error('Error al cargar productos eliminados:', data.mensaje);
      }
    } catch (error) {
      console.error('Error al cargar productos eliminados:', error);
      toastError('Error al cargar la papelera');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductosEliminados();
  }, []);

  const handleRestore = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/comidas/${id}/restaurar`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Producto restaurado exitosamente');
        fetchProductosEliminados();
      } else {
        toastError(data.mensaje || 'Error al restaurar producto');
      }
    } catch (error) {
      console.error('Error al restaurar producto:', error);
      toastError('Error al conectar con el servidor');
    }
  };

  const handleDeletePermanently = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/comidas/${id}/permanente`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Producto eliminado permanentemente');
        fetchProductosEliminados();
      } else {
        toastError(data.mensaje || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toastError('Error al conectar con el servidor');
    }
  };

  // Transformar los productos al formato esperado por TrashList
  const productosFormateados = productos.map((p) => ({
    id: p.id,
    title: p.nombre,
    date: p.created_at ? new Date(p.created_at).toLocaleDateString('es-CL') : '-',
    description: p.descripcion,
    price: p.precio,
    image: p.imagen_url || '/placeholder.svg',
  }));

  // Cálculo de paginación
  const totalPaginas = Math.ceil(productosFormateados.length / ITEMS_POR_PAGINA);
  const indiceFinal = paginaActual * ITEMS_POR_PAGINA;
  const indiceInicial = indiceFinal - ITEMS_POR_PAGINA;
  const productosPaginados = productosFormateados.slice(indiceInicial, indiceFinal);

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const handlePaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  return (
    <DashboardLayout>
      <section>
        <h1>🗑️ Papelera de Productos</h1>
        <p>Aquí puedes ver los productos eliminados. Puedes restaurarlos o eliminarlos permanentemente.</p>

        <div style={{ height: 12 }} />

        <div style={{ marginBottom: 12 }}>
          <button 
            className={styles.addBtn} 
            onClick={() => router.push('/admin/dashboard/productos')}
          >
            ← Volver a Productos
          </button>
        </div>

        {loading ? (
          <p>Cargando productos eliminados...</p>
        ) : (
          <>
            <TrashList 
              rows={productosPaginados} 
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
