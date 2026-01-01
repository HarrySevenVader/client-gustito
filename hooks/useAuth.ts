"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import supabase from '../lib/supabaseClient'

export function useAuth() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          console.warn('Supabase no disponible')
          setLoading(false)
          return
        }

        const { data, error } = await supabase.auth.getUser()
        
        if (error || !data.user) {
          // No hay usuario autenticado
          setUser(null)
          
          // Si está en una ruta admin (excepto login), redirigir al login
          if (pathname?.startsWith('/admin') && !pathname?.includes('/login')) {
            router.push('/admin/login')
          }
        } else {
          setUser(data.user)
        }
      } catch (err) {
        console.warn('Error verificando autenticación:', err)
        setUser(null)
        
        if (pathname?.startsWith('/admin') && !pathname?.includes('/login')) {
          router.push('/admin/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Escuchar cambios de autenticación
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setUser(null)
            router.push('/admin/login')
          } else if (session?.user) {
            setUser(session.user)
          }
        }
      )

      return () => {
        authListener?.subscription?.unsubscribe()
      }
    }
  }, [router, pathname])

  return { user, loading }
}
