'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Categoria {
    id: number;
    nombre: string;
}

interface Comida {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url: string;
    categoria_id: number;
    activo: boolean;
}

const MAX_PRODUCTS = 6; // Cantidad máxima de productos a mostrar

export default function Products() {
    const [productos, setProductos] = useState<Comida[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar productos y categorías en paralelo
                const [menuRes, categoriasRes] = await Promise.all([
                    fetch('http://localhost:4000/api/menu'),
                    fetch('http://localhost:4000/api/categorias')
                ]);

                const menuData = await menuRes.json();
                const categoriasData = await categoriasRes.json();

                if (menuData.ok && menuData.data) {
                    // Filtrar solo productos activos y limitar cantidad
                    const productosActivos = menuData.data
                        .filter((p: any) => p.activo)
                        .slice(0, MAX_PRODUCTS)
                        .map((comida: any) => ({
                            id: comida.id_comida,
                            nombre: comida.nombre_comida,
                            descripcion: comida.descripcion,
                            precio: comida.precio_final || comida.precio,
                            imagen_url: comida.imagen_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
                            categoria_id: comida.categoria_id,
                            activo: comida.activo,
                        }));
                    setProductos(productosActivos);
                }

                if (categoriasData.ok && categoriasData.data) {
                    const cats = categoriasData.data.map((cat: any) => ({
                        id: cat.id_categoria,
                        nombre: cat.nombre_categoria,
                    }));
                    setCategorias(cats);
                }
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCategoriaNombre = (categoriaId: number) => {
        const categoria = categorias.find(c => c.id === categoriaId);
        return categoria?.nombre || 'Sin categoría';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(price);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="menu">
            <div className="w-full flex">
                {/* Espaciador izquierdo */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />
                
                <div className="flex-1 px-4 sm:px-8 lg:px-0">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gustito-green rounded-full mb-6">
                        <Utensils size={32} className="text-white" />
                    </div>
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gustito-dark mb-4"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                    >
                        Nuestra <span className="text-gustito-orange">Carta</span>
                    </h2>
                    <p className="text-xl text-gustito-dark/70 max-w-2xl mx-auto">
                        Descubre los sabores auténticos de Chile, preparados con ingredientes frescos y mucho cariño
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gustito-orange"></div>
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gustito-dark/70">No hay productos disponibles</p>
                    </div>
                ) : (
                    /* Products Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                        {productos.map((producto, index) => (
                            <motion.div
                                key={producto.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                {/* Product Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={producto.imagen_url}
                                        alt={producto.nombre}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-gustito-green text-white text-sm font-semibold rounded-full">
                                            {getCategoriaNombre(producto.categoria_id)}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <h3
                                        className="text-2xl font-bold text-gustito-dark mb-2 group-hover:text-gustito-orange transition-colors duration-300 line-clamp-1"
                                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                                    >
                                        {producto.nombre}
                                    </h3>
                                    <p className="text-gustito-dark/70 mb-4 line-clamp-2">
                                        {producto.descripcion}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-gustito-orange">
                                            {formatPrice(producto.precio)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* View Full Menu Button */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Link
                        href="/menu"
                        className="inline-block px-8 py-4 bg-gustito-orange text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-[#E67000] transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        Ver Menú Completo
                    </Link>
                </motion.div>
                </div>
                
                {/* Espaciador derecho */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />
            </div>
        </section>
    );
}
