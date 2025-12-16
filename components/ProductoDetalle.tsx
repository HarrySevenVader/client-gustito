'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ComidaConPrecio } from '@/types/menu';
import Image from 'next/image';
import { X } from 'lucide-react';
import styles from './ProductoDetalle.module.css';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { toastSuccess, toastError } from './swalHelper';
import SucursalSelector from './SucursalSelector';
import type { Sucursal } from '@/contexts/CartContext';

const MAX_CANTIDAD_POR_PRODUCTO = 20;
const MAX_TOTAL_CARRITO = 100000;

interface ProductoDetalleProps {
    comida: ComidaConPrecio | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductoDetalle({ comida, isOpen, onClose }: ProductoDetalleProps) {
    const { addToCart, sucursal, setSucursal, items, getTotal } = useCart();
    const [showSucursalSelector, setShowSucursalSelector] = useState(false);
    
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

    const handleAddToCart = () => {
        // No permitir agregar si el producto no está disponible
        if (!comida.activo) return;
        
        // Verificar límite por producto
        const itemEnCarrito = items.find(item => item.id === comida.id);
        if (itemEnCarrito && itemEnCarrito.cantidad >= MAX_CANTIDAD_POR_PRODUCTO) {
            toastError(`Máximo ${MAX_CANTIDAD_POR_PRODUCTO} unidades por producto. Para pedidos grandes, contáctanos directamente.`);
            return;
        }
        
        // Verificar límite total del carrito
        const totalActual = getTotal();
        const nuevoTotal = totalActual + comida.precio_final;
        if (nuevoTotal > MAX_TOTAL_CARRITO) {
            toastError(`El total del pedido no puede superar ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(MAX_TOTAL_CARRITO)}. Para pedidos grandes, contáctanos directamente.`);
            return;
        }
        
        // Si no hay sucursal seleccionada, mostrar mensaje y selector
        if (!sucursal) {
            toastError('Por favor, selecciona una sucursal antes de agregar productos al carrito');
            setShowSucursalSelector(true);
            return;
        }
        
        addToCart(comida);
        toastSuccess(`${comida.nombre} agregado al carrito`);
        onClose();
    };

    const handleSucursalSelected = (selectedSucursal: Sucursal) => {
        setSucursal(selectedSucursal);
        setShowSucursalSelector(false);
        
        // Ahora sí agregar al carrito
        addToCart(comida);
        toastSuccess(`${comida.nombre} agregado al carrito`);
        onClose();
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
                                    <button 
                                        className={`${styles.addBtn} ${!comida.activo ? styles.disabled : ''}`}
                                        onClick={handleAddToCart}
                                        disabled={!comida.activo}
                                        aria-label={comida.activo ? `Agregar ${comida.nombre} al carrito` : `${comida.nombre} no disponible`}
                                    >
                                        {comida.activo ? 'Agregar al carrito' : 'No disponible'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Modal de selección de sucursal */}
                    <SucursalSelector
                        isOpen={showSucursalSelector}
                        onClose={() => setShowSucursalSelector(false)}
                        onSelect={handleSucursalSelected}
                        currentSucursal={sucursal}
                        availableSucursales={comida.sucursales || []} // Usar sucursales del producto
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
