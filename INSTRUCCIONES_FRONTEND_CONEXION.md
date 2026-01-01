# Instrucciones para Conectar el Frontend con el Backend en Google Cloud

## 🌐 URL del Backend en Producción

Tu backend está desplegado y funcionando en:
```
https://back-gustito-926848134800.us-central1.run.app
```

## 📝 Pasos para Configurar el Frontend

### 1. Actualizar la Variable de Entorno

En tu proyecto de frontend (Next.js/React en Vercel), actualiza o crea las siguientes variables de entorno:

**Para desarrollo local** - Archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://back-gustito-926848134800.us-central1.run.app/api
# o si usas REACT_APP
REACT_APP_API_URL=https://back-gustito-926848134800.us-central1.run.app/api
```

**Para producción en Vercel**:
1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto "el-gustito"
3. Ve a Settings → Environment Variables
4. Agrega la variable:
   - **Name:** `NEXT_PUBLIC_API_URL` (o `REACT_APP_API_URL`)
   - **Value:** `https://back-gustito-926848134800.us-central1.run.app/api`
   - **Environment:** Production, Preview, Development (selecciona todos)
5. Haz un nuevo deploy para que tome las variables

### 2. Actualizar el Código del Frontend

Asegúrate de que tu código use la variable de entorno en lugar de URLs hardcodeadas:

**Ejemplo con Next.js/React:**
```javascript
// En lugar de esto:
const API_URL = "http://localhost:4000/api";

// Usa esto:
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Luego en tus llamadas:
const response = await fetch(`${API_URL}/categorias`);
```

**Si usas Axios:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || "http://localhost:4000/api",
  withCredentials: true, // Si usas cookies/sesiones
});

export default api;
```

### 3. Verificar CORS

El backend ya está configurado para aceptar peticiones desde:
- ✅ `http://localhost:3000` (desarrollo)
- ✅ `https://el-gustito.vercel.app` (producción)

Si tienes otros dominios (como preview deployments de Vercel), avísame para agregarlos.

### 4. Probar la Conexión

**Prueba manual desde el navegador:**
```
https://back-gustito-926848134800.us-central1.run.app/api/categorias
https://back-gustito-926848134800.us-central1.run.app/api/sucursales
https://back-gustito-926848134800.us-central1.run.app/api/comidas
https://back-gustito-926848134800.us-central1.run.app/api/noticias
```

**Prueba desde tu código:**
```javascript
// Test simple
fetch('https://back-gustito-926848134800.us-central1.run.app/api/categorias')
  .then(res => res.json())
  .then(data => console.log('Categorías:', data))
  .catch(err => console.error('Error:', err));
```

### 5. Deploy en Vercel

Después de hacer los cambios:

```bash
# Commit tus cambios
git add .
git commit -m "Conectar con backend en Google Cloud Run"
git push origin main

# Vercel hará el deploy automáticamente
# O manualmente:
vercel --prod
```

## 🔧 Endpoints Disponibles

Tu backend expone las siguientes rutas (todas bajo `/api`):

- `GET /api/categorias` - Listar categorías
- `GET /api/comidas` - Listar comidas
- `GET /api/sucursales` - Listar sucursales
- `GET /api/noticias` - Listar noticias
- `GET /api/consultas` - Listar consultas
- `GET /api/menu` - Obtener menú
- `POST /api/comidas` - Crear comida
- `PUT /api/comidas/:id` - Actualizar comida
- `DELETE /api/comidas/:id` - Eliminar comida
- (y todas las demás rutas de tu API)

## 🐛 Solución de Problemas

### Error de CORS
Si recibes errores de CORS desde otros dominios (preview deployments):
- Avísame el dominio para agregarlo al backend

### Error 404
- Verifica que estés usando `/api` en la ruta
- Ejemplo correcto: `https://back-gustito-926848134800.us-central1.run.app/api/categorias`
- Ejemplo incorrecto: `https://back-gustito-926848134800.us-central1.run.app/categorias`

### Error de Conexión
- Verifica que la URL sea exactamente: `https://back-gustito-926848134800.us-central1.run.app/api`
- No olvides el `/api` al final
- Revisa la consola del navegador para más detalles

### Variables de entorno no se actualizan
- En Vercel, después de cambiar variables de entorno, debes hacer un nuevo deploy
- En desarrollo local, reinicia tu servidor después de cambiar `.env.local`

## 📊 Monitoreo

Puedes ver logs y métricas del backend en:
- **Cloud Run Console:** https://console.cloud.google.com/run/detail/us-central1/back-gustito?project=back-gustito-prod
- **Logs:** https://console.cloud.google.com/logs/query?project=back-gustito-prod

## 🔐 Seguridad

- ✅ HTTPS habilitado automáticamente
- ✅ CORS configurado correctamente
- ✅ Variables sensibles (Supabase) configuradas en el servidor
- ⚠️ El API_KEY de Supabase expuesto en el frontend es el `anon` key (público), lo cual es normal

## 📈 Costos

Tu backend está en la capa gratuita de Google Cloud:
- 2 millones de peticiones/mes gratis
- Para tu tráfico actual, debería ser 100% gratis

## 🚀 Próximos Pasos Opcionales

1. **Dominio personalizado:** Configurar `api.tugustito.com` en lugar de la URL larga
2. **Monitoreo:** Configurar alertas para errores
3. **CI/CD:** Automatizar deployments desde GitHub
4. **Preview environments:** Crear ambientes de staging

---

**¿Tienes dudas?** Cualquier error o problema, comparte el mensaje de error completo.
