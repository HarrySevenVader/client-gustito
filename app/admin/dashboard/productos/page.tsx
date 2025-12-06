'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import ProductList from '../../../../components/ProductList';
import ProductFormModal from '../../../../components/ProductFormModal';
import styles from '../../../../components/adminStyles.module.css';

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

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/comidas');
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

        <div style={{ marginBottom: 12 }}>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            + Agregar producto
          </button>
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <ProductList rows={productosFormateados} />
        )}
      </section>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  );
}
