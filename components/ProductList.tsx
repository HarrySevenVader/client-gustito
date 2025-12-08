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

interface ProductListProps {
  rows: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (id: number | string) => void
}

export default function ProductList({ rows, onEdit, onDelete }: ProductListProps) {
  const handleEdit = (r: Product) => {
    if (onEdit) {
      onEdit(r);
    } else {
      alert('Editar producto: ' + r.title);
    }
  }

  const handleDelete = async (r: Product) => {
    const ok = await confirm('¿Mover a papelera?', `Vas a mover "${r.title}" a la papelera`)
    if (!ok) return
    
    if (onDelete) {
      try {
        await onDelete(r.id);
      } catch (error) {
        console.error('Error al borrar:', error);
      }
    }
  }

  return (
    <div className={styles.productList}>
      {rows.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666',
          fontSize: '18px'
        }}>
          No tienes productos publicados
        </div>
      ) : (
        rows.map((p) => (
          <div key={p.id} className={styles.productItem}>
            <img src={p.image || '/placeholder.svg'} alt={p.title} className={styles.productImage} />

            <div className={styles.productInfo}>
              <div className={styles.productTitle}>{p.title}</div>
              <div className={styles.productDesc}>{p.description ?? '—'}</div>
              <div className={styles.productMeta}>Creado: {p.date ?? '-'}</div>
            </div>

            <div className={styles.productRight}>
              <div className={styles.productPrice}>{typeof p.price === 'number' ? `$ ${p.price}` : p.price ?? '-'}</div>
              <div className={styles.productActions}>
                <button className={styles.actionBtn} onClick={() => handleEdit(p)}>Editar</button>
                <button className={styles.actionBtn + ' ' + styles.danger} onClick={() => handleDelete(p)}>Borrar</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
