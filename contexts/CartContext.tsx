'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ComidaConPrecio } from '@/types/menu';

// Límites del carrito
const MAX_CANTIDAD_POR_PRODUCTO = 20;
const MAX_TOTAL_CARRITO = 100000;

export interface CartItem extends ComidaConPrecio {
  cantidad: number;
}

export interface Sucursal {
  id_sucursal: number;
  nombre_sucursal: string;
  direccion_sucursal: string;
  telefono?: string;
}

interface CartContextType {
  items: CartItem[];
  sucursal: Sucursal | null;
  setSucursal: (sucursal: Sucursal | null) => void;
  addToCart: (producto: ComidaConPrecio) => void;
  removeFromCart: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [sucursal, setSucursalState] = useState<Sucursal | null>(null);

  // Cargar carrito y sucursal desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('gustito-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar carrito:', error);
      }
    }

    const savedSucursal = localStorage.getItem('gustito-sucursal');
    if (savedSucursal) {
      try {
        setSucursalState(JSON.parse(savedSucursal));
      } catch (error) {
        console.error('Error al cargar sucursal:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('gustito-cart', JSON.stringify(items));
  }, [items]);

  // Guardar sucursal en localStorage cuando cambie
  useEffect(() => {
    if (sucursal) {
      localStorage.setItem('gustito-sucursal', JSON.stringify(sucursal));
    } else {
      localStorage.removeItem('gustito-sucursal');
    }
  }, [sucursal]);

  const setSucursal = (newSucursal: Sucursal | null) => {
    // Si cambia la sucursal, limpiar el carrito
    if (newSucursal && sucursal && newSucursal.id_sucursal !== sucursal.id_sucursal) {
      setItems([]);
    }
    setSucursalState(newSucursal);
  };

  const addToCart = (producto: ComidaConPrecio) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === producto.id);
      
      if (existingItem) {
        // Validar límite por producto
        if (existingItem.cantidad >= MAX_CANTIDAD_POR_PRODUCTO) {
          return currentItems; // No agregar más
        }
        // Si ya existe, incrementar cantidad
        return currentItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Validar límite total del carrito
        const totalActual = currentItems.reduce((sum, item) => sum + (item.precio_final * item.cantidad), 0);
        const nuevoTotal = totalActual + producto.precio_final;
        
        if (nuevoTotal > MAX_TOTAL_CARRITO) {
          return currentItems; // No agregar si excede el límite
        }
        
        // Si no existe, agregar nuevo item
        return [...currentItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  const removeFromCart = (productoId: number) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.id !== productoId);
      // Si el carrito queda vacío, limpiar también la sucursal
      if (newItems.length === 0) {
        setSucursalState(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }
    
    // Validar límite por producto
    if (cantidad > MAX_CANTIDAD_POR_PRODUCTO) {
      cantidad = MAX_CANTIDAD_POR_PRODUCTO;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productoId
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setSucursalState(null);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.precio_final * item.cantidad), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        sucursal,
        setSucursal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
