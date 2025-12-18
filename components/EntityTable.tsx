"use client"
import styles from './adminStyles.module.css'
import React from 'react'

type Row = { id: string | number; title: string; date?: string }

export default function EntityTable({ title, rows, onEdit, onDelete }: { title: string; rows: Row[]; onEdit?: (id: number | string)=>void; onDelete?: (id: number | string)=>void }) {
  return (
    <div className={styles.tableWrap}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Título</th>
            <th className={styles.th}>Fecha</th>
            <th className={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td className={styles.td}>{r.id}</td>
              <td className={styles.td}>{r.title}</td>
              <td className={styles.td}>{r.date ?? '-'}</td>
              <td className={styles.td}>
                <button className={styles.actionBtn} style={{ marginRight: 8 }} onClick={() => onEdit?.(r.id)}>Editar</button>
                <button className={styles.actionBtn + ' ' + styles.danger} style={{ marginLeft: 4 }} onClick={() => onDelete?.(r.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
