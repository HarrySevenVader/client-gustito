'use client';

import React, { useState, useEffect } from 'react';
import styles from './adminStyles.module.css';
import { toastSuccess, toastError } from './swalHelper';
import supabase from '../lib/supabaseClient';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
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
      setImagePreview(initialData.imagen_url || '');
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
      setImageFile(null);
      setImagePreview('');
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

  // Manejar selección de archivo de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toastError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastError('La imagen no debe superar los 5MB');
        return;
      }

      setImageFile(file);
      
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    // Limpiar el input para permitir reseleccionar la misma imagen
    e.target.value = '';
  };

  // Subir imagen a Supabase Storage
  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    if (!supabase) {
      toastError('Error: Supabase no está configurado. Verifica tus variables de entorno.');
      return null;
    }

    try {
      setUploadingImage(true);
      
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('imagenes') // Nombre del bucket que crearás en Supabase
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        
        // Mostrar mensaje específico según el error
        if (error.message.includes('Bucket not found') || error.message.includes('404')) {
          toastError('❌ El bucket "imagenes" no existe en Supabase. Por favor créalo siguiendo las instrucciones del archivo CONFIGURACION_SUPABASE_STORAGE.md');
        } else if (error.message.includes('policy')) {
          toastError('❌ Error de permisos: Configura las políticas RLS del bucket "imagenes"');
        } else {
          toastError(`Error al subir imagen: ${error.message}`);
        }
        return null;
      }

      // Obtener URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('imagenes')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toastError('Error inesperado al subir la imagen');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

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
      let imagenUrl = formData.imagen_url;

      // Si hay un archivo de imagen seleccionado, subirlo primero
      if (imageFile) {
        const uploadedUrl = await uploadImageToSupabase(imageFile);
        if (uploadedUrl) {
          imagenUrl = uploadedUrl;
        } else {
          // Si falla la subida, no continuar
          setLoading(false);
          return;
        }
      }

      const url = editMode && productId 
        ? `/api/comidas?id=${productId}` 
        : '/api/comidas';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imagen_url: imagenUrl
        }),
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
        setImageFile(null);
        setImagePreview('');
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
            <label htmlFor="descripcion">Descripción * (máximo 500 caracteres)</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe el producto..."
              rows={3}
              maxLength={500}
              required
            />
            <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
              {formData.descripcion.length}/500 caracteres
            </small>
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
            <label htmlFor="imagen">Imagen del Producto</label>
            
            {/* Input para subir archivo desde el ordenador */}
            <div className={styles.imageUploadContainer}>
              <input
                id="imagen-file"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('imagen-file')?.click()}
                className={styles.uploadBtn}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Subiendo...' : '📁 Seleccionar imagen desde mi ordenador'}
              </button>
            </div>

            {/* Preview de la imagen */}
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    setFormData({ ...formData, imagen_url: '' });
                  }}
                  className={styles.removeImageBtn}
                >
                  ✕ Eliminar imagen
                </button>
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
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={loading || uploadingImage}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading || uploadingImage}>
              {loading ? 'Guardando...' : uploadingImage ? 'Subiendo imagen...' : (editMode ? 'Actualizar Producto' : 'Guardar Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
