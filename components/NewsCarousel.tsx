'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Newspaper, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Noticia {
    id: number;
    title: string;
    date: string;
    description: string;
    image: string;
}

// Datos de muestra - se reemplazarán cuando haya backend
const noticiasDefault: Noticia[] = [
    { 
        id: 1, 
        title: 'Apertura nueva sucursal', 
        date: '2025-08-30', 
        description: 'Hemos abierto una nueva sucursal en el centro de la ciudad con atención extendida. ¡Te esperamos!', 
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop' 
    },
    { 
        id: 2, 
        title: 'Promoción de verano', 
        date: '2025-07-14', 
        description: 'Descuentos especiales en helados y bebidas hasta fin de mes. Aprovecha esta oportunidad única.', 
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop' 
    },
    { 
        id: 3, 
        title: 'Evento degustación', 
        date: '2025-06-02', 
        description: 'Te invitamos a una degustación gratuita este sábado en nuestra sucursal principal.', 
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop' 
    },
    { 
        id: 4, 
        title: 'Nuevo horario extendido', 
        date: '2025-05-10', 
        description: 'Ampliamos horario los fines de semana para mejor servicio. Ahora abiertos hasta las 23:00.', 
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop' 
    },
    { 
        id: 5, 
        title: 'Receta del mes', 
        date: '2025-04-01', 
        description: 'Aprende a preparar nuestra empanada especial con ingredientes locales frescos.', 
        image: 'https://images.unsplash.com/photo-1604467707321-70f018d5ebb3?w=800&auto=format&fit=crop' 
    },
    { 
        id: 6, 
        title: 'Sello de calidad', 
        date: '2025-03-20', 
        description: 'Recibimos un reconocimiento por el uso de ingredientes de calidad y preparación artesanal.', 
        image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&auto=format&fit=crop' 
    },
];

export default function NewsCarousel() {
    const [noticias] = useState<Noticia[]>(noticiasDefault);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
                                        key={noticia.id}
                                        className="flex-shrink-0 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
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
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={noticia.image}
                                                alt={noticia.title}
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
                                                <time dateTime={noticia.date}>{formatDate(noticia.date)}</time>
                                            </div>
                                            <h3 
                                                className="text-xl font-bold text-gustito-dark mb-3 line-clamp-2"
                                                style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                                            >
                                                {noticia.title}
                                            </h3>
                                            <p className="text-gustito-dark/70 line-clamp-3">
                                                {noticia.description}
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

