'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')`,
                    }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1
                        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                    >
                        Sabores que te dan un{' '}
                        <span className="text-gustito-green">Gustito</span>
                    </h1>
                </motion.div>

                <motion.p
                    className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 sm:mb-16 max-w-3xl text-center px-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Comida casera con un toque único, hecha con amor.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center mt-4 w-full px-4 sm:px-0"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <a
                        href="#menu"
                        className="px-10 sm:px-14 md:px-16 py-4 sm:py-5 bg-gustito-orange text-white text-base sm:text-xl font-semibold rounded-2xl shadow-lg hover:bg-[#E67000] transition-all duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto min-w-[200px] max-w-[300px]"
                    >
                        Ver Carta
                    </a>
                    <a
                        href="#sucursales"
                        className="px-10 sm:px-14 md:px-16 py-4 sm:py-5 bg-gustito-orange text-white text-base sm:text-xl font-semibold rounded-2xl shadow-lg hover:bg-[#E67000] transition-all duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto min-w-[200px] max-w-[300px]"
                    >
                        Sucursales
                    </a>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 0.5,
                }}
            >
                <ChevronDown size={40} className="text-white/70" />
            </motion.div>
        </section>
    );
}

