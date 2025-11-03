"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import { confirm, toastSuccess } from './swalHelper'

type Query = { id: number | string; consulta: string; email?: string; created_at?: string }

export default function QueryList({ rows }: { rows: Query[] }) {
  const handleView = (r: Query) => {
    // Mostrar detalles en un modal o alerta
    alert(`Consulta de ${r.email || 'sin email'}:\n\n${r.consulta}`)
  }

  const handleDelete = async (r: Query) => {
    const ok = await confirm('¿Borrar consulta?', `Eliminar consulta ID ${r.id} de ${r.email || 'usuario'}`)
    if (!ok) return
    // Aquí iría la llamada a la API para borrar/archivar la consulta
    await toastSuccess('Consulta eliminada')
  }

  return (
    <div className={styles.tableWrap}>
      <h3 style={{ marginTop: 0 }}>Consultas</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Consulta</th>
            <th className={styles.th}>Correo</th>
            <th className={styles.th}>Fecha</th>
            <th className={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td className={styles.td}>{r.id}</td>
              <td className={styles.td} style={{ maxWidth: 520 }}>{r.consulta}</td>
              <td className={styles.td}>{r.email ?? '-'}</td>
              <td className={styles.td}>{r.created_at ?? '-'}</td>
              <td className={styles.td}>
                <button className={styles.actionBtn} style={{ marginRight: 8 }} onClick={() => handleView(r)}>Ver</button>
                <button className={styles.actionBtn + ' ' + styles.danger} onClick={() => handleDelete(r)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
