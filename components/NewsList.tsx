"use client"
import React from 'react'
import EntityTable from './EntityTable'

interface NewsListProps {
  rows: { 
    id: number | string; 
    title: string; 
    date?: string;
    description?: string;
    image?: string;
    estado?: 'activo' | 'inactivo' | 'eliminado';
  }[];
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

export default function NewsList({ rows, onEdit, onDelete }: NewsListProps) {
  return <EntityTable title="Noticias" rows={rows} onEdit={onEdit} onDelete={onDelete} />
}
