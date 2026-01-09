"use client"
import { useState, useEffect } from 'react'
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
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Verificar si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      // Solo verificar si supabase está configurado
      if (!supabase) return
      
      try {
        // Verificar sesión con Supabase directamente
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          // Si hay error, limpiar cualquier sesión residual
          localStorage.removeItem('supabase_session')
          document.cookie = 'supabase_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
          return
        }
        
        // Si hay sesión válida, redirigir al dashboard
        if (session && session.access_token) {
          router.replace('/admin/dashboard')
        } else {
          // No hay sesión, limpiar residuos
          localStorage.removeItem('supabase_session')
          document.cookie = 'supabase_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
        }
      } catch (error) {
        // Error al verificar, limpiar sesión
        localStorage.removeItem('supabase_session')
        document.cookie = 'supabase_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
      }
    }
    
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsAuthenticating(true)
    setLoading(true)

    const email = username.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(email)) {
      setError('Introduce un correo válido')
      setLoading(false)
      setIsAuthenticating(false)
      // Hacer que el mensaje desaparezca después de 3 segundos
      setTimeout(() => setError(null), 3000)
      return
    }

    if (!supabase) {
      setError('Supabase no está configurado')
      setLoading(false)
      setIsAuthenticating(false)
      setTimeout(() => setError(null), 3000)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        // Diferenciar entre error de credenciales y error del servidor
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('invalid') ||
            error.message.includes('credentials')) {
          setError('Credenciales inválidas')
        } else {
          setError('Credenciales inválidas')
        }
        setLoading(false)
        setIsAuthenticating(false)
        // Hacer que el mensaje desaparezca después de 4 segundos
        setTimeout(() => setError(null), 4000)
        return
      }

      if (!data.session) {
        setError('No se pudo iniciar sesión')
        setLoading(false)
        setIsAuthenticating(false)
        setTimeout(() => setError(null), 4000)
        return
      }

      // Guardar sesión en localStorage
      localStorage.setItem('supabase_session', JSON.stringify(data.session))
      
      // Guardar sesión en cookie para el middleware
      document.cookie = `supabase_session=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 500)
    } catch (err: any) {
      // Si es un error de red o del servidor
      if (err?.message?.includes('fetch') || 
          err?.message?.includes('network') ||
          err?.message?.includes('Failed to fetch')) {
        setError('Servidor caído')
      } else {
        setError('Error inesperado')
      }
      setLoading(false)
      setIsAuthenticating(false)
      // Hacer que el mensaje desaparezca después de 4 segundos
      setTimeout(() => setError(null), 4000)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.brand} style={{ flexDirection: 'column', alignItems: 'center', gap: '4px', marginBottom: '2rem' }}>
        <h3 
          className={styles.title}
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#FF6B35',
            textShadow: '3px 3px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(0,0,0,0.3), 1px -1px 0px rgba(0,0,0,0.3), -1px 1px 0px rgba(0,0,0,0.3)',
            letterSpacing: '0.02em',
            fontFamily: "'Baloo 2', 'Poppins', sans-serif",
            marginBottom: 0
          }}
        >
          Gustito
        </h3>
        <p 
          className={styles.subtitle}
          style={{
            letterSpacing: '0.05em',
            marginTop: '-4px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textAlign: 'center',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Maipú - Talagante - Huechuraba
        </p>
      </div>

      {isAuthenticating ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Usuario</label>
        <input
          className={`${styles.input} ${styles.inputLight}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu correo"
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
      )}
    </div>
  )
}
