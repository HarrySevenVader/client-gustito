/**
 * ============================================
 * 🔧 CONFIGURACIÓN DE API
 * ============================================
 * 
 * INSTRUCCIONES PARA CAMBIAR ENTRE DESARROLLO Y PRODUCCIÓN:
 * 
 * 1. Ve al archivo .env.local
 * 2. Comenta/descomenta la URL que quieras usar:
 * 
 *    Para DESARROLLO:
 *    NEXT_PUBLIC_API_URL=http://localhost:4000
 *    # NEXT_PUBLIC_API_URL=https://back-gustito-926848134800.us-central1.run.app
 * 
 *    Para PRODUCCIÓN:
 *    # NEXT_PUBLIC_API_URL=http://localhost:4000
 *    NEXT_PUBLIC_API_URL=https://back-gustito-926848134800.us-central1.run.app
 * 
 * 3. Reinicia el servidor de desarrollo (Ctrl+C y npm run dev)
 * ============================================
 */

// Configuración de URLs
// ✅ MODO DESARROLLO (localhost)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// ❌ MODO PRODUCCIÓN (Google Cloud Run) - Usar .env.local
// export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://back-gustito-926848134800.us-central1.run.app'

// Información de la API actual
console.log('🌐 API URL configurada:', API_URL)

/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
  comidas: `${API_URL}/api/comidas`,
  categorias: `${API_URL}/api/categorias`,
  sucursales: `${API_URL}/api/sucursales`,
  noticias: `${API_URL}/api/noticias`,
  consultas: `${API_URL}/api/consultas`,
  menu: `${API_URL}/api/menu`,
}
