import LoginForm from '@/components/LoginForm'
import './admin.css'

export const metadata = {
  title: 'Login - Gustito',
}

export default function LoginPage() {
  return (
   <main style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr',
  /* Alineamos el contenido al centro (vertical y horizontal) para que quede como en la imagen 2 */
  placeItems: 'center',
        position: 'relative',
        /* ocultar overflow causado por decoraciones absolutas para evitar scroll innecesario */
        overflow: 'hidden',
        // Gradiente de verdes: oscuro -> principal -> lima brillante
        background: `radial-gradient(1200px 600px at 10% 20%, rgba(127,227,58,0.12) 0%, rgba(127,227,58,0.06) 12%, transparent 30%), linear-gradient(120deg, #042018 0%, #063425 35%, #0b6b2f 60%, #a8ff4d 100%)`,
        color: '#fff',
          paddingTop: '0' /* centrar verticalmente sin padding superior extra */
      }}>
        {/* Decoración floral blanca en bordes - SVGs posicionados absolutas */}
        <div style={{ position: 'absolute', left: -20, top: -20, pointerEvents: 'none', opacity: 0.12 }} aria-hidden>
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <circle cx="40" cy="40" r="28" />
              <circle cx="80" cy="20" r="18" />
              <circle cx="20" cy="80" r="14" />
              <circle cx="60" cy="70" r="10" />
            </g>
          </svg>
        </div>

        <div style={{ position: 'absolute', right: -16, top: 18, pointerEvents: 'none', opacity: 0.08 }} aria-hidden>
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <path d="M18 30c18-8 38-10 56-4 6 2 18 8 22 14 6 10 4 26-6 32-12 8-30 4-44 0-16-5-32-16-28-42z" />
              <circle cx="140" cy="20" r="8" />
            </g>
          </svg>
        </div>

        {/* Más decoraciones en el lado derecho: densidad superior a inferior */}
        <div style={{ position: 'absolute', right: 24, top: 40, pointerEvents: 'none', opacity: 0.06 }} aria-hidden>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <circle cx="20" cy="20" r="12" />
              <circle cx="60" cy="10" r="8" />
              <path d="M80 40c8-6 18-8 26-4 6 3 8 12 4 18-6 8-18 10-28 6-12-5-20-18-2-20z" />
            </g>
          </svg>
        </div>

        <div style={{ position: 'absolute', right: 40, top: 140, pointerEvents: 'none', opacity: 0.07 }} aria-hidden>
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <circle cx="130" cy="30" r="10" />
              <path d="M20 100c10-14 30-26 50-20 10 3 20 12 18 22-2 12-14 24-30 26-16 2-36-6-38-28z" />
            </g>
          </svg>
        </div>

        <div style={{ position: 'absolute', right: 6, bottom: 60, pointerEvents: 'none', opacity: 0.05 }} aria-hidden>
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <path d="M80 70c20 2 34 18 36 36 2 12-6 24-18 28-16 6-36-2-46-16-8-12-6-30 8-36 6-3 12-4 20-12z" />
            </g>
          </svg>
        </div>

        {/* Blobs animados adicionales (medio y abajo - lado derecho) */}
        <div className="float float-s1" aria-hidden>
          <svg width="120" height="360" viewBox="0 0 120 360" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <ellipse cx="60" cy="40" rx="42" ry="26" opacity="0.12" />
              <ellipse cx="30" cy="120" rx="28" ry="18" opacity="0.09" />
              <ellipse cx="90" cy="220" rx="36" ry="22" opacity="0.08" />
            </g>
          </svg>
        </div>

        <div className="float float-s2" aria-hidden>
          <svg width="90" height="220" viewBox="0 0 90 220" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <ellipse cx="18" cy="30" rx="14" ry="10" opacity="0.12" />
              <ellipse cx="60" cy="100" rx="20" ry="14" opacity="0.1" />
              <ellipse cx="40" cy="180" rx="24" ry="16" opacity="0.08" />
            </g>
          </svg>
        </div>

        <div className="float float-s3" aria-hidden>
          <svg width="110" height="180" viewBox="0 0 110 180" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <ellipse cx="40" cy="28" rx="26" ry="16" opacity="0.1" />
              <ellipse cx="70" cy="92" rx="30" ry="18" opacity="0.08" />
            </g>
          </svg>
        </div>

        <div className="float float-s4" aria-hidden>
          <svg width="80" height="120" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <ellipse cx="36" cy="18" rx="18" ry="12" opacity="0.11" />
            </g>
          </svg>
        </div>

        <div style={{ position: 'absolute', left: -8, bottom: -12, pointerEvents: 'none', opacity: 0.07 }} aria-hidden>
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <path d="M30 140c6-12 18-22 32-24 14-2 30 4 38 14 6 8 6 20-2 26-10 8-26 6-38 2-12-4-26-8-30-18z" />
              <circle cx="10" cy="170" r="6" />
            </g>
          </svg>
        </div>

        <div style={{ position: 'absolute', right: -28, bottom: 8, pointerEvents: 'none', opacity: 0.06 }} aria-hidden>
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ffffff">
              <circle cx="120" cy="120" r="18" />
              <path d="M100 90c12 6 18 18 16 30-2 10-14 18-26 16-12-2-18-12-16-22 2-10 12-22 26-24z" />
            </g>
          </svg>
        </div>
        <div style={{
          width: '100%',
          maxWidth: 1200,
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '2rem',
          /* asegurar que el contenido (texto y card) esté alineado al centro verticalmente */
          alignItems: 'center'
        }}>
          <div style={{padding: '2rem 1rem'}}>
            <h1 style={{
              fontSize: '4.5rem',
              lineHeight: 1,
              margin: 0,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 6px 24px rgba(0,0,0,0.6)'
            }}>
              Sabores que te dan un
              <div style={{ color: '#7fe33a', fontSize: '5.2rem', marginTop: 8 }}>Gustito</div>
            </h1>

            <p style={{ fontSize: '1.25rem', marginTop: 24, opacity: 0.9 }}>
              Comida casera con un toque único, hecha con amor.
            </p>

            <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
              <button style={{
                background: 'linear-gradient(90deg,#ff6a00,#ff3d00)',
                border: 'none',
                color: 'white',
                padding: '10px 18px',
                borderRadius: 999,
                fontWeight: 700,
                cursor: 'pointer'
              }}>Ver Carta</button>

              <button style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'white',
                padding: '10px 18px',
                borderRadius: 999,
                cursor: 'pointer'
              }}>Sucursales</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  )
}
