'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/DashboardLayout';
import ProductList from '../../../../components/ProductList';
import ProductFormModal from '../../../../components/ProductFormModal';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useActivity } from '../../../../contexts/ActivityContext';
import styles from '../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../components/swalHelper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../../../../lib/config';

const ITEMS_POR_PAGINA = 8;

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_id: number;
  imagen_url: string;
  precio: number;
  activo: boolean;
  sucursales?: number[]; // Array de IDs de sucursales
  created_at?: string;
}

export default function ProductsPage() {
  const { addActivity } = useActivity();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/comidas`);
      const data = await response.json();

      console.log('Datos recibidos del backend:', data);

      if (data.ok && data.data) {
        // Transformar los datos del backend al formato del frontend
        // MOSTRAR productos activos e inactivos, PERO NO los que están en papelera
        const productosTransformados = data.data
          .filter((comida: any) => {
            // Excluir productos en papelera (pueden tener diferentes nombres de campo)
            const estaEnPapelera = comida.en_papelera === true || 
                                   comida.eliminado === true || 
                                   (comida.deleted_at != null && comida.deleted_at !== undefined) ||
                                   (comida.eliminado_at != null && comida.eliminado_at !== undefined);
            return !estaEnPapelera;
          })
          .map((comida: any) => ({
            id: comida.id_comida,
            nombre: comida.nombre_comida,
            descripcion: comida.descripcion,
            categoria_id: comida.categoria_id,
            imagen_url: comida.imagen_url,
            precio: comida.precio,
            activo: comida.activo,
            sucursales: comida.sucursales || [], // Array de IDs desde backend
            created_at: comida.created_at,
          }));
        setProductos(productosTransformados);
      } else {
        console.error('Error al cargar productos:', data.mensaje);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSuccess = () => {
    fetchProductos();
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    // Encontrar el producto completo en el estado
    const productoCompleto = productos.find(p => p.id === product.id);
    if (productoCompleto) {
      setEditingProduct(productoCompleto);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      // Obtener el nombre del producto antes de eliminarlo
      const producto = productos.find(p => p.id === id);
      const nombreProducto = producto?.nombre || 'Producto';
      
      const response = await fetch(`${API_URL}/api/comidas/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Producto movido a la papelera');
        
        // Registrar actividad
        addActivity({
          type: 'product',
          action: 'eliminar',
          title: 'Producto eliminado',
          description: nombreProducto,
          icon: '🗑️'
        });
        
        fetchProductos();
      } else {
        toastError(data.mensaje || 'Error al borrar producto');
      }
    } catch (error) {
      console.error('Error al borrar producto:', error);
      toastError('Error al conectar con el servidor');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Transformar los productos al formato esperado por ProductList
  const productosFormateados = productos.map((p) => ({
    id: p.id,
    title: p.nombre,
    date: p.created_at ? new Date(p.created_at).toLocaleDateString('es-CL') : '-',
    description: p.descripcion,
    price: p.precio,
    image: p.imagen_url || '/imagenes/producto_sin_imagen.svg',
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
        <h1>Productos</h1>
        <p>Desde aquí podrás gestionar productos: crear, editar y borrar.</p>

        <div style={{ height: 12 }} />

        <div style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            + Agregar producto
          </button>
          <button 
            className={styles.trashBtn} 
            onClick={() => router.push('/admin/dashboard/productos/papelera')}
          >
            🗑️ Papelera
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Cargando productos..." />
        ) : (
          <>
            <ProductList 
              rows={productosPaginados} 
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

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editMode={!!editingProduct}
        productId={editingProduct?.id}
        initialData={editingProduct ? {
          nombre_comida: editingProduct.nombre,
          descripcion: editingProduct.descripcion,
          categoria_id: editingProduct.categoria_id,
          precio: editingProduct.precio,
          imagen_url: editingProduct.imagen_url,
          activo: editingProduct.activo,
          sucursales: editingProduct.sucursales || [],
        } : undefined}
      />
    </DashboardLayout>
  );
}
