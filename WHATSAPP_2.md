# 📱 Sistema de Pedidos por WhatsApp - Documentación Técnica

## 📋 Descripción del Sistema

El sistema reemplaza el proceso de pago tradicional por un **mensaje pre-formateado de WhatsApp** que contiene:
- Saludo personalizado
- Detalle completo de productos con precios
- Información de la sucursal
- Total a pagar
- Datos del cliente

El mensaje se envía automáticamente al **número de WhatsApp de la sucursal seleccionada**, iniciando una conversación directa entre el cliente y el local.

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### 1. Tabla: `sucursales` (MODIFICAR)

**Agregar columna nueva:**

```sql
ALTER TABLE sucursales 
ADD COLUMN telefono_whatsapp VARCHAR(20) NOT NULL DEFAULT '';
```

**Descripción del campo:**
- **Nombre:** `telefono_whatsapp`
- **Tipo:** `VARCHAR(20)`
- **Descripción:** Número de WhatsApp de la sucursal en formato internacional
- **Formato esperado:** Solo números, sin espacios, sin guiones, sin el símbolo +
- **Ejemplo para Chile:** `56912345678`
  - `56` = Código de país de Chile
  - `9` = Indica teléfono móvil
  - `12345678` = Número del teléfono

**Ejemplo de actualización de sucursales:**
```sql
-- Sucursal 1: Centro
UPDATE sucursales 
SET telefono_whatsapp = '56912345678' 
WHERE id_sucursal = 1;

-- Sucursal 2: Mall
UPDATE sucursales 
SET telefono_whatsapp = '56987654321' 
WHERE id_sucursal = 2;

-- Sucursal 3: Providencia
UPDATE sucursales 
SET telefono_whatsapp = '56923456789' 
WHERE id_sucursal = 3;
```

**Validación recomendada:**
```sql
-- Verificar que no esté vacío
ALTER TABLE sucursales 
ADD CONSTRAINT check_telefono_whatsapp_not_empty 
CHECK (LENGTH(telefono_whatsapp) > 0);

-- Verificar que comience con código de país válido (56 para Chile)
ALTER TABLE sucursales 
ADD CONSTRAINT check_telefono_whatsapp_formato 
CHECK (telefono_whatsapp ~ '^[0-9]{10,15}$');
```

---

### 2. Tabla: `pedidos` (CREAR NUEVA)

**Script de creación:**

```sql
CREATE TABLE pedidos (
    -- Identificadores
    id_pedido SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    
    -- Relación con sucursal
    sucursal_id INTEGER NOT NULL REFERENCES sucursales(id_sucursal) ON DELETE RESTRICT,
    
    -- Datos del cliente
    nombre_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL,
    email_cliente VARCHAR(255),
    
    -- Información del pedido
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    
    -- Detalles adicionales
    observaciones TEXT,
    metodo_retiro VARCHAR(50) DEFAULT 'retiro_inmediato',
    horario_retiro VARCHAR(100),
    
    -- Estado del pedido
    estado VARCHAR(50) DEFAULT 'pendiente' NOT NULL,
    
    -- Información de WhatsApp
    telefono_whatsapp_sucursal VARCHAR(20) NOT NULL,
    mensaje_whatsapp TEXT NOT NULL,
    whatsapp_enviado BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_confirmacion TIMESTAMP,
    fecha_completado TIMESTAMP,
    fecha_cancelacion TIMESTAMP,
    
    -- Metadata
    ip_cliente VARCHAR(45),
    user_agent TEXT
);
```

**Descripción de campos importantes:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_pedido` | SERIAL | ID autoincrementable único del pedido |
| `numero_pedido` | VARCHAR(20) | Número único legible (ej: GUS-20251214-0001) |
| `sucursal_id` | INTEGER | ID de la sucursal donde se hará el pedido |
| `nombre_cliente` | VARCHAR(255) | Nombre completo del cliente |
| `telefono_cliente` | VARCHAR(20) | Teléfono del cliente para contacto |
| `email_cliente` | VARCHAR(255) | Email del cliente (opcional) |
| `subtotal` | DECIMAL(10,2) | Suma de todos los items sin descuentos |
| `total` | DECIMAL(10,2) | Total final a pagar |
| `observaciones` | TEXT | Comentarios adicionales del cliente |
| `metodo_retiro` | VARCHAR(50) | "retiro_inmediato" o "retiro_programado" |
| `horario_retiro` | VARCHAR(100) | Horario preferido si es programado |
| `estado` | VARCHAR(50) | Estado actual del pedido |
| `telefono_whatsapp_sucursal` | VARCHAR(20) | Número al que se envió el mensaje (copia) |
| `mensaje_whatsapp` | TEXT | Mensaje completo enviado (para historial) |
| `whatsapp_enviado` | BOOLEAN | Si el cliente completó el envío |
| `fecha_creacion` | TIMESTAMP | Cuándo se creó el pedido |
| `fecha_confirmacion` | TIMESTAMP | Cuándo la sucursal confirmó |
| `fecha_completado` | TIMESTAMP | Cuándo se completó el pedido |
| `fecha_cancelacion` | TIMESTAMP | Cuándo se canceló (si aplica) |

**Estados posibles del pedido:**
- `pendiente`: Recién creado, esperando que el cliente envíe el WhatsApp
- `enviado`: Cliente envió el mensaje por WhatsApp
- `confirmado`: Sucursal confirmó el pedido
- `en_preparacion`: Preparando el pedido
- `listo`: Listo para retiro
- `completado`: Cliente retiró el pedido
- `cancelado`: Pedido cancelado

**Índices recomendados:**
```sql
CREATE INDEX idx_pedidos_sucursal ON pedidos(sucursal_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_fecha_creacion ON pedidos(fecha_creacion);
CREATE INDEX idx_pedidos_numero ON pedidos(numero_pedido);
CREATE INDEX idx_pedidos_telefono_cliente ON pedidos(telefono_cliente);
```

---

### 3. Tabla: `items_pedido` (CREAR NUEVA)

**Script de creación:**

```sql
CREATE TABLE items_pedido (
    -- Identificador
    id_item_pedido SERIAL PRIMARY KEY,
    
    -- Relación con pedido
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    
    -- Relación con producto
    comida_id INTEGER REFERENCES comidas(id_comida) ON DELETE SET NULL,
    
    -- Información del producto (snapshot al momento del pedido)
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion_producto TEXT,
    categoria_producto VARCHAR(100),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    
    -- Cálculos
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    
    -- Detalles adicionales
    observaciones TEXT,
    
    -- Metadata
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

**Descripción de campos importantes:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_item_pedido` | SERIAL | ID único del item |
| `pedido_id` | INTEGER | ID del pedido al que pertenece |
| `comida_id` | INTEGER | ID del producto (puede ser NULL si se elimina) |
| `nombre_producto` | VARCHAR(255) | Nombre del producto al momento del pedido |
| `descripcion_producto` | TEXT | Descripción snapshot |
| `categoria_producto` | VARCHAR(100) | Categoría snapshot |
| `precio_unitario` | DECIMAL(10,2) | Precio por unidad al momento del pedido |
| `cantidad` | INTEGER | Cantidad de unidades |
| `subtotal` | DECIMAL(10,2) | precio_unitario × cantidad |
| `observaciones` | TEXT | Observaciones específicas del item (ej: "sin cebolla") |

**¿Por qué guardamos snapshot de los datos?**
- Los precios pueden cambiar en el futuro
- Los productos pueden ser eliminados
- Necesitamos mantener el historial exacto de lo que se pidió

**Índices recomendados:**
```sql
CREATE INDEX idx_items_pedido_pedido ON items_pedido(pedido_id);
CREATE INDEX idx_items_pedido_comida ON items_pedido(comida_id);
```

**Constraint adicional:**
```sql
-- Asegurar que el subtotal sea correcto
ALTER TABLE items_pedido 
ADD CONSTRAINT check_subtotal_correcto 
CHECK (subtotal = precio_unitario * cantidad);
```

---

## 🔙 BACKEND - ENDPOINTS REQUERIDOS

### 1. GET `/api/sucursales/:id`

**Modificar el endpoint existente para incluir el nuevo campo.**

**Response actualizado:**
```json
{
  "ok": true,
  "data": {
    "id_sucursal": 1,
    "nombre_sucursal": "Sucursal Centro",
    "direccion_sucursal": "Av. Libertador Bernardo O'Higgins 1234, Santiago",
    "telefono": "+56 2 2345 6789",
    "telefono_whatsapp": "56912345678",
    "horario_apertura": "10:00",
    "horario_cierre": "22:00",
    "activo": true
  }
}
```

**Lógica adicional:**
- Validar que `telefono_whatsapp` no esté vacío
- Si está vacío, no permitir pedidos a esa sucursal
- Retornar error si la sucursal no tiene WhatsApp configurado

---

### 2. POST `/api/pedidos` (NUEVO)

**Descripción:** Crear un nuevo pedido y generar el mensaje de WhatsApp

**Request Body:**
```json
{
  "sucursal_id": 1,
  "cliente": {
    "nombre": "Juan Pérez González",
    "telefono": "+56912345678",
    "email": "juan.perez@email.com"
  },
  "items": [
    {
      "comida_id": 5,
      "nombre": "Hamburguesa Clásica",
      "descripcion": "Hamburguesa de 150g con lechuga y tomate",
      "categoria": "Hamburguesas",
      "precio_unitario": 5990,
      "cantidad": 2,
      "observaciones": "Sin cebolla, extra queso"
    },
    {
      "comida_id": 12,
      "nombre": "Papas Fritas Grandes",
      "descripcion": "Porción grande de papas fritas",
      "categoria": "Acompañamientos",
      "precio_unitario": 2990,
      "cantidad": 1,
      "observaciones": ""
    }
  ],
  "subtotal": 14970,
  "total": 14970,
  "observaciones": "Por favor llamar al llegar al local",
  "metodo_retiro": "retiro_inmediato",
  "horario_retiro": null
}
```

**Response exitoso:**
```json
{
  "ok": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id_pedido": 123,
    "numero_pedido": "GUS-20251214-0001",
    "sucursal": {
      "id": 1,
      "nombre": "Sucursal Centro",
      "direccion": "Av. Libertador Bernardo O'Higgins 1234",
      "telefono": "+56 2 2345 6789"
    },
    "total": 14970,
    "items_count": 2,
    "whatsapp": {
      "telefono": "56912345678",
      "url": "https://wa.me/56912345678?text=...",
      "mensaje": "Hola! 👋\n\nMe gustaría hacer un pedido..."
    },
    "fecha_creacion": "2025-12-14T15:30:00.000Z"
  }
}
```

**Response de error:**
```json
{
  "ok": false,
  "error": "SUCURSAL_SIN_WHATSAPP",
  "mensaje": "La sucursal seleccionada no tiene WhatsApp configurado"
}
```

**Posibles errores:**
- `SUCURSAL_NO_ENCONTRADA`: La sucursal no existe
- `SUCURSAL_INACTIVA`: La sucursal está desactivada
- `SUCURSAL_SIN_WHATSAPP`: La sucursal no tiene número de WhatsApp
- `PRODUCTOS_NO_ENCONTRADOS`: Algunos productos no existen
- `PRECIOS_NO_COINCIDEN`: Los precios no coinciden con la BD
- `TOTAL_INCORRECTO`: El total calculado no coincide
- `DATOS_INCOMPLETOS`: Faltan datos requeridos del cliente
- `CARRITO_VACIO`: No hay items en el pedido

---

### 3. GET `/api/pedidos/:numero_pedido` (NUEVO)

**Descripción:** Consultar el estado y detalles de un pedido específico

**Request:**
```
GET /api/pedidos/GUS-20251214-0001
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "numero_pedido": "GUS-20251214-0001",
    "estado": "confirmado",
    "sucursal": {
      "id": 1,
      "nombre": "Sucursal Centro",
      "direccion": "Av. Libertador Bernardo O'Higgins 1234",
      "telefono": "+56 2 2345 6789",
      "telefono_whatsapp": "56912345678"
    },
    "cliente": {
      "nombre": "Juan Pérez González",
      "telefono": "+56912345678",
      "email": "juan.perez@email.com"
    },
    "items": [
      {
        "nombre": "Hamburguesa Clásica",
        "cantidad": 2,
        "precio_unitario": 5990,
        "subtotal": 11980,
        "observaciones": "Sin cebolla, extra queso"
      },
      {
        "nombre": "Papas Fritas Grandes",
        "cantidad": 1,
        "precio_unitario": 2990,
        "subtotal": 2990,
        "observaciones": ""
      }
    ],
    "subtotal": 14970,
    "total": 14970,
    "observaciones": "Por favor llamar al llegar al local",
    "metodo_retiro": "retiro_inmediato",
    "fecha_creacion": "2025-12-14T15:30:00.000Z",
    "fecha_confirmacion": "2025-12-14T15:35:00.000Z",
    "fecha_completado": null,
    "whatsapp_enviado": true
  }
}
```

---

### 4. GET `/api/pedidos` (NUEVO - Opcional, para admin)

**Descripción:** Listar todos los pedidos con filtros

**Query Parameters:**
- `sucursal_id`: Filtrar por sucursal
- `estado`: Filtrar por estado
- `fecha_desde`: Filtrar desde fecha
- `fecha_hasta`: Filtrar hasta fecha
- `limit`: Límite de resultados (default: 50)
- `offset`: Para paginación (default: 0)

**Request ejemplo:**
```
GET /api/pedidos?sucursal_id=1&estado=pendiente&limit=20
```

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "numero_pedido": "GUS-20251214-0001",
      "sucursal_nombre": "Sucursal Centro",
      "cliente_nombre": "Juan Pérez",
      "total": 14970,
      "estado": "pendiente",
      "fecha_creacion": "2025-12-14T15:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "has_more": false
  }
}
```

---

## 🧮 LÓGICA DEL BACKEND

### Función 1: Generar Número de Pedido

**Formato:** `GUS-YYYYMMDD-XXXX`
- `GUS`: Prefijo de Gustito
- `YYYYMMDD`: Fecha (año, mes, día)
- `XXXX`: Consecutivo del día (0001, 0002, etc.)

**Pseudocódigo:**
```javascript
async function generarNumeroPedido(pool) {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const prefijo = `GUS-${año}${mes}${dia}`;
  
  // Buscar el último pedido del día
  const resultado = await pool.query(
    `SELECT numero_pedido 
     FROM pedidos 
     WHERE numero_pedido LIKE $1 
     ORDER BY id_pedido DESC 
     LIMIT 1`,
    [`${prefijo}-%`]
  );
  
  let consecutivo = 1;
  if (resultado.rows.length > 0) {
    const ultimoNumero = resultado.rows[0].numero_pedido;
    const partes = ultimoNumero.split('-');
    consecutivo = parseInt(partes[2]) + 1;
  }
  
  const numeroFinal = `${prefijo}-${String(consecutivo).padStart(4, '0')}`;
  return numeroFinal;
}

// Ejemplos de salida:
// GUS-20251214-0001
// GUS-20251214-0002
// GUS-20251214-0100
// GUS-20251215-0001 (nuevo día, reinicia contador)
```

---

### Función 2: Generar Mensaje de WhatsApp

**Formato del mensaje:**

```
Hola! 👋

Me gustaría hacer un pedido para *{Nombre Sucursal}*:

━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Pedido #:* {numero_pedido}
📅 *Fecha:* {DD/MM/YYYY}
🕒 *Hora:* {HH:mm}

━━━━━━━━━━━━━━━━━━━━━━━━
🛒 *MI PEDIDO:*

• {cantidad}x {nombre_producto} - ${precio}
  {observaciones si existen}

• {cantidad}x {nombre_producto} - ${precio}

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL:* ${total}

━━━━━━━━━━━━━━━━━━━━━━━━
👤 *MIS DATOS:*
Nombre: {nombre_cliente}
Teléfono: {telefono_cliente}
Email: {email_cliente (si existe)}

━━━━━━━━━━━━━━━━━━━━━━━━
📝 *Observaciones:*
{observaciones_generales (si existen)}

━━━━━━━━━━━━━━━━━━━━━━━━
⏰ *Retiro:* {retiro_inmediato / retiro_programado}
{Horario preferido si aplica}

¡Quedo atento a su confirmación! ✅
```

**Pseudocódigo:**
```javascript
function generarMensajeWhatsApp(pedido, sucursal, items) {
  const fecha = new Date(pedido.fecha_creacion);
  const fechaStr = fecha.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const horaStr = fecha.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  let mensaje = `Hola! 👋\n\n`;
  mensaje += `Me gustaría hacer un pedido para *${sucursal.nombre_sucursal}*:\n\n`;
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `🆔 *Pedido #:* ${pedido.numero_pedido}\n`;
  mensaje += `📅 *Fecha:* ${fechaStr}\n`;
  mensaje += `🕒 *Hora:* ${horaStr}\n\n`;
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `🛒 *MI PEDIDO:*\n\n`;
  
  items.forEach(item => {
    const precioFormateado = item.subtotal.toLocaleString('es-CL');
    mensaje += `• ${item.cantidad}x ${item.nombre_producto} - $${precioFormateado}\n`;
    if (item.observaciones && item.observaciones.trim() !== '') {
      mensaje += `  _(${item.observaciones})_\n`;
    }
  });
  
  mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  const totalFormateado = pedido.total.toLocaleString('es-CL');
  mensaje += `💰 *TOTAL:* $${totalFormateado}\n\n`;
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `👤 *MIS DATOS:*\n`;
  mensaje += `Nombre: ${pedido.nombre_cliente}\n`;
  mensaje += `Teléfono: ${pedido.telefono_cliente}\n`;
  if (pedido.email_cliente) {
    mensaje += `Email: ${pedido.email_cliente}\n`;
  }
  
  if (pedido.observaciones && pedido.observaciones.trim() !== '') {
    mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `📝 *Observaciones:*\n${pedido.observaciones}\n`;
  }
  
  mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  const metodoRetiro = pedido.metodo_retiro === 'retiro_inmediato' 
    ? 'Retiro Inmediato' 
    : 'Retiro Programado';
  mensaje += `⏰ *Retiro:* ${metodoRetiro}\n`;
  if (pedido.horario_retiro) {
    mensaje += `🕐 *Horario:* ${pedido.horario_retiro}\n`;
  }
  
  mensaje += `\n¡Quedo atento a su confirmación! ✅`;
  
  return mensaje;
}
```

---

### Función 3: Generar URL de WhatsApp

**Pseudocódigo:**
```javascript
function generarURLWhatsApp(telefono, mensaje) {
  // Codificar el mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Generar URL
  const url = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
  
  return url;
}

// Ejemplo de URL generada:
// https://wa.me/56912345678?text=Hola!%20%F0%9F%91%8B%0A%0AMe%20gustar%C3%ADa...
```

**Notas importantes:**
- `encodeURIComponent()` maneja automáticamente:
  - Espacios → `%20`
  - Saltos de línea → `%0A`
  - Emojis → Códigos UTF-8
  - Caracteres especiales → Códigos correspondientes
- La URL resultante puede ser MUY larga (hasta 4000 caracteres)
- No hay problema con URLs largas en WhatsApp

---

### Función 4: Validar Pedido

**Validaciones requeridas:**

```javascript
async function validarPedido(body, pool) {
  const errores = [];
  
  // 1. Validar sucursal existe
  const sucursalResult = await pool.query(
    'SELECT * FROM sucursales WHERE id_sucursal = $1',
    [body.sucursal_id]
  );
  
  if (sucursalResult.rows.length === 0) {
    errores.push({
      campo: 'sucursal_id',
      mensaje: 'La sucursal no existe'
    });
  } else {
    const sucursal = sucursalResult.rows[0];
    
    // 2. Validar sucursal activa
    if (!sucursal.activo) {
      errores.push({
        campo: 'sucursal_id',
        mensaje: 'La sucursal no está activa'
      });
    }
    
    // 3. Validar tiene WhatsApp configurado
    if (!sucursal.telefono_whatsapp || sucursal.telefono_whatsapp.trim() === '') {
      errores.push({
        campo: 'sucursal_id',
        mensaje: 'La sucursal no tiene WhatsApp configurado'
      });
    }
  }
  
  // 4. Validar datos del cliente
  if (!body.cliente.nombre || body.cliente.nombre.trim().length < 3) {
    errores.push({
      campo: 'cliente.nombre',
      mensaje: 'El nombre debe tener al menos 3 caracteres'
    });
  }
  
  if (!body.cliente.telefono || body.cliente.telefono.trim() === '') {
    errores.push({
      campo: 'cliente.telefono',
      mensaje: 'El teléfono es requerido'
    });
  }
  
  // 5. Validar email si existe
  if (body.cliente.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.cliente.email)) {
      errores.push({
        campo: 'cliente.email',
        mensaje: 'El email no tiene un formato válido'
      });
    }
  }
  
  // 6. Validar que hay items
  if (!body.items || body.items.length === 0) {
    errores.push({
      campo: 'items',
      mensaje: 'El pedido debe tener al menos un producto'
    });
  }
  
  // 7. Validar cada item
  if (body.items && body.items.length > 0) {
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      
      // Validar que el producto existe
      const productoResult = await pool.query(
        'SELECT precio FROM comidas WHERE id_comida = $1 AND activo = TRUE',
        [item.comida_id]
      );
      
      if (productoResult.rows.length === 0) {
        errores.push({
          campo: `items[${i}].comida_id`,
          mensaje: `El producto con ID ${item.comida_id} no existe o no está activo`
        });
      } else {
        // Validar que el precio coincide
        const precioReal = parseFloat(productoResult.rows[0].precio);
        const precioEnviado = parseFloat(item.precio_unitario);
        
        if (Math.abs(precioReal - precioEnviado) > 0.01) {
          errores.push({
            campo: `items[${i}].precio_unitario`,
            mensaje: `El precio del producto no coincide. Esperado: ${precioReal}, Recibido: ${precioEnviado}`
          });
        }
      }
      
      // Validar cantidad
      if (!item.cantidad || item.cantidad < 1) {
        errores.push({
          campo: `items[${i}].cantidad`,
          mensaje: 'La cantidad debe ser mayor a 0'
        });
      }
    }
  }
  
  // 8. Validar totales
  let subtotalCalculado = 0;
  if (body.items) {
    subtotalCalculado = body.items.reduce((sum, item) => {
      return sum + (item.precio_unitario * item.cantidad);
    }, 0);
  }
  
  if (Math.abs(subtotalCalculado - body.subtotal) > 0.01) {
    errores.push({
      campo: 'subtotal',
      mensaje: `El subtotal no coincide. Esperado: ${subtotalCalculado}, Recibido: ${body.subtotal}`
    });
  }
  
  if (Math.abs(subtotalCalculado - body.total) > 0.01) {
    errores.push({
      campo: 'total',
      mensaje: `El total no coincide. Esperado: ${subtotalCalculado}, Recibido: ${body.total}`
    });
  }
  
  return errores;
}
```

---

### Función 5: Crear Pedido (Función Principal)

**Pseudocódigo completo:**

```javascript
async function crearPedido(body, pool) {
  // 1. VALIDAR DATOS
  const errores = await validarPedido(body, pool);
  if (errores.length > 0) {
    return {
      ok: false,
      error: 'VALIDACION_ERROR',
      errores: errores
    };
  }
  
  // 2. OBTENER SUCURSAL
  const sucursalResult = await pool.query(
    'SELECT * FROM sucursales WHERE id_sucursal = $1',
    [body.sucursal_id]
  );
  const sucursal = sucursalResult.rows[0];
  
  // 3. INICIAR TRANSACCIÓN
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 4. GENERAR NÚMERO DE PEDIDO
    const numeroPedido = await generarNumeroPedido(client);
    
    // 5. GENERAR MENSAJE DE WHATSAPP (versión preliminar)
    // Lo haremos después de insertar para tener el ID
    
    // 6. INSERTAR PEDIDO
    const insertPedidoResult = await client.query(
      `INSERT INTO pedidos (
        numero_pedido,
        sucursal_id,
        nombre_cliente,
        telefono_cliente,
        email_cliente,
        subtotal,
        total,
        observaciones,
        metodo_retiro,
        horario_retiro,
        estado,
        telefono_whatsapp_sucursal,
        mensaje_whatsapp,
        whatsapp_enviado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id_pedido, fecha_creacion`,
      [
        numeroPedido,
        body.sucursal_id,
        body.cliente.nombre,
        body.cliente.telefono,
        body.cliente.email || null,
        body.subtotal,
        body.total,
        body.observaciones || null,
        body.metodo_retiro,
        body.horario_retiro || null,
        'pendiente',
        sucursal.telefono_whatsapp,
        '', // Se actualizará después
        false
      ]
    );
    
    const idPedido = insertPedidoResult.rows[0].id_pedido;
    const fechaCreacion = insertPedidoResult.rows[0].fecha_creacion;
    
    // 7. INSERTAR ITEMS DEL PEDIDO
    for (const item of body.items) {
      const subtotalItem = item.precio_unitario * item.cantidad;
      
      await client.query(
        `INSERT INTO items_pedido (
          pedido_id,
          comida_id,
          nombre_producto,
          descripcion_producto,
          categoria_producto,
          precio_unitario,
          cantidad,
          subtotal,
          observaciones
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          idPedido,
          item.comida_id,
          item.nombre,
          item.descripcion || null,
          item.categoria || null,
          item.precio_unitario,
          item.cantidad,
          subtotalItem,
          item.observaciones || null
        ]
      );
    }
    
    // 8. GENERAR MENSAJE DE WHATSAPP COMPLETO
    const pedidoCompleto = {
      numero_pedido: numeroPedido,
      fecha_creacion: fechaCreacion,
      nombre_cliente: body.cliente.nombre,
      telefono_cliente: body.cliente.telefono,
      email_cliente: body.cliente.email,
      total: body.total,
      observaciones: body.observaciones,
      metodo_retiro: body.metodo_retiro,
      horario_retiro: body.horario_retiro
    };
    
    const mensaje = generarMensajeWhatsApp(pedidoCompleto, sucursal, body.items);
    
    // 9. ACTUALIZAR PEDIDO CON EL MENSAJE
    await client.query(
      'UPDATE pedidos SET mensaje_whatsapp = $1 WHERE id_pedido = $2',
      [mensaje, idPedido]
    );
    
    // 10. GENERAR URL DE WHATSAPP
    const whatsappURL = generarURLWhatsApp(sucursal.telefono_whatsapp, mensaje);
    
    // 11. COMMIT DE LA TRANSACCIÓN
    await client.query('COMMIT');
    
    // 12. RETORNAR RESPUESTA
    return {
      ok: true,
      message: 'Pedido creado exitosamente',
      data: {
        id_pedido: idPedido,
        numero_pedido: numeroPedido,
        sucursal: {
          id: sucursal.id_sucursal,
          nombre: sucursal.nombre_sucursal,
          direccion: sucursal.direccion_sucursal,
          telefono: sucursal.telefono
        },
        total: body.total,
        items_count: body.items.length,
        whatsapp: {
          telefono: sucursal.telefono_whatsapp,
          url: whatsappURL,
          mensaje: mensaje
        },
        fecha_creacion: fechaCreacion
      }
    };
    
  } catch (error) {
    // ROLLBACK en caso de error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## 🔄 FLUJO COMPLETO DEL SISTEMA

### Paso a paso:

```
1. Usuario agrega productos al carrito
   ↓
2. Selecciona sucursal
   ↓
3. Hace clic en "Enviar Pedido por WhatsApp"
   ↓
4. Se muestra formulario con datos del cliente:
   - Nombre
   - Teléfono
   - Email (opcional)
   - Observaciones (opcional)
   - Método de retiro
   - Horario (si aplica)
   ↓
5. Usuario completa formulario y confirma
   ↓
6. Frontend envía datos a POST /api/pedidos
   ↓
7. Backend valida los datos
   ↓
8. Backend crea registro en tabla `pedidos`
   ↓
9. Backend crea registros en tabla `items_pedido`
   ↓
10. Backend genera mensaje formateado
    ↓
11. Backend genera URL de WhatsApp
    ↓
12. Backend retorna URL al frontend
    ↓
13. Frontend abre automáticamente WhatsApp con:
    - window.open(whatsappURL, '_blank')
    ↓
14. Se abre WhatsApp Web/App con mensaje pre-llenado
    ↓
15. Usuario ve el mensaje y hace clic en "Enviar"
    ↓
16. El mensaje llega al WhatsApp de la sucursal
    ↓
17. Encargado de la sucursal recibe el pedido
    ↓
18. Encargado responde confirmando el pedido
    ↓
19. (Opcional) Cliente puede rastrear su pedido con el número
```

---

## 📱 EJEMPLO REAL DEL MENSAJE

**Mensaje que verá el cliente en WhatsApp:**

```
Hola! 👋

Me gustaría hacer un pedido para *Sucursal Centro*:

━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Pedido #:* GUS-20251214-0001
📅 *Fecha:* 14/12/2025
🕒 *Hora:* 15:30

━━━━━━━━━━━━━━━━━━━━━━━━
🛒 *MI PEDIDO:*

• 2x Hamburguesa Clásica - $11.980
  _(Sin cebolla, extra queso)_

• 1x Papas Fritas Grandes - $2.990

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL:* $14.970

━━━━━━━━━━━━━━━━━━━━━━━━
👤 *MIS DATOS:*
Nombre: Juan Pérez González
Teléfono: +56912345678
Email: juan.perez@email.com

━━━━━━━━━━━━━━━━━━━━━━━━
📝 *Observaciones:*
Por favor llamar al llegar al local

━━━━━━━━━━━━━━━━━━━━━━━━
⏰ *Retiro:* Retiro Inmediato

¡Quedo atento a su confirmación! ✅
```

**Lo que verá el encargado de la sucursal:**
- Recibirá este mensaje exactamente como está formateado
- Podrá ver todos los detalles del pedido
- Podrá responder directamente al cliente
- Podrá coordinar detalles adicionales

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### 1. Limitaciones de WhatsApp Web:

- **No se puede enviar automáticamente:** El usuario DEBE presionar el botón "Enviar" en WhatsApp
- **Requiere WhatsApp instalado:** En móvil abre la app, en desktop requiere WhatsApp Web
- **Límite de caracteres:** Los mensajes muy largos pueden tener problemas (mantener < 4000 caracteres)
- **Necesita conexión:** El cliente necesita internet para abrir WhatsApp

### 2. Seguridad y Validaciones:

- **Validar precios en backend:** Nunca confiar en precios del frontend
- **Verificar existencia de productos:** Validar que los productos existan y estén activos
- **Rate limiting:** Limitar pedidos por IP (ej: máximo 5 por hora)
- **Sanitizar datos:** Escapar caracteres especiales en observaciones
- **Logs de seguridad:** Registrar IP y User-Agent para detectar abusos

### 3. Manejo de Errores:

**En el backend:**
- Usar transacciones para mantener consistencia
- Si falla algo, hacer ROLLBACK completo
- Retornar errores descriptivos al frontend
- Loggear errores para debugging

**En el frontend:**
- Mostrar errores claros al usuario
- Permitir reintentar en caso de error
- Guardar datos del formulario si falla (no perder info)
- Timeout de 30 segundos para la petición

### 4. Experiencia de Usuario:

**Buenas prácticas:**
- Mostrar resumen del pedido antes de enviar
- Confirmación: "¿Estás seguro de enviar este pedido?"
- Indicador de carga mientras se crea el pedido
- Mensaje de éxito con número de pedido
- Instrucciones claras sobre qué hacer después
- Botón "Abrir WhatsApp nuevamente" si se cierra por error

### 5. Datos a Guardar:

**¿Por qué guardar todo en la BD?**
- Historial completo de pedidos
- Estadísticas y reportes
- Análisis de productos más vendidos
- Seguimiento de clientes recurrentes
- Respaldo en caso de problemas con WhatsApp
- Posibilidad de implementar seguimiento futuro

---

## 📊 CASOS DE USO ADICIONALES (FUTURO)

### 1. Panel de Administración de Pedidos

**En el panel de admin del frontend:**
- Ver todos los pedidos por sucursal
- Filtrar por estado (pendiente, confirmado, etc.)
- Cambiar estado de pedidos manualmente
- Ver detalles completos de cada pedido
- Exportar a Excel para contabilidad
- Estadísticas de ventas

### 2. Notificaciones Automáticas

**Cuando se pueda implementar:**
- Email al cliente cuando se crea el pedido
- Email al encargado de la sucursal
- SMS de confirmación (usando Twilio u otro servicio)
- Webhook cuando cambia el estado

### 3. Sistema de Tracking

**Para el cliente:**
- Página para consultar estado con número de pedido
- Estimación de tiempo de preparación
- Notificación cuando esté listo
- Calificación del servicio post-retiro

### 4. Métricas y Reportes

**KPIs importantes:**
- Pedidos por día/mes
- Ticket promedio
- Productos más vendidos
- Horarios de mayor demanda
- Tasa de conversión (carritos vs pedidos)
- Tiempo promedio de confirmación

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Base de Datos:
- [ ] Agregar columna `telefono_whatsapp` a tabla `sucursales`
- [ ] Crear tabla `pedidos` con todos los campos
- [ ] Crear tabla `items_pedido` con todos los campos
- [ ] Crear índices recomendados
- [ ] Agregar constraints de validación
- [ ] Actualizar números de WhatsApp de sucursales existentes
- [ ] Probar inserts/updates en las nuevas tablas

### Backend:
- [ ] Modificar GET `/api/sucursales/:id` para incluir `telefono_whatsapp`
- [ ] Crear endpoint POST `/api/pedidos`
- [ ] Implementar función `generarNumeroPedido()`
- [ ] Implementar función `generarMensajeWhatsApp()`
- [ ] Implementar función `generarURLWhatsApp()`
- [ ] Implementar función `validarPedido()`
- [ ] Implementar función principal `crearPedido()`
- [ ] Agregar manejo de transacciones
- [ ] Agregar manejo de errores completo
- [ ] Agregar rate limiting
- [ ] Agregar logging
- [ ] Probar con casos de prueba
- [ ] Crear endpoint GET `/api/pedidos/:numero_pedido` (opcional)

### Testing:
- [ ] Probar creación de pedido simple
- [ ] Probar con múltiples items
- [ ] Probar con observaciones largas
- [ ] Probar con caracteres especiales
- [ ] Probar con emojis
- [ ] Probar validaciones (sucursal inexistente, sin WhatsApp, precios incorrectos)
- [ ] Probar URL de WhatsApp en navegador
- [ ] Probar URL en móvil
- [ ] Verificar formato del mensaje en WhatsApp
- [ ] Probar rollback si falla algo

### Frontend (Próximo):
- [ ] Crear componente FormularioCliente
- [ ] Modificar página de carrito
- [ ] Integrar con endpoint POST /api/pedidos
- [ ] Abrir WhatsApp automáticamente
- [ ] Página de confirmación
- [ ] Manejo de errores en UI

---

## 🎯 PRIORIDADES

### Alta Prioridad (Implementar primero):
1. ✅ Modificar tabla `sucursales`
2. ✅ Crear tabla `pedidos`
3. ✅ Crear tabla `items_pedido`
4. ✅ Endpoint POST `/api/pedidos` con todas las validaciones
5. ✅ Funciones de generación de mensaje y URL

### Media Prioridad (Después del MVP):
1. Endpoint GET `/api/pedidos/:numero_pedido`
2. Rate limiting
3. Logging completo
4. Estadísticas básicas

### Baja Prioridad (Futuro):
1. Panel de admin de pedidos
2. Sistema de notificaciones
3. Tracking de pedidos
4. Reportes avanzados

---

## 📝 NOTAS FINALES

Este sistema es una solución simple y efectiva que:

**Ventajas:**
- ✅ No requiere pasarela de pago (ahorro de costos)
- ✅ Comunicación directa con la sucursal
- ✅ Familiar para los clientes (todos usan WhatsApp)
- ✅ Flexibilidad para coordinar detalles
- ✅ No requiere APIs complejas de WhatsApp Business
- ✅ Implementación rápida

**Limitaciones:**
- ❌ Requiere que el usuario tenga WhatsApp
- ❌ Usuario debe enviar manualmente el mensaje
- ❌ No hay confirmación automática
- ❌ Depende de que el encargado responda

**Recomendaciones:**
- Probar exhaustivamente antes de producción
- Capacitar al personal de las sucursales
- Monitorear los primeros pedidos
- Recopilar feedback de los clientes
- Iterar y mejorar basándose en el uso real

---

**Documento creado:** 14 de diciembre de 2025  
**Versión:** 2.0  
**Estado:** ✅ Listo para implementación

---

_¡Éxito con la implementación del sistema! 🚀📱_
