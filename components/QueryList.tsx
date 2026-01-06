"use client"
import React from 'react'
import styles from './adminStyles.module.css'
import { confirm } from './swalHelper'
import Swal from 'sweetalert2'
import { useTheme } from '../contexts/ThemeContext'

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
  const { theme } = useTheme();
  const handleView = (consulta: Query) => {
    const fechaFormateada = new Date(consulta.fecha_envio).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Santiago'
    });

    const isDark = theme === 'dark';

    Swal.fire({
      title: `Consulta de ${consulta.nombre} ${consulta.apellido}`,
      html: `
        <div style="text-align: left; padding: 5px;">
          <p style="margin: 6px 0; font-size: 14px; color: ${isDark ? '#e5e7eb' : '#111827'};"><strong>📧 Email:</strong> ${consulta.correo}</p>
          <p style="margin: 6px 0; font-size: 14px; color: ${isDark ? '#e5e7eb' : '#111827'};"><strong>📱 Teléfono:</strong> ${consulta.celular}</p>
          <p style="margin: 6px 0; font-size: 14px; color: ${isDark ? '#e5e7eb' : '#111827'};"><strong>📅 Fecha:</strong> ${fechaFormateada}</p>
          <hr style="margin: 10px 0; border-color: ${isDark ? '#374151' : '#e5e7eb'};">
          <p style="margin: 6px 0; font-size: 14px; color: ${isDark ? '#e5e7eb' : '#111827'};"><strong>💬 Mensaje:</strong></p>
          <div style="margin: 6px 0; padding: 10px; background: ${isDark ? '#1f2937' : '#f5f5f5'}; border-radius: 8px; white-space: pre-wrap; max-height: 200px; overflow-y: auto; font-size: 14px; color: ${isDark ? '#d1d5db' : '#111827'};">${consulta.mensaje}</div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#FF6B35',
      width: '600px',
      showCloseButton: true,
      background: isDark ? '#111827' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
      customClass: {
        popup: 'swal-compact'
      }
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
      <div className={styles.emptyTrash}>
        <p>📭 No hay consultas</p>
        <p>No hay consultas pendientes</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className={`${styles.tableWrap} ${styles.desktopOnly}`}>
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

      {/* Vista de tarjetas para móvil */}
      <div className={styles.mobileOnly}>
        <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: '1.1rem' }}>
          Consultas Recibidas ({rows.length})
        </h3>
        <div className={styles.queryCardList}>
          {rows.map(consulta => (
            <div key={consulta.id_consulta} className={styles.queryCard}>
              <div className={styles.queryCardHeader}>
                <span className={styles.queryCardId}>#{consulta.id_consulta}</span>
                <span className={styles.queryCardDate}>
                  {new Date(consulta.fecha_envio).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'America/Santiago'
                  })}
                </span>
              </div>
              
              <div className={styles.queryCardBody}>
                <div className={styles.queryCardRow}>
                  <strong>👤</strong>
                  <span>{consulta.nombre} {consulta.apellido}</span>
                </div>
                <div className={styles.queryCardRow}>
                  <strong>📧</strong>
                  <span className={styles.queryCardEmail}>{consulta.correo}</span>
                </div>
                <div className={styles.queryCardRow}>
                  <strong>📱</strong>
                  <span>{consulta.celular}</span>
                </div>
                <div className={styles.queryCardRow}>
                  <strong>💬</strong>
                  <span className={styles.queryCardMessage}>
                    {consulta.mensaje.length > 80 
                      ? `${consulta.mensaje.substring(0, 80)}...` 
                      : consulta.mensaje}
                  </span>
                </div>
              </div>

              <div className={styles.queryCardActions}>
                <button 
                  className={styles.viewBtn} 
                  onClick={() => handleView(consulta)}
                >
                  Ver Detalles
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.danger}`} 
                  onClick={() => handleDelete(consulta)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
