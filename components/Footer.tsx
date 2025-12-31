'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter, href: '#', label: 'Twitter' },
    ];

    const quickLinks = [
        { name: 'Menú', href: '#menu' },
        { name: 'Sucursales', href: '#sucursales' },
        { name: 'Nosotros', href: '#nosotros' },
        { name: 'Contacto', href: '#contacto' },
    ];

    return (
        <footer className="bg-gustito-dark text-white relative z-20" id="contacto" style={{ 
            position: 'relative',
            width: '100%',
            marginTop: 'auto'
        }}>
            <div className="w-full flex py-16" style={{ 
                background: '#1a1a1a',
                minHeight: 'fit-content'
            }}>
                {/* Espaciador izquierdo */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />
                
                <div className="flex-1 px-4 sm:px-8 lg:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h3
                            className="text-4xl font-bold text-gustito-orange mb-4"
                            style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                        >
                            Gustito
                        </h3>
                        <p className="text-white/80 mb-6">
                            Sabores auténticos de Chile, preparados con amor y dedicación para tu disfrute.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gustito-orange transition-all duration-300"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="text-xl font-bold mb-6 text-gustito-green">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-white/80 hover:text-gustito-orange transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-gustito-orange transition-all duration-300 mr-0 group-hover:mr-2" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="text-xl font-bold mb-6 text-gustito-green">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Phone size={20} className="text-gustito-orange mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-white/80">+56 9 1234 5678</p>
                                    <p className="text-white/60 text-sm">Lun - Dom: 11:00 - 23:00</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Mail size={20} className="text-gustito-orange mr-3 mt-1 flex-shrink-0" />
                                <a
                                    href="mailto:contacto@gustito.cl"
                                    className="text-white/80 hover:text-gustito-orange transition-colors duration-300"
                                >
                                    contacto@gustito.cl
                                </a>
                            </li>
                            <li className="flex items-start">
                                <MapPin size={20} className="text-gustito-orange mr-3 mt-1 flex-shrink-0" />
                                <p className="text-white/80">
                                    Av. Providencia 1234
                                    <br />
                                    Santiago, Chile
                                </p>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="text-xl font-bold mb-6 text-gustito-green">Horarios</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Clock size={20} className="text-gustito-orange mr-3" />
                                <div>
                                    <p className="font-semibold text-white">Lunes - Viernes</p>
                                    <p className="text-white/80 text-sm">11:00 - 23:00</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock size={20} className="text-gustito-orange mr-3" />
                                <div>
                                    <p className="font-semibold text-white">Sábado - Domingo</p>
                                    <p className="text-white/80 text-sm">12:00 - 00:00</p>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-gustito-orange/20 rounded-xl border border-gustito-orange/30">
                                <p className="text-sm text-white/90">
                                    🎉 <strong>Happy Hour:</strong> Lun-Vie 17:00-19:00
                                    <br />
                                    <span className="text-gustito-green font-semibold">20% OFF</span> en productos seleccionados
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    className="mt-12 pt-8 border-t border-white/10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-white/60 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Gustito. Todos los derechos reservados.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-white/60 hover:text-gustito-orange transition-colors duration-300">
                                Política de Privacidad
                            </a>
                            <a href="#" className="text-white/60 hover:text-gustito-orange transition-colors duration-300">
                                Términos y Condiciones
                            </a>
                        </div>
                    </div>
                </motion.div>
                </div>
                
                {/* Espaciador derecho */}
                <div className="hidden lg:block w-16 xl:w-24 2xl:w-32 flex-shrink-0" />
            </div>
        </footer>
    );
}

