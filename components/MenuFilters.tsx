'use client';

import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Categoria, Sucursal, MenuFilters as MenuFiltersType } from '@/types/menu';

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
    const hasActiveFilters = filters.categoria_id !== null || filters.sucursal_id !== null || filters.search !== '';

    const clearFilters = () => {
        onFiltersChange({
            categoria_id: null,
            sucursal_id: null,
            search: '',
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Filter className="text-gustito-orange" size={24} />
                    <h2 className="text-2xl font-bold text-gustito-dark" style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}>
                        Filtros
                    </h2>
                </div>
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gustito-orange hover:bg-gustito-orange hover:text-white transition-all duration-300 rounded-lg border border-gustito-orange"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar comida
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            placeholder="Nombre del plato..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gustito-orange focus:border-transparent transition-all duration-300 outline-none"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                    </label>
                    <select
                        value={filters.categoria_id ?? ''}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                categoria_id: e.target.value ? parseInt(e.target.value) : null,
                            })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gustito-orange focus:border-transparent transition-all duration-300 outline-none bg-white cursor-pointer"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sucursal
                    </label>
                    <select
                        value={filters.sucursal_id ?? ''}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                sucursal_id: e.target.value ? parseInt(e.target.value) : null,
                            })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gustito-orange focus:border-transparent transition-all duration-300 outline-none bg-white cursor-pointer"
                    >
                        <option value="">Todas las sucursales</option>
                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Active filters summary */}
            {hasActiveFilters && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                >
                    <div className="flex flex-wrap gap-2">
                        {filters.search && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gustito-orange/10 text-gustito-orange rounded-full text-sm">
                                Búsqueda: "{filters.search}"
                            </span>
                        )}
                        {filters.categoria_id && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gustito-green/10 text-green-700 rounded-full text-sm">
                                {categorias.find((c) => c.id === filters.categoria_id)?.nombre}
                            </span>
                        )}
                        {filters.sucursal_id && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {sucursales.find((s) => s.id === filters.sucursal_id)?.nombre}
                            </span>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

