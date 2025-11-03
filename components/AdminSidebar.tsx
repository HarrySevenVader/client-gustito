"use client"
import styles from './adminStyles.module.css'
import React from 'react'
import supabase from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Props = { active?: string; onNavigate?: (path: string)=>void }

export default function AdminSidebar({ active = 'inicio', onNavigate }: Props) {
  const router = useRouter()

  const items = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'productos', label: 'Ver productos' },
    { id: 'noticias', label: 'Ver noticias' },
    { id: 'consultas', label: 'Ver consultas' },
    { id: 'sucursales', label: 'Sucursales' },
  ]

  const handleSignOut = async () => {
    try {
      if (supabase) await supabase.auth.signOut()
    } catch (err) { console.warn('signOut error', err) }
    try { localStorage.removeItem('supabase_token') } catch(_) {}
    router.push('/admin/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandLogo}>G</div>
        <div>
          <div className={styles.brandText}>Gustito - Admin</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Panel de control</div>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Navegación administrativa">
        {items.map(it => (
          <div
            key={it.id}
            className={styles.navItem + (it.id === active ? ` ${styles.active}` : '')}
            onClick={() => {
              if (onNavigate) return onNavigate(it.id)
              const path = it.id === 'inicio' ? '/admin/dashboard' : `/admin/dashboard/${it.id}`
              router.push(path)
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') { const path = it.id === 'inicio' ? '/admin/dashboard' : `/admin/dashboard/${it.id}`; router.push(path) } }}
          >
            {it.label}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button onClick={handleSignOut} className={styles.actionBtn} style={{ width: '100%' }}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
