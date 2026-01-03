import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas del dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    // Verificar si existe token de sesión en las cookies
    const session = request.cookies.get('supabase_session');
    
    // Si no hay sesión, redirigir al login
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
