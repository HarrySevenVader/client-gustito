import { Categoria, Sucursal, Comida, ComidaSucursal } from '@/types/menu';

// Mock data - Categorías
export const categorias: Categoria[] = [
    { id: 1, nombre: 'Proteínas' },
    { id: 2, nombre: 'Ensaladas' },
    { id: 3, nombre: 'Bebidas' },
    { id: 4, nombre: 'Acompañamientos' },
    { id: 5, nombre: 'Postres' },
];

// Mock data - Sucursales
export const sucursales: Sucursal[] = [
    { id: 1, nombre: 'Sucursal Centro', direccion: 'Av. Principal 123, Centro' },
    { id: 2, nombre: 'Sucursal Mall Plaza', direccion: 'Mall Plaza Local 45' },
    { id: 3, nombre: 'Sucursal Norte', direccion: 'Av. Los Pinos 789, Sector Norte' },
];

// Mock data - Comidas
export const comidas: Comida[] = [
    {
        id: 1,
        nombre: 'Completo Italiano',
        descripcion: 'Vienesa, tomate, palta y mayonesa',
        categoria_id: 1,
        imagen_url: 'https://images.unsplash.com/photo-1612392062798-2baaa4f76f95?w=800&auto=format&fit=crop',
        precio: 3500,
        activo: true,
    },
    {
        id: 2,
        nombre: 'Completo Dinámico',
        descripcion: 'Vienesa, tomate, chucrut, palta y mayonesa',
        categoria_id: 1,
        imagen_url: 'https://images.unsplash.com/photo-1596662951482-0c4ba8a6e8c3?w=800&auto=format&fit=crop',
        precio: 4000,
        activo: true,
    },
    {
        id: 3,
        nombre: 'Completo Alemán',
        descripcion: 'Vienesa, chucrut y mostaza',
        categoria_id: 1,
        imagen_url: 'https://images.unsplash.com/photo-1612392062422-a3e39a72e1dc?w=800&auto=format&fit=crop',
        precio: 3200,
        activo: true,
    },
    {
        id: 4,
        nombre: 'Ensalada César',
        descripcion: 'Lechuga, crutones, queso parmesano y aderezo césar',
        categoria_id: 2,
        imagen_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop',
        precio: 4500,
        activo: true,
    },
    {
        id: 5,
        nombre: 'Ensalada Mixta',
        descripcion: 'Lechuga, tomate, zanahoria, repollo y aceitunas',
        categoria_id: 2,
        imagen_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
        precio: 3800,
        activo: true,
    },
    {
        id: 6,
        nombre: 'Coca Cola',
        descripcion: 'Bebida gaseosa 500ml',
        categoria_id: 3,
        imagen_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop',
        precio: 1500,
        activo: true,
    },
    {
        id: 7,
        nombre: 'Sprite',
        descripcion: 'Bebida gaseosa 500ml',
        categoria_id: 3,
        imagen_url: 'https://images.unsplash.com/photo-1625740234155-8e86c794c49e?w=800&auto=format&fit=crop',
        precio: 1500,
        activo: true,
    },
    {
        id: 8,
        nombre: 'Jugo Natural Naranja',
        descripcion: 'Jugo de naranja natural 350ml',
        categoria_id: 3,
        imagen_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop',
        precio: 2500,
        activo: true,
    },
    {
        id: 9,
        nombre: 'Papas Fritas',
        descripcion: 'Papas fritas crujientes porción mediana',
        categoria_id: 4,
        imagen_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop',
        precio: 2000,
        activo: true,
    },
    {
        id: 10,
        nombre: 'Aros de Cebolla',
        descripcion: 'Aros de cebolla empanizados y fritos',
        categoria_id: 4,
        imagen_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&auto=format&fit=crop',
        precio: 2200,
        activo: true,
    },
    {
        id: 11,
        nombre: 'Brownie con Helado',
        descripcion: 'Brownie de chocolate con helado de vainilla',
        categoria_id: 5,
        imagen_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop',
        precio: 3000,
        activo: true,
    },
    {
        id: 12,
        nombre: 'Helado Artesanal',
        descripcion: 'Dos bolas de helado artesanal a elección',
        categoria_id: 5,
        imagen_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop',
        precio: 2800,
        activo: true,
    },
    {
        id: 13,
        nombre: 'Completo Vegetariano',
        descripcion: 'Salchicha vegetal, tomate, palta y mostaza',
        categoria_id: 1,
        imagen_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop',
        precio: 3800,
        activo: true,
    },
    {
        id: 14,
        nombre: 'Agua Mineral',
        descripcion: 'Agua mineral con o sin gas 500ml',
        categoria_id: 3,
        imagen_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&auto=format&fit=crop',
        precio: 1200,
        activo: true,
    },
    {
        id: 15,
        nombre: 'Ensalada Griega',
        descripcion: 'Tomate, pepino, cebolla morada, queso feta y aceitunas',
        categoria_id: 2,
        imagen_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop',
        precio: 4200,
        activo: true,
    },
];

// Mock data - Relación Comidas-Sucursales
export const comidasSucursales: ComidaSucursal[] = [
    // Sucursal Centro (1) - Tiene casi todo disponible
    { comida_id: 1, sucursal_id: 1, disponible: true },
    { comida_id: 2, sucursal_id: 1, disponible: true, precio_sucursal: 4200 }, // Precio especial
    { comida_id: 3, sucursal_id: 1, disponible: true },
    { comida_id: 4, sucursal_id: 1, disponible: true },
    { comida_id: 5, sucursal_id: 1, disponible: true },
    { comida_id: 6, sucursal_id: 1, disponible: true },
    { comida_id: 7, sucursal_id: 1, disponible: true },
    { comida_id: 8, sucursal_id: 1, disponible: true, precio_sucursal: 2800 },
    { comida_id: 9, sucursal_id: 1, disponible: true },
    { comida_id: 10, sucursal_id: 1, disponible: false }, // No disponible
    { comida_id: 11, sucursal_id: 1, disponible: true },
    { comida_id: 12, sucursal_id: 1, disponible: true },
    { comida_id: 13, sucursal_id: 1, disponible: true },
    { comida_id: 14, sucursal_id: 1, disponible: true },
    { comida_id: 15, sucursal_id: 1, disponible: true },

    // Sucursal Mall Plaza (2) - Menú más limitado
    { comida_id: 1, sucursal_id: 2, disponible: true, precio_sucursal: 3800 },
    { comida_id: 2, sucursal_id: 2, disponible: true },
    { comida_id: 3, sucursal_id: 2, disponible: true },
    { comida_id: 4, sucursal_id: 2, disponible: true, precio_sucursal: 5000 },
    { comida_id: 6, sucursal_id: 2, disponible: true },
    { comida_id: 7, sucursal_id: 2, disponible: true },
    { comida_id: 9, sucursal_id: 2, disponible: true, precio_sucursal: 2500 },
    { comida_id: 11, sucursal_id: 2, disponible: true },
    { comida_id: 13, sucursal_id: 2, disponible: true },
    { comida_id: 14, sucursal_id: 2, disponible: true },

    // Sucursal Norte (3) - Tiene productos únicos con precios especiales
    { comida_id: 1, sucursal_id: 3, disponible: true },
    { comida_id: 2, sucursal_id: 3, disponible: true },
    { comida_id: 3, sucursal_id: 3, disponible: false },
    { comida_id: 4, sucursal_id: 3, disponible: true },
    { comida_id: 5, sucursal_id: 3, disponible: true, precio_sucursal: 4000 },
    { comida_id: 6, sucursal_id: 3, disponible: true },
    { comida_id: 7, sucursal_id: 3, disponible: true },
    { comida_id: 8, sucursal_id: 3, disponible: true },
    { comida_id: 9, sucursal_id: 3, disponible: true },
    { comida_id: 10, sucursal_id: 3, disponible: true },
    { comida_id: 11, sucursal_id: 3, disponible: true, precio_sucursal: 3500 },
    { comida_id: 12, sucursal_id: 3, disponible: true, precio_sucursal: 3200 },
    { comida_id: 13, sucursal_id: 3, disponible: true, precio_sucursal: 4200 },
    { comida_id: 14, sucursal_id: 3, disponible: true },
    { comida_id: 15, sucursal_id: 3, disponible: true },
];

// Helper function to get the final price for a comida at a specific sucursal
export function getPrecioFinal(comida: Comida, sucursalId: number | null): number {
    if (!sucursalId) return comida.precio;

    const relacion = comidasSucursales.find(
        (cs) => cs.comida_id === comida.id && cs.sucursal_id === sucursalId
    );

    return relacion?.precio_sucursal ?? comida.precio;
}

// Helper function to check if a comida is available at a specific sucursal
export function isDisponible(comidaId: number, sucursalId: number | null): boolean {
    if (!sucursalId) return true; // If no sucursal selected, show all active

    const relacion = comidasSucursales.find(
        (cs) => cs.comida_id === comidaId && cs.sucursal_id === sucursalId
    );

    return relacion ? relacion.disponible : false;
}

// Helper function to get observacion
export function getObservacion(comidaId: number, sucursalId: number | null): string | undefined {
    if (!sucursalId) return undefined;

    const relacion = comidasSucursales.find(
        (cs) => cs.comida_id === comidaId && cs.sucursal_id === sucursalId
    );

    return relacion?.observacion;
}

