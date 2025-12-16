"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import { confirm } from './swalHelper'
import Swal from 'sweetalert2'

type Query = {
  id_consulta: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
  mensaje: string;
  fecha_envio: string;
}

interface QueryListProps {
  rows: Query[];
  onDelete?: (id: number) => void;
}

export default function QueryList({ rows, onDelete }: QueryListProps) {
  const handleView = (consulta: Query) => {
    const fechaFormateada = new Date(consulta.fecha_envio).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Santiago'
    });

    Swal.fire({
      title: `Consulta de ${consulta.nombre} ${consulta.apellido}`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${consulta.correo}</p>
          <p style="margin: 8px 0;"><strong>📱 Teléfono:</strong> ${consulta.celular}</p>
          <p style="margin: 8px 0;"><strong>📅 Fecha:</strong> ${fechaFormateada}</p>
          <hr style="margin: 12px 0;">
          <p style="margin: 8px 0;"><strong>💬 Mensaje:</strong></p>
          <div style="margin: 8px 0; padding: 12px; background: #f5f5f5; border-radius: 8px; white-space: pre-wrap; height: 200px; overflow-y: auto;">${consulta.mensaje}</div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#17a84a',
      width: '500px'
    });
  };

  const handleDelete = async (consulta: Query) => {
    const ok = await confirm(
      '¿Eliminar consulta?', 
      `¿Estás seguro de eliminar la consulta de ${consulta.nombre} ${consulta.apellido}?`
    );
    if (!ok) return;
    
    if (onDelete) {
      onDelete(consulta.id_consulta);
    }
  };

  if (rows.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 26px rgba(4,20,10,0.04)'
      }}>
        <p style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>📭</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgba(0,0,0,0.7)', margin: 0 }}>
          No hay consultas pendientes
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <h3 style={{ marginTop: 0 }}>Consultas Recibidas ({rows.length})</h3>
      <table className={styles.table}>
        <colgroup>
          <col style={{ width: '50px' }} />
          <col style={{ width: '150px' }} />
          <col style={{ width: '180px' }} />
          <col style={{ width: '120px' }} />
          <col style={{ width: 'auto' }} />
          <col style={{ width: '130px' }} />
          <col style={{ width: '180px' }} />
        </colgroup>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Nombre</th>
            <th className={styles.th}>Correo</th>
            <th className={styles.th}>Teléfono</th>
            <th className={styles.th}>Mensaje</th>
            <th className={styles.th}>Fecha</th>
            <th className={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(consulta => (
            <tr key={consulta.id_consulta}>
              <td className={styles.td} style={{ textAlign: 'center' }}>{consulta.id_consulta}</td>
              <td className={styles.td} title={`${consulta.nombre} ${consulta.apellido}`}>
                {consulta.nombre} {consulta.apellido}
              </td>
              <td className={styles.td} title={consulta.correo}>
                {consulta.correo}
              </td>
              <td className={styles.td}>{consulta.celular}</td>
              <td className={styles.td} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }} title={consulta.mensaje}>
                {consulta.mensaje.length > 60 
                  ? `${consulta.mensaje.substring(0, 60)}...` 
                  : consulta.mensaje}
              </td>
              <td className={styles.td} style={{ whiteSpace: 'nowrap' }}>
                {new Date(consulta.fecha_envio).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'America/Santiago'
                })}
              </td>
              <td className={styles.tdActions}>
                <button 
                  className={styles.viewBtn} 
                  style={{ marginRight: 8 }} 
                  onClick={() => handleView(consulta)}
                >
                  Ver
                </button>
                <button 
                  className={styles.actionBtn + ' ' + styles.danger} 
                  onClick={() => handleDelete(consulta)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
