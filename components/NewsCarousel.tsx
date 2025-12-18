'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Newspaper, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Noticia {
    id_noticia: number;
    titulo: string;
    contenido: string;
    imagen: string | null;
    fecha_publicacion: string;
    estado: 'activo' | 'inactivo';
}

export default function NewsCarousel() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Cargar noticias activas desde el backend
    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/noticias/activas');
                const data = await response.json();
                
                if (data.ok && data.data) {
                    setNoticias(data.data);
                }
            } catch (error) {
                console.error('Error al cargar noticias:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticias();
    }, []);

    // Mostrar 4 noticias en pantallas grandes, 3 en desktop, 2 en tablet, 1 en mobile
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

    const maxIndex = Math.max(0, noticias.length - visibleCount);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Santiago'
        });
    };

    const visibleNoticias = noticias.slice(currentIndex, currentIndex + visibleCount);

    const handleNoticiaClick = (id: number) => {
        router.push(`/noticias/${id}`);
    };

    if (loading || noticias.length === 0) {
        return null; // O mostrar un skeleton loader
    }

    return (
        <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white" id="noticias">
            <div className="w-full flex">
                {/* Espaciador izquierdo */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />
                
                <div className="flex-1 px-4 sm:px-8 lg:px-0">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gustito-orange to-gustito-green rounded-full mb-4">
                        <Newspaper size={32} className="text-white" />
                    </div>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-gustito-dark mb-4"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                    >
                        Últimas <span className="text-gustito-orange">Noticias</span>
                    </h2>
                    <p className="text-lg text-gustito-dark/70 max-w-2xl mx-auto">
                        Mantente informado sobre promociones, eventos y novedades de Gustito
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div 
                    className="relative"
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

                    {/* Cards Grid */}
                    <div className="overflow-hidden mx-12 sm:mx-16 lg:mx-20">
                        <motion.div 
                            className="flex gap-4 sm:gap-6"
                            initial={false}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {visibleNoticias.map((noticia, index) => (
                                    <motion.article
                                        key={noticia.id_noticia}
                                        className="flex-shrink-0 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
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
                                        whileHover={{ y: -5 }}
                                        onClick={() => handleNoticiaClick(noticia.id_noticia)}
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={noticia.imagen || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop'}
                                                alt={noticia.titulo}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-gustito-orange text-sm mb-3">
                                                <Calendar size={14} />
                                                <time dateTime={noticia.fecha_publicacion}>{formatDate(noticia.fecha_publicacion)}</time>
                                            </div>
                                            <h3 
                                                className="text-xl font-bold text-gustito-dark mb-3 line-clamp-2"
                                                style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                                            >
                                                {noticia.titulo}
                                            </h3>
                                            <p className="text-gustito-dark/70 line-clamp-3">
                                                {noticia.contenido.substring(0, 100)}...
                                            </p>
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex 
                                        ? 'bg-gustito-orange w-8' 
                                        : 'bg-gray-300 hover:bg-gustito-orange/50'
                                }`}
                                aria-label={`Ir a slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
                </div>
                
                {/* Espaciador derecho */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />
            </div>
        </section>
    );
}

