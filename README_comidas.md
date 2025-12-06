# back-gustito
Servidor dedicado para el sitio web con ExpressJS para las funcionalidades y conexion a la base de datos.

---

# 🎯 Integración de Endpoint de Comidas - Guía para Frontend

## 📡 Endpoint Backend Disponible

**URL:** `POST http://localhost:4000/api/comidas`

**Headers requeridos:**
```
Content-Type: application/json
```

**Body de la petición:**
```json
{
  "nombre_comida": "Pizza Margherita",
  "descripcion": "Pizza con tomate, mozzarella y albahaca",
  "categoria_id": 1,
  "imagen_url": "https://ejemplo.com/pizza.jpg",
  "precio": 8500,
  "activo": true
}
```

**Campos obligatorios:**
- `nombre_comida` (string)
- `descripcion` (string)
- `categoria_id` (number) - Debe existir en la tabla categoria
- `precio` (number) - Debe ser mayor a 0

**Campos opcionales:**
- `imagen_url` (string) - URL de la imagen
- `activo` (boolean) - Por defecto es `true`

---

## 🚀 Tareas para el Agente IA de Frontend

### 1. **Crear formulario de agregar comida**
Necesito que crees un formulario con los siguientes campos:
- Input para `nombre_comida` (texto, requerido)
- Textarea para `descripcion` (texto, requerido)
- Select/Dropdown para `categoria_id` (número, requerido)
  - Deberás obtener las categorías disponibles primero
- Input para `imagen_url` (texto, opcional)
- Input para `precio` (número, requerido, validar > 0)
- Checkbox o toggle para `activo` (opcional, default: true)

### 2. **Implementar validaciones del formulario**
Antes de enviar al backend:
- Validar que todos los campos requeridos estén completos
- Validar que el precio sea un número mayor a 0
- Validar que categoria_id sea un número válido
- Mostrar mensajes de error claros al usuario

### 3. **Conectar con el endpoint**
Implementar la función para enviar datos al backend:

```javascript
const agregarComida = async (formData) => {
  try {
    const response = await fetch('http://localhost:4000/api/comidas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Manejar éxito
      console.log('Comida creada:', data);
      return data;
    } else {
      // Manejar error del servidor
      throw new Error(data.mensaje || 'Error al crear comida');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### 4. **Manejar respuestas del servidor**

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "mensaje": "Comida creada exitosamente",
  "data": {
    "id_comida": 1,
    "nombre_comida": "Pizza Margherita",
    "descripcion": "Pizza con tomate, mozzarella y albahaca",
    "categoria_id": 1,
    "imagen_url": "https://ejemplo.com/pizza.jpg",
    "precio": 8500,
    "activo": true
  }
}
```

**Posibles errores:**
- **400:** Faltan campos requeridos o datos inválidos
- **400:** La categoría especificada no existe
- **500:** Error del servidor

### 5. **UX/UI recomendadas**
- Mostrar un mensaje de éxito cuando la comida se cree correctamente
- Limpiar el formulario después de crear la comida
- Deshabilitar el botón de envío mientras se procesa la petición
- Mostrar indicador de carga durante el envío
- Mostrar errores de validación junto a cada campo
- Si hay error del servidor, mostrar el mensaje en un alert o toast

### 6. **Consideraciones adicionales**

#### CORS:
El backend ya tiene CORS configurado para `http://localhost:3000`. Si tu frontend corre en otro puerto, avísame para ajustarlo.

#### Obtener categorías:
Antes de mostrar el formulario, podrías necesitar obtener la lista de categorías disponibles. Si necesitas un endpoint para listar categorías, avísame y lo agrego al backend.

#### Preview de imagen:
Si implementas el campo de imagen_url, sería bueno mostrar un preview de la imagen antes de enviar el formulario.

---

## 📋 Ejemplo de flujo completo

1. Usuario abre el formulario de "Agregar Comida"
2. Usuario llena los campos del formulario
3. Usuario hace clic en "Guardar" o "Agregar"
4. Frontend valida los datos
5. Frontend envía POST a `http://localhost:4000/api/comidas`
6. Si es exitoso:
   - Mostrar mensaje de éxito
   - Limpiar formulario
   - Opcionalmente: redirigir o actualizar lista de comidas
7. Si hay error:
   - Mostrar mensaje de error específico
   - Mantener los datos del formulario

---

## 🔧 Variables de entorno sugeridas

Si usas variables de entorno, crea un archivo `.env`:
```
VITE_API_URL=http://localhost:4000/api
# o
NEXT_PUBLIC_API_URL=http://localhost:4000/api
# o
REACT_APP_API_URL=http://localhost:4000/api
```

Luego usa: `${API_URL}/comidas`

---

## ✅ Checklist de implementación

- [ ] Crear componente de formulario
- [ ] Implementar campos del formulario
- [ ] Agregar validaciones
- [ ] Implementar función de envío al backend
- [ ] Manejar estados de carga
- [ ] Mostrar mensajes de éxito
- [ ] Mostrar mensajes de error
- [ ] Limpiar formulario después de éxito
- [ ] Probar con datos válidos
- [ ] Probar con datos inválidos
- [ ] Probar manejo de errores de red

---

## 💡 Nota importante

El backend ya está completamente funcional y probado. Solo necesitas implementar la parte visual y la conexión HTTP desde tu frontend. Si necesitas algún endpoint adicional (como listar categorías, listar comidas, etc.), házmelo saber y lo agrego al backend.
