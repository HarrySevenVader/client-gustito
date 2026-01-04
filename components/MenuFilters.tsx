'use client';

import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Categoria, Sucursal, MenuFilters as MenuFiltersType } from '@/types/menu';
import { useCart } from '@/contexts/CartContext';

interface MenuFiltersProps {
    filters: MenuFiltersType;
    onFiltersChange: (filters: MenuFiltersType) => void;
    categorias: Categoria[];
    sucursales: Sucursal[];
}

export default function MenuFilters({
    filters,
    onFiltersChange,
    categorias,
    sucursales,
}: MenuFiltersProps) {
    const { sucursal: sucursalCarrito } = useCart();
    const hasActiveFilters = filters.categoria_id !== null || filters.sucursal_id !== null || filters.search !== '';

    const clearFilters = () => {
        onFiltersChange({
            categoria_id: null,
            sucursal_id: null,
            search: '',
        });
    };

    return (
        <div className="filters-panel mb-8">
            <div className="filters-header">
                <h2>
                    <Filter className="text-gustito-orange" size={24} />
                    Filtros
                </h2>
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 rounded-full border border-blue-200"
                        >
                            <X size={16} />
                            Limpiar filtros
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="relative">
                    <label className="mb-2">Buscar comida</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            placeholder="Nombre del plato..."
                            className="w-full h-10 py-2 px-3 rounded-md border border-gray-300 focus:border-gustito-orange focus:ring-2 focus:ring-gustito-orange/40 outline-none placeholder:text-gray-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="mb-2">Categoría</label>
                    <select
                        value={filters.categoria_id ?? ''}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                categoria_id: e.target.value ? parseInt(e.target.value) : null,
                            })
                        }
                        className="cursor-pointer"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sucursal Filter */}
                <div>
                    <label className="mb-2">Sucursal</label>
                    <select
                        value={filters.sucursal_id ?? ''}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                sucursal_id: e.target.value ? parseInt(e.target.value) : null,
                            })
                        }
                        className="cursor-pointer"
                        disabled={!!sucursalCarrito}
                        style={{
                            opacity: sucursalCarrito ? 0.7 : 1,
                            cursor: sucursalCarrito ? 'not-allowed' : 'pointer',
                            backgroundColor: sucursalCarrito ? '#f3f4f6' : 'white'
                        }}
                        title={sucursalCarrito ? `Tienes productos en el carrito de ${sucursalCarrito.nombre_sucursal}. Para cambiar de sucursal, ve al carrito.` : ''}
                    >
                        <option value="">Todas las sucursales</option>
                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                    {sucursalCarrito && (
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            🔒 Filtrado por tu carrito
                        </p>
                    )}
                </div>
            </div>

            {/* Active filters summary */}
            {hasActiveFilters && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="active-tags"
                >
                    {filters.search && (
                        <span className="tag search">Búsqueda: "{filters.search}"</span>
                    )}
                    {filters.categoria_id && (
                        <span className="tag categoria">{categorias.find((c) => c.id === filters.categoria_id)?.nombre}</span>
                    )}
                    {filters.sucursal_id && (
                        <span className="tag sucursal">{sucursales.find((s) => s.id === filters.sucursal_id)?.nombre}</span>
                    )}
                </motion.div>
            )}
        </div>
    );
}

