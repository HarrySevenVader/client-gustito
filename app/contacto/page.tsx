'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        mensaje: ''
    });
    const [charCount, setCharCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'mensaje') {
            if (value.length <= 500) {
                setFormData(prev => ({ ...prev, [name]: value }));
                setCharCount(value.length);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulación de envío (aquí puedes integrar con tu backend)
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            setFormData({
                nombre: '',
                apellido: '',
                correo: '',
                telefono: '',
                mensaje: ''
            });
            setCharCount(0);

            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setSubmitMessage(''), 5000);
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center">
            <Navbar dark />

            {/* Spacer for fixed navbar */}
            <div className="h-24 w-full"></div>

            {/* Hero Section */}
            <section className="pt-8 pb-6 w-full flex justify-center">
                <div className="max-w-3xl w-full px-4">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-gustito-dark mb-4 text-center"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        ¿Tienes alguna duda, sugerencia o comentario? ¡Escríbenos!
                    </motion.h1>
                </div>
            </section>

            {/* Rectangle Section */}
            <div className="w-full h-24 bg-gray-200 mb-8"></div>

            {/* Contact Form Section */}
            <section className="flex-grow pb-12 px-4 w-full flex justify-center">
                <div className="max-w-4xl w-full">
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 md:p-12"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-7">
                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nombre" className="block text-base font-semibold text-gustito-dark mb-2.5">
                                        Nombre <span className="text-gustito-orange">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-gustito-orange focus:outline-none transition-colors duration-300 text-base"
                                        placeholder="Ingresa tu nombre"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="apellido" className="block text-base font-semibold text-gustito-dark mb-2.5">
                                        Apellido <span className="text-gustito-orange">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-gustito-orange focus:outline-none transition-colors duration-300 text-base"
                                        placeholder="Ingresa tu apellido"
                                    />
                                </div>
                            </div>

                            {/* Correo */}
                            <div>
                                <label htmlFor="correo" className="block text-base font-semibold text-gustito-dark mb-2.5">
                                    Correo electrónico <span className="text-gustito-orange">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-gustito-orange focus:outline-none transition-colors duration-300 text-base"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label htmlFor="telefono" className="block text-base font-semibold text-gustito-dark mb-2.5">
                                    Número de teléfono móvil <span className="text-gustito-orange">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-gustito-orange focus:outline-none transition-colors duration-300 text-base"
                                    placeholder="1234567890"
                                />
                            </div>

                            {/* Mensaje */}
                            <div>
                                <label htmlFor="mensaje" className="block text-base font-semibold text-gustito-dark mb-2.5">
                                    Mensaje <span className="text-gustito-orange">*</span>
                                </label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    maxLength={500}
                                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-gustito-orange focus:outline-none transition-colors duration-300 resize-none text-base"
                                    placeholder="Escribe tu mensaje aquí..."
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">
                                        Máximo 500 caracteres
                                    </p>
                                    <p className={`text-sm font-semibold ${charCount > 450 ? 'text-gustito-orange' : 'text-gray-600'}`}>
                                        {charCount}/500
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gustito-orange hover:bg-opacity-90 transform hover:scale-105'
                                    } text-white`}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                            </motion.button>

                            {/* Success Message */}
                            {submitMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gustito-green/10 border-2 border-gustito-green text-gustito-dark px-4 py-3 rounded-lg text-center font-semibold"
                                >
                                    {submitMessage}
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </section>

            <div className="w-full">
                <Footer />
            </div>
        </main>
    );
}


