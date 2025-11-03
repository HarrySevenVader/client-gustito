"use client"
import styles from './adminStyles.module.css'
import React, { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminTopbar({ title = 'Panel' }: { title?: string }) {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    if (!supabase) return

    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) return console.warn('supabase getUser error', error)
        if (mounted) setUser(data.user)
      } catch (err) {
        console.warn('supabase getUser failed', err)
      }
    })()

    // listen to auth state changes (optional)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user)
      if (!session) setUser(null)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      if (supabase) await supabase.auth.signOut()
    } catch (err) {
      console.warn('signOut error', err)
    }
    try { localStorage.removeItem('supabase_token') } catch(_) {}
    router.push('/admin/login')
  }

  const displayName = user?.user_metadata?.full_name || user?.email || 'Admin'

  return (
    <div className={styles.topbar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div className={styles.search}>
          <input className={styles.searchInput} placeholder="Buscar..." />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800 }}>{displayName}</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{user ? 'Administrador' : 'Invitado'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={handleSignOut} className={styles.actionBtn} style={{ padding: '8px 10px', borderRadius: 999 }}>Salir</button>
          <div className={styles.avatar}>{displayName?.charAt?.(0) ?? 'A'}</div>
        </div>
      </div>
    </div>
  )
}
