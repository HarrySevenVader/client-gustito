'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toastSuccess, toastError } from '@/components/swalHelper';
import './contacto.css';

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        celular: '',
        mensaje: ''
    });
    const [charCount, setCharCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Validación para mensaje
        if (name === 'mensaje') {
            if (value.length <= 500) {
                setFormData(prev => ({ ...prev, [name]: value }));
                setCharCount(value.length);
            }
            return;
        }
        
        // Validación para nombre y apellido: solo letras, espacios y acentos, máximo 30 caracteres
        if (name === 'nombre' || name === 'apellido') {
            const cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            if (cleanValue.length <= 30) {
                setFormData(prev => ({ ...prev, [name]: cleanValue }));
            }
            return;
        }
        
        // Validación para correo: solo caracteres válidos, máximo 70 caracteres
        if (name === 'correo') {
            const cleanValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
            if (cleanValue.length <= 70) {
                setFormData(prev => ({ ...prev, [name]: cleanValue }));
            }
            return;
        }
        
        // Validación para celular: solo números, espacios y el signo +, máximo 13 caracteres con formato
        if (name === 'celular') {
            // Limpiar todo excepto números y +
            const cleanValue = value.replace(/[^0-9+]/g, '');
            
            // Formatear automáticamente: +56 9 1234 5678
            let formatted = cleanValue;
            if (cleanValue.startsWith('+56')) {
                const digits = cleanValue.substring(3); // Obtener dígitos después de +56
                if (digits.length > 0) {
                    formatted = '+56';
                    if (digits.length >= 1) {
                        formatted += ' ' + digits.substring(0, 1); // Agregar el 9
                    }
                    if (digits.length >= 2) {
                        formatted += ' ' + digits.substring(1, 5); // Agregar primeros 4 dígitos
                    }
                    if (digits.length >= 6) {
                        formatted += ' ' + digits.substring(5, 9); // Agregar últimos 4 dígitos
                    }
                }
            } else {
                formatted = cleanValue;
            }
            
            if (formatted.length <= 15) { // +56 9 1234 5678 = 15 caracteres con espacios
                setFormData(prev => ({ ...prev, [name]: formatted }));
            }
            return;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación de campos vacíos
        if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.trim() ||
            !formData.celular.trim() || !formData.mensaje.trim()) {
            toastError('Todos los campos son obligatorios');
            return;
        }

        // Validar longitud de nombre y apellido
        if (formData.nombre.length > 30) {
            toastError('El nombre no puede exceder los 30 caracteres');
            return;
        }
        if (formData.apellido.length > 30) {
            toastError('El apellido no puede exceder los 30 caracteres');
            return;
        }

        // Validar formato de email con dominios permitidos
        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|utem\.cl)$/;
        if (!emailRegex.test(formData.correo)) {
            toastError('Solo se permiten correos @gmail.com o @utem.cl');
            return;
        }

        // Validar longitud del email
        if (formData.correo.length > 70) {
            toastError('El correo no puede exceder los 70 caracteres');
            return;
        }

        // Validar formato de teléfono +56 9 seguido de 8 dígitos
        const phoneRegex = /^\+56\s?9\d{8}$/;
        if (!phoneRegex.test(formData.celular.replace(/\s/g, ''))) {
            toastError('El teléfono debe tener formato +56 9 seguido de 8 números');
            return;
        }

        // Validar longitud del mensaje
        if (formData.mensaje.length > 500) {
            toastError('El mensaje no puede exceder los 500 caracteres');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:4000/api/consultas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                await toastSuccess(data.mensaje || '¡Tu consulta ha sido enviada exitosamente! Te contactaremos pronto.');
                // Limpiar formulario
                setFormData({
                    nombre: '',
                    apellido: '',
                    correo: '',
                    celular: '',
                    mensaje: ''
                });
                setCharCount(0);
            } else {
                toastError(data.mensaje || 'Error al enviar la consulta');
            }
        } catch (error) {
            console.error('Error al enviar consulta:', error);
            toastError('Error al conectar con el servidor. Por favor, intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
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
                                {/* Gustito Maipú */}
                                <li className="contacto-info-item">
                                    <MapPin size={22} className="icon" />
                                    <div>
                                        <strong>Gustito Maipú</strong><br />
                                        <span>Av. El Rosal 4304, Maipú</span><br />
                                        <span style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                            <Phone size={14} />
                                            +56 2 2345 6789
                                        </span>
                                    </div>
                                </li>
                                
                                {/* Gustito Talagante */}
                                <li className="contacto-info-item">
                                    <MapPin size={22} className="icon" />
                                    <div>
                                        <strong>Gustito Talagante</strong><br />
                                        <span>Octavio Leiva Opazo 42, Talagante</span><br />
                                        <span style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                            <Phone size={14} />
                                            +56 2 2345 6790
                                        </span>
                                    </div>
                                </li>
                                
                                {/* Gustito Huechuraba */}
                                <li className="contacto-info-item">
                                    <MapPin size={22} className="icon" />
                                    <div>
                                        <strong>Gustito Huechuraba</strong><br />
                                        <span>Berta Correa 1686, Huechuraba</span><br />
                                        <span style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                            <Phone size={14} />
                                            +56 2 2345 6791
                                        </span>
                                    </div>
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
                                        <input 
                                            type="text" 
                                            id="nombre" 
                                            name="nombre" 
                                            value={formData.nombre} 
                                            onChange={handleChange} 
                                            required 
                                            maxLength={30}
                                            placeholder="Ingresa tu nombre" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="apellido">Apellido *</label>
                                        <input 
                                            type="text" 
                                            id="apellido" 
                                            name="apellido" 
                                            value={formData.apellido} 
                                            onChange={handleChange} 
                                            required 
                                            maxLength={30}
                                            placeholder="Ingresa tu apellido" 
                                        />
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="correo">Correo electrónico *</label>
                                        <input 
                                            type="email" 
                                            id="correo" 
                                            name="correo" 
                                            value={formData.correo} 
                                            onChange={handleChange} 
                                            required 
                                            maxLength={70}
                                            placeholder="ejemplo@gmail.com" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="celular">Número de teléfono móvil * (+56 9 seguido de 8 números)</label>
                                        <input 
                                            type="tel" 
                                            id="celular" 
                                            name="celular" 
                                            value={formData.celular} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="+56 912345678" 
                                        />
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
                            </form>
                        </motion.div>
                    </div>
                </section>
                
                {/* Spacer para separación del footer */}
                <div style={{ paddingBottom: '3rem' }}></div>
            </div>
            <Footer />
        </main>
    );
}
