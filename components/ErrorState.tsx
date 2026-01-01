import React from 'react'
import { AlertCircle, WifiOff } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  type?: 'error' | 'offline' | 'unavailable'
  onRetry?: () => void
}

export default function ErrorState({ 
  message = 'Servicio no disponible', 
  type = 'unavailable',
  onRetry 
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'offline':
        return <WifiOff size={64} />
      case 'error':
        return <AlertCircle size={64} />
      default:
        return <AlertCircle size={64} />
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'offline':
        return 'Sin conexión al servidor'
      case 'error':
        return 'Error al cargar'
      default:
        return 'Servicio no disponible'
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f3f4f6',
      margin: '20px 0'
    }}>
      <div style={{ color: '#9ca3af', marginBottom: '24px' }}>
        {getIcon()}
      </div>
      
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#374151',
        marginBottom: '12px',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        {getTitle()}
      </h3>
      
      <p style={{
        fontSize: '1rem',
        color: '#6b7280',
        marginBottom: '24px',
        maxWidth: '400px'
      }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'linear-gradient(90deg, #10b981, #059669)',
            color: 'white',
            padding: '10px 24px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
