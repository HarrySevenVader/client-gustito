import React from 'react';
import styles from './NewsTrashCard.module.css';
import { useTheme } from '../contexts/ThemeContext';

interface NewsTrashCardProps {
  id: number;
  titulo: string;
  contenido: string | null;
  imagen: string | null;
  fecha: string;
  onRestore: (id: number) => void;
  onDeletePermanently: (id: number) => void;
}

export default function NewsTrashCard({ id, titulo, contenido, imagen, fecha, onRestore, onDeletePermanently }: NewsTrashCardProps) {
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
          <img 
            src="/imagenes/noticia_sin_imagen.svg" 
            alt="Noticia sin imagen"
            className={styles.image}
          />
        )}
        <div className={styles.overlay}>
          <span className={styles.badge}>Eliminada</span>
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
              className={styles.restoreBtn}
              onClick={() => onRestore(id)}
              title="Restaurar noticia"
            >
              Restaurar
            </button>
            <button 
              className={styles.deleteBtn}
              onClick={() => onDeletePermanently(id)}
              title="Eliminar permanentemente"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
