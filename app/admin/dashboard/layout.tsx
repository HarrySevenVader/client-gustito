'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticación en el cliente
    const checkAuth = () => {
      const session = localStorage.getItem('supabase_session');
      
      if (!session) {
        // No hay sesión, redirigir al login inmediatamente
        router.replace('/admin/login');
        return;
      }

      try {
        const sessionData = JSON.parse(session);
        const expiresAt = sessionData.expires_at;
        
        // Verificar si la sesión ha expirado
        if (expiresAt && Date.now() / 1000 > expiresAt) {
          localStorage.removeItem('supabase_session');
          document.cookie = 'supabase_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.replace('/admin/login');
        } else {
          // Sesión válida
          setIsAuthenticated(true);
          setIsChecking(false);
        }
      } catch (error) {
        // Si hay error al parsear, limpiar y redirigir
        localStorage.removeItem('supabase_session');
        document.cookie = 'supabase_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  // Mientras verifica la autenticación, mostrar pantalla de carga
  if (isChecking || !isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        zIndex: 9999
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #FF6B35',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
