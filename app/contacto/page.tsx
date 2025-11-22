'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import './contacto.css';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            setFormData({ nombre: '', apellido: '', correo: '', telefono: '', mensaje: '' });
            setCharCount(0);
            setTimeout(() => setSubmitMessage(''), 5000);
        }, 1500);
    };

    return (
        <main className="contacto-page">
            <Navbar dark />
            <div className="pt-24 contacto-container">
                <section className="contacto-hero">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        ¿Tienes alguna duda, sugerencia o comentario? ¡Escríbenos!
                    </motion.h1>
                    <p>Responderemos tu mensaje a la brevedad. También puedes comunicarte directamente con nosotros a través de los siguientes medios.</p>
                </section>

                <section>
                    <div className="contacto-grid">
                        <motion.div
                            className="panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                        >
                            <h2 className="panel-header">Información de contacto</h2>
                            <ul className="contacto-info-list">
                                <li className="contacto-info-item">
                                    <Phone size={22} className="icon" />
                                    <div><strong>+56 9 1234 5678</strong><br /><span style={{ fontSize: '0.75rem', color: '#666' }}>Lun - Dom: 11:00 - 23:00</span></div>
                                </li>
                                <li className="contacto-info-item">
                                    <Mail size={22} className="icon" />
                                    <a href="mailto:contacto@gustito.cl" className="hover:text-gustito-orange">contacto@gustito.cl</a>
                                </li>
                                <li className="contacto-info-item">
                                    <MapPin size={22} className="icon" />
                                    <span>Av. Providencia 1234<br />Santiago, Chile</span>
                                </li>
                                <li className="contacto-info-item">
                                    <Clock size={22} className="icon" />
                                    <span>Tiempo de respuesta promedio: 24-48 hrs hábiles</span>
                                </li>
                            </ul>
                        </motion.div>
                        <motion.div
                            className="panel"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                        >
                            <h2 className="panel-header">Envía tu mensaje</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid two-cols">
                                    <div className="form-group">
                                        <label htmlFor="nombre">Nombre *</label>
                                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ingresa tu nombre" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="apellido">Apellido *</label>
                                        <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required placeholder="Ingresa tu apellido" />
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="correo">Correo electrónico *</label>
                                        <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required placeholder="ejemplo@correo.com" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="telefono">Número de teléfono móvil *</label>
                                        <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="1234567890" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mensaje">Mensaje *</label>
                                        <textarea id="mensaje" name="mensaje" value={formData.mensaje} onChange={handleChange} required rows={6} maxLength={500} placeholder="Escribe tu mensaje aquí..." />
                                        <div className="char-counter">
                                            <span>Máximo 500 caracteres</span>
                                            <span className={charCount > 450 ? 'text-gustito-orange' : ''}>{charCount}/500</span>
                                        </div>
                                    </div>
                                </div>
                                <motion.button type="submit" disabled={isSubmitting} className="submit-btn" whileTap={{ scale: 0.97 }}>
                                    {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                                </motion.button>
                                {submitMessage && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert-success">
                                        {submitMessage}
                                    </motion.div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}


