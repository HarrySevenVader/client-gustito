'use client';

import { motion } from 'framer-motion';

export default function ParticleDivider() {
    return (
        <div className="relative overflow-hidden">
            {/* Sección superior con imagen de fondo */}
            <div 
                className="relative h-20 md:h-24 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')`,
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* SVG de borde desgarrado */}
            <div className="relative -mt-1">
                <svg 
                    className="w-full h-16 md:h-20" 
                    viewBox="0 0 1200 120" 
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="tearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 0.3 }} />
                            <stop offset="50%" style={{ stopColor: '#f9fafb', stopOpacity: 0.8 }} />
                            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    
                    {/* Forma irregular tipo desgarre */}
                    <path 
                        d="M0,0 
                           L0,40 
                           C50,35 100,45 150,38 
                           C200,31 250,42 300,36 
                           C350,30 380,48 430,42 
                           C480,36 520,50 570,44 
                           C620,38 660,52 710,45 
                           C760,38 800,50 850,43 
                           C900,36 940,48 990,42 
                           C1040,36 1080,50 1130,44 
                           C1160,40 1180,35 1200,38 
                           L1200,0 Z"
                        fill="url(#tearGradient)"
                        opacity="0.6"
                    />
                    
                    {/* Capa de fondo blanco con borde más desgarrado */}
                    <path 
                        d="M0,20 
                           C60,28 120,15 180,25 
                           C240,35 300,18 360,28 
                           C420,38 480,22 540,32 
                           C600,42 660,25 720,35 
                           C780,45 840,28 900,38 
                           C960,48 1020,32 1080,42 
                           C1120,47 1160,38 1200,45 
                           L1200,120 
                           L0,120 Z"
                        fill="#ffffff"
                    />
                    
                    {/* Pequeños detalles de rotura */}
                    <g opacity="0.4">
                        <path d="M150,35 L155,32 L152,38 Z" fill="#e5e7eb" />
                        <path d="M430,40 L436,37 L432,44 Z" fill="#e5e7eb" />
                        <path d="M710,42 L716,39 L712,46 Z" fill="#e5e7eb" />
                        <path d="M990,40 L996,37 L992,44 Z" fill="#e5e7eb" />
                    </g>
                </svg>
            </div>

            {/* Sección inferior blanca */}
            <div className="bg-white h-8 -mt-1" />
        </div>
    );
}
