"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import { confirm, toastSuccess } from './swalHelper'

type Product = {
  id: number | string
  title: string
  date?: string
  description?: string
  price?: number | string
  image?: string
}

export default function ProductList({ rows }: { rows: Product[] }) {
  const handleEdit = (r: Product) => {
    // abrir formulario en modal o navegar a edición (por implementar)
    alert('Editar producto: ' + r.title)
  }

  const handleDelete = async (r: Product) => {
    const ok = await confirm('¿Borrar producto?', `Vas a borrar "${r.title}"`)
    if (!ok) return
    // aquí iría la llamada a la API para borrar
    await toastSuccess('Producto borrado')
  }

  return (
    <div className={styles.productList}>
      {rows.map((p) => (
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
      ))}
    </div>
  )
}
