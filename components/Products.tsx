'use client';

import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
}

const products: Product[] = [
    {
        id: 1,
        name: 'Completo Italiano',
        description: 'Vienesa, tomate, palta y mayo casera',
        price: '$3.500',
        image: 'https://images.unsplash.com/photo-1612392062798-2dbaa788a9e4?q=80&w=800&auto=format&fit=crop',
        category: 'Completos',
    },
    {
        id: 2,
        name: 'Chacarero',
        description: 'Carne, tomate, porotos verdes y ají verde',
        price: '$4.200',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
        category: 'Sándwiches',
    },
    {
        id: 3,
        name: 'Empanadas de Pino',
        description: 'Carne, cebolla, huevo, aceituna y pasas',
        price: '$2.000',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
        category: 'Empanadas',
    },
    {
        id: 4,
        name: 'Papas Fritas',
        description: 'Crujientes y doradas, porción grande',
        price: '$2.500',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop',
        category: 'Acompañamientos',
    },
    {
        id: 5,
        name: 'Chorrillana',
        description: 'Papas fritas, carne, cebolla, huevo y chorizo',
        price: '$8.500',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=800&auto=format&fit=crop',
        category: 'Platos Fuertes',
    },
    {
        id: 6,
        name: 'Sopaipillas',
        description: 'Con pebre o chancaca',
        price: '$1.500',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
        category: 'Postres',
    },
];

export default function Products() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50" id="menu">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                {/* Products Grid */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                            >
                                {/* Product Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${product.image}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-gustito-green text-white text-sm font-semibold rounded-full">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <h3
                                        className="text-2xl font-bold text-gustito-dark mb-2 group-hover:text-gustito-orange transition-colors duration-300"
                                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                                    >
                                        {product.name}
                                    </h3>
                                    <p className="text-gustito-dark/70 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gustito-orange">
                                            {product.price}
                                        </span>
                                        <button className="px-4 py-2 bg-gustito-green text-white font-semibold rounded-xl hover:bg-[#6FC01D] transition-colors duration-300">
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* View Full Menu Button */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <a
                        href="#menu-completo"
                        className="inline-block px-8 py-4 bg-gustito-orange text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-[#E67000] transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        Ver Menú Completo
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

