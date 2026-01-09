"use client"
import styles from './adminStyles.module.css'
import React, { useEffect, useState, useRef } from 'react'
import supabase from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useTheme } from '../contexts/ThemeContext'
import { API_URL } from '../lib/config'

interface SearchResult {
  id: number
  type: 'producto' | 'consulta'
  title: string
  subtitle: string
  route: string
}

export default function AdminTopbar({ title = 'Panel', onMenuClick }: { title?: string; onMenuClick?: () => void }) {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    let mounted = true
    if (!supabase) return

    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
          // Si hay error de refresh token, limpiar sesión
          if (error.message?.includes('refresh') || error.message?.includes('token')) {
            await supabase.auth.signOut()
            localStorage.removeItem('supabase_session')
          }
          console.warn('supabase getUser error', error)
          return
        }
        if (mounted) setUser(data.user)
      } catch (err) {
        console.warn('supabase getUser failed', err)
      }
    })()

    // listen to auth state changes (optional)
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) setUser(session.user)
      if (!session) {
        setUser(null)
        // Limpiar localStorage si no hay sesión
        localStorage.removeItem('supabase_session')
      }
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Buscar cuando cambia el query
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300) // Debounce de 300ms

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    const results: SearchResult[] = []

    try {
      // Buscar productos
      const productosResponse = await fetch(`${API_URL}/api/comidas`)
      if (productosResponse.ok) {
        const productosData = await productosResponse.json()
        if (productosData.ok && productosData.data) {
          const productosFiltrados = productosData.data
            .filter((producto: any) => 
              !producto.en_papelera && 
              (producto.nombre?.toLowerCase().includes(query.toLowerCase()) ||
               producto.descripcion?.toLowerCase().includes(query.toLowerCase()))
            )
            .slice(0, 5) // Limitar a 5 resultados
            .map((producto: any) => ({
              id: producto.id_comida,
              type: 'producto' as const,
              title: producto.nombre,
              subtitle: producto.descripcion?.substring(0, 50) + '...' || 'Sin descripción',
              route: '/admin/dashboard/productos'
            }))
          results.push(...productosFiltrados)
        }
      }

      // Buscar consultas
      const consultasResponse = await fetch(`${API_URL}/api/consultas`)
      if (consultasResponse.ok) {
        const consultasData = await consultasResponse.json()
        if (consultasData.ok && consultasData.data) {
          const consultasFiltradas = consultasData.data
            .filter((consulta: any) =>
              consulta.nombre?.toLowerCase().includes(query.toLowerCase()) ||
              consulta.apellido?.toLowerCase().includes(query.toLowerCase()) ||
              consulta.correo?.toLowerCase().includes(query.toLowerCase()) ||
              consulta.mensaje?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5) // Limitar a 5 resultados
            .map((consulta: any) => ({
              id: consulta.id_consulta,
              type: 'consulta' as const,
              title: `${consulta.nombre} ${consulta.apellido}`,
              subtitle: consulta.mensaje?.substring(0, 50) + '...' || 'Sin mensaje',
              route: '/admin/dashboard/consultas'
            }))
          results.push(...consultasFiltradas)
        }
      }

      setSearchResults(results)
      setShowResults(true)
    } catch (error) {
      console.error('Error al buscar:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    router.push(result.route)
    setSearchQuery('')
    setShowResults(false)
    setSearchResults([])
  }

  const handleSignOut = async () => {
    try {
      if (supabase) await supabase.auth.signOut()
    } catch (err) {
      console.warn('signOut error', err)
    }
    
    // Limpiar localStorage
    try { 
      localStorage.removeItem('supabase_token')
      localStorage.removeItem('supabase_session')
    } catch(_) {}
    
    // Limpiar cookie del middleware
    document.cookie = 'supabase_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
    
    // Usar replace para evitar loops de redirección
    router.replace('/admin/login')
  }

  const displayName = user?.user_metadata?.full_name || user?.email || 'Admin'

  return (
    <div className={styles.topbar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Botón de menú para móvil */}
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className={styles.menuButton}
            aria-label="Abrir menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
        
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div className={styles.search} ref={searchRef} style={{ position: 'relative' }}>
          <input 
            className={styles.searchInput} 
            placeholder="Buscar productos, consultas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
          />
          
          {/* Dropdown de resultados */}
          {showResults && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`,
              borderRadius: '8px',
              boxShadow: theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1000,
              minWidth: '320px'
            }}>
              {isSearching ? (
                <div style={{ padding: '16px', textAlign: 'center', color: theme === 'dark' ? '#e0e0e0' : '#666' }}>
                  Buscando...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {/* Agrupar resultados por tipo */}
                  {searchResults.filter(r => r.type === 'producto').length > 0 && (
                    <div>
                      <div style={{
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#666',
                        textTransform: 'uppercase',
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`
                      }}>
                        Productos
                      </div>
                      {searchResults
                        .filter(r => r.type === 'producto')
                        .map(result => (
                          <div
                            key={`producto-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`,
                              transition: 'background-color 0.2s',
                              backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : 'white'}
                          >
                            <div style={{ fontWeight: 600, marginBottom: '4px', color: theme === 'dark' ? '#2ecc71' : '#0b5a30' }}>
                              {result.title}
                            </div>
                            <div style={{ fontSize: '13px', color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#666' }}>
                              {result.subtitle}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {searchResults.filter(r => r.type === 'consulta').length > 0 && (
                    <div>
                      <div style={{
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#666',
                        textTransform: 'uppercase',
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`
                      }}>
                        Consultas
                      </div>
                      {searchResults
                        .filter(r => r.type === 'consulta')
                        .map(result => (
                          <div
                            key={`consulta-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            style={{
                              padding: '12px 16px',
                              cursor: 'pointer',
                              borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}`,
                              transition: 'background-color 0.2s',
                              backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e1e1e' : 'white'}
                          >
                            <div style={{ fontWeight: 600, marginBottom: '4px', color: theme === 'dark' ? '#2ecc71' : '#0b5a30' }}>
                              {result.title}
                            </div>
                            <div style={{ fontSize: '13px', color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#666' }}>
                              {result.subtitle}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: theme === 'dark' ? '#e0e0e0' : '#666' }}>
                  No se encontraron resultados
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, color: theme === 'dark' ? '#ffffff' : '#000000' }}>{displayName}</div>
          <div style={{ fontSize: 12, color: theme === 'dark' ? '#ffffff' : 'rgba(0,0,0,0.45)' }}>{user ? 'Administrador' : 'Invitado'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className={styles.avatar}>{displayName?.charAt?.(0) ?? 'A'}</div>
        </div>
      </div>
    </div>
  )
}
