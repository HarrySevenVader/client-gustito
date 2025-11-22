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
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="menu-card"
        >
            <div className="menu-card__image">
                <Image
                    src={comida.imagen_url}
                    alt={comida.nombre}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 280px"
                />
                {comida.categoria_nombre && (
                    <div className="badge">{comida.categoria_nombre}</div>
                )}
                {hasPriceChange && (
                    <div className="badge special">Precio especial</div>
                )}
            </div>
            <div className="menu-card__body">
                <h3>{comida.nombre}</h3>
                <p>{comida.descripcion}</p>
                {comida.observacion && (
                    <div className="menu-card__note">
                        <strong>Nota:</strong> {comida.observacion}
                    </div>
                )}
                <div className="menu-card__footer">
                    <div className="menu-card__price">
                        {hasPriceChange && (
                            <span className="old">{formatPrice(comida.precio)}</span>
                        )}
                        <span className="current">{formatPrice(comida.precio_final)}</span>
                    </div>
                    <button className="menu-card__add" aria-label={`Agregar ${comida.nombre} al carrito`}>
                        Agregar
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

