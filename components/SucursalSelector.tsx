'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './SucursalSelector.module.css';

interface Sucursal {
  id_sucursal: number;
  nombre_sucursal: string;
  direccion_sucursal: string;
  telefono?: string;
}

interface SucursalSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sucursal: Sucursal) => void;
  currentSucursal?: Sucursal | null;
  availableSucursales?: number[]; // IDs de sucursales donde el producto está disponible
}

export default function SucursalSelector({ isOpen, onClose, onSelect, currentSucursal, availableSucursales }: SucursalSelectorProps) {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(currentSucursal?.id_sucursal || null);

  useEffect(() => {
    if (isOpen) {
      fetchSucursales();
    }
  }, [isOpen, availableSucursales]);

  const fetchSucursales = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/sucursales');
      const data = await response.json();

      if (data.ok && data.data) {
        // Filtrar solo sucursales activas
        let activas = data.data.filter((s: any) => s.activo !== false);
        
        // Si se especificaron sucursales disponibles, filtrar por ellas
        if (availableSucursales && availableSucursales.length > 0) {
          activas = activas.filter((s: any) => availableSucursales.includes(s.id_sucursal));
        }
        
        setSucursales(activas);
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    const sucursal = sucursales.find(s => s.id_sucursal === selectedId);
    if (sucursal) {
      onSelect(sucursal);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>

          <div className={styles.header}>
            <MapPin size={32} className={styles.icon} />
            <h2>Selecciona tu Sucursal</h2>
            <p>
              {availableSucursales && availableSucursales.length > 0
                ? 'Este producto está disponible en las siguientes sucursales:'
                : 'Elige la sucursal donde retirarás tu pedido'}
            </p>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Cargando sucursales...</p>
            </div>
          ) : (
            <>
              {sucursales.length === 0 ? (
                <div className={styles.loading}>
                  <p style={{ color: '#ff6b35', fontWeight: '500' }}>
                    No hay sucursales disponibles para este producto en este momento.
                  </p>
                </div>
              ) : (
                <>
                  <div className={styles.sucursalesList}>
                    {sucursales.map((sucursal) => (
                      <div
                        key={sucursal.id_sucursal}
                        className={`${styles.sucursalCard} ${selectedId === sucursal.id_sucursal ? styles.selected : ''}`}
                        onClick={() => setSelectedId(sucursal.id_sucursal)}
                      >
                        <div className={styles.radioCircle}>
                          {selectedId === sucursal.id_sucursal && <div className={styles.radioInner} />}
                        </div>
                        <div className={styles.sucursalInfo}>
                          <h3>{sucursal.nombre_sucursal}</h3>
                          <p>{sucursal.direccion_sucursal}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.footer}>
                    <button
                      className={styles.btnCancel}
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button
                      className={styles.btnConfirm}
                      onClick={handleSelect}
                      disabled={!selectedId}
                    >
                      Confirmar Sucursal
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
