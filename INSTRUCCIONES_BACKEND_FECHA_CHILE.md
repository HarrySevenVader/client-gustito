# 📋 Instrucciones para Backend - Fecha/Hora de Chile en Noticias

## 🔴 Problema Actual
La fecha y hora de publicación de las noticias no está guardando la hora correcta de Chile. Está guardando la hora UTC o del servidor, causando una diferencia de 3 horas.

**Ejemplo del problema:**
- Hora real de creación: 19:40 (Chile)
- Hora que se muestra: 22:40 (UTC) o 10:40 PM

---

## ✅ Solución Requerida

### 1. Configurar la Base de Datos (PostgreSQL)

En tu archivo principal del servidor o en la conexión a la base de datos, configura la zona horaria:

```javascript
// Al inicio de tu conexión a PostgreSQL
pool.query("SET timezone = 'America/Santiago'");

// O en la configuración del pool:
const pool = new Pool({
  // ... otras configuraciones
  timezone: 'America/Santiago'
});
```

### 2. Modificar el Endpoint POST `/api/noticias`

El frontend ahora envía el campo `fecha_publicacion` en formato ISO. El backend debe recibirlo y usarlo:

```javascript
// ANTES (incorrecto):
router.post('/api/noticias', async (req, res) => {
  const { titulo, contenido, imagen, estado } = req.body;
  
  const query = `
    INSERT INTO noticias (titulo, contenido, imagen, estado)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const values = [titulo, contenido, imagen, estado];
  // ... resto del código
});

// DESPUÉS (correcto):
router.post('/api/noticias', async (req, res) => {
  const { titulo, contenido, imagen, estado, fecha_publicacion } = req.body;
  
  const query = `
    INSERT INTO noticias (titulo, contenido, imagen, estado, fecha_publicacion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const values = [
    titulo, 
    contenido, 
    imagen, 
    estado, 
    fecha_publicacion || new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' })
  ];
  
  // ... resto del código
});
```

### 3. Alternativa: Usar la base de datos directamente

Si prefieres que la base de datos genere la fecha, modifica la tabla:

```sql
-- Opción 1: Modificar la columna existente
ALTER TABLE noticias 
ALTER COLUMN fecha_publicacion 
SET DEFAULT (NOW() AT TIME ZONE 'America/Santiago');

-- Opción 2: Si usas CURRENT_TIMESTAMP
ALTER TABLE noticias 
ALTER COLUMN fecha_publicacion 
SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Santiago');
```

Y en el endpoint, no incluyas `fecha_publicacion` en el INSERT para que use el DEFAULT:

```javascript
router.post('/api/noticias', async (req, res) => {
  const { titulo, contenido, imagen, estado } = req.body;
  
  const query = `
    INSERT INTO noticias (titulo, contenido, imagen, estado)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  
  const values = [titulo, contenido, imagen, estado];
  // ... resto del código
});
```

---

## 🧪 Cómo Verificar que Funciona

1. Crear una noticia nueva desde el panel de administración
2. Verificar en la base de datos:
```sql
SELECT id_noticia, titulo, fecha_publicacion, 
       fecha_publicacion AT TIME ZONE 'America/Santiago' as fecha_chile
FROM noticias 
ORDER BY id_noticia DESC 
LIMIT 1;
```

3. Verificar en el frontend (vista pública de la noticia) que la hora coincida con la hora actual de Chile

---

## 📤 Qué Enviar de Vuelta

Una vez implementada la solución, envía:

1. ✅ El código modificado del endpoint POST `/api/noticias`
2. ✅ La configuración de zona horaria que usaste (opción 1, 2 o 3)
3. ✅ Una prueba creando una noticia y verificando que la hora sea correcta

---

## 🔍 Datos Adicionales

**Zona horaria de Chile:** `America/Santiago`

**Frontend está enviando:**
```json
{
  "titulo": "...",
  "contenido": "...",
  "imagen": "...",
  "estado": "activo",
  "fecha_publicacion": "2025-12-18T19:40:00.000Z"  // ← Fecha en formato ISO
}
```

**Backend debe guardar esta fecha TAL CUAL** o usar la zona horaria configurada si no viene este campo.
