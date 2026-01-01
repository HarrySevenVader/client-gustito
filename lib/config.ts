/**
 * Configuración centralizada de la API
 * En producción, asegúrate de configurar NEXT_PUBLIC_API_URL en Vercel
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

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
