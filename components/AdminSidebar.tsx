"use client"
import styles from './adminStyles.module.css'
import React from 'react'
import supabase from '../lib/supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '../contexts/ThemeContext'

type Props = { active?: string; onNavigate?: (path: string)=>void; isOpen?: boolean; onClose?: () => void }

export default function AdminSidebar({ active, onNavigate, isOpen = false, onClose }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  
  // Determinar la sección activa basándose en la ruta actual
  const getActiveSection = () => {
    if (active) return active; // Si se pasa explícitamente, usarlo
    
    if (pathname === '/admin/dashboard') return 'inicio';
    if (pathname?.includes('/productos')) return 'productos';
    if (pathname?.includes('/noticias')) return 'noticias';
    if (pathname?.includes('/consultas')) return 'consultas';
    
    return ''; // Ninguno activo
  }
  
  const activeSection = getActiveSection()

  const items = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'productos', label: 'Ver productos' },
    { id: 'noticias', label: 'Ver noticias' },
    { id: 'consultas', label: 'Ver consultas' },
  ]

  const handleSignOut = async () => {
    try {
      if (supabase) await supabase.auth.signOut()
    } catch (err) { console.warn('signOut error', err) }
    try { localStorage.removeItem('supabase_token') } catch(_) {}
    router.push('/admin/login')
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className={styles.sidebarOverlay}
          onClick={onClose}
        />
      )}
      
      <aside className={`${styles.sidebar} ${theme === 'dark' ? styles.dark : ''} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.brand}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div 
            className={styles.brandText}
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: '#FF6B35',
              textShadow: '2px 2px 0px rgba(0,0,0,0.2), -1px -1px 0px rgba(0,0,0,0.2), 1px -1px 0px rgba(0,0,0,0.2), -1px 1px 0px rgba(0,0,0,0.2)',
              letterSpacing: '0.02em',
              fontFamily: "'Baloo 2', 'Poppins', sans-serif",
              marginBottom: 0,
              lineHeight: 1
            }}
          >
            Gustito
          </div>
          <div 
            style={{ 
              fontSize: '0.65rem', 
              opacity: 0.9,
              fontWeight: 600,
              letterSpacing: '0.05em',
              fontFamily: "'Poppins', sans-serif",
              marginTop: '-2px',
              textAlign: 'center',
              color: theme === 'dark' ? '#e0e0e0' : '#2d2d2d'
            }}
          >
            Maipú - Talagante - Huechuraba
          </div>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Navegación administrativa">
        {items.map(it => (
          <div
            key={it.id}
            className={styles.navItem + (it.id === activeSection ? ` ${styles.active}` : '')}
            onClick={() => {
              if (onNavigate) return onNavigate(it.id)
              const path = it.id === 'inicio' ? '/admin/dashboard' : `/admin/dashboard/${it.id}`
              router.push(path)
              if (onClose) onClose() // Cerrar sidebar en móvil
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { const path = it.id === 'inicio' ? '/admin/dashboard' : `/admin/dashboard/${it.id}`; router.push(path) } }}
          >
            {it.label}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggle}
          title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </button>
        <button onClick={handleSignOut} className={styles.actionBtn} style={{ width: '100%' }}>
          Cerrar sesión
        </button>
      </div>
    </aside>
    </>
  )
}
