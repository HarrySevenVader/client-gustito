'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Sucursal {
    name: string;
    address: string;
    phone: string;
    hours: string;
    mapUrl: string;
    embedUrl: string;
    imageUrl: string;
}

const sucursales: Sucursal[] = [
    {
        name: 'Gustito Maipú',
        address: 'Av. El Rosal 4304, 9300925 Maipú, Región Metropolitana',
        phone: '+56 2 2345 6789',
        hours: 'Lun-Vie: 12:00-21:00 | Sáb: 12:30-21:00 | Dom: 12:30-17:00',
        mapUrl: 'https://maps.google.com/?q=Av.+El+Rosal+4304+Maipu+Region+Metropolitana+Chile',
        embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.7!2d-70.7689!3d-33.5207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c37dddddddd%3A0x0!2zQXYuIEVsIFJvc2FsIDQzMDQsIE1haXDDuiwgUmVnacOzbiBNZXRyb3BvbGl0YW5h!5e0!3m2!1ses!2scl!4v1600000000000!5m2!1ses!2scl',
        imageUrl: '/imagenes/Gustito-Maipu.png'
    },
    {
        name: 'Gustito Talagante',
        address: 'Octavio Leiva Opazo 42, 9671017 Talagante, Región Metropolitana',
        phone: '+56 2 2345 6790',
        hours: 'Lun-Vie: 12:00-21:00 | Sáb: 12:30-21:00 | Dom: 12:30-17:00',
        mapUrl: 'https://maps.google.com/?q=Octavio+Leiva+Opazo+42+Talagante+Region+Metropolitana+Chile',
        embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3315.8!2d-70.9256!3d-33.6641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9663089dddddddd%3A0x0!2zT2N0YXZpbyBMZWl2YSBPcGF6byA0MiwgVGFsYWdhbnRlLCBSZWdpw7NuIE1ldHJvcG9saXRhbmE!5e0!3m2!1ses!2scl!4v1600000000000!5m2!1ses!2scl',
        imageUrl: '/imagenes/local-gustito.jpeg'
    },
    {
        name: 'Gustito Huechuraba',
        address: 'Berta Correa 1686, 8600772 Huechuraba, Región Metropolitana',
        phone: '+56 2 2345 6791',
        hours: 'Lun-Vie: 12:00-21:00 | Sáb: 12:30-21:00 | Dom: 12:30-17:00',
        mapUrl: 'https://maps.google.com/?q=Berta+Correa+1686+Huechuraba+Region+Metropolitana+Chile',
        embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3336.9!2d-70.6545!3d-33.3689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5ddddddddd%3A0x0!2zQmVydGEgQ29ycmVhIDE2ODYsIEh1ZWNodXJhYmEsIFJlZ2nDs24gTWV0cm9wb2xpdGFuYQ!5e0!3m2!1ses!2scl!4v1600000000000!5m2!1ses!2scl',
        imageUrl: '/imagenes/Gustito-Huechu.png'
    }
];

export default function SucursalesPage() {
    const router = useRouter();
    
    return (
        <main className="min-h-screen relative">
            {/* Background Image with Dark Overlay */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-black/70"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Navbar dark />

                {/* Spacer for fixed navbar */}
                <div className="h-24"></div>

                {/* Hero Section */}
                <section className="pt-16 pb-16 px-4">
                    <div className="w-full flex flex-col items-center justify-center text-center">
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold text-white mb-6"
                            style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Nuestras Sucursales
                        </motion.h1>
                        <motion.p
                            className="text-xl text-white/90 max-w-2xl"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Visítanos en cualquiera de nuestras ubicaciones y disfruta de las mejores comidas de Santiago!
                        </motion.p>
                    </div>
                </section>

                {/* Spacer before branches */}
                <div className="h-16 w-full bg-transparent"></div>

                {/* Sucursales Grid */}
                <section className="pb-20 px-4">
                    <div className="w-full mx-auto flex flex-col items-center">
                        {sucursales.map((sucursal, index) => (
                            <div key={sucursal.name} className="w-full max-w-[1400px]">
                                <motion.div
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                >
                                    <div className="grid md:grid-cols-[350px_1fr_1fr] gap-0">
                                        {/* Info Section */}
                                        <div className="p-8 md:p-10 flex flex-col justify-center">
                                            <h2 className="text-3xl md:text-4xl font-bold text-gustito-orange mb-6"
                                                style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                                            >
                                                {sucursal.name}
                                            </h2>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <MapPin className="w-6 h-6 text-gustito-green flex-shrink-0 mt-1" />
                                                    <div>
                                                        <h3 className="font-semibold text-gustito-dark mb-1">Dirección</h3>
                                                        <p className="text-gray-600">{sucursal.address}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <Phone className="w-6 h-6 text-gustito-green flex-shrink-0 mt-1" />
                                                    <div>
                                                        <h3 className="font-semibold text-gustito-dark mb-1">Teléfono</h3>
                                                        <a href={`tel:${sucursal.phone.replace(/\s/g, '')}`}
                                                            className="text-gray-600 hover:text-gustito-orange transition-colors">
                                                            {sucursal.phone}
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <Clock className="w-6 h-6 text-gustito-green flex-shrink-0 mt-1" />
                                                    <div>
                                                        <h3 className="font-semibold text-gustito-dark mb-1">Horario</h3>
                                                        <p className="text-gray-600">{sucursal.hours}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <a
                                                href={sucursal.mapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-gustito-orange text-white font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                            >
                                                Abrir en Google Maps
                                            </a>
                                        </div>

                                        {/* Image Section */}
                                        <div className="relative h-[400px] md:h-full min-h-[400px]">
                                            <img
                                                src={sucursal.imageUrl}
                                                alt={`Local ${sucursal.name}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                        </div>

                                        {/* Map Section */}
                                        <div className="relative h-[400px] md:h-full min-h-[400px]">
                                            <iframe
                                                src={sucursal.embedUrl}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen={true}
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                className="absolute inset-0"
                                                title={`Mapa de ${sucursal.name}`}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Spacer between branches */}
                                {index < sucursales.length - 1 && (
                                    <div className="h-20 my-8"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section - Full Width */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                        width: '100%',
                        padding: '40px 20px 60px 20px',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        textAlign: 'center',
                        margin: 0,
                        marginTop: '60px'
                    }}
                >
                    <div style={{
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>
                        <h3 style={{
                            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '16px',
                            fontFamily: "'Baloo 2', 'Poppins', sans-serif"
                        }}>
                            ¿Listo para disfrutar?
                        </h3>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            marginBottom: '28px',
                            fontSize: '1.1rem',
                            lineHeight: '1.6'
                        }}>
                            Visítanos en cualquiera de nuestras sucursales y descubre por qué somos los mejores
                        </p>
                        <button
                            onClick={() => router.push('/menu')}
                            style={{
                                padding: '16px 40px',
                                background: 'white',
                                color: '#FF6B35',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                            }}
                        >
                            Ver nuestro menú 🍽️
                        </button>
                    </div>
                </motion.div>

                <Footer />
            </div>
        </main>
    );
}
