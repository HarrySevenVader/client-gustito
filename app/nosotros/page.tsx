'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './nosotros.css';

export default function NosotrosPage() {
    return (
        <main className="nosotros-page">
            <Navbar dark />
            
            <div className="pt-24 nosotros-container">
                {/* Hero Section */}
                <section className="nosotros-hero">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Sobre Nosotros
                    </motion.h1>
                    <motion.p
                        className="subtitle"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Conoce la historia, valores y esencia de El Gustito
                    </motion.p>
                </section>

                {/* Quiénes Somos */}
                <motion.section
                    className="content-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className="section-header">
                        <span className="section-icon">🏠</span>
                        Quiénes Somos
                    </h2>
                    <div className="section-content">
                        <p>
                            En <strong>El Gustito</strong> creemos que una buena comida no solo se disfruta por su sabor, 
                            sino también por la experiencia que la rodea. Somos una empresa gastronómica de origen familiar 
                            dedicada a ofrecer comidas rápidas con un sello casero, preparadas con dedicación, ingredientes 
                            seleccionados y una atención cercana.
                        </p>
                        <p>
                            Nuestro proyecto nace del compromiso por entregar platos simples, pero bien hechos, pensados para 
                            quienes buscan una opción rica, confiable y accesible en su día a día. Cada preparación refleja 
                            nuestra convicción de que la calidad y el buen trato marcan la diferencia.
                        </p>
                    </div>
                </motion.section>

                {/* Nuestra Esencia */}
                <motion.section
                    className="content-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h2 className="section-header">
                        <span className="section-icon">✨</span>
                        Nuestra Esencia
                    </h2>
                    <div className="section-content">
                        <p>
                            El Gustito se construye sobre valores claros: 
                            <span className="values-highlight">sabor auténtico</span>,
                            <span className="values-highlight">cercanía con las personas</span> y
                            <span className="values-highlight">respeto por el trabajo bien hecho</span>. 
                            Apostamos por recetas tradicionales, procesos cuidados y una carta que combina clásicos 
                            con opciones que se adaptan a los gustos de nuestros clientes.
                        </p>
                        <p>
                            Más que vender comida, buscamos crear un espacio donde las personas se sientan bien atendidas, 
                            escuchadas y con ganas de volver.
                        </p>
                    </div>
                </motion.section>

                {/* Qué Nos Diferencia */}
                <motion.section
                    className="content-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <h2 className="section-header">
                        <span className="section-icon">🌟</span>
                        Qué Nos Diferencia
                    </h2>
                    <div className="section-content">
                        <p>
                            En un mercado gastronómico competitivo, El Gustito se distingue por mantener una identidad 
                            clara y coherente en cada punto de contacto con el cliente. Nuestro enfoque está en:
                        </p>
                        <ul className="differentiators-list">
                            <li>Preparaciones con sabor casero y porciones generosas</li>
                            <li>Atención amable y personalizada</li>
                            <li>Procesos simples, pero bien ejecutados</li>
                            <li>Cercanía con la comunidad y nuestros clientes</li>
                        </ul>
                        <p>
                            Cada sucursal mantiene los mismos estándares de calidad y servicio, asegurando una experiencia 
                            consistente sin importar la ubicación.
                        </p>
                    </div>
                </motion.section>

                {/* Nuestro Compromiso */}
                <motion.section
                    className="content-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <h2 className="section-header">
                        <span className="section-icon">🤝</span>
                        Nuestro Compromiso
                    </h2>
                    <div className="section-content">
                        <p className="commitment-text">
                            Como empresa, trabajamos constantemente para mejorar y crecer de manera responsable. Nos 
                            esforzamos por fortalecer nuestra marca, optimizar nuestros procesos y adaptarnos a las 
                            nuevas formas de conexión digital, sin perder la esencia que nos caracteriza.
                        </p>
                        <span className="commitment-highlight">
                            El Gustito es un proyecto en evolución, con una mirada puesta en el futuro, pero fiel a 
                            sus raíces: buena comida, buen servicio y una experiencia honesta.
                        </span>
                    </div>
                </motion.section>

                {/* Preguntas Frecuentes */}
                <motion.section
                    className="faq-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <h2 className="faq-header">
                        <span className="faq-icon">❓</span>
                        Preguntas Frecuentes
                    </h2>
                    <div className="faq-list">
                        <div className="faq-item">
                            <div className="faq-question">¿Qué tipo de comida ofrece El Gustito?</div>
                            <div className="faq-answer">
                                Ofrecemos comida rápida con sello casero. Nuestra carta incluye preparaciones tradicionales, 
                                platos abundantes y opciones pensadas para disfrutar en el local o para llevar, siempre 
                                cuidando el sabor y la calidad.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿El Gustito es un restaurante o un local de comida rápida?</div>
                            <div className="faq-answer">
                                Somos un local de comida rápida con enfoque casero. Combinamos la rapidez del servicio con 
                                preparaciones hechas al momento y una atención cercana.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Tienen varias sucursales?</div>
                            <div className="faq-answer">
                                Sí, El Gustito cuenta con distintas sucursales dentro de la Región Metropolitana. Todas 
                                mantienen los mismos estándares de calidad, sabor y atención.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Puedo pedir comida para llevar?</div>
                            <div className="faq-answer">
                                Sí. Todas nuestras preparaciones pueden pedirse para llevar, ideal para quienes buscan 
                                una comida rica y práctica.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Realizan pedidos por WhatsApp o redes sociales?</div>
                            <div className="faq-answer">
                                Sí. Contamos con canales de contacto digitales como WhatsApp e Instagram para consultas, 
                                pedidos y novedades. Nuestro equipo responde de forma rápida y cercana.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Los precios son accesibles?</div>
                            <div className="faq-answer">
                                Sí. Buscamos mantener precios justos y competitivos, ofreciendo porciones generosas y 
                                una excelente relación precio–calidad.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Los productos se preparan en el momento?</div>
                            <div className="faq-answer">
                                Sí. La mayoría de nuestras preparaciones se realizan al momento, priorizando la frescura 
                                y el sabor en cada pedido.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿El Gustito trabaja con recetas propias?</div>
                            <div className="faq-answer">
                                Sí. Nuestra carta se basa en recetas tradicionales y preparaciones desarrolladas internamente, 
                                manteniendo un estilo casero y reconocible.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Atienden eventos o pedidos especiales?</div>
                            <div className="faq-answer">
                                Dependiendo de la disponibilidad y la sucursal, podemos evaluar pedidos especiales. Te 
                                recomendamos contactarnos directamente para coordinar.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Cómo puedo conocer promociones o novedades?</div>
                            <div className="faq-answer">
                                Publicamos nuestras promociones, nuevos productos y horarios especiales a través de nuestras 
                                redes sociales oficiales.
                            </div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">¿Puedo dejar comentarios o sugerencias?</div>
                            <div className="faq-answer">
                                Por supuesto. Valoramos mucho la opinión de nuestros clientes y siempre estamos abiertos 
                                a recibir sugerencias que nos ayuden a mejorar.
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>

            <Footer />
        </main>
    );
}


