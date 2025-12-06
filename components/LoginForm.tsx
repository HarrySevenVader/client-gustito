"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './LoginForm.module.css'
import { createClient } from '@supabase/supabase-js'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const email = username.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(email)) {
      setError('Introduce un correo válido')
      setLoading(false)
      return
    }

    if (!supabase) {
      setError('Supabase no está configurado')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        setError(error.message || 'Error en autenticación')
        setLoading(false)
        return
      }

      if (!data.session) {
        setError('No se pudo iniciar sesión')
        setLoading(false)
        return
      }

      // Guardar sesión y redirigir
      localStorage.setItem('supabase_session', JSON.stringify(data.session))
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Error inesperado')
      setLoading(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.brand}>
        <div className={styles.logo}>G</div>
        <div>
          <h3 className={styles.title}>Gustito</h3>
          <p className={styles.subtitle}>Admin portal</p>
        </div>
      </div>

      <div className={styles.topText}>Accede a la administración del sitio</div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Usuario</label>
        <input
          className={`${styles.input} ${styles.inputLight}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu correo o nombre de usuario"
          autoComplete="username"
        />

        <label className={styles.label}>Contraseña</label>
        <div className={styles.pwWrap}>
          <input
            className={`${styles.input} ${styles.inputDark}`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className={styles.eye}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3l18 18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.submit} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className={styles.hint}>Solo administradores. No hay registro ni recuperación.</div>
      </form>
    </div>
  )
}
