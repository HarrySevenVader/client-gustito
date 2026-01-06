import Link from 'next/link';
import './globals.css';

export default function NotFound() {
  return (
    <html lang="es-CL">
      <head>
        <title>404 - Página no encontrada | Gustito</title>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
      </head>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Logo o ícono */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 mb-6">
                <svg 
                  className="w-16 h-16 text-orange-500"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-4">
                404
              </h1>
            </div>

            {/* Mensaje */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Página no encontrada
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Lo sentimos, la página que buscas no existe o ha sido movida a otra ubicación.
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-3 text-base font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
                Volver al inicio
              </Link>
              
              <Link 
                href="/menu"
                className="inline-flex items-center px-8 py-3 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
                Ver menú
              </Link>
            </div>

            {/* Enlaces adicionales */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">También puedes explorar:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/noticias" className="text-orange-600 hover:text-orange-700 hover:underline">
                  Noticias
                </Link>
                <span className="text-gray-300">•</span>
                <Link href="/nosotros" className="text-orange-600 hover:text-orange-700 hover:underline">
                  Nosotros
                </Link>
                <span className="text-gray-300">•</span>
                <Link href="/sucursales" className="text-orange-600 hover:text-orange-700 hover:underline">
                  Sucursales
                </Link>
                <span className="text-gray-300">•</span>
                <Link href="/contacto" className="text-orange-600 hover:text-orange-700 hover:underline">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
