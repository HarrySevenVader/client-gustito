'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface Noticia {
  id_noticia: number;
  titulo: string;
  contenido: string;
  imagen: string | null;
  fecha_publicacion: string;
  fec_actualizacion: string;
  estado: 'activo' | 'inactivo';
}

export default function NoticiaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/noticias/${params.id}`);
        const data = await response.json();

        if (data.ok && data.data) {
          setNoticia(data.data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error al cargar noticia:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNoticia();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main style={{ 
        minHeight: '100vh', 
        background: '#f5f5f5',
        margin: 0,
        padding: 0
      }}>
        <Navbar dark />
        <div style={{ 
          paddingTop: '80px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #FF6B35',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ 
              color: '#666', 
              fontSize: '1rem'
            }}>
              Cargando noticia...
            </p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  if (error || !noticia) {
    return (
      <main style={{ 
        minHeight: '100vh', 
        background: '#f5f5f5',
        margin: 0,
        padding: 0
      }}>
        <Navbar dark />
        <div style={{ 
          paddingTop: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 120px)',
          padding: '40px 20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px'
            }}>
              📰
            </div>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '16px', 
              color: '#2c3e50',
              fontWeight: '700'
            }}>
              Noticia no encontrada
            </h2>
            <p style={{ 
              color: '#666', 
              marginBottom: '30px',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              Lo sentimos, la noticia que buscas no existe o ha sido eliminada.
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 28px',
                background: '#FF6B35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e55a28';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FF6B35';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ArrowLeft size={18} />
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const fechaPublicacion = new Date(noticia.fecha_publicacion).toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  });

  // Validar que fec_actualizacion existe y es válida
  let fechaActualizacion = '';
  let fueActualizada = false;

  if (noticia.fec_actualizacion) {
    const fechaActualizacionDate = new Date(noticia.fec_actualizacion);
    const fechaPublicacionDate = new Date(noticia.fecha_publicacion);
    
    // Verificar que la fecha es válida (no es NaN)
    if (!isNaN(fechaActualizacionDate.getTime()) && fechaActualizacionDate.getFullYear() > 2000) {
      fechaActualizacion = fechaActualizacionDate.toLocaleString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Santiago',
      });

      // Verificar si la noticia fue actualizada (diferencia mayor a 1 minuto)
      fueActualizada = Math.abs(
        fechaActualizacionDate.getTime() - fechaPublicacionDate.getTime()
      ) > 60000;
    }
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#ffffff',
      margin: 0,
      padding: 0,
      width: '100%',
      overflowX: 'hidden'
    }}>
      <Navbar dark />
      
      {/* Imagen Hero - Full Width */}
      {noticia.imagen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ 
            position: 'relative',
            width: '100%',
            height: '70vh',
            minHeight: '500px',
            marginTop: '60px'
          }}
        >
          <Image
            src={noticia.imagen}
            alt={noticia.titulo}
            fill
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            priority
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
          }} />
        </motion.div>
      )}

      {/* Contenido del Artículo - Full Width con padding interno */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          width: '100%',
          background: '#ffffff',
          padding: '60px 20px',
          margin: 0
        }}
      >
        <div style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Botón Volver - Integrado en el contenido */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => router.push('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              color: '#2c3e50',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.borderColor = '#FF6B35';
              e.currentTarget.style.color = '#FF6B35';
              e.currentTarget.style.transform = 'translateX(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.color = '#2c3e50';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            <ArrowLeft size={20} />
            Volver
          </motion.button>

          {/* Metadata */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '24px',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FF6B35'
            }}>
              <Calendar size={18} />
              <span>Publicado: {fechaPublicacion}</span>
            </div>
            {fueActualizada && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#666'
              }}>
                <RefreshCw size={16} />
                <span>Actualizado: {fechaActualizacion}</span>
              </div>
            )}
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            color: '#2c3e50',
            marginBottom: '32px',
            lineHeight: '1.2',
            fontFamily: "'Baloo 2', 'Poppins', sans-serif"
          }}>
            {noticia.titulo}
          </h1>

          {/* Contenido */}
          <div style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: '#4a5568',
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
          }}>
            {noticia.contenido.split('\n').map((parrafo, index) => (
              parrafo.trim() && (
                <p key={index} style={{
                  marginBottom: '1.5rem',
                  textAlign: 'justify'
                }}>
                  {parrafo}
                </p>
              )
            ))}
          </div>
        </div>
      </motion.article>

      {/* CTA Section - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          width: '100%',
          padding: '60px 20px',
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          textAlign: 'center',
          margin: 0
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
            ¿Te gustó esta noticia?
          </h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '28px',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Descubre nuestros deliciosos productos y haz tu pedido
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
    </main>
  );
}
