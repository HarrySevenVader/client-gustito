'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './menu.css';
import MenuFilters from '@/components/MenuFilters';
import MenuGrid from '@/components/MenuGrid';
import { MenuFilters as MenuFiltersType, ComidaConPrecio, Comida, Categoria, Sucursal } from '@/types/menu';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PRODUCTOS_POR_PAGINA = 8;

export default function MenuPage() {
    const [filters, setFilters] = useState<MenuFiltersType>({
        categoria_id: null,
        sucursal_id: null,
        search: '',
    });
    const [comidas, setComidas] = useState<Comida[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);

    // Cargar categorías desde el backend
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/categorias');
                const data = await response.json();

                if (data.ok && data.data) {
                    // Transformar datos del backend al formato esperado
                    const categoriasAPI: Categoria[] = data.data.map((cat: any) => ({
                        id: cat.id_categoria,
                        nombre: cat.nombre_categoria,
                    }));
                    setCategorias(categoriasAPI);
                } else {
                    console.error('Error al cargar categorías:', data.mensaje);
                }
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        };

        fetchCategorias();
    }, []);

    // Cargar sucursales desde el backend
    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/sucursales');
                const data = await response.json();

                if (data.ok && data.data) {
                    // Transformar datos del backend al formato esperado
                    const sucursalesAPI: Sucursal[] = data.data.map((suc: any) => ({
                        id: suc.id_sucursal,
                        nombre: suc.nombre_sucursal,
                        direccion: suc.direccion || '',
                        telefono: suc.telefono || '',
                        whatsapp: suc.whatsapp || '',
                    }));
                    setSucursales(sucursalesAPI);
                } else {
                    console.error('Error al cargar sucursales:', data.mensaje);
                }
            } catch (error) {
                console.error('Error al cargar sucursales:', error);
            }
        };

        fetchSucursales();
    }, []);

    // Cargar comidas desde la API del menú (ya incluye filtrado por sucursal si está en filters)
    useEffect(() => {
        const fetchComidas = async () => {
            try {
                setLoading(true);
                
                // 1. Obtener IDs de productos en papelera
                let productosEnPapeleraIds: number[] = [];
                try {
                    const papeleraResponse = await fetch('http://localhost:4000/api/comidas/papelera');
                    const papeleraData = await papeleraResponse.json();
                    if (papeleraData.ok && papeleraData.data) {
                        productosEnPapeleraIds = papeleraData.data.map((p: any) => p.id_comida);
                    }
                } catch (error) {
                    console.error('Error al cargar papelera:', error);
                }
                
                // 2. Obtener todos los productos del menú
                const url = filters.sucursal_id 
                    ? `http://localhost:4000/api/menu?sucursal_id=${filters.sucursal_id}`
                    : 'http://localhost:4000/api/menu';
                
                const response = await fetch(url);
                const data = await response.json();

                if (data.ok && data.data) {
                    // Filtrar productos que NO estén en papelera
                    const comidasAPI: Comida[] = data.data
                        .filter((comida: any) => !productosEnPapeleraIds.includes(comida.id_comida))
                        .map((comida: any) => ({
                            id: comida.id_comida,
                            nombre: comida.nombre_comida,
                            descripcion: comida.descripcion,
                            categoria_id: comida.categoria_id,
                            imagen_url: comida.imagen_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
                            precio: comida.precio_final || comida.precio, // Usar precio_final si existe
                            activo: comida.activo,
                            sucursales: comida.sucursales || [], // Array de IDs de sucursales desde backend
                        }));
                    setComidas(comidasAPI);
                } else {
                    console.error('Error al cargar comidas:', data.mensaje);
                }
            } catch (error) {
                console.error('Error al cargar comidas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComidas();
    }, [filters.sucursal_id]); // Recargar cuando cambia la sucursal seleccionada

    // Filter and process comidas based on current filters (categoria y búsqueda)
    const filteredComidas = useMemo(() => {
        let result = comidas;

        // El filtrado por sucursal ya lo hace el backend, solo filtramos por categoría y búsqueda

        // Filter by categoria
        if (filters.categoria_id) {
            result = result.filter(
                (comida) => comida.categoria_id === filters.categoria_id
            );
        }

        // Filter by search text
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase().trim();
            result = result.filter((comida) =>
                comida.nombre.toLowerCase().includes(searchLower)
            );
        }

        // Map to ComidaConPrecio (el backend ya incluye precio_final)
        const comidasConPrecio: ComidaConPrecio[] = result.map((comida) => {
            const categoria = categorias.find((c) => c.id === comida.categoria_id);
            return {
                ...comida,
                precio_final: comida.precio, // El backend ya devuelve el precio correcto
                observacion: '', // No hay observaciones en la nueva estructura
                categoria_nombre: categoria?.nombre,
                sucursales: comida.sucursales || [], // Incluir sucursales
            };
        });

        return comidasConPrecio;
    }, [comidas, filters.categoria_id, filters.search, categorias]);

    // Resetear a página 1 cuando cambian los filtros
    useEffect(() => {
        setPaginaActual(1);
    }, [filters.categoria_id, filters.sucursal_id, filters.search]);

    // Calcular productos paginados
    const totalPaginas = Math.ceil(filteredComidas.length / PRODUCTOS_POR_PAGINA);
    const indiceFinal = paginaActual * PRODUCTOS_POR_PAGINA;
    const indiceInicial = indiceFinal - PRODUCTOS_POR_PAGINA;
    const comidasPaginadas = filteredComidas.slice(indiceInicial, indiceFinal);

    const handlePaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePaginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <main className="menu-page">
            <Navbar dark />
            <div className="menu-container pt-24">
                <section className="menu-hero">
                    <motion.h1
                        className="text-5xl md:text-6xl"
                        style={{ fontFamily: "'Baloo 2', 'Poppins', sans-serif", color: 'var(--gustito-dark)' }}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Nuestro Menú
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Descubre nuestros deliciosos completos, ensaladas y bebidas
                    </motion.p>
                </section>
                <section className="menu-section">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <MenuFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            categorias={categorias}
                            sucursales={sucursales}
                        />
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ fontSize: '1.1rem', color: 'var(--gustito-dark)' }}>
                                    Cargando menú...
                                </p>
                            </div>
                        ) : (
                            <>
                                <MenuGrid comidas={comidasPaginadas} />
                                {totalPaginas > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="pagination-container"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            marginTop: '2.5rem',
                                            marginBottom: '2rem'
                                        }}
                                    >
                                        <button
                                            onClick={handlePaginaAnterior}
                                            disabled={paginaActual === 1}
                                            className="pagination-arrow"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                border: '2px solid #FF6B35',
                                                background: paginaActual === 1 ? '#f5f5f5' : 'white',
                                                color: paginaActual === 1 ? '#ccc' : '#FF6B35',
                                                cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s ease',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (paginaActual !== 1) {
                                                    e.currentTarget.style.background = '#FF6B35';
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (paginaActual !== 1) {
                                                    e.currentTarget.style.background = 'white';
                                                    e.currentTarget.style.color = '#FF6B35';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }
                                            }}
                                        >
                                            <ChevronLeft size={28} />
                                        </button>
                                        
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '80px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                background: '#FF6B35',
                                                color: 'white',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                padding: '0 1rem',
                                                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                                            }}
                                        >
                                            {paginaActual}
                                        </div>

                                        <button
                                            onClick={handlePaginaSiguiente}
                                            disabled={paginaActual === totalPaginas}
                                            className="pagination-arrow"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                border: '2px solid #FF6B35',
                                                background: paginaActual === totalPaginas ? '#f5f5f5' : 'white',
                                                color: paginaActual === totalPaginas ? '#ccc' : '#FF6B35',
                                                cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s ease',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (paginaActual !== totalPaginas) {
                                                    e.currentTarget.style.background = '#FF6B35';
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (paginaActual !== totalPaginas) {
                                                    e.currentTarget.style.background = 'white';
                                                    e.currentTarget.style.color = '#FF6B35';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }
                                            }}
                                        >
                                            <ChevronRight size={28} />
                                        </button>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </motion.div>
                </section>
            </div>
            <Footer />
        </main>
    );
}


