'use client';

import React from 'react';
import EntityTable from './EntityTable';

interface NewsTrashListProps {
  rows: {
    id: number | string;
    title: string;
    date?: string;
    description?: string;
    image?: string;
  }[];
  onRestore: (id: number | string) => void;
  onDeletePermanently: (id: number | string) => void;
}

export default function NewsTrashList({ rows, onRestore, onDeletePermanently }: NewsTrashListProps) {
  return (
    <EntityTable
      title="Noticias Eliminadas"
      rows={rows}
      onEdit={onRestore}
      onDelete={onDeletePermanently}
      editLabel="Restaurar"
      deleteLabel="Eliminar definitivamente"
    />
  );
}
