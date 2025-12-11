'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './menu.css';
import MenuFilters from '@/components/MenuFilters';
import MenuGrid from '@/components/MenuGrid';
import { MenuFilters as MenuFiltersType, ComidaConPrecio, Comida, Categoria } from '@/types/menu';
import {
    sucursales,
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
    const [comidas, setComidas] = useState<Comida[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar categorías desde el backend
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/categorias');
                const data = await response.json();

                if (data.ok && data.data) {
                    // Transformar datos del backend al formato esperado
                    const categoriasAPI: Categoria[] = data.data.map((cat: any) => ({
                        id: cat.id_categoria,
                        nombre: cat.nombre_categoria,
                    }));
                    setCategorias(categoriasAPI);
                } else {
                    console.error('Error al cargar categorías:', data.mensaje);
                }
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };

        fetchCategorias();
    }, []);

    // Cargar comidas desde la API
    useEffect(() => {
        const fetchComidas = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/comidas');
                const data = await response.json();

                if (data.ok && data.data) {
                    // Transformar datos del backend al formato esperado
                    const comidasAPI: Comida[] = data.data.map((comida: any) => ({
                        id: comida.id_comida,
                        nombre: comida.nombre_comida,
                        descripcion: comida.descripcion,
                        categoria_id: comida.categoria_id,
                        imagen_url: comida.imagen_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
                        precio: comida.precio,
                        activo: comida.activo,
                    }));
                    setComidas(comidasAPI);
                } else {
                    console.error('Error al cargar comidas:', data.mensaje);
                }
            } catch (error) {
                console.error('Error al cargar comidas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComidas();
    }, []);

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
    }, [comidas, filters]);

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
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ fontSize: '1.1rem', color: 'var(--gustito-dark)' }}>
                                    Cargando menú...
                                </p>
                            </div>
                        ) : (
                            <MenuGrid comidas={filteredComidas} />
                        )}
                    </motion.div>
                </section>
            </div>
            <Footer />
        </main>
    );
}


