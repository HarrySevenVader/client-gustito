'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-0 bg-white" id="sucursales">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Side - White Background with Icon */}
                    <motion.div
                        className="bg-white p-12 md:p-16 lg:p-20 flex flex-col items-center justify-center text-center border-r border-gray-100"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-gustito-orange rounded-full shadow-xl">
                                <MapPin size={48} className="text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                        <h2
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gustito-orange mb-6"
                            style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        >
                            SUCURSALES
                        </h2>
                        <p className="text-lg text-gustito-dark/80 mb-8 max-w-md">
                            Encuentra tu Gustito más cercano y disfruta de nuestros sabores únicos
                        </p>
                        <Link
                            href="/sucursales"
                            className="px-8 py-4 bg-gustito-orange text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-[#E67000] transition-all duration-300 hover:scale-105 hover:shadow-xl inline-block"
                        >
                            Ver Ubicaciones
                        </Link>
                    </motion.div>

                    {/* Right Side - Orange Background with Text */}
                    <motion.div
                        className="bg-gradient-to-br from-gustito-orange to-[#E67000] p-12 md:p-16 lg:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop')`,
                                }}
                            />
                        </div>

                        <div className="relative z-10">
                            <div className="mb-6">
                                <Phone size={64} className="text-white mx-auto" strokeWidth={2} />
                            </div>
                            <h2
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                                style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                            >
                                NO COCINES,
                                <br />
                                <span className="text-gustito-green">¡PIDE GUSTITO!</span>
                            </h2>
                            <p className="text-xl text-white/90 mb-8 max-w-md mx-auto">
                                Llama ahora y recibe tu pedido en minutos
                            </p>
                            <a
                                href="tel:+56912345678"
                                className="inline-block px-8 py-4 bg-white text-gustito-orange text-lg font-semibold rounded-2xl shadow-lg hover:bg-gustito-green hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                +56 9 1234 5678
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

