"use client"
import React from 'react'
import EntityTable from './EntityTable'
import { confirm, toastSuccess } from './swalHelper'

export default function NewsList({ rows }: { rows: { id: number | string; title: string; date?: string }[] }) {
  const handleEdit = (r: any) => {
    alert('Editar noticia: ' + r.title)
  }

  const handleDelete = async (r: any) => {
    const ok = await confirm('¿Borrar noticia?', `Vas a borrar "${r.title}"`)
    if (!ok) return
    await toastSuccess('Noticia borrada')
  }

  return <EntityTable title="Noticias" rows={rows} onEdit={handleEdit} onDelete={handleDelete} />
}
