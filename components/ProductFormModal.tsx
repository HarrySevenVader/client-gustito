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
  editMode?: boolean;
  productId?: number;
  initialData?: Partial<ProductFormData>;
}

interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export default function ProductFormModal({ isOpen, onClose, onSuccess, editMode = false, productId, initialData }: ProductFormModalProps) {
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

  // Cargar datos iniciales si está en modo edición
  useEffect(() => {
    if (isOpen && editMode && initialData) {
      setFormData({
        nombre_comida: initialData.nombre_comida || '',
        descripcion: initialData.descripcion || '',
        categoria_id: initialData.categoria_id || 0,
        precio: initialData.precio || 0,
        imagen_url: initialData.imagen_url || '',
        activo: initialData.activo !== undefined ? initialData.activo : true,
      });
    } else if (isOpen && !editMode) {
      // Resetear formulario al abrir en modo crear
      setFormData({
        nombre_comida: '',
        descripcion: '',
        categoria_id: categorias.length > 0 ? categorias[0].id_categoria : 0,
        precio: 0,
        imagen_url: '',
        activo: true,
      });
    }
  }, [isOpen, editMode, initialData, categorias]);

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
      const url = editMode && productId 
        ? `/api/comidas?id=${productId}` 
        : '/api/comidas';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess(editMode ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        // Limpiar formulario
        setFormData({
          nombre_comida: '',
          descripcion: '',
          categoria_id: categorias.length > 0 ? categorias[0].id_categoria : 1,
          precio: 0,
          imagen_url: '',
          activo: true,
        });
        onSuccess();
        onClose();
      } else {
        toastError(data.mensaje || `Error al ${editMode ? 'actualizar' : 'crear'} producto`);
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
          <h2>{editMode ? 'Editar Producto' : 'Agregar Producto'}</h2>
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
                value={formData.precio || ''}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                min="0"
                step="10"
                placeholder="Ingrese el precio"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imagen">URL de la Imagen</label>
            {/* 
              SUGERENCIAS DE FUENTES DE IMÁGENES GRATUITAS:
              - Unsplash: https://unsplash.com (imágenes de alta calidad gratis)
              - Pexels: https://www.pexels.com (fotos gratis sin derechos de autor)
              - Pixabay: https://pixabay.com (imágenes y vectores gratis)
              - Imgur: https://imgur.com (subir tus propias imágenes)
              
              CÓMO OBTENER LA URL:
              1. Busca la imagen en una de estas páginas
              2. Haz clic derecho sobre la imagen
              3. Selecciona "Copiar dirección de imagen" o "Copy image address"
              4. Pega la URL aquí
            */}
            <input
              id="imagen"
              type="url"
              value={formData.imagen_url}
              onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
              placeholder="https://images.unsplash.com/photo-ejemplo.jpg"
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
              {loading ? 'Guardando...' : (editMode ? 'Actualizar Producto' : 'Guardar Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
