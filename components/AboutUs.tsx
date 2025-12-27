'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutUs() {
    const features = [
        {
            icon: Heart,
            title: 'Sabor Casero',
            description: 'Preparaciones con sabor auténtico y porciones generosas, como en casa.',
        },
        {
            icon: Award,
            title: 'Calidad Consistente',
            description: 'Cada sucursal mantiene los mismos estándares de calidad y servicio.',
        },
        {
            icon: Users,
            title: 'Atención Cercana',
            description: 'Buscamos que te sientas bien atendido, escuchado y con ganas de volver.',
        },
        {
            icon: Clock,
            title: 'Procesos Cuidados',
            description: 'Platos simples pero bien ejecutados, pensados para tu día a día.',
        },
    ];

    return (
        <section className="py-20 bg-white" id="nosotros">
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
                        <h2
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gustito-dark mb-4"
                            style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        >
                            Sobre <span className="text-gustito-orange">Nosotros</span>
                        </h2>
                        <p className="text-xl text-gustito-dark/70 max-w-4xl mx-auto">
                            Somos una empresa gastronómica de origen familiar dedicada a ofrecer comidas rápidas con un sello casero,
                            preparadas con dedicación, ingredientes seleccionados y una atención cercana.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="mb-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gustito-orange to-gustito-green rounded-full mb-4">
                                        <feature.icon size={32} className="text-white" />
                                    </div>
                                    <h3
                                        className="text-xl font-bold text-gustito-dark mb-2"
                                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p className="text-gustito-dark/70">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Story Section */}
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Image */}
                        <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/imagenes/local-gustito.jpeg"
                                alt="Local Gustito"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="space-y-8">
                            <h3
                                className="text-3xl md:text-4xl font-bold text-gustito-dark"
                                style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                            >
                                Nuestra <span className="text-gustito-green">Esencia</span>
                            </h3>
                            
                            <div className="space-y-5 text-lg text-gustito-dark/80">
                                <p>
                                    En <span className="font-semibold text-gustito-orange">El Gustito</span> creemos que una buena 
                                    comida no solo se disfruta por su sabor, sino también por la experiencia que la rodea. Nuestro 
                                    proyecto nace del compromiso por entregar platos simples, pero bien hechos, pensados para quienes 
                                    buscan una opción rica, confiable y accesible en su día a día.
                                </p>
                                <p>
                                    Nos distinguimos por mantener una identidad clara: <span className="font-semibold text-gustito-orange">
                                    preparaciones con sabor casero</span>, <span className="font-semibold text-gustito-green">
                                    atención personalizada</span> y procesos bien ejecutados. Cada sucursal mantiene los mismos 
                                    estándares de calidad y servicio, asegurando una experiencia consistente.
                                </p>
                                <p className="font-semibold text-gustito-dark">
                                    Más que vender comida, buscamos crear un espacio donde las personas se sientan bien atendidas, 
                                    escuchadas y con ganas de volver.
                                </p>
                            </div>
                            
                            {/* Botón para conocer más */}
                            <div className="pt-6 text-center lg:text-left">
                                <Link href="/nosotros">
                                    <motion.button
                                        className="px-8 py-4 bg-gradient-to-r from-gustito-orange to-gustito-green text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Conoce Nuestra Historia Completa →
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* Espaciador derecho */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />
            </div>
        </section>
    );
}

