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
import { useTheme } from '../../../../contexts/ThemeContext';

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
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();

  // Leer el tema directamente del documento y observar cambios
  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
      console.log('🎨 Tema detectado:', theme);
      setCurrentTheme(theme);
    };
    
    // Leer tema inicial
    updateTheme();
    
    // Observar cambios en el atributo data-theme
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  const fetchProductos = async () => {
    try {
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
    sucursales: p.sucursales, // Pasar array de IDs de sucursales
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

        <div style={{ marginBottom: 12, display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12 }}>
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

          {/* Contador de productos */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.25rem',
            background: currentTheme === 'dark' ? '#2a2a2a' : '#ffffff',
            borderRadius: '12px',
            boxShadow: currentTheme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: currentTheme === 'dark' ? '1px solid #3a3a3a' : '1px solid #e0e0e0',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? 'none' : 'auto',
          }}>
            <div style={{
              fontSize: '2rem',
              animation: loading ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}>
              🍽️
            </div>
            <div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: currentTheme === 'dark' ? '#a0a0a0' : '#666',
                fontWeight: '500',
                marginBottom: '0.15rem',
              }}>
                Total
              </div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: currentTheme === 'dark' ? '#fff' : '#333',
                lineHeight: '1',
                minWidth: '40px',
              }}>
                {loading ? (
                  <div style={{
                    width: '40px',
                    height: '24px',
                    background: currentTheme === 'dark' ? '#3a3a3a' : '#e0e0e0',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ) : productos.length}
              </div>
            </div>
            <div style={{
              padding: '0.5rem 0.75rem',
              background: currentTheme === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
              borderRadius: '8px',
              marginLeft: '0.5rem',
              border: currentTheme === 'dark' ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(76, 175, 80, 0.2)',
            }}>
              <div style={{ 
                fontSize: '0.7rem', 
                color: currentTheme === 'dark' ? '#a0a0a0' : '#666',
                marginBottom: '0.15rem',
              }}>
                Activos
              </div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: currentTheme === 'dark' ? '#4CAF50' : '#2e7d32',
                lineHeight: '1',
                minWidth: '30px',
              }}>
                {loading ? (
                  <div style={{
                    width: '30px',
                    height: '20px',
                    background: currentTheme === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ) : productos.filter(p => p.activo).length}
              </div>
            </div>
          </div>
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
