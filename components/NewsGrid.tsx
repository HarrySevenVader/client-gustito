"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import { confirm, toastSuccess } from './swalHelper'

type News = {
  id: number | string
  title: string
  date?: string
  description?: string
  image?: string
}

export default function NewsGrid({ items, onEdit }: { items: News[]; onEdit?: (n: News)=>void }) {
  // limit to 6 news items as per requirement
  const shown = items.slice(0, 6)

  const handleDelete = async (n: News) => {
    const ok = await confirm('¿Eliminar noticia?', `Eliminar: ${n.title}`)
    if (!ok) return
    // placeholder: call API to delete
    await toastSuccess('Noticia eliminada')
  }

  const handleEdit = (n: News) => {
    if (onEdit) return onEdit(n)
    // fallback visual cuando no se provee onEdit desde el padre (útil para páginas server estáticas)
    alert('Editar noticia: ' + n.title)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Noticias (máx. 6)</h2>
          <div style={{ color: 'rgba(0,0,0,0.55)', fontSize: 13 }}>Administra las noticias destacadas en el sitio</div>
        </div>
        <div>
          <button className={styles.addBtn}>+ Agregar noticia</button>
        </div>
      </div>

      <div className={styles.newsGrid}>
        {shown.map(n => (
          <article key={n.id} className={styles.newsCard} aria-label={`Noticia ${n.title}`}>
            <img src={n.image || '/placeholder.svg'} alt={n.title} className={styles.newsImage} />
            <div className={styles.newsBody}>
              <div className={styles.newsTitle}>{n.title}</div>
              <div className={styles.newsMeta}>{n.date ?? '-'}</div>
              <div className={styles.newsDesc}>{n.description ?? ''}</div>
              <div className={styles.newsActions}>
                <button className={styles.actionBtn} onClick={() => handleEdit(n)} aria-label={`Editar ${n.title}`}>Editar</button>
                <button className={styles.actionBtn + ' ' + styles.danger} onClick={() => handleDelete(n)} aria-label={`Borrar ${n.title}`}>Borrar</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
