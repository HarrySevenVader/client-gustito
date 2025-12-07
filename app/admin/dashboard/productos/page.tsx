'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/DashboardLayout';
import ProductList from '../../../../components/ProductList';
import ProductFormModal from '../../../../components/ProductFormModal';
import styles from '../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../components/swalHelper';

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

export default function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const router = useRouter();

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/comidas');
      const data = await response.json();

      console.log('Datos recibidos del backend:', data);

      if (data.ok && data.data) {
        // Transformar los datos del backend al formato del frontend
        // Filtrar solo los productos activos
        const productosTransformados = data.data
          .filter((comida: any) => {
            console.log(`Producto: ${comida.nombre_comida}, Activo: ${comida.activo}`);
            return comida.activo === true;
          })
          .map((comida: any) => ({
            id: comida.id_comida,
            nombre: comida.nombre_comida,
            descripcion: comida.descripcion,
            categoria_id: comida.categoria_id,
            imagen_url: comida.imagen_url,
            precio: comida.precio,
            activo: comida.activo,
            created_at: comida.created_at,
          }));
        console.log('Productos filtrados (activos):', productosTransformados);
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
      const response = await fetch(`/api/comidas?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Producto movido a la papelera');
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
    image: p.imagen_url || '/placeholder.svg',
  }));

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
          <p>Cargando productos...</p>
        ) : (
          <ProductList 
            rows={productosFormateados} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
        } : undefined}
      />
    </DashboardLayout>
  );
}
