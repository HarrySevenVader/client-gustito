# 📝 Requisitos para Backend - Sistema de Carrito con Sucursales

## 🎯 Objetivo
Implementar endpoints necesarios para soportar el flujo de carrito con selección de sucursal en el frontend.

---

## 📌 Endpoints Necesarios

### 1. Obtener Comidas Disponibles en una Sucursal con Precios

**Endpoint existente a verificar/modificar:**

```
GET /api/sucursales/:sucursalId/comidas
```

**Debe retornar:**
```json
{
  "ok": true,
  "data": [
    {
      "id_comida": 15,
      "nombre_comida": "Pizza Napolitana",
      "descripcion": "Pizza con tomate, mozzarella...",
      "precio_base": 8500,
      "precio_sucursal": 9000,  // Precio específico de esta sucursal (opcional)
      "precio_final": 9000,      // Precio que se debe mostrar
      "imagen_url": "https://...",
      "categoria_id": 6,
      "categoria_nombre": "Pizzas",
      "disponible": true,
      "observacion": "Solo disponible los fines de semana" // Opcional
    }
  ]
}
```

**Lógica del precio_final:**
- Si existe `precio_sucursal` en la tabla `comidas_sucursales`, usar ese
- Si no existe, usar el `precio_base` de la tabla `comidas`

---

### 2. Validar Disponibilidad de Productos en Sucursal

**Endpoint existente a verificar:**

```
POST /api/sucursales/:sucursalId/validar-carrito
```

**Body esperado:**
```json
{
  "items": [
    { "comida_id": 15, "cantidad": 2 },
    { "comida_id": 16, "cantidad": 1 }
  ]
}
```

**Respuesta exitosa (todos disponibles):**
```json
{
  "ok": true,
  "mensaje": "Todos los productos están disponibles",
  "disponibles": true,
  "detalles": [
    {
      "comida_id": 15,
      "nombre": "Pizza Napolitana",
      "disponible": true,
      "precio_final": 9000
    },
    {
      "comida_id": 16,
      "nombre": "Hamburguesa Clásica",
      "disponible": true,
      "precio_final": 6500
    }
  ]
}
```

**Respuesta con productos no disponibles:**
```json
{
  "ok": false,
  "mensaje": "Algunos productos no están disponibles en esta sucursal",
  "disponibles": false,
  "detalles": [
    {
      "comida_id": 15,
      "nombre": "Pizza Napolitana",
      "disponible": true,
      "precio_final": 9000
    },
    {
      "comida_id": 16,
      "nombre": "Hamburguesa Clásica",
      "disponible": false,
      "razon": "No disponible en esta sucursal"
    }
  ]
}
```

---

### 3. Obtener Sucursales Activas

**Endpoint existente:**

```
GET /api/sucursales
```

**Debe retornar solo sucursales activas:**
```json
{
  "ok": true,
  "data": [
    {
      "id_sucursal": 1,
      "nombre_sucursal": "Gustito Huechuraba",
      "direccion_sucursal": "Berta Correa 1686, 8600772 Huechuraba...",
      "activo": true
    }
  ]
}
```

---

## 🔄 Flujo de Trabajo en Frontend

### Paso 1: Usuario selecciona sucursal antes de agregar al carrito
```javascript
// Usuario hace click en "Agregar al carrito"
// Se muestra modal con lista de sucursales
// Usuario selecciona sucursal
// Se guarda sucursal en localStorage
```

### Paso 2: Validación al agregar producto
```javascript
// Al agregar producto, validar que esté disponible en sucursal seleccionada
// Usar endpoint: GET /api/sucursales/:sucursalId/comidas
// Si no está disponible, mostrar error
```

### Paso 3: Validación final antes de pagar
```javascript
// Antes de proceder al pago
// Validar todo el carrito contra sucursal
// Usar endpoint: POST /api/sucursales/:sucursalId/validar-carrito
```

---

## 📊 Estructura de Datos Esperada

### Tabla: comidas_sucursales

Debe tener estas columnas:
- `id` o `id_comida_sucursal` (PK)
- `comida_id` (FK a comidas)
- `sucursal_id` (FK a sucursales)
- `disponible` (boolean)
- `precio_sucursal` (decimal, nullable) - Precio específico para esta sucursal
- `observacion` (text, nullable) - Ejemplo: "Solo fines de semana"

### Ejemplo de consulta para obtener comidas de una sucursal:

```sql
SELECT 
    c.id_comida,
    c.nombre_comida,
    c.descripcion,
    c.precio as precio_base,
    cs.precio_sucursal,
    COALESCE(cs.precio_sucursal, c.precio) as precio_final,
    c.imagen_url,
    c.categoria_id,
    cat.nombre_categoria,
    cs.disponible,
    cs.observacion
FROM comidas c
INNER JOIN comidas_sucursales cs ON c.id_comida = cs.comida_id
LEFT JOIN categorias cat ON c.categoria_id = cat.id_categoria
WHERE cs.sucursal_id = $1
  AND cs.disponible = true
  AND c.activo = true;
```

---

## ⚠️ Casos de Uso a Manejar

1. **Usuario cambia de sucursal con carrito lleno:**
   - Frontend debe validar que todos los productos del carrito estén disponibles en la nueva sucursal
   - Si alguno no está disponible, mostrar advertencia

2. **Producto se marca como no disponible mientras está en el carrito:**
   - Al intentar pagar, la validación debe detectarlo
   - Mostrar mensaje: "El producto X ya no está disponible en esta sucursal"

3. **Precios diferentes por sucursal:**
   - Siempre usar el precio_final del endpoint
   - Mostrar al usuario si hubo cambio de precio al cambiar sucursal

---

## 🧪 Pruebas Recomendadas

1. Crear 3 sucursales
2. Asignar diferentes comidas a cada sucursal
3. Algunos productos solo en sucursal 1, otros solo en sucursal 2
4. Verificar que validación funcione correctamente
5. Probar precios diferentes por sucursal

---

## 📝 Notas Importantes

- El frontend guardará la sucursal seleccionada en `localStorage` con key `gustito-sucursal`
- La sucursal se debe seleccionar **antes** de agregar productos al carrito
- Si no hay sucursal seleccionada, mostrar modal de selección
- Todos los endpoints deben retornar estructura consistente: `{ ok: boolean, data: any }` o `{ ok: boolean, mensaje: string }`
