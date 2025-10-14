'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar dark />

            {/* Spacer for fixed navbar */}
            <div className="h-24"></div>

            {/* Hero Section */}
            <section className="pt-16 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold text-gustito-dark mb-6"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Nuestro Menú
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Descubre nuestros deliciosos completos y bebidas
                    </motion.p>
                </div>
            </section>

            {/* Coming Soon Content */}
            <section className="pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="text-6xl mb-6">🌭</div>
                        <h2 className="text-3xl font-bold text-gustito-orange mb-4"
                            style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        >
                            Página en construcción
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Estamos trabajando en traerte la mejor experiencia de menú digital.
                        </p>
                        <a
                            href="/"
                            className="inline-block px-8 py-3 bg-gustito-orange text-white font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Volver al Inicio
                        </a>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}


