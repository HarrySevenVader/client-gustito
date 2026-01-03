'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toastSuccess, toastError } from './swalHelper';
import { useActivity } from '../contexts/ActivityContext';
import { useTheme } from '../contexts/ThemeContext';
import styles from './LoginForm.module.css';
import { supabase } from '@/lib/supabaseClient';
import { API_URL } from '../lib/config';

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  noticiaId?: number;
  initialData?: {
    titulo: string;
    contenido: string;
    imagen: string | null;
    estado: 'activo' | 'inactivo' | 'eliminado';
  };
}

export default function NewsFormModal({
  isOpen,
  onClose,
  onSuccess,
  editMode = false,
  noticiaId,
  initialData,
}: NewsFormModalProps) {
  const { addActivity } = useActivity();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    imagen: '',
    estado: 'activo' as 'activo' | 'inactivo' | 'eliminado',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        titulo: initialData.titulo,
        contenido: initialData.contenido,
        imagen: initialData.imagen || '',
        estado: initialData.estado,
      });
      setImagePreview(initialData.imagen || '');
      setImageFile(null);
    } else if (isOpen && !editMode) {
      setFormData({
        titulo: '',
        contenido: '',
        imagen: '',
        estado: 'activo',
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [isOpen, initialData, editMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastError('La imagen no debe superar los 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!supabase) {
      toastError('Error: Supabase no está configurado. Verifica tus variables de entorno.');
      return null;
    }

    try {
      setUploadingImage(true);
      
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `noticias/${fileName}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        
        if (error.message.includes('Bucket not found') || error.message.includes('404')) {
          toastError('❌ El bucket "imagenes" no existe en Supabase. Por favor créalo.');
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
    setLoading(true);

    try {
      let imagenUrl = formData.imagen;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imagenUrl = uploadedUrl;
        } else {
          setLoading(false);
          return; // No continuar si falla la subida de imagen
        }
      }

      const body = {
        titulo: formData.titulo,
        contenido: formData.contenido,
        imagen: imagenUrl || null,
        estado: formData.estado,
      };

      const url = editMode
        ? `http://localhost:4000/api/noticias/${noticiaId}`
        : 'http://localhost:4000/api/noticias';

      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        await toastSuccess(
          editMode ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente'
        );
        
        // Registrar actividad
        addActivity({
          type: 'noticia',
          action: editMode ? 'editar' : 'crear',
          title: editMode ? 'Noticia actualizada' : 'Noticia creada',
          description: formData.titulo,
          icon: '📰'
        });
        
        onSuccess();
        onClose();
      } else {
        toastError(data.mensaje || 'Error al guardar noticia');
      }
    } catch (error) {
      console.error('Error:', error);
      toastError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: isDark ? '#1f2937' : 'white',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          transition: 'background-color 0.4s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            color: isDark ? '#f9fafb' : '#000',
            transition: 'color 0.4s ease',
          }}
        >
          <X size={24} />
        </button>

        <h2>
          {editMode ? 'Editar Noticia' : 'Crear Nueva Noticia'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: isDark ? '#e5e7eb' : '#000',
              transition: 'color 0.4s ease',
            }}>
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
              minLength={5}
              placeholder="Ej: Apertura nueva sucursal"
              style={{
                width: '100%',
                padding: '12px',
                border: isDark ? '1px solid #374151' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: isDark ? '#374151' : 'white',
                color: isDark ? '#f9fafb' : '#000',
                transition: 'all 0.4s ease',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: isDark ? '#e5e7eb' : '#000',
              transition: 'color 0.4s ease',
            }}>
              Contenido *
            </label>
            <textarea
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              required
              minLength={10}
              rows={8}
              placeholder="Escribe el contenido completo de la noticia..."
              style={{
                width: '100%',
                padding: '12px',
                border: isDark ? '1px solid #374151' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                backgroundColor: isDark ? '#374151' : 'white',
                color: isDark ? '#f9fafb' : '#000',
                transition: 'all 0.4s ease',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: isDark ? '#e5e7eb' : '#000',
              transition: 'color 0.4s ease',
            }}>
              Imagen
            </label>
            <div
              style={{
                border: isDark ? '2px dashed #4b5563' : '2px dashed #ddd',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: isDark ? '#374151' : 'transparent',
                transition: 'all 0.4s ease',
              }}
              onClick={() => document.getElementById('news-image-upload')?.click()}
            >
              <input
                id="news-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {imagePreview ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview('');
                      setImageFile(null);
                      setFormData({ ...formData, imagen: '' });
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255, 0, 0, 0.8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={40} style={{ margin: '0 auto 10px', color: isDark ? '#9ca3af' : '#999' }} />
                  <p style={{ color: isDark ? '#d1d5db' : '#666', margin: 0 }}>
                    Haz clic para subir una imagen
                  </p>
                  <p style={{ color: isDark ? '#9ca3af' : '#999', fontSize: '14px', marginTop: '5px' }}>
                    Máximo 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: isDark ? '#e5e7eb' : '#000',
              transition: 'color 0.4s ease',
            }}>
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })
              }
              style={{
                width: '100%',
                padding: '12px',
                border: isDark ? '1px solid #374151' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: isDark ? '#374151' : 'white',
                color: isDark ? '#f9fafb' : '#000',
                transition: 'all 0.4s ease',
              }}
            >
              <option value="activo">Activo (visible al público)</option>
              <option value="inactivo">Inactivo (oculto)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploadingImage}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: isDark ? '1px solid #4b5563' : '1px solid #ddd',
                background: isDark ? '#374151' : 'white',
                color: isDark ? '#f9fafb' : '#000',
                cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.4s ease',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: (loading || uploadingImage) ? '#ccc' : '#FF6B35',
                color: 'white',
                cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.4s ease',
              }}
            >
              {loading ? 'Guardando...' : uploadingImage ? 'Subiendo imagen...' : editMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
