'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Clock } from 'lucide-react';

export default function AboutUs() {
    const features = [
        {
            icon: Heart,
            title: 'Hecho con Amor',
            description: 'Cada plato es preparado con ingredientes frescos y mucho cariño, como en casa.',
        },
        {
            icon: Award,
            title: 'Calidad Garantizada',
            description: 'Más de 10 años sirviendo los mejores sabores de Chile a nuestros clientes.',
        },
        {
            icon: Users,
            title: 'Familia Gustito',
            description: 'Un equipo apasionado comprometido con tu satisfacción y felicidad.',
        },
        {
            icon: Clock,
            title: 'Servicio Rápido',
            description: 'Delivery express para que disfrutes tu comida caliente y en el momento perfecto.',
        },
    ];

    return (
        <section className="py-20 bg-white" id="nosotros">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <p className="text-xl text-gustito-dark/70 max-w-3xl mx-auto">
                        Somos una familia chilena dedicada a llevar los auténticos sabores de nuestra tierra a tu mesa.
                        Desde 2014, hemos servido con orgullo comida casera que reconforta el alma.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000&auto=format&fit=crop')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div>
                        <h3
                            className="text-3xl md:text-4xl font-bold text-gustito-dark mb-6"
                            style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        >
                            Nuestra <span className="text-gustito-green">Historia</span>
                        </h3>
                        <div className="space-y-4 text-lg text-gustito-dark/80">
                            <p>
                                Todo comenzó en 2014, cuando la familia Rodríguez decidió compartir las recetas tradicionales
                                que habían pasado de generación en generación. Lo que empezó como un pequeño local en
                                Providencia, hoy se ha convertido en una cadena querida por miles de chilenos.
                            </p>
                            <p>
                                En <span className="font-semibold text-gustito-orange">Gustito</span>, creemos que la comida
                                es más que nutrición: es amor, tradición y comunidad. Cada completo, cada empanada, cada
                                plato que servimos lleva el sello de nuestra pasión por la gastronomía chilena.
                            </p>
                            <p>
                                Hoy, con múltiples sucursales en Santiago, seguimos comprometidos con la calidad, el sabor
                                auténtico y el servicio que nos caracteriza. <span className="font-semibold text-gustito-green">
                                    ¡Gracias por ser parte de la familia Gustito!</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

