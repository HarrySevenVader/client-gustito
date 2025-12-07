# 📋 Guía de Integración Frontend - Sistema de Gestión de Comidas

## 🎯 Resumen
El backend proporciona un sistema completo de CRUD para comidas con funcionalidad de papelera (soft delete). Todos los endpoints están funcionando en `http://localhost:4000/api`

---

## 📡 Endpoints Disponibles

### **1. Listar Categorías**
```
GET http://localhost:4000/api/categorias
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id_categoria": 6,
      "nombre_categoria": "Pizzas"
    },
    {
      "id_categoria": 7,
      "nombre_categoria": "Hamburguesas"
    }
  ]
}
```

**Uso:** Para llenar el dropdown/select de categorías en el formulario.

---

### **2. Listar Todas las Comidas Activas**
```
GET http://localhost:4000/api/comidas
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id_comida": 1,
      "nombre_comida": "Pizza Margherita",
      "descripcion": "Pizza con tomate y mozzarella",
      "categoria_id": 6,
      "imagen_url": "https://ejemplo.com/pizza.jpg",
      "precio": 8500,
      "activo": true
    }
  ]
}
```

**Uso:** Para mostrar la lista de comidas disponibles en el menú principal.

---

### **3. Obtener Comida por ID**
```
GET http://localhost:4000/api/comidas/:id
```

**Ejemplo:** `GET http://localhost:4000/api/comidas/1`

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": {
    "id_comida": 1,
    "nombre_comida": "Pizza Margherita",
    "descripcion": "Pizza con tomate y mozzarella",
    "categoria_id": 6,
    "imagen_url": "https://ejemplo.com/pizza.jpg",
    "precio": 8500,
    "activo": true
  }
}
```

**Uso:** Para ver detalles de una comida específica o cargar datos en el formulario de edición.

---

### **4. Crear Nueva Comida**
```
POST http://localhost:4000/api/comidas
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre_comida": "Pizza Napolitana",
  "descripcion": "Pizza con tomate, mozzarella y albahaca fresca",
  "categoria_id": 6,
  "imagen_url": "https://ejemplo.com/napolitana.jpg",
  "precio": 9500,
  "activo": true
}
```

**Campos obligatorios:**
- `nombre_comida` (string)
- `descripcion` (string)
- `categoria_id` (number) - Debe existir en la tabla categorias
- `precio` (number) - Debe ser mayor a 0

**Campos opcionales:**
- `imagen_url` (string)
- `activo` (boolean) - Default: `true`

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "mensaje": "Comida creada exitosamente",
  "data": {
    "id_comida": 2,
    "nombre_comida": "Pizza Napolitana",
    "descripcion": "Pizza con tomate, mozzarella y albahaca fresca",
    "categoria_id": 6,
    "imagen_url": "https://ejemplo.com/napolitana.jpg",
    "precio": 9500,
    "activo": true
  }
}
```

**Errores posibles:**
- `400` - Faltan campos requeridos o datos inválidos
- `400` - La categoría especificada no existe
- `500` - Error del servidor

**Uso:** Para crear nuevas comidas desde el formulario de administración.

---

### **5. Actualizar Comida**
```
PUT http://localhost:4000/api/comidas/:id
```

**Ejemplo:** `PUT http://localhost:4000/api/comidas/1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "nombre_comida": "Pizza Margherita Premium",
  "precio": 10500
}
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Comida actualizada exitosamente",
  "data": {
    "id_comida": 1,
    "nombre_comida": "Pizza Margherita Premium",
    "descripcion": "Pizza con tomate y mozzarella",
    "categoria_id": 6,
    "imagen_url": "https://ejemplo.com/pizza.jpg",
    "precio": 10500,
    "activo": true
  }
}
```

**Errores posibles:**
- `400` - Debe proporcionar al menos un campo para actualizar
- `404` - Comida no encontrada
- `500` - Error del servidor

**Uso:** Para editar información de comidas existentes. Solo envía los campos que quieras actualizar.

---

### **6. Borrar Comida (Mover a Papelera)**
```
DELETE http://localhost:4000/api/comidas/:id
```

**Ejemplo:** `DELETE http://localhost:4000/api/comidas/1`

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Comida movida a la papelera",
  "data": {
    "id_comida": 1,
    "nombre_comida": "Pizza Margherita",
    "descripcion": "Pizza con tomate y mozzarella",
    "categoria_id": 6,
    "imagen_url": "https://ejemplo.com/pizza.jpg",
    "precio": 8500,
    "activo": false
  }
}
```

**Nota importante:** Esta es una eliminación suave (soft delete). La comida NO se elimina de la base de datos, solo se marca como `activo: false`.

**Uso:** Para "eliminar" comidas pero mantenerlas en la papelera por si se arrepiente el usuario.

---

### **7. Ver Papelera (Comidas Eliminadas)**
```
GET http://localhost:4000/api/comidas/papelera
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id_comida": 1,
      "nombre_comida": "Pizza Margherita",
      "descripcion": "Pizza con tomate y mozzarella",
      "categoria_id": 6,
      "imagen_url": "https://ejemplo.com/pizza.jpg",
      "precio": 8500,
      "activo": false
    }
  ]
}
```

**Uso:** Para mostrar una vista de "Papelera" o "Elementos eliminados" donde el usuario puede ver y restaurar comidas.

---

### **8. Restaurar Comida de la Papelera**
```
PATCH http://localhost:4000/api/comidas/:id/restaurar
```

**Ejemplo:** `PATCH http://localhost:4000/api/comidas/1/restaurar`

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Comida restaurada exitosamente",
  "data": {
    "id_comida": 1,
    "nombre_comida": "Pizza Margherita",
    "descripcion": "Pizza con tomate y mozzarella",
    "categoria_id": 6,
    "imagen_url": "https://ejemplo.com/pizza.jpg",
    "precio": 8500,
    "activo": true
  }
}
```

**Uso:** Para restaurar comidas que estaban en la papelera, volviéndolas a activar.

---

### **9. Eliminar Comida Permanentemente**
```
DELETE http://localhost:4000/api/comidas/:id/permanente
```

**Ejemplo:** `DELETE http://localhost:4000/api/comidas/1/permanente`

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Comida eliminada permanentemente"
}
```

**⚠️ ADVERTENCIA:** Esta acción es **irreversible**. La comida se elimina completamente de la base de datos y NO se puede recuperar.

**Uso:** Para vaciar la papelera o eliminar definitivamente comidas que no se necesitan.

---

## 🎨 Sugerencias de Implementación en el Frontend

### **Vista Principal - Lista de Comidas**
1. Al cargar el componente, hacer `GET /api/comidas` para obtener todas las comidas activas
2. Mostrar las comidas en cards/tabla con su información
3. Botones en cada comida:
   - **Editar** → Abre modal/formulario de edición
   - **Eliminar** → Confirma y llama a `DELETE /api/comidas/:id`

### **Formulario de Crear Comida**
1. Al montar el formulario, hacer `GET /api/categorias` para llenar el select de categorías
2. Validar campos obligatorios antes de enviar
3. Al enviar, hacer `POST /api/comidas` con los datos del formulario
4. Si es exitoso:
   - Mostrar mensaje de éxito
   - Limpiar formulario
   - Actualizar lista de comidas
   - Cerrar modal/redirigir

### **Formulario de Editar Comida**
1. Al abrir el formulario, hacer `GET /api/comidas/:id` para cargar los datos actuales
2. Prellenar el formulario con los datos obtenidos
3. Permitir editar cualquier campo
4. Al enviar, hacer `PUT /api/comidas/:id` solo con los campos modificados
5. Actualizar la vista después de la respuesta exitosa

### **Vista de Papelera**
1. Hacer `GET /api/comidas/papelera` para obtener comidas eliminadas
2. Mostrar lista de comidas inactivas
3. Botones por cada comida:
   - **Restaurar** → Llama a `PATCH /api/comidas/:id/restaurar`
   - **Eliminar Permanentemente** → Confirma y llama a `DELETE /api/comidas/:id/permanente`
4. Mostrar advertencia antes de eliminar permanentemente

### **Manejo de Estados**
```javascript
// Estados sugeridos para el componente
const [comidas, setComidas] = useState([]);
const [categorias, setCategorias] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### **Ejemplo de Función para Crear Comida**
```javascript
const crearComida = async (formData) => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost:4000/api/comidas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Éxito
      mostrarMensajeExito(data.mensaje);
      actualizarListaComidas();
      limpiarFormulario();
    } else {
      // Error del servidor
      mostrarMensajeError(data.mensaje);
    }
  } catch (error) {
    // Error de red
    mostrarMensajeError('Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
};
```

### **Ejemplo de Función para Actualizar Comida**
```javascript
const actualizarComida = async (id, datosActualizados) => {
  try {
    setLoading(true);
    const response = await fetch(`http://localhost:4000/api/comidas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosActualizados)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      mostrarMensajeExito(data.mensaje);
      actualizarListaComidas();
    } else {
      mostrarMensajeError(data.mensaje);
    }
  } catch (error) {
    mostrarMensajeError('Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
};
```

### **Ejemplo de Función para Borrar Comida**
```javascript
const borrarComida = async (id) => {
  // Confirmar antes de borrar
  if (!confirm('¿Estás seguro de mover esta comida a la papelera?')) {
    return;
  }
  
  try {
    setLoading(true);
    const response = await fetch(`http://localhost:4000/api/comidas/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      mostrarMensajeExito(data.mensaje);
      actualizarListaComidas();
    } else {
      mostrarMensajeError(data.mensaje);
    }
  } catch (error) {
    mostrarMensajeError('Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
};
```

---

## 🔧 Configuración

### **Variables de Entorno**
Crea un archivo `.env` en tu proyecto frontend:

```env
# Para React
REACT_APP_API_URL=http://localhost:4000/api

# Para Next.js
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Para Vite
VITE_API_URL=http://localhost:4000/api
```

Luego úsalo en tu código:
```javascript
const API_URL = process.env.REACT_APP_API_URL; // React
const API_URL = process.env.NEXT_PUBLIC_API_URL; // Next.js
const API_URL = import.meta.env.VITE_API_URL; // Vite
```

### **CORS**
El backend ya tiene CORS configurado para `http://localhost:3000`. Si tu frontend corre en otro puerto, avísame para ajustarlo.

---

## ✅ Checklist de Implementación

### **Funcionalidad Básica**
- [ ] Crear vista para listar comidas activas
- [ ] Implementar formulario para crear comida
- [ ] Implementar formulario para editar comida
- [ ] Agregar botón de eliminar con confirmación
- [ ] Cargar categorías en el select del formulario

### **Funcionalidad de Papelera**
- [ ] Crear vista de papelera
- [ ] Mostrar comidas eliminadas
- [ ] Implementar botón de restaurar
- [ ] Implementar eliminación permanente con doble confirmación

### **UX/UI**
- [ ] Mostrar indicadores de carga durante las peticiones
- [ ] Mostrar mensajes de éxito
- [ ] Mostrar mensajes de error
- [ ] Validar formularios antes de enviar
- [ ] Deshabilitar botones durante las peticiones
- [ ] Actualizar vistas después de operaciones exitosas

### **Validaciones**
- [ ] Validar campos obligatorios
- [ ] Validar que el precio sea mayor a 0
- [ ] Validar formato de URL de imagen (opcional)
- [ ] Mostrar errores de validación junto a cada campo

---

## 💡 Notas Importantes

1. **El backend ya está 100% funcional** - Solo necesitas consumir los endpoints desde el frontend
2. **Soft Delete** - Las comidas eliminadas NO se borran, solo se marcan como inactivas
3. **Restauración** - Siempre puedes recuperar comidas de la papelera
4. **Eliminación permanente** - Úsala solo cuando estés completamente seguro
5. **CORS configurado** - El backend acepta peticiones desde `http://localhost:3000`
6. **Mantén el servidor corriendo** - Ejecuta `npm run dev` en el backend mientras desarrollas

---

## 🚀 Para Empezar

1. Asegúrate de que el backend esté corriendo: `npm run dev` en el proyecto backend
2. Verifica que el servidor responda: `http://localhost:4000/api/categorias`
3. Implementa primero la funcionalidad básica (listar y crear)
4. Luego agrega edición y eliminación
5. Finalmente implementa la papelera y restauración

¡El backend está listo! Solo necesitas conectar el frontend. 🎉
