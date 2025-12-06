'use client';

import React, { useState, useEffect } from 'react';
import styles from './adminStyles.module.css';
import { toastSuccess, toastError } from './swalHelper';

interface ProductFormData {
  nombre_comida: string;
  descripcion: string;
  categoria_id: number;
  precio: number;
  imagen_url: string;
  activo: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export default function ProductFormModal({ isOpen, onClose, onSuccess }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    nombre_comida: '',
    descripcion: '',
    categoria_id: 0,
    precio: 0,
    imagen_url: '',
    activo: true,
  });

  // Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const response = await fetch('http://localhost:4000/api/categorias');
        const data = await response.json();
        
        if (data.ok && data.data && data.data.length > 0) {
          setCategorias(data.data);
          // Establecer la primera categoría como default
          setFormData(prev => ({ ...prev, categoria_id: data.data[0].id_categoria }));
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        toastError('Error al cargar categorías');
      } finally {
        setLoadingCategorias(false);
      }
    };

    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre_comida.trim()) {
      toastError('El nombre es requerido');
      return;
    }
    if (!formData.descripcion.trim()) {
      toastError('La descripción es requerida');
      return;
    }
    if (formData.precio <= 0) {
      toastError('El precio debe ser mayor a 0');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/comidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess('Producto creado exitosamente');
        // Limpiar formulario
        setFormData({
          nombre_comida: '',
          descripcion: '',
          categoria_id: 1,
          precio: 0,
          imagen_url: '',
          activo: true,
        });
        onSuccess();
        onClose();
      } else {
        toastError(data.mensaje || 'Error al crear producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toastError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Agregar Producto</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.productForm}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre del Producto *</label>
            <input
              id="nombre"
              type="text"
              value={formData.nombre_comida}
              onChange={(e) => setFormData({ ...formData, nombre_comida: e.target.value })}
              placeholder="Ej: Pizza Margherita"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el producto..."
              rows={3}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: parseInt(e.target.value) })}
                required
                disabled={loadingCategorias}
              >
                {loadingCategorias ? (
                  <option>Cargando categorías...</option>
                ) : categorias.length === 0 ? (
                  <option>No hay categorías disponibles</option>
                ) : (
                  categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="precio">Precio ($) *</label>
              <input
                id="precio"
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                min="0"
                step="10"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imagen">URL de la Imagen</label>
            <input
              id="imagen"
              type="url"
              value={formData.imagen_url}
              onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.imagen_url && (
              <div className={styles.imagePreview}>
                <img src={formData.imagen_url} alt="Preview" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
              <span>Producto activo</span>
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
