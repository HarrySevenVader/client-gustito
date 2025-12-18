# 📋 Instrucciones para Frontend - Integración API Noticias con Fecha/Hora Chile

## ✅ Confirmación: Backend Actualizado

El backend ha sido actualizado y ahora acepta el campo `fecha_publicacion` en formato ISO cuando se crea una noticia. Si no se envía este campo, el backend generará automáticamente la fecha en hora de Chile.

---

## 🔌 Endpoint POST `/api/noticias` - Actualización

### URL:
```
POST http://localhost:3000/api/noticias
```

### Headers:
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON):
```json
{
  "titulo": "Título de la noticia",
  "contenido": "Contenido completo de la noticia...",
  "imagen": "https://ejemplo.com/imagen.jpg",
  "estado": "activo",
  "fecha_publicacion": "2025-12-18T19:40:00.000-03:00"
}
```

### Campos:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `titulo` | string | ✅ Sí | Título de la noticia (mínimo 5 caracteres) |
| `contenido` | string | ✅ Sí | Contenido de la noticia (mínimo 10 caracteres) |
| `imagen` | string | ❌ No | URL de la imagen (opcional) |
| `estado` | string | ❌ No | `"activo"` o `"inactivo"` (default: `"activo"`) |
| `fecha_publicacion` | string | ❌ No | **NUEVO**: Fecha en formato ISO (si no se envía, el backend genera la fecha en hora de Chile) |

---

## 💡 Cómo Implementar en el Frontend

### Opción 1: Enviar la Fecha desde el Frontend (Recomendado)

```javascript
async function crearNoticia(titulo, contenido, imagen, estado) {
  // Generar la fecha actual en hora de Chile
  const fechaChile = new Date().toLocaleString('en-US', { 
    timeZone: 'America/Santiago' 
  });
  
  const fechaISO = new Date(fechaChile).toISOString();
  
  const response = await fetch('http://localhost:3000/api/noticias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titulo,
      contenido,
      imagen,
      estado: estado || 'activo',
      fecha_publicacion: fechaISO // ← Enviar la fecha
    })
  });
  
  return await response.json();
}
```

### Opción 2: Dejar que el Backend Genere la Fecha

Si prefieres que el backend maneje completamente la fecha, simplemente **no envíes** el campo `fecha_publicacion`:

```javascript
async function crearNoticia(titulo, contenido, imagen, estado) {
  const response = await fetch('http://localhost:3000/api/noticias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titulo,
      contenido,
      imagen,
      estado: estado || 'activo'
      // NO incluir fecha_publicacion
    })
  });
  
  return await response.json();
}
```

**El backend generará automáticamente la fecha en hora de Chile.**

---

## 🎯 Recomendación: Usar Opción 2

**Te recomiendo usar la Opción 2** (no enviar `fecha_publicacion`) porque:

✅ El backend ya está configurado para generar fechas en hora de Chile  
✅ Menos código en el frontend  
✅ Consistencia garantizada en todas las fechas  
✅ No hay riesgo de desfase si el dispositivo del usuario tiene hora incorrecta

---

## 📝 Ejemplo Completo con Axios

```javascript
import axios from 'axios';

async function crearNoticia(datosNoticia) {
  try {
    const response = await axios.post('http://localhost:3000/api/noticias', {
      titulo: datosNoticia.titulo,
      contenido: datosNoticia.contenido,
      imagen: datosNoticia.imagen || null,
      estado: datosNoticia.estado || 'activo'
      // No incluimos fecha_publicacion, el backend la genera
    });

    if (response.data.ok) {
      console.log('Noticia creada:', response.data.data);
      console.log('Fecha de publicación:', response.data.data.fecha_publicacion);
      return response.data.data;
    }
  } catch (error) {
    if (error.response?.data?.mensaje) {
      console.error('Error:', error.response.data.mensaje);
    } else {
      console.error('Error al crear noticia:', error.message);
    }
    throw error;
  }
}

// Uso:
await crearNoticia({
  titulo: 'Gran inauguración',
  contenido: 'Nos complace anunciar la apertura de nuestra nueva sucursal en Valparaíso...',
  imagen: 'https://ejemplo.com/imagen.jpg',
  estado: 'activo'
});
```

---

## 📅 Mostrar la Fecha en el Frontend

Cuando recibas la noticia del backend, la fecha vendrá en formato ISO. Para mostrarla correctamente en hora de Chile:

### Ejemplo 1: Formato Completo

```javascript
function formatearFechaChile(fechaISO) {
  return new Date(fechaISO).toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Uso:
const fechaFormateada = formatearFechaChile(noticia.fecha_publicacion);
// Resultado: "18 de diciembre de 2025, 19:40"
```

### Ejemplo 2: Formato Corto

```javascript
function formatearFechaCorta(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Uso:
const fechaCorta = formatearFechaCorta(noticia.fecha_publicacion);
// Resultado: "18/12/2025"
```

### Ejemplo 3: Fecha Relativa (hace X tiempo)

```javascript
function tiempoTranscurrido(fechaISO) {
  const fecha = new Date(fechaISO);
  const ahora = new Date();
  const diferencia = ahora - fecha;
  
  const minutos = Math.floor(diferencia / 60000);
  const horas = Math.floor(diferencia / 3600000);
  const dias = Math.floor(diferencia / 86400000);
  
  if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
  if (dias < 7) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
  
  return new Date(fechaISO).toLocaleDateString('es-CL', {
    timeZone: 'America/Santiago'
  });
}

// Uso:
const tiempo = tiempoTranscurrido(noticia.fecha_publicacion);
// Resultado: "Hace 2 horas" o "Hace 1 día"
```

---

## 🧪 Prueba de Integración

### 1. Crear una noticia de prueba:

```javascript
// En tu consola del navegador o componente React
await crearNoticia({
  titulo: 'Prueba de fecha Chile',
  contenido: 'Verificando que la fecha sea correcta en hora de Chile',
  estado: 'activo'
});
```

### 2. Verificar la respuesta:

```json
{
  "ok": true,
  "mensaje": "Noticia creada exitosamente",
  "data": {
    "id_noticia": 1,
    "titulo": "Prueba de fecha Chile",
    "contenido": "Verificando que la fecha sea correcta en hora de Chile",
    "imagen": null,
    "fecha_publicacion": "2025-12-18T22:40:00.000Z",
    "estado": "activo",
    "fec_creacion": "2025-12-18T22:40:00.000Z",
    "fec_actualizacion": "2025-12-18T22:40:00.000Z"
  }
}
```

### 3. Verificar en el navegador:

```javascript
const noticia = response.data;
console.log('Fecha ISO:', noticia.fecha_publicacion);
console.log('Fecha Chile:', new Date(noticia.fecha_publicacion).toLocaleString('es-CL', {
  timeZone: 'America/Santiago'
}));
```

**Debe mostrar la hora actual de Chile.**

---

## ⚠️ Notas Importantes

1. **No modifiques la fecha manualmente**: El backend ya la maneja correctamente
2. **Usa `timeZone: 'America/Santiago'`** al mostrar fechas en el frontend
3. **El formato ISO que recibes del backend ya tiene el timestamp correcto** de Chile
4. **Si actualizas una noticia**, el campo `fec_actualizacion` se actualiza automáticamente

---

## 🔗 Endpoints Relacionados

Todos estos endpoints devuelven fechas correctas en hora de Chile:

- ✅ `GET /api/noticias` - Obtener todas las noticias
- ✅ `GET /api/noticias/activas` - Obtener noticias activas
- ✅ `GET /api/noticias/:id` - Obtener noticia por ID
- ✅ `POST /api/noticias` - Crear noticia (actualizado)
- ✅ `PUT /api/noticias/:id` - Actualizar noticia
- ✅ `DELETE /api/noticias/:id` - Borrar noticia

---

## 📞 Resumen para Implementar

**Lo que debes hacer:**

1. ✅ **NO envíes el campo `fecha_publicacion`** en el POST (el backend la genera)
2. ✅ Al mostrar fechas, usa `toLocaleString('es-CL', { timeZone: 'America/Santiago' })`
3. ✅ Verifica que las fechas se muestren correctamente en tu interfaz

**Lo que el backend hace automáticamente:**

1. ✅ Genera `fecha_publicacion` en hora de Chile al crear
2. ✅ Actualiza `fec_actualizacion` en hora de Chile al editar
3. ✅ Maneja correctamente la zona horaria `America/Santiago`

---

## ✨ Resultado Esperado

Después de implementar estos cambios:

- ✅ Las noticias se crean con la hora correcta de Chile
- ✅ Las fechas se muestran correctamente en el frontend
- ✅ No hay desfase de 3 horas
- ✅ La hora coincide con la hora real de Chile

---

**Fecha de actualización:** 18 de diciembre de 2025  
**Versión API:** 1.0.1 (con soporte de fecha Chile)  
**Backend:** Node.js + Express + Supabase + Zona horaria America/Santiago

¡Listo para implementar! 🚀
