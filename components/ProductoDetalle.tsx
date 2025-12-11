'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ComidaConPrecio } from '@/types/menu';
import Image from 'next/image';
import { X } from 'lucide-react';
import styles from './ProductoDetalle.module.css';
import { useEffect } from 'react';

interface ProductoDetalleProps {
    comida: ComidaConPrecio | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductoDetalle({ comida, isOpen, onClose }: ProductoDetalleProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!comida) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(price);
    };

    const truncateDescription = (text: string, maxLength: number = 500): string => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength);
    };

    const hasPriceChange = comida.precio !== comida.precio_final;

    return (
        <AnimatePresence>
            {isOpen && (
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
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                            <X size={24} />
                        </button>

                        <div className={styles.content}>
                            <div className={styles.imageContainer}>
                                <Image
                                    src={comida.imagen_url}
                                    alt={comida.nombre}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 500px"
                                    className={styles.image}
                                />
                                {comida.categoria_nombre && (
                                    <div className={styles.badge}>{comida.categoria_nombre}</div>
                                )}
                                {hasPriceChange && (
                                    <div className={`${styles.badge} ${styles.special}`}>Precio especial</div>
                                )}
                            </div>

                            <div className={styles.info}>
                                <h2 className={styles.title}>{comida.nombre}</h2>
                                
                                <div className={styles.description}>
                                    <p>{truncateDescription(comida.descripcion, 500)}</p>
                                </div>

                                {comida.observacion && (
                                    <div className={styles.note}>
                                        <strong>Nota:</strong> {comida.observacion}
                                    </div>
                                )}

                                <div className={styles.footer}>
                                    <div className={styles.priceContainer}>
                                        {hasPriceChange && (
                                            <span className={styles.oldPrice}>{formatPrice(comida.precio)}</span>
                                        )}
                                        <span className={styles.currentPrice}>{formatPrice(comida.precio_final)}</span>
                                    </div>
                                    <button className={styles.addBtn} aria-label={`Agregar ${comida.nombre} al carrito`}>
                                        Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
