'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, MapPin } from 'lucide-react';
import Link from 'next/link';
import { confirm, toastSuccess, toastError, alertSuccess } from '@/components/swalHelper';
import { useState } from 'react';
import SucursalSelector from '@/components/SucursalSelector';
import type { Sucursal } from '@/contexts/CartContext';
import './carrito.css';

const MAX_CANTIDAD_POR_PRODUCTO = 20;
const MAX_TOTAL_CARRITO = 100000;

export default function CarritoPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal, sucursal, setSucursal } = useCart();
  const [showSucursalSelector, setShowSucursalSelector] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const handleRemoveItem = async (id: number, nombre: string) => {
    const confirmed = await confirm(
      '¿Eliminar producto?',
      `¿Estás seguro de eliminar "${nombre}" del carrito?`
    );
    if (confirmed) {
      removeFromCart(id);
      toastSuccess('Producto eliminado del carrito');
    }
  };

  const handleClearCart = async () => {
    const confirmed = await confirm(
      '¿Vaciar carrito?',
      '¿Estás seguro de eliminar todos los productos del carrito?'
    );
    if (confirmed) {
      clearCart();
      toastSuccess('Carrito vaciado');
    }
  };

  const handlePagar = () => {
    if (!sucursal) {
      toastError('Por favor selecciona una sucursal para continuar');
      setShowSucursalSelector(true);
      return;
    }

    if (!sucursal.telefono) {
      toastError('Esta sucursal no tiene un número de WhatsApp configurado');
      return;
    }

    // Generar mensaje de WhatsApp
    const mensaje = generarMensajeWhatsApp();
    const numeroLimpio = sucursal.telefono.replace(/[^0-9]/g, '');
    const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
    
    // Abrir WhatsApp en nueva ventana
    window.open(urlWhatsApp, '_blank');

    // Mostrar modal de éxito y limpiar carrito
    alertSuccess('Pedido enviado por WhatsApp exitoso').then(() => {
      clearCart();
    });
  };

  const generarMensajeWhatsApp = () => {
    let mensaje = '¡Hola! Quiero hacer un pedido de los siguientes productos:\n\n';
    
    items.forEach((item, index) => {
      mensaje += `${index + 1}. ${item.nombre} - Cantidad: ${item.cantidad}\n`;
    });
    
    mensaje += `\nPara la sucursal ${sucursal?.nombre_sucursal}\n\n`;
    mensaje += 'Espero su respuesta. ¡Gracias!';
    
    return mensaje;
  };

  const handleIncrementQuantity = (itemId: number, currentQuantity: number) => {
    if (currentQuantity >= MAX_CANTIDAD_POR_PRODUCTO) {
      toastError(`Máximo ${MAX_CANTIDAD_POR_PRODUCTO} unidades por producto. Para pedidos grandes, contáctanos directamente.`);
      return;
    }
    updateQuantity(itemId, currentQuantity + 1);
  };

  if (items.length === 0) {
    return (
      <main className="carrito-page">
        <Navbar dark />
        <div className="carrito-container">
          <motion.div
            className="carrito-empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag size={80} className="carrito-empty-icon" />
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos desde nuestro menú para comenzar tu pedido</p>
            <Link href="/menu">
              <button className="carrito-btn-primary">
                Ver Menú
              </button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="carrito-page">
      <Navbar dark />
      <div className="carrito-container">
        <motion.div
          className="carrito-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Carrito de Compras</h1>
          <button onClick={handleClearCart} className="carrito-btn-clear">
            Vaciar carrito
          </button>
        </motion.div>

        {/* Información de sucursal seleccionada */}
        {sucursal && (
          <motion.div
            className="carrito-sucursal-info"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="sucursal-info-content">
              <MapPin size={20} />
              <div>
                <strong>Sucursal: </strong>
                <span>{sucursal.nombre_sucursal}</span>
                <span className="sucursal-direccion"> • {sucursal.direccion_sucursal}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSucursalSelector(true)}
              className="carrito-btn-change-sucursal"
            >
              Cambiar sucursal
            </button>
          </motion.div>
        )}

        <div className="carrito-content">
          <div className="carrito-items">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="carrito-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="carrito-item-image">
                  <Image
                    src={item.imagen_url}
                    alt={item.nombre}
                    fill
                    className="carrito-img"
                  />
                </div>
                
                <div className="carrito-item-info">
                  <h3>{item.nombre}</h3>
                  <p className="carrito-item-desc">{item.descripcion.substring(0, 80)}...</p>
                  {item.categoria_nombre && (
                    <span className="carrito-item-category">{item.categoria_nombre}</span>
                  )}
                </div>

                <div className="carrito-item-price">
                  <span className="price">{formatPrice(item.precio_final)}</span>
                  <span className="price-label">c/u</span>
                </div>

                <div className="carrito-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    className="qty-btn"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{item.cantidad}</span>
                  <button
                    onClick={() => handleIncrementQuantity(item.id, item.cantidad)}
                    className={`qty-btn ${item.cantidad >= MAX_CANTIDAD_POR_PRODUCTO ? 'disabled' : ''}`}
                    disabled={item.cantidad >= MAX_CANTIDAD_POR_PRODUCTO}
                    aria-label="Aumentar cantidad"
                    title={item.cantidad >= MAX_CANTIDAD_POR_PRODUCTO ? `Máximo ${MAX_CANTIDAD_POR_PRODUCTO} unidades` : 'Aumentar cantidad'}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="carrito-item-subtotal">
                  <span className="subtotal-label">Subtotal</span>
                  <span className="subtotal-price">{formatPrice(item.precio_final * item.cantidad)}</span>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id, item.nombre)}
                  className="carrito-item-remove"
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="carrito-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Resumen del pedido</h2>
            
            <div className="carrito-summary-details">
              <div className="summary-row">
                <span>Productos ({items.reduce((acc, item) => acc + item.cantidad, 0)})</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              
              {/* Advertencia si está cerca del límite */}
              {getTotal() > MAX_TOTAL_CARRITO * 0.8 && (
                <div className="carrito-warning">
                  <p>📋 Para pedidos grandes, te recomendamos contactarnos directamente para mejor atención.</p>
                </div>
              )}
            </div>

            <button onClick={handlePagar} className="carrito-btn-pagar">
              Enviar pedido por WhatsApp
            </button>

            <Link href="/menu">
              <button className="carrito-btn-continue">
                Seguir Comprando
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Modal de selección de sucursal */}
      <SucursalSelector
        isOpen={showSucursalSelector}
        onClose={() => setShowSucursalSelector(false)}
        onSelect={(newSucursal) => {
          setSucursal(newSucursal);
          setShowSucursalSelector(false);
        }}
        currentSucursal={sucursal}
      />

      <Footer />
    </main>
  );
}
