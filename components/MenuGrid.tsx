'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ComidaConPrecio } from '@/types/menu';
import MenuCard from './MenuCard';
import { UtensilsCrossed } from 'lucide-react';

interface MenuGridProps {
    comidas: ComidaConPrecio[];
    isLoading?: boolean;
}

export default function MenuGrid({ comidas, isLoading = false }: MenuGridProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gustito-orange"></div>
                    <p className="text-gray-600 font-medium">Cargando menú...</p>
                </div>
            </div>
        );
    }

    if (comidas.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 px-4"
            >
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
                    <UtensilsCrossed className="mx-auto mb-4 text-gray-400" size={64} />
                    <h3
                        className="text-2xl font-bold text-gustito-dark mb-3"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                    >
                        No se encontraron resultados
                    </h3>
                    <p className="text-gray-600">
                        No hay comidas disponibles con los filtros seleccionados.
                        Intenta ajustar tus criterios de búsqueda.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="mb-8">
            {/* Results count */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <p className="text-gray-600">
                    Mostrando <span className="font-bold text-gustito-orange">{comidas.length}</span>{' '}
                    {comidas.length === 1 ? 'producto' : 'productos'}
                </p>
            </motion.div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={comidas.map(c => c.id).join('-')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {comidas.map((comida, index) => (
                        <MenuCard key={comida.id} comida={comida} index={index} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

