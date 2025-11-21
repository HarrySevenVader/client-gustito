'use client';

import { motion } from 'framer-motion';
import { ComidaConPrecio } from '@/types/menu';
import Image from 'next/image';

interface MenuCardProps {
    comida: ComidaConPrecio;
    index: number;
}

export default function MenuCard({ comida, index }: MenuCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(price);
    };

    const hasPriceChange = comida.precio !== comida.precio_final;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
        >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <Image
                    src={comida.imagen_url}
                    alt={comida.nombre}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Category Badge */}
                {comida.categoria_nombre && (
                    <div className="absolute top-3 right-3 bg-gustito-orange text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {comida.categoria_nombre}
                    </div>
                )}

                {/* Price Change Badge */}
                {hasPriceChange && (
                    <div className="absolute top-3 left-3 bg-gustito-green text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Precio especial
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3
                    className="text-xl font-bold text-gustito-dark mb-2 line-clamp-1"
                    style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                >
                    {comida.nombre}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {comida.descripcion}
                </p>

                {/* Observation */}
                {comida.observacion && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                            <span className="font-semibold">Nota:</span> {comida.observacion}
                        </p>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex flex-col">
                        {hasPriceChange && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(comida.precio)}
                            </span>
                        )}
                        <span className="text-2xl font-bold text-gustito-orange">
                            {formatPrice(comida.precio_final)}
                        </span>
                    </div>

                    <button
                        className="px-5 py-2 bg-gustito-orange text-white font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md"
                        aria-label={`Agregar ${comida.nombre} al carrito`}
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

