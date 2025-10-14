'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
    dark?: boolean;
}

export default function Navbar({ dark = false }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (dark) return; // No scroll effect for dark navbar

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [dark]);

    const navLinks = [
        { name: 'Menú', href: '/menu' },
        { name: 'Sucursales', href: '/sucursales' },
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Contacto', href: '/contacto' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${dark
                    ? 'bg-gustito-dark shadow-lg'
                    : isScrolled
                        ? 'bg-white shadow-lg'
                        : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <motion.h1
                            className={`text-3xl font-bold transition-colors duration-300 ${dark
                                    ? 'text-gustito-orange'
                                    : isScrolled
                                        ? 'text-gustito-orange'
                                        : 'text-white'
                                }`}
                            style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif" }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Gustito
                        </motion.h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link, index) => (
                            <Link key={link.name} href={link.href}>
                                <motion.span
                                    className={`text-lg font-medium transition-colors duration-300 hover:text-gustito-orange px-2 cursor-pointer ${dark
                                            ? 'text-white'
                                            : isScrolled
                                                ? 'text-gustito-dark'
                                                : 'text-white'
                                        }`}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {link.name}
                                </motion.span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${dark
                                ? 'text-white hover:bg-white/10'
                                : isScrolled
                                    ? 'text-gustito-dark hover:bg-gray-100'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white shadow-lg overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block text-lg font-medium text-gustito-dark hover:text-gustito-orange transition-colors duration-300 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

