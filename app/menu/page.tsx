'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './menu.css';
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
        <main className="menu-page">
            <Navbar dark />
            <div className="menu-container pt-24">
                <section className="menu-hero">
                    <motion.h1
                        className="text-5xl md:text-6xl"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif", color: 'var(--gustito-dark)' }}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Nuestro Menú
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Descubre nuestros deliciosos completos, ensaladas y bebidas
                    </motion.p>
                </section>
                <section className="menu-section">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <MenuFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            categorias={categorias}
                            sucursales={sucursales}
                        />
                        <MenuGrid comidas={filteredComidas} />
                    </motion.div>
                </section>
            </div>
            <Footer />
        </main>
    );
}


