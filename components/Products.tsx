'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const [productos, setProductos] = useState<Comida[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
                    // Filtrar solo productos activos y seleccionar 6 aleatorios
                    const productosActivos = menuData.data
                        .filter((p: any) => p.activo)
                        .map((comida: any) => ({
                            id: comida.id_comida,
                            nombre: comida.nombre_comida,
                            descripcion: comida.descripcion,
                            precio: comida.precio_final || comida.precio,
                            imagen_url: comida.imagen_url || '/imagenes/producto_sin_imagen.svg',
                            categoria_id: comida.categoria_id,
                            activo: comida.activo,
                        }));

                    // Seleccionar 6 productos aleatorios
                    const productosAleatorios = productosActivos
                        .sort(() => 0.5 - Math.random())
                        .slice(0, MAX_PRODUCTS);

                    setProductos(productosAleatorios);
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

    // Mostrar productos según tamaño de pantalla
    const getVisibleCount = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) return 1;
            if (window.innerWidth < 1024) return 2;
            if (window.innerWidth < 1536) return 3;
            return 4;
        }
        return 3;
    };

    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setVisibleCount(getVisibleCount());
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, productos.length - visibleCount);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying || productos.length === 0) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, productos.length]);

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

    const visibleProductos = productos.slice(currentIndex, currentIndex + visibleCount);

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="menu">
            <div className="w-full flex">
                {/* Espaciador izquierdo */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />

                <div className="flex-1 px-4 sm:px-8 lg:px-0">
                    {/* Section Header */}
                    <motion.div
                        className="flex flex-col items-center text-center mb-16"
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
                        <p className="text-xl text-gustito-dark/70 max-w-2xl text-center">
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
                        /* Carousel Container */
                        <div
                            className="relative mb-12"
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                        >
                            {/* Navigation Buttons */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gustito-dark hover:bg-gustito-orange hover:text-white transition-all duration-300 hover:scale-110"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gustito-dark hover:bg-gustito-orange hover:text-white transition-all duration-300 hover:scale-110"
                                aria-label="Siguiente"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Products Carousel */}
                            <div className="overflow-hidden mx-12 sm:mx-16 lg:mx-20">
                                <motion.div
                                    className="flex gap-4 sm:gap-6"
                                    initial={false}
                                >
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        {visibleProductos.map((producto, index) => (
                                            <motion.div
                                                key={producto.id}
                                                className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                                style={{
                                                    width: visibleCount === 1 ? '100%'
                                                        : visibleCount === 2 ? 'calc(50% - 12px)'
                                                            : visibleCount === 3 ? 'calc(33.333% - 14px)'
                                                                : 'calc(25% - 14px)'
                                                }}
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                whileHover={{ y: -8 }}
                                                onClick={() => router.push('/menu')}
                                            >
                                                {/* Product Image */}
                                                <div className="relative h-56 overflow-hidden">
                                                    <Image
                                                        src={producto.imagen_url}
                                                        alt={producto.nombre}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* View Full Menu Button */}
                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link
                            href="/menu"
                            className="inline-block px-16 py-5 bg-gustito-orange text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-[#E67000] transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[200px]"
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
