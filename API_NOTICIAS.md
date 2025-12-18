# 📰 API de Noticias - Documentación para Frontend

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Modelo de Datos](#modelo-de-datos)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Manejo de Errores](#manejo-de-errores)
6. [Consideraciones Importantes](#consideraciones-importantes)

---

## 📝 Descripción General

La API de noticias permite gestionar un sistema de noticias con las siguientes características:
- ✅ Crear, leer, actualizar y eliminar noticias (CRUD completo)
- ✅ **Límite máximo de 6 noticias** (activas + inactivas)
- ✅ Sistema de papelera (borrado lógico)
- ✅ Estados: `activo`, `inactivo`, `eliminado`
- ✅ Restauración desde papelera
- ✅ Eliminación permanente

**Base URL:** `http://localhost:3000/api/noticias`

---

## 🗂️ Modelo de Datos

### Estructura de una Noticia

```typescript
interface Noticia {
  id_noticia: number;           // ID único (autogenerado)
  titulo: string;               // Título de la noticia (mínimo 5 caracteres)
  contenido: string;            // Contenido completo (mínimo 10 caracteres)
  imagen: string | null;        // URL de la imagen (opcional)
  fecha_publicacion: string;    // ISO timestamp (autogenerado)
  estado: 'activo' | 'inactivo' | 'eliminado'; // Estado actual
  fec_creacion: string;         // ISO timestamp (autogenerado)
  fec_actualizacion: string;    // ISO timestamp (se actualiza automáticamente)
}
```

### Estados Posibles
- **`activo`**: La noticia está visible para el público
- **`inactivo`**: La noticia existe pero no se muestra al público
- **`eliminado`**: La noticia está en la papelera (borrado lógico)

---

## 🔌 Endpoints Disponibles

### 1. 📊 Verificar Límite de Noticias

**GET** `/api/noticias/limite`

Verifica cuántas noticias hay y cuántas se pueden agregar.

**Response:**
```json
{
  "ok": true,
  "data": {
    "total": 4,
    "limite": 6,
    "disponibles": 2,
    "puedeAgregar": true
  }
}
```

---

### 2. 📄 Obtener Todas las Noticias

**GET** `/api/noticias`

Retorna todas las noticias con estado `activo` e `inactivo` (no incluye eliminadas).

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id_noticia": 1,
      "titulo": "Nueva apertura de sucursal",
      "contenido": "Estamos felices de anunciar...",
      "imagen": "https://ejemplo.com/imagen.jpg",
      "fecha_publicacion": "2025-12-18T10:00:00.000Z",
      "estado": "activo",
      "fec_creacion": "2025-12-18T10:00:00.000Z",
      "fec_actualizacion": "2025-12-18T10:00:00.000Z"
    }
  ],
  "total": 4,
  "limite": 6
}
```

---

### 3. ✨ Obtener Noticias Activas (Para Público)

**GET** `/api/noticias/activas`

Retorna solo las noticias con estado `activo` para mostrar al público.

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id_noticia": 1,
      "titulo": "Nueva apertura de sucursal",
      "contenido": "Estamos felices de anunciar...",
      "imagen": "https://ejemplo.com/imagen.jpg",
      "fecha_publicacion": "2025-12-18T10:00:00.000Z",
      "estado": "activo",
      "fec_creacion": "2025-12-18T10:00:00.000Z",
      "fec_actualizacion": "2025-12-18T10:00:00.000Z"
    }
  ],
  "total": 3
}
```

---

### 4. 🔍 Obtener una Noticia por ID

**GET** `/api/noticias/:id`

**Parámetros:**
- `id` (número): ID de la noticia

**Response:**
```json
{
  "ok": true,
  "data": {
    "id_noticia": 1,
    "titulo": "Nueva apertura de sucursal",
    "contenido": "Estamos felices de anunciar...",
    "imagen": "https://ejemplo.com/imagen.jpg",
    "fecha_publicacion": "2025-12-18T10:00:00.000Z",
    "estado": "activo",
    "fec_creacion": "2025-12-18T10:00:00.000Z",
    "fec_actualizacion": "2025-12-18T10:00:00.000Z"
  }
}
```

**Error 404:**
```json
{
  "ok": false,
  "mensaje": "Noticia no encontrada"
}
```

---

### 5. ➕ Crear una Nueva Noticia

**POST** `/api/noticias`

**Body (JSON):**
```json
{
  "titulo": "Título de la noticia",
  "contenido": "Contenido completo de la noticia aquí...",
  "imagen": "https://ejemplo.com/imagen.jpg",  // Opcional
  "estado": "activo"  // Opcional (default: "activo")
}
```

**Validaciones:**
- ✅ `titulo`: Requerido, mínimo 5 caracteres
- ✅ `contenido`: Requerido, mínimo 10 caracteres
- ✅ `imagen`: Opcional, string o null
- ✅ `estado`: Opcional, solo `"activo"` o `"inactivo"`

**Response Success (201):**
```json
{
  "ok": true,
  "mensaje": "Noticia creada exitosamente",
  "data": {
    "id_noticia": 5,
    "titulo": "Título de la noticia",
    "contenido": "Contenido completo de la noticia aquí...",
    "imagen": "https://ejemplo.com/imagen.jpg",
    "fecha_publicacion": "2025-12-18T15:30:00.000Z",
    "estado": "activo",
    "fec_creacion": "2025-12-18T15:30:00.000Z",
    "fec_actualizacion": "2025-12-18T15:30:00.000Z"
  }
}
```

**Error 400 (Límite alcanzado):**
```json
{
  "ok": false,
  "mensaje": "Se ha alcanzado el límite máximo de 6 noticias",
  "limite": 6
}
```

**Error 400 (Validación):**
```json
{
  "ok": false,
  "mensaje": "Faltan campos requeridos: titulo, contenido"
}
```

---

### 6. ✏️ Actualizar una Noticia

**PUT** `/api/noticias/:id`

**Parámetros:**
- `id` (número): ID de la noticia a actualizar

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "titulo": "Nuevo título",
  "contenido": "Nuevo contenido actualizado...",
  "imagen": "https://ejemplo.com/nueva-imagen.jpg",
  "estado": "inactivo"
}
```

**Validaciones:**
- Si se envía `titulo`: mínimo 5 caracteres
- Si se envía `contenido`: mínimo 10 caracteres
- Si se envía `estado`: solo `"activo"` o `"inactivo"`

**Response Success (200):**
```json
{
  "ok": true,
  "mensaje": "Noticia actualizada exitosamente",
  "data": {
    "id_noticia": 5,
    "titulo": "Nuevo título",
    "contenido": "Nuevo contenido actualizado...",
    "imagen": "https://ejemplo.com/nueva-imagen.jpg",
    "fecha_publicacion": "2025-12-18T15:30:00.000Z",
    "estado": "inactivo",
    "fec_creacion": "2025-12-18T15:30:00.000Z",
    "fec_actualizacion": "2025-12-18T16:00:00.000Z"
  }
}
```

---

### 7. 🗑️ Borrar una Noticia (Papelera)

**DELETE** `/api/noticias/:id`

Realiza un borrado lógico (cambia el estado a `eliminado`). La noticia se mueve a la papelera.

**Parámetros:**
- `id` (número): ID de la noticia a borrar

**Response Success (200):**
```json
{
  "ok": true,
  "mensaje": "Noticia movida a la papelera exitosamente",
  "data": {
    "id_noticia": 5,
    "titulo": "Título de la noticia",
    "contenido": "...",
    "imagen": "https://ejemplo.com/imagen.jpg",
    "fecha_publicacion": "2025-12-18T15:30:00.000Z",
    "estado": "eliminado",
    "fec_creacion": "2025-12-18T15:30:00.000Z",
    "fec_actualizacion": "2025-12-18T16:30:00.000Z"
  }
}
```

---

### 8. 📋 Obtener Papelera

**GET** `/api/noticias/papelera`

Retorna todas las noticias con estado `eliminado`.

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id_noticia": 5,
      "titulo": "Noticia eliminada",
      "contenido": "...",
      "imagen": null,
      "fecha_publicacion": "2025-12-18T15:30:00.000Z",
      "estado": "eliminado",
      "fec_creacion": "2025-12-18T15:30:00.000Z",
      "fec_actualizacion": "2025-12-18T16:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

### 9. ♻️ Restaurar Noticia

**POST** `/api/noticias/:id/restaurar`

Restaura una noticia de la papelera (cambia estado de `eliminado` a `activo`).

**Parámetros:**
- `id` (número): ID de la noticia a restaurar

**Response Success (200):**
```json
{
  "ok": true,
  "mensaje": "Noticia restaurada exitosamente",
  "data": {
    "id_noticia": 5,
    "titulo": "Noticia restaurada",
    "contenido": "...",
    "imagen": null,
    "fecha_publicacion": "2025-12-18T15:30:00.000Z",
    "estado": "activo",
    "fec_creacion": "2025-12-18T15:30:00.000Z",
    "fec_actualizacion": "2025-12-18T17:00:00.000Z"
  }
}
```

**Error 400 (Límite alcanzado):**
```json
{
  "ok": false,
  "mensaje": "Se ha alcanzado el límite máximo de 6 noticias. No se puede restaurar.",
  "limite": 6
}
```

---

### 10. ❌ Eliminar Permanentemente

**DELETE** `/api/noticias/:id/permanente`

Elimina permanentemente una noticia de la base de datos. **Esta acción es IRREVERSIBLE**.

**Parámetros:**
- `id` (número): ID de la noticia a eliminar

**Response Success (200):**
```json
{
  "ok": true,
  "mensaje": "Noticia eliminada permanentemente",
  "data": {
    "id_noticia": 5,
    "titulo": "Noticia eliminada",
    // ... resto de campos
  }
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear una noticia con JavaScript (fetch)

```javascript
async function crearNoticia() {
  try {
    const response = await fetch('http://localhost:3000/api/noticias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: 'Gran inauguración',
        contenido: 'Nos complace anunciar la apertura de nuestra nueva sucursal...',
        imagen: 'https://ejemplo.com/inauguracion.jpg',
        estado: 'activo'
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log('Noticia creada:', data.data);
    } else {
      console.error('Error:', data.mensaje);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}
```

### Ejemplo 2: Obtener noticias activas con Axios

```javascript
import axios from 'axios';

async function obtenerNoticiasActivas() {
  try {
    const response = await axios.get('http://localhost:3000/api/noticias/activas');
    
    if (response.data.ok) {
      const noticias = response.data.data;
      console.log(`Total de noticias activas: ${noticias.length}`);
      return noticias;
    }
  } catch (error) {
    console.error('Error al obtener noticias:', error.response?.data || error.message);
  }
}
```

### Ejemplo 3: Actualizar una noticia

```javascript
async function actualizarNoticia(id, datosActualizados) {
  try {
    const response = await fetch(`http://localhost:3000/api/noticias/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosActualizados)
    });

    const data = await response.json();
    
    if (data.ok) {
      console.log('Noticia actualizada:', data.data);
      return data.data;
    } else {
      throw new Error(data.mensaje);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Uso:
actualizarNoticia(1, {
  titulo: 'Título actualizado',
  estado: 'inactivo'
});
```

### Ejemplo 4: Verificar límite antes de crear

```javascript
async function puedeCrearNoticia() {
  try {
    const response = await fetch('http://localhost:3000/api/noticias/limite');
    const data = await response.json();
    
    if (data.ok && data.data.puedeAgregar) {
      console.log(`Puedes agregar ${data.data.disponibles} noticias más`);
      return true;
    } else {
      console.log('Has alcanzado el límite de 6 noticias');
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
```

---

## ⚠️ Manejo de Errores

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Error de validación o límite alcanzado |
| 404 | Noticia no encontrada |
| 500 | Error del servidor |

### Estructura de Respuestas de Error

```json
{
  "ok": false,
  "mensaje": "Descripción del error",
  "error": "Detalle técnico del error (solo en desarrollo)"
}
```

### Errores Comunes

1. **Límite alcanzado al crear:**
```json
{
  "ok": false,
  "mensaje": "Se ha alcanzado el límite máximo de 6 noticias",
  "limite": 6
}
```

2. **Campos requeridos faltantes:**
```json
{
  "ok": false,
  "mensaje": "Faltan campos requeridos: titulo, contenido"
}
```

3. **Validación de longitud:**
```json
{
  "ok": false,
  "mensaje": "El título debe tener al menos 5 caracteres"
}
```

4. **Noticia no encontrada:**
```json
{
  "ok": false,
  "mensaje": "Noticia no encontrada"
}
```

---

## 🎯 Consideraciones Importantes

### 1. Límite de 6 Noticias
- El sistema permite **máximo 6 noticias** con estado `activo` o `inactivo`
- Las noticias `eliminadas` no cuentan para este límite
- Al intentar crear una 7ª noticia, se recibe un error 400
- Al restaurar desde la papelera, se valida nuevamente el límite

### 2. Estados y Visibilidad
- **`activo`**: Visible en `/api/noticias/activas` (para público)
- **`inactivo`**: No visible al público, pero cuenta para el límite
- **`eliminado`**: En papelera, no cuenta para el límite

### 3. Borrado Lógico vs. Permanente
- **Borrado lógico** (`DELETE /api/noticias/:id`): La noticia se mueve a la papelera y puede restaurarse
- **Borrado permanente** (`DELETE /api/noticias/:id/permanente`): La noticia se elimina definitivamente de la base de datos (IRREVERSIBLE)

### 4. Fechas Automáticas
- `fecha_publicacion`: Se asigna al crear la noticia
- `fec_creacion`: Se asigna automáticamente al crear
- `fec_actualizacion`: Se actualiza automáticamente en cada modificación

### 5. Validaciones Importantes
- El título debe tener mínimo 5 caracteres
- El contenido debe tener mínimo 10 caracteres
- El estado solo puede ser `"activo"` o `"inactivo"` (no se puede cambiar manualmente a `"eliminado"`)

### 6. Ordenamiento
- Las noticias se retornan ordenadas por `fecha_publicacion` descendente (más recientes primero)
- La papelera se ordena por `fec_actualizacion` descendente

---

## 🔗 Flujo de Trabajo Recomendado

### Para la Vista de Administración:

```
1. GET /api/noticias/limite
   ↓ Verificar si se pueden agregar más noticias
   
2. GET /api/noticias
   ↓ Mostrar todas las noticias (activas e inactivas)
   
3. POST /api/noticias
   ↓ Crear nueva noticia (si hay espacio disponible)
   
4. PUT /api/noticias/:id
   ↓ Editar noticia existente
   
5. DELETE /api/noticias/:id
   ↓ Mover a papelera
   
6. GET /api/noticias/papelera
   ↓ Ver noticias eliminadas
   
7. POST /api/noticias/:id/restaurar
   ↓ Restaurar desde papelera
   
8. DELETE /api/noticias/:id/permanente
   ↓ Eliminar definitivamente (con confirmación)
```

### Para la Vista Pública:

```
1. GET /api/noticias/activas
   ↓ Mostrar solo noticias activas
   
2. GET /api/noticias/:id
   ↓ Ver detalle de una noticia específica
```

---

## 📞 Contacto y Soporte

Si necesitas ayuda o tienes preguntas sobre la implementación, contacta al equipo de backend.

**Fecha de creación:** 18 de diciembre de 2025  
**Versión:** 1.0.0  
**Backend:** Node.js + Express + Supabase

---

¡Listo para implementar! 🚀
