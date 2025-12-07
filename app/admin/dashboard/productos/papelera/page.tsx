'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../../components/DashboardLayout';
import TrashList from '../../../../../components/TrashList';
import styles from '../../../../../components/adminStyles.module.css';
import { toastSuccess, toastError } from '../../../../../components/swalHelper';

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
          <TrashList 
            rows={productosFormateados} 
            onRestore={handleRestore}
            onDeletePermanently={handleDeletePermanently}
          />
        )}
      </section>
    </DashboardLayout>
  );
}
