import React from 'react';
import styles from './NewsCard.module.css';
import { useTheme } from '../contexts/ThemeContext';

interface NewsCardProps {
  id: number;
  titulo: string;
  contenido: string | null;
  imagen: string | null;
  fecha: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NewsCard({ id, titulo, contenido, imagen, fecha, onEdit, onDelete }: NewsCardProps) {
  const { theme } = useTheme();
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  const truncarTexto = (texto: string, limite: number) => {
    if (!texto) return '';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  };

  return (
    <div className={`${styles.card} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.imageContainer}>
        {imagen ? (
          <img 
            src={imagen} 
            alt={titulo}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholderImage}>
            📰
          </div>
        )}
        <div className={styles.overlay}>
          <span className={styles.badge}>Noticia</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{truncarTexto(titulo || 'Sin título', 45)}</h3>
        <p className={styles.description}>{truncarTexto(contenido || 'Sin descripción', 120)}</p>
        
        <div className={styles.footer}>
          <div className={styles.date}>
            <span className={styles.dateIcon}>📅</span>
            <span>{formatearFecha(fecha)}</span>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.editBtn}
              onClick={() => onEdit(id)}
              title="Editar noticia"
            >
              Editar
            </button>
            <button 
              className={styles.deleteBtn}
              onClick={() => onDelete(id)}
              title="Borrar noticia"
            >
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
