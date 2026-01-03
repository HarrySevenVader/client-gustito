# 🔧 CONFIGURACIÓN Y CONEXIÓN BACKEND - FRONTEND

## 📋 Resumen
Este documento detalla la configuración necesaria para que el backend funcione correctamente con el frontend Next.js desplegado.

---

## 🌐 CONFIGURACIÓN DE URLs

### Frontend (Next.js)
El frontend usa la variable de entorno:
```env
NEXT_PUBLIC_API_URL=https://cl-gustito-servidor.onrender.com
```

**IMPORTANTE:** La URL NO debe incluir `/api` al final, ya que el código del frontend agrega `/api/` en cada llamada.

### Construcción de URLs en Frontend
Todas las llamadas al backend se construyen así:
```javascript
fetch(`${API_URL}/api/comidas`)      // ✅ Correcto
fetch(`${API_URL}/api/categorias`)   // ✅ Correcto
fetch(`${API_URL}/api/noticias`)     // ✅ Correcto
```

Resultado final:
```
https://cl-gustito-servidor.onrender.com/api/comidas
https://cl-gustito-servidor.onrender.com/api/categorias
https://cl-gustito-servidor.onrender.com/api/noticias
```

---

## 🔑 VARIABLES DE ENTORNO REQUERIDAS EN BACKEND

El backend en **Render** DEBE tener configuradas estas variables de entorno:

### 1. Supabase (Base de Datos)
```env
SUPABASE_URL=https://zwxjzrkivkxiunaynwjp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eGp6cmtpdmt4aXVuYXlud2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjA5ODYsImV4cCI6MjA3NjM5Njk4Nn0.z1js8f1drU5i8eJkkn3oHImBehmjLc1Sr__j-vwfETg
```

### 2. Puerto (Render lo asigna automáticamente)
```env
PORT=4000
```

### 3. CORS - Dominios Permitidos
```env
FRONTEND_URL=https://el-gustito.vercel.app
# O el dominio donde esté desplegado tu frontend
```

---

## 🛣️ RUTAS DE LA API

El backend debe exponer estas rutas bajo el prefijo `/api`:

### Comidas (Productos)
```
GET    /api/comidas              - Listar todas las comidas
GET    /api/comidas/:id          - Obtener comida por ID
POST   /api/comidas              - Crear nueva comida
PUT    /api/comidas/:id          - Actualizar comida
DELETE /api/comidas/:id          - Eliminar comida (mover a papelera)
GET    /api/comidas/papelera     - Listar comidas en papelera
POST   /api/comidas/:id/restaurar - Restaurar comida de papelera
DELETE /api/comidas/:id/permanente - Eliminar permanentemente
```

### Categorías
```
GET    /api/categorias           - Listar todas las categorías
GET    /api/categorias/:id       - Obtener categoría por ID
POST   /api/categorias           - Crear nueva categoría
PUT    /api/categorias/:id       - Actualizar categoría
DELETE /api/categorias/:id       - Eliminar categoría
```

### Sucursales
```
GET    /api/sucursales           - Listar todas las sucursales
GET    /api/sucursales/:id       - Obtener sucursal por ID
POST   /api/sucursales           - Crear nueva sucursal
PUT    /api/sucursales/:id       - Actualizar sucursal
DELETE /api/sucursales/:id       - Eliminar sucursal
```

### Noticias
```
GET    /api/noticias             - Listar todas las noticias
GET    /api/noticias/activas     - Listar noticias activas
GET    /api/noticias/:id         - Obtener noticia por ID
GET    /api/noticias/limite      - Obtener límite de noticias activas
POST   /api/noticias             - Crear nueva noticia
PUT    /api/noticias/:id         - Actualizar noticia
DELETE /api/noticias/:id          - Eliminar noticia (mover a papelera)
GET    /api/noticias/papelera    - Listar noticias en papelera
POST   /api/noticias/:id/restaurar - Restaurar noticia de papelera
DELETE /api/noticias/:id/permanente - Eliminar permanentemente
```

### Consultas (Contacto)
```
GET    /api/consultas            - Listar todas las consultas
GET    /api/consultas/:id        - Obtener consulta por ID
POST   /api/consultas            - Crear nueva consulta
DELETE /api/consultas/:id        - Eliminar consulta
GET    /api/consultas/estadisticas - Estadísticas de consultas
GET    /api/consultas/recientes  - Consultas recientes
```

### Menú
```
GET    /api/menu                 - Obtener menú completo
GET    /api/menu?sucursal_id=X   - Obtener menú por sucursal
```

---

## 🔒 CONFIGURACIÓN DE CORS

El backend debe permitir peticiones desde:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',           // Desarrollo local
    'https://el-gustito.vercel.app',   // Producción Vercel
    'https://cl-gustito-servidor.onrender.com' // Backend mismo
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📦 FORMATO DE RESPUESTAS

Todas las respuestas del backend deben seguir este formato:

### Respuesta Exitosa
```json
{
  "ok": true,
  "data": [...],
  "mensaje": "Operación exitosa"
}
```

### Respuesta de Error
```json
{
  "ok": false,
  "mensaje": "Descripción del error"
}
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### En Render (Backend)
- [ ] Variable `SUPABASE_URL` configurada
- [ ] Variable `SUPABASE_ANON_KEY` configurada
- [ ] Variable `PORT` configurada (o usar la de Render)
- [ ] Variable `FRONTEND_URL` configurada
- [ ] CORS configurado correctamente
- [ ] Todas las rutas con prefijo `/api` funcionando

### En Producción (Frontend)
- [ ] Variable `NEXT_PUBLIC_API_URL` sin `/api` al final
- [ ] Ejemplo: `https://cl-gustito-servidor.onrender.com`

### Pruebas de Conexión
- [ ] Backend responde en: `https://cl-gustito-servidor.onrender.com/api/categorias`
- [ ] Frontend llama correctamente a: `${API_URL}/api/categorias`
- [ ] No hay errores de CORS en la consola
- [ ] No hay errores "Invalid API key" de Supabase
- [ ] No hay errores 404 (doble `/api/api/`)

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### Error: "Invalid API key" (Supabase)
**Causa:** Variables de Supabase no configuradas en Render  
**Solución:** Agregar `SUPABASE_URL` y `SUPABASE_ANON_KEY` en Environment Variables

### Error: 404 en rutas
**Causa:** URL mal formada (`/api/api/...`)  
**Solución:** Verificar que `NEXT_PUBLIC_API_URL` NO tenga `/api` al final

### Error: CORS
**Causa:** Backend no permite el dominio del frontend  
**Solución:** Agregar dominio de Vercel a la lista de orígenes permitidos

### Error: Failed to fetch
**Causa:** Backend no está respondiendo  
**Solución:** Verificar que el servicio en Render esté activo y deployado

---

## 📞 FLUJO DE UNA PETICIÓN COMPLETA

```
1. Usuario hace acción en Frontend
   ↓
2. Frontend construye URL: ${API_URL}/api/comidas
   Resultado: https://cl-gustito-servidor.onrender.com/api/comidas
   ↓
3. Frontend hace fetch() a esa URL
   ↓
4. Backend en Render recibe la petición en /api/comidas
   ↓
5. Backend valida CORS
   ↓
6. Backend consulta Supabase con las credenciales
   ↓
7. Backend devuelve respuesta en formato JSON
   ↓
8. Frontend procesa la respuesta y actualiza la UI
```

---

## 🚀 COMANDOS ÚTILES PARA VERIFICAR

### Probar desde terminal si el backend responde:
```bash
curl https://cl-gustito-servidor.onrender.com/api/categorias
```

### Probar desde navegador:
```
https://cl-gustito-servidor.onrender.com/api/categorias
```

Debe devolver JSON con formato:
```json
{
  "ok": true,
  "data": [...]
}
```

---

## 📝 NOTAS ADICIONALES

1. **Render Cold Starts**: Si el servicio está inactivo, la primera petición puede tardar ~30 segundos
2. **Logs en Render**: Revisar logs para debug en Dashboard → Logs
3. **Health Check**: Considerar agregar endpoint `/health` o `/api/health`
4. **Rate Limiting**: Configurar límites si es necesario
5. **HTTPS**: Render proporciona HTTPS automáticamente

---

## 🔗 URLs DE REFERENCIA

- **Backend Render**: https://cl-gustito-servidor.onrender.com
- **Frontend Vercel**: https://el-gustito.vercel.app
- **Supabase**: https://zwxjzrkivkxiunaynwjp.supabase.co

---

**Última actualización:** 3 de enero de 2026
