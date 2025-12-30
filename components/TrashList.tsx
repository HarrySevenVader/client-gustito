"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import { confirm, toastSuccess, toastError } from './swalHelper'

type Product = {
  id: number | string
  title: string
  date?: string
  description?: string
  price?: number | string
  image?: string
}

interface TrashListProps {
  rows: Product[]
  onRestore?: (id: number | string) => void
  onDeletePermanently?: (id: number | string) => void
}

export default function TrashList({ rows, onRestore, onDeletePermanently }: TrashListProps) {
  const handleRestore = async (r: Product) => {
    const ok = await confirm('¿Restaurar producto?', `Vas a restaurar "${r.title}"`)
    if (!ok) return
    
    if (onRestore) {
      try {
        await onRestore(r.id);
      } catch (error) {
        console.error('Error al restaurar:', error);
      }
    }
  }

  const handleDeletePermanently = async (r: Product) => {
    const ok = await confirm(
      '⚠️ ¿Eliminar permanentemente?', 
      `Esta acción es IRREVERSIBLE. El producto "${r.title}" se eliminará para siempre.`
    )
    if (!ok) return
    
    if (onDeletePermanently) {
      try {
        await onDeletePermanently(r.id);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }

  return (
    <div className={styles.productList}>
      {rows.map((p) => (
        <div key={p.id} className={styles.productItem + ' ' + styles.deletedItem}>
          <img src={p.image || '/placeholder.svg'} alt={p.title} className={styles.productImage} />

          <div className={styles.productInfo}>
            <div className={styles.productTitle}>{p.title}</div>
            <div className={styles.productDesc}>{p.description ?? '—'}</div>
            <div className={styles.productMeta}>Eliminado: {p.date ?? '-'}</div>
          </div>

          <div className={styles.productRight}>
            <div className={styles.productPrice}>{typeof p.price === 'number' ? `$ ${p.price}` : p.price ?? '-'}</div>
            <div className={styles.productActions}>
              <button className={styles.actionBtn + ' ' + styles.restore} onClick={() => handleRestore(p)}>Restaurar</button>
              <button className={styles.actionBtn + ' ' + styles.danger} onClick={() => handleDeletePermanently(p)}>Eliminar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
