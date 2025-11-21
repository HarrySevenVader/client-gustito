'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuFilters from '@/components/MenuFilters';
import MenuGrid from '@/components/MenuGrid';
import { MenuFilters as MenuFiltersType, ComidaConPrecio } from '@/types/menu';
import {
    categorias,
    sucursales,
    comidas,
    getPrecioFinal,
    isDisponible,
    getObservacion,
} from '@/lib/mockData';

export default function MenuPage() {
    const [filters, setFilters] = useState<MenuFiltersType>({
        categoria_id: null,
        sucursal_id: null,
        search: '',
    });

    // Filter and process comidas based on current filters
    const filteredComidas = useMemo(() => {
        let result = comidas.filter((comida) => comida.activo);

        // Filter by sucursal availability
        if (filters.sucursal_id) {
            result = result.filter((comida) =>
                isDisponible(comida.id, filters.sucursal_id)
            );
        }

        // Filter by categoria
        if (filters.categoria_id) {
            result = result.filter(
                (comida) => comida.categoria_id === filters.categoria_id
            );
        }

        // Filter by search text
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase().trim();
            result = result.filter((comida) =>
                comida.nombre.toLowerCase().includes(searchLower)
            );
        }

        // Map to ComidaConPrecio with final prices
        const comidasConPrecio: ComidaConPrecio[] = result.map((comida) => {
            const categoria = categorias.find((c) => c.id === comida.categoria_id);
            return {
                ...comida,
                precio_final: getPrecioFinal(comida, filters.sucursal_id),
                observacion: getObservacion(comida.id, filters.sucursal_id),
                categoria_nombre: categoria?.nombre,
            };
        });

        return comidasConPrecio;
    }, [filters]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar dark />

            {/* Spacer for fixed navbar */}
            <div className="h-24"></div>

            {/* Hero Section */}
            <section className="pt-16 pb-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold text-gustito-dark mb-6"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Nuestro Menú
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Descubre nuestros deliciosos completos, ensaladas y bebidas
                    </motion.p>
                </div>
            </section>

            {/* Menu Content */}
            <section className="pb-20 px-4">
                <div className="w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {/* Filters */}
                        <MenuFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            categorias={categorias}
                            sucursales={sucursales}
                        />

                        {/* Menu Grid */}
                        <MenuGrid comidas={filteredComidas} />
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}


