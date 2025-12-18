# 🔧 FIX: Error al Borrar Noticia - Instrucciones para Frontend

## ❌ Problema Detectado

El frontend está enviando `[object Object]` en lugar del ID numérico de la noticia.

**Error en el backend:**
```
DELETE /api/noticias/[object%20Object] 500
invalid input syntax for type bigint: "[object Object]"
```

---

## ✅ Solución Implementada en Backend

El backend ahora valida que el ID sea un número válido antes de procesar la petición. Si el ID es inválido, retornará:

```json
{
  "ok": false,
  "mensaje": "ID de noticia inválido"
}
```

---

## 🔍 Causa del Problema

El error ocurre cuando el frontend envía un objeto completo en lugar de solo el ID. Por ejemplo:

### ❌ INCORRECTO:
```javascript
// Enviando el objeto completo
await axios.delete(`http://localhost:3000/api/noticias/${noticia}`);
// URL resultante: /api/noticias/[object Object]

// O enviando una propiedad incorrecta
await axios.delete(`http://localhost:3000/api/noticias/${noticia.titulo}`);
// URL resultante: /api/noticias/Título de la noticia
```

### ✅ CORRECTO:
```javascript
// Enviando solo el ID numérico
await axios.delete(`http://localhost:3000/api/noticias/${noticia.id_noticia}`);
// URL resultante: /api/noticias/5
```

---

## 📝 Cómo Corregir en el Frontend

### 1. Verificar que estás usando el campo correcto

El campo que contiene el ID es **`id_noticia`**, NO `id`:

```javascript
// ✅ CORRECTO
const idNoticia = noticia.id_noticia;

// ❌ INCORRECTO
const idNoticia = noticia.id; // Esto podría ser undefined
```

### 2. Borrar una Noticia (Mover a Papelera)

```javascript
async function borrarNoticia(noticiaId) {
  try {
    // Asegurarse de que noticiaId es un número
    const id = parseInt(noticiaId);
    
    if (isNaN(id)) {
      console.error('ID inválido:', noticiaId);
      return;
    }
    
    const response = await axios.delete(`http://localhost:3000/api/noticias/${id}`);
    
    if (response.data.ok) {
      console.log('Noticia borrada:', response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.error('Error al borrar noticia:', error.response?.data || error.message);
    throw error;
  }
}

// USO:
const noticia = { id_noticia: 5, titulo: "...", ... };
await borrarNoticia(noticia.id_noticia); // Pasar solo el ID
```

### 3. Actualizar una Noticia

```javascript
async function actualizarNoticia(noticiaId, datosActualizados) {
  try {
    const id = parseInt(noticiaId);
    
    if (isNaN(id)) {
      console.error('ID inválido:', noticiaId);
      return;
    }
    
    const response = await axios.put(
      `http://localhost:3000/api/noticias/${id}`,
      datosActualizados
    );
    
    if (response.data.ok) {
      console.log('Noticia actualizada:', response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// USO:
await actualizarNoticia(noticia.id_noticia, {
  titulo: 'Nuevo título'
});
```

### 4. Obtener una Noticia por ID

```javascript
async function obtenerNoticia(noticiaId) {
  try {
    const id = parseInt(noticiaId);
    
    if (isNaN(id)) {
      console.error('ID inválido:', noticiaId);
      return;
    }
    
    const response = await axios.get(`http://localhost:3000/api/noticias/${id}`);
    
    if (response.data.ok) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// USO:
const noticia = await obtenerNoticia(5);
```

### 5. Restaurar Noticia

```javascript
async function restaurarNoticia(noticiaId) {
  try {
    const id = parseInt(noticiaId);
    
    if (isNaN(id)) {
      console.error('ID inválido:', noticiaId);
      return;
    }
    
    const response = await axios.post(`http://localhost:3000/api/noticias/${id}/restaurar`);
    
    if (response.data.ok) {
      console.log('Noticia restaurada:', response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// USO:
await restaurarNoticia(noticia.id_noticia);
```

### 6. Eliminar Permanentemente

```javascript
async function eliminarNoticiaPermanente(noticiaId) {
  try {
    const id = parseInt(noticiaId);
    
    if (isNaN(id)) {
      console.error('ID inválido:', noticiaId);
      return;
    }
    
    // Confirmar con el usuario antes de eliminar permanentemente
    if (!confirm('¿Estás seguro? Esta acción es IRREVERSIBLE.')) {
      return;
    }
    
    const response = await axios.delete(`http://localhost:3000/api/noticias/${id}/permanente`);
    
    if (response.data.ok) {
      console.log('Noticia eliminada permanentemente');
      return response.data.data;
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// USO:
await eliminarNoticiaPermanente(noticia.id_noticia);
```

---

## 🎯 Ejemplo Completo en React

```jsx
import { useState } from 'react';
import axios from 'axios';

function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  
  // Obtener todas las noticias
  useEffect(() => {
    obtenerNoticias();
  }, []);
  
  const obtenerNoticias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/noticias');
      if (response.data.ok) {
        setNoticias(response.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Borrar noticia (mover a papelera)
  const handleBorrar = async (noticia) => {
    try {
      // ✅ USAR id_noticia, NO el objeto completo
      const id = noticia.id_noticia;
      
      if (!confirm(`¿Borrar la noticia "${noticia.titulo}"?`)) {
        return;
      }
      
      const response = await axios.delete(`http://localhost:3000/api/noticias/${id}`);
      
      if (response.data.ok) {
        alert('Noticia movida a la papelera');
        obtenerNoticias(); // Recargar lista
      }
    } catch (error) {
      console.error('Error al borrar:', error);
      alert('Error al borrar la noticia');
    }
  };
  
  // Editar noticia
  const handleEditar = async (noticia) => {
    const nuevoTitulo = prompt('Nuevo título:', noticia.titulo);
    
    if (!nuevoTitulo) return;
    
    try {
      // ✅ USAR id_noticia
      const id = noticia.id_noticia;
      
      const response = await axios.put(`http://localhost:3000/api/noticias/${id}`, {
        titulo: nuevoTitulo
      });
      
      if (response.data.ok) {
        alert('Noticia actualizada');
        obtenerNoticias(); // Recargar lista
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar la noticia');
    }
  };
  
  return (
    <div>
      <h1>Administrar Noticias</h1>
      {noticias.map(noticia => (
        <div key={noticia.id_noticia}>
          <h3>{noticia.titulo}</h3>
          <p>{noticia.contenido}</p>
          
          {/* ✅ Pasar solo el ID o la noticia completa, 
              pero dentro de la función usar id_noticia */}
          <button onClick={() => handleEditar(noticia)}>
            Editar
          </button>
          <button onClick={() => handleBorrar(noticia)}>
            Borrar
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🧪 Cómo Probar

### 1. En la consola del navegador:

```javascript
// Obtener todas las noticias
const response = await fetch('http://localhost:3000/api/noticias');
const data = await response.json();
const noticias = data.data;

console.log('Noticias:', noticias);

// Borrar la primera noticia (usa su id_noticia)
const idABorrar = noticias[0].id_noticia;
console.log('ID a borrar:', idABorrar); // Debe ser un número como 5

const deleteResponse = await fetch(`http://localhost:3000/api/noticias/${idABorrar}`, {
  method: 'DELETE'
});

const deleteData = await deleteResponse.json();
console.log('Resultado:', deleteData);
```

### 2. Verificar que el ID sea un número:

```javascript
const noticia = { id_noticia: 5, titulo: "Prueba", ... };

console.log('ID:', noticia.id_noticia); // Debe mostrar: 5
console.log('Tipo:', typeof noticia.id_noticia); // Debe mostrar: "number"

// Construir URL
const url = `http://localhost:3000/api/noticias/${noticia.id_noticia}`;
console.log('URL:', url); // Debe mostrar: http://localhost:3000/api/noticias/5
```

---

## ⚠️ Errores Comunes a Evitar

### 1. ❌ Pasar el objeto completo:
```javascript
// MAL
await axios.delete(`/api/noticias/${noticia}`);
```

### 2. ❌ Usar campo incorrecto:
```javascript
// MAL - "id" no existe
await axios.delete(`/api/noticias/${noticia.id}`);
```

### 3. ❌ Interpolar sin el ID:
```javascript
// MAL
await axios.delete(`/api/noticias/${noticia}`);
```

### 4. ✅ CORRECTO:
```javascript
// BIEN
await axios.delete(`/api/noticias/${noticia.id_noticia}`);
```

---

## 📋 Checklist de Verificación

Antes de hacer commit, verifica:

- [ ] Estás usando `noticia.id_noticia` y NO `noticia.id`
- [ ] Estás pasando solo el número, no el objeto completo
- [ ] Tienes validación para verificar que el ID sea un número
- [ ] Manejas errores correctamente con try/catch
- [ ] Probaste borrar, editar y restaurar noticias

---

## 🔗 Estructura de Respuestas del Backend

### Éxito (200):
```json
{
  "ok": true,
  "mensaje": "Noticia movida a la papelera exitosamente",
  "data": {
    "id_noticia": 5,
    "titulo": "...",
    "estado": "eliminado",
    ...
  }
}
```

### Error - ID Inválido (400):
```json
{
  "ok": false,
  "mensaje": "ID de noticia inválido"
}
```

### Error - Noticia No Encontrada (404):
```json
{
  "ok": false,
  "mensaje": "Noticia no encontrada"
}
```

---

**Resumen:** Usa `noticia.id_noticia` (número) en lugar del objeto completo. El backend ahora valida que sea un número válido antes de procesarlo. 🚀
