# 📱 Sistema de Pedidos por WhatsApp Web

## 📋 Descripción General

Este documento describe la implementación de un sistema de pedidos mediante WhatsApp Web, reemplazando la pasarela de pago tradicional por una comunicación directa con la sucursal a través de WhatsApp.

---

## 🎯 Concepto y Funcionamiento

### Flujo Completo:

```
Usuario completa carrito
        ↓
Hace clic en "Enviar Pedido por WhatsApp"
        ↓
Sistema genera mensaje pre-formateado
        ↓
Se abre WhatsApp Web/App automáticamente
        ↓
Mensaje aparece listo para enviar
        ↓
Usuario presiona "Enviar"
        ↓
Mensaje llega al WhatsApp de la sucursal
        ↓
Encargado confirma el pedido
```

---

## 🔧 Tecnología: WhatsApp Web URL Scheme

### URL Base:
```
https://wa.me/{número}?text={mensaje}
```

### Componentes:
- `{número}`: Número de WhatsApp en formato internacional (sin +, sin espacios, sin guiones)
  - Ejemplo: `56912345678` (Chile)
  - Formato: `{código_país}{número}`
  
- `{mensaje}`: Texto del pedido URL-encoded
  - Caracteres especiales deben codificarse
  - Saltos de línea: `%0A`
  - Espacios: `%20` o `+`
  - Emojis: Compatible directamente

### Ejemplo Completo:
```
https://wa.me/56912345678?text=%F0%9F%8D%94+*NUEVO+PEDIDO*%0A%0APedido+de+2x+Hamburguesas
```

---

## 📝 Estructura del Mensaje

### Formato Propuesto:

```
🍔 *NUEVO PEDIDO - Gustito*

━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Sucursal:* {nombre_sucursal}
📅 *Fecha:* {dd/mm/yyyy}
🕒 *Hora:* {HH:mm}
🆔 *Pedido #:* {numero_pedido}

━━━━━━━━━━━━━━━━━━━━━━━━
🛒 *DETALLE DEL PEDIDO:*

{lista_productos}

━━━━━━━━━━━━━━━━━━━━━━━━
💵 *SUBTOTAL:* ${subtotal}
🚚 *ENVÍO:* Gratis
💰 *TOTAL A PAGAR:* ${total}

━━━━━━━━━━━━━━━━━━━━━━━━
👤 *DATOS DEL CLIENTE:*
Nombre: {nombre_cliente}
Teléfono: {telefono_cliente}
Email: {email_cliente}

━━━━━━━━━━━━━━━━━━━━━━━━
📝 *Observaciones:*
{observaciones_cliente}

━━━━━━━━━━━━━━━━━━━━━━━━
⏰ *Método de retiro:* {retiro_inmediato / programado}
🕐 *Horario preferido:* {horario_retiro}

━━━━━━━━━━━━━━━━━━━━━━━━
💳 *Forma de pago:*
□ Efectivo
□ Transferencia
□ Tarjeta (en local)

_Por favor confirme este pedido_ ✅
```

### Ejemplo de lista_productos:
```
• 2x Hamburguesa Clásica - $11.980
  (Con extra queso, sin cebolla)
• 1x Papas Fritas Grandes - $2.990
• 1x Coca-Cola 500ml - $1.500
```

---

## 🗄️ Cambios en Base de Datos

### Tabla: `sucursales`

**Agregar campo nuevo:**
```sql
ALTER TABLE sucursales 
ADD COLUMN telefono_whatsapp VARCHAR(20);
```

**Descripción:**
- Almacena el número de WhatsApp de la sucursal
- Formato: Solo números, sin espacios ni guiones
- Ejemplo: `56912345678` (código país + número)
- Validación: Debe comenzar con código de país

**Actualizar sucursales existentes:**
```sql
UPDATE sucursales 
SET telefono_whatsapp = '56912345678' 
WHERE id_sucursal = 1;
```

### Tabla: `pedidos` (NUEVA)

**Crear tabla para registrar pedidos:**
```sql
CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    sucursal_id INTEGER REFERENCES sucursales(id_sucursal),
    
    -- Datos del cliente
    nombre_cliente VARCHAR(255) NOT NULL,
    telefono_cliente VARCHAR(20) NOT NULL,
    email_cliente VARCHAR(255),
    
    -- Detalles del pedido
    items_json JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Estado y fechas
    estado VARCHAR(50) DEFAULT 'pendiente',
    observaciones TEXT,
    metodo_retiro VARCHAR(50),
    horario_retiro VARCHAR(100),
    
    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmacion TIMESTAMP,
    fecha_completado TIMESTAMP,
    
    -- Metadata
    mensaje_whatsapp TEXT,
    whatsapp_enviado BOOLEAN DEFAULT FALSE
);
```

**Estados posibles:**
- `pendiente`: Pedido enviado, esperando confirmación
- `confirmado`: Sucursal confirmó el pedido
- `en_preparacion`: Preparando el pedido
- `listo`: Listo para retiro
- `completado`: Cliente retiró el pedido
- `cancelado`: Pedido cancelado

### Tabla: `items_pedido` (NUEVA)

**Detalle de items por pedido:**
```sql
CREATE TABLE items_pedido (
    id_item_pedido SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    comida_id INTEGER REFERENCES comidas(id),
    
    nombre_producto VARCHAR(255) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INTEGER NOT NULL,
    observaciones TEXT,
    
    subtotal DECIMAL(10, 2) NOT NULL
);
```

**Índices recomendados:**
```sql
CREATE INDEX idx_pedidos_sucursal ON pedidos(sucursal_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_creacion);
CREATE INDEX idx_items_pedido ON items_pedido(pedido_id);
```

---

## 🔙 Backend - Endpoints Necesarios

### 1. GET /api/sucursales/:id

**Modificar endpoint existente para incluir:**
```json
{
  "ok": true,
  "data": {
    "id_sucursal": 1,
    "nombre_sucursal": "Sucursal Centro",
    "direccion_sucursal": "Av. Principal 123",
    "telefono_whatsapp": "56912345678",
    "activo": true
  }
}
```

### 2. POST /api/pedidos (NUEVO)

**Descripción:** Crear un nuevo pedido y guardarlo en la BD

**Request Body:**
```json
{
  "sucursal_id": 1,
  "cliente": {
    "nombre": "Juan Pérez",
    "telefono": "+56912345678",
    "email": "juan@email.com"
  },
  "items": [
    {
      "comida_id": 5,
      "nombre": "Hamburguesa Clásica",
      "precio_unitario": 5990,
      "cantidad": 2,
      "observaciones": "Sin cebolla, extra queso"
    }
  ],
  "subtotal": 11980,
  "total": 11980,
  "observaciones": "Llamar al llegar",
  "metodo_retiro": "retiro_inmediato",
  "horario_retiro": "14:00 - 15:00"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id_pedido": 123,
    "numero_pedido": "GUS-20251211-0123",
    "whatsapp_url": "https://wa.me/56912345678?text=...",
    "mensaje_whatsapp": "🍔 *NUEVO PEDIDO*...",
    "telefono_sucursal": "56912345678"
  }
}
```

**Lógica del endpoint:**
```javascript
// Pseudocódigo
1. Validar datos de entrada
2. Generar número de pedido único (formato: GUS-YYYYMMDD-XXXX)
3. Crear registro en tabla `pedidos`
4. Crear registros en tabla `items_pedido`
5. Generar mensaje de WhatsApp formateado
6. Codificar mensaje para URL
7. Generar URL de WhatsApp completa
8. Retornar datos del pedido + URL de WhatsApp
```

**Generación de número de pedido:**
```javascript
const generarNumeroPedido = async () => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  
  // Obtener último número del día
  const ultimoPedido = await db.query(
    `SELECT numero_pedido FROM pedidos 
     WHERE numero_pedido LIKE 'GUS-${año}${mes}${dia}-%' 
     ORDER BY id_pedido DESC LIMIT 1`
  );
  
  let consecutivo = 1;
  if (ultimoPedido.rows.length > 0) {
    const ultimo = ultimoPedido.rows[0].numero_pedido;
    consecutivo = parseInt(ultimo.split('-')[2]) + 1;
  }
  
  return `GUS-${año}${mes}${dia}-${String(consecutivo).padStart(4, '0')}`;
};
```

**Generación de mensaje WhatsApp:**
```javascript
const generarMensajeWhatsApp = (pedido) => {
  const fecha = new Date(pedido.fecha_creacion);
  const fechaStr = fecha.toLocaleDateString('es-CL');
  const horaStr = fecha.toLocaleTimeString('es-CL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  let mensaje = `🍔 *NUEVO PEDIDO - Gustito*\n\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `📍 *Sucursal:* ${pedido.sucursal.nombre}\n`;
  mensaje += `📅 *Fecha:* ${fechaStr}\n`;
  mensaje += `🕒 *Hora:* ${horaStr}\n`;
  mensaje += `🆔 *Pedido #:* ${pedido.numero_pedido}\n\n`;
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `🛒 *DETALLE DEL PEDIDO:*\n\n`;
  
  pedido.items.forEach(item => {
    mensaje += `• ${item.cantidad}x ${item.nombre} - $${item.subtotal.toLocaleString('es-CL')}\n`;
    if (item.observaciones) {
      mensaje += `  (${item.observaciones})\n`;
    }
  });
  
  mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `💵 *SUBTOTAL:* $${pedido.subtotal.toLocaleString('es-CL')}\n`;
  mensaje += `🚚 *ENVÍO:* Gratis\n`;
  mensaje += `💰 *TOTAL A PAGAR:* $${pedido.total.toLocaleString('es-CL')}\n\n`;
  
  mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `👤 *DATOS DEL CLIENTE:*\n`;
  mensaje += `Nombre: ${pedido.cliente.nombre}\n`;
  mensaje += `Teléfono: ${pedido.cliente.telefono}\n`;
  if (pedido.cliente.email) {
    mensaje += `Email: ${pedido.cliente.email}\n`;
  }
  
  if (pedido.observaciones) {
    mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `📝 *Observaciones:*\n${pedido.observaciones}\n`;
  }
  
  mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `⏰ *Método de retiro:* ${pedido.metodo_retiro}\n`;
  if (pedido.horario_retiro) {
    mensaje += `🕐 *Horario preferido:* ${pedido.horario_retiro}\n`;
  }
  
  mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `💳 *Forma de pago:* A coordinar\n\n`;
  mensaje += `_Por favor confirme este pedido_ ✅`;
  
  return mensaje;
};

const generarURLWhatsApp = (telefono, mensaje) => {
  const mensajeCodificado = encodeURIComponent(mensaje);
  return `https://wa.me/${telefono}?text=${mensajeCodificado}`;
};
```

### 3. GET /api/pedidos/:numero_pedido (NUEVO)

**Descripción:** Consultar estado de un pedido

**Response:**
```json
{
  "ok": true,
  "data": {
    "numero_pedido": "GUS-20251211-0123",
    "estado": "confirmado",
    "sucursal": {
      "nombre": "Sucursal Centro",
      "telefono": "56912345678"
    },
    "items": [...],
    "total": 11980,
    "fecha_creacion": "2025-12-11T14:30:00Z",
    "fecha_confirmacion": "2025-12-11T14:35:00Z"
  }
}
```

### 4. PUT /api/pedidos/:id/estado (NUEVO - Opcional)

**Descripción:** Actualizar estado del pedido (para panel admin)

**Request Body:**
```json
{
  "estado": "confirmado"
}
```

---

## 🎨 Frontend - Cambios Necesarios

### 1. Formulario de Datos del Cliente

**Archivo a crear:** `components/FormularioCliente.tsx`

**Campos requeridos:**
- Nombre completo (requerido)
- Teléfono (requerido, validación formato chileno)
- Email (opcional)
- Observaciones del pedido (textarea, opcional)
- Método de retiro:
  - Radio: Retiro inmediato / Retiro programado
- Si es programado: Input de horario preferido
- Checkbox: Acepto términos y condiciones

**Validaciones:**
```typescript
- Nombre: mínimo 3 caracteres
- Teléfono: formato +56912345678 o validación flexible
- Email: formato válido o vacío
- Horario: solo si retiro programado
```

### 2. Modificar Página de Carrito

**Archivo:** `app/carrito/page.tsx`

**Cambios:**

1. Reemplazar botón "Proceder al Pago" por:
```tsx
<button onClick={handleEnviarPorWhatsApp}>
  Enviar Pedido por WhatsApp
</button>
```

2. Agregar modal/paso de formulario de cliente antes de enviar

3. Función `handleEnviarPorWhatsApp`:
```typescript
const handleEnviarPorWhatsApp = async () => {
  // 1. Validar que hay sucursal seleccionada
  if (!sucursal) {
    toastError('Debes seleccionar una sucursal');
    return;
  }
  
  // 2. Validar que hay items en el carrito
  if (items.length === 0) {
    toastError('Tu carrito está vacío');
    return;
  }
  
  // 3. Abrir modal/formulario de datos del cliente
  setShowFormularioCliente(true);
};

const handleSubmitFormulario = async (datosCliente) => {
  try {
    // 1. Preparar datos del pedido
    const pedidoData = {
      sucursal_id: sucursal.id_sucursal,
      cliente: datosCliente,
      items: items.map(item => ({
        comida_id: item.id,
        nombre: item.nombre,
        precio_unitario: item.precio_final,
        cantidad: item.cantidad,
        observaciones: item.observaciones || ''
      })),
      subtotal: getTotal(),
      total: getTotal(),
      observaciones: datosCliente.observaciones,
      metodo_retiro: datosCliente.metodo_retiro,
      horario_retiro: datosCliente.horario_retiro
    };
    
    // 2. Llamar al backend
    const response = await fetch('http://localhost:4000/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData)
    });
    
    const result = await response.json();
    
    if (result.ok) {
      // 3. Guardar número de pedido en localStorage
      localStorage.setItem('ultimo_pedido', result.data.numero_pedido);
      
      // 4. Abrir WhatsApp
      window.open(result.data.whatsapp_url, '_blank');
      
      // 5. Mostrar confirmación
      toastSuccess('Redirigiendo a WhatsApp...');
      
      // 6. Opcional: Vaciar carrito después de unos segundos
      setTimeout(() => {
        clearCart();
        router.push('/pedido-confirmado');
      }, 2000);
    }
  } catch (error) {
    toastError('Error al crear el pedido');
  }
};
```

### 3. Página de Confirmación

**Archivo a crear:** `app/pedido-confirmado/page.tsx`

**Contenido:**
- Mensaje de éxito
- Número de pedido generado
- Instrucciones: "Tu pedido fue enviado por WhatsApp"
- Estado: "Esperando confirmación de la sucursal"
- Link para consultar estado (futuro)
- Botón: "Volver al inicio"

### 4. Actualizar CartContext

**Modificaciones:**
```typescript
// Agregar función para guardar observaciones por item
const addObservacionToItem = (productoId: number, observacion: string) => {
  setItems(currentItems =>
    currentItems.map(item =>
      item.id === productoId
        ? { ...item, observaciones: observacion }
        : item
    )
  );
};
```

---

## 📱 Componentes Adicionales

### FormularioCliente.tsx

**Props:**
```typescript
interface FormularioClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (datos: DatosCliente) => void;
  totalPedido: number;
  sucursal: Sucursal;
}

interface DatosCliente {
  nombre: string;
  telefono: string;
  email: string;
  observaciones: string;
  metodo_retiro: 'inmediato' | 'programado';
  horario_retiro?: string;
}
```

**Estructura del modal:**
```tsx
- Header: "Datos para tu pedido"
- Resumen rápido:
  - Sucursal
  - Total a pagar
- Formulario:
  - Input: Nombre
  - Input: Teléfono
  - Input: Email (opcional)
  - Textarea: Observaciones
  - Radio: Método de retiro
  - Input condicional: Horario
  - Checkbox: Términos
- Footer:
  - Botón "Cancelar"
  - Botón "Enviar por WhatsApp" (deshabilitado si no válido)
```

---

## 🔐 Validaciones y Seguridad

### Backend:

1. **Validar datos de entrada:**
```javascript
- Sucursal existe y está activa
- Sucursal tiene telefono_whatsapp configurado
- Items del pedido existen en la BD
- Precios coinciden con los de la BD (anti-manipulación)
- Total calculado es correcto
- Datos del cliente completos
```

2. **Rate limiting:**
```javascript
- Máximo 5 pedidos por IP por hora
- Prevenir spam
```

3. **Sanitización:**
```javascript
- Escapar caracteres especiales en observaciones
- Validar formato de teléfono
- Validar formato de email
```

### Frontend:

1. **Validación en tiempo real:**
```typescript
- Teléfono: solo números y formato válido
- Email: regex de email
- Nombre: mínimo 3 caracteres
```

2. **Confirmación antes de enviar:**
```typescript
- Modal de confirmación con resumen del pedido
- "¿Confirmas que los datos son correctos?"
```

---

## 🎯 Mejoras Futuras

### 1. Sistema de Confirmaciones

**Webhook de WhatsApp (requiere Business API):**
- Detectar cuando el encargado responde
- Actualizar estado del pedido automáticamente
- Notificar al cliente por email

**Alternativa sin API:**
- Panel de admin donde el encargado marca pedidos como confirmados
- Enviar SMS/Email de confirmación al cliente

### 2. Historial de Pedidos

**Login de clientes:**
- Registro de usuarios
- Ver historial de pedidos
- Re-ordenar pedidos anteriores
- Guardar direcciones favoritas

### 3. Tracking de Pedidos

**Estados visuales:**
```
Pendiente → Confirmado → En Preparación → Listo → Completado
```

**Notificaciones:**
- Email cuando cambia el estado
- SMS cuando está listo

### 4. Estadísticas para Admin

**Dashboard de pedidos:**
- Pedidos por día/mes
- Productos más vendidos
- Horarios de mayor demanda
- Ingresos por sucursal

### 5. Integración con QR

**Escanear para hacer pedido:**
- QR en cada mesa
- QR en volantes
- Incluir ID de sucursal en QR

---

## 📊 Métricas a Monitorear

### KPIs importantes:

1. **Tasa de conversión:**
   - % de carritos que completan pedido
   - Punto de abandono más común

2. **Tiempo de respuesta:**
   - Tiempo promedio de confirmación de sucursal
   - Tiempo total del proceso

3. **Satisfacción:**
   - Encuesta post-pedido
   - Rating de experiencia

4. **Volumen:**
   - Pedidos por día/hora
   - Ticket promedio
   - Items por pedido

---

## 🚀 Plan de Implementación

### Fase 1: Backend (1-2 días)
- [ ] Agregar campo `telefono_whatsapp` a tabla sucursales
- [ ] Crear tabla `pedidos` y `items_pedido`
- [ ] Implementar endpoint POST /api/pedidos
- [ ] Implementar generación de mensaje WhatsApp
- [ ] Testing de generación de URLs

### Fase 2: Frontend (2-3 días)
- [ ] Crear componente FormularioCliente
- [ ] Modificar página de carrito
- [ ] Agregar modal de formulario
- [ ] Implementar validaciones
- [ ] Integrar con endpoint de backend
- [ ] Crear página de confirmación

### Fase 3: Testing (1 día)
- [ ] Probar flujo completo
- [ ] Validar mensaje en WhatsApp
- [ ] Probar en móvil y desktop
- [ ] Verificar encoding de caracteres especiales
- [ ] Probar con diferentes navegadores

### Fase 4: Producción (0.5 días)
- [ ] Configurar números de WhatsApp de sucursales
- [ ] Capacitar al personal
- [ ] Monitorear primeros pedidos
- [ ] Ajustar según feedback

---

## 📝 Notas Importantes

### Limitaciones de WhatsApp Web:

1. **No se puede enviar automáticamente:**
   - El usuario DEBE hacer clic en "Enviar"
   - Es por seguridad de WhatsApp
   - No hay forma de saltarse esto sin usar la API oficial

2. **Requiere WhatsApp instalado:**
   - En móvil: Abre la app automáticamente
   - En desktop: Requiere WhatsApp Web ya iniciado o app de escritorio

3. **Límite de caracteres:**
   - Mensajes muy largos pueden truncarse
   - Mantener mensajes < 4000 caracteres

### Recomendaciones:

1. **Número de prueba primero:**
   - Configurar un número de prueba
   - Hacer 20-30 pedidos de prueba
   - Ajustar formato del mensaje según necesidad

2. **Respaldos:**
   - Guardar TODOS los pedidos en BD
   - Aunque se envíen por WhatsApp
   - Permite generar reportes y estadísticas

3. **Comunicación clara:**
   - Informar al cliente que será contactado por WhatsApp
   - Especificar tiempo de respuesta esperado
   - Dar alternativas de contacto

4. **Horarios de atención:**
   - Mostrar claramente horarios
   - Deshabilitar pedidos fuera de horario
   - Mensaje automático de horarios

---

## 🎨 Ejemplo Visual del Flujo

```
┌─────────────────────────────────────────┐
│  CARRITO DE COMPRAS                     │
│  ─────────────────────                  │
│  🗺️ Sucursal Centro                     │
│                                          │
│  • 2x Hamburguesa - $11.980             │
│  • 1x Papas - $2.990                    │
│                                          │
│  TOTAL: $14.970                         │
│                                          │
│  [Enviar Pedido por WhatsApp]           │
└─────────────────────────────────────────┘
                ↓ CLIC
┌─────────────────────────────────────────┐
│  DATOS PARA TU PEDIDO                   │
│  ─────────────────────                  │
│  Sucursal: Centro | Total: $14.970      │
│                                          │
│  Nombre: [_______________]              │
│  Teléfono: [+569________]               │
│  Email: [_______________] (opcional)    │
│                                          │
│  Observaciones:                         │
│  [________________________]             │
│                                          │
│  Retiro:                                │
│  ○ Inmediato  ○ Programado              │
│                                          │
│  ☑ Acepto términos y condiciones        │
│                                          │
│  [Cancelar]  [Enviar por WhatsApp]      │
└─────────────────────────────────────────┘
                ↓ CLIC
┌─────────────────────────────────────────┐
│  ✅ ¡PEDIDO CREADO!                     │
│                                          │
│  Pedido #: GUS-20251211-0123            │
│                                          │
│  Tu pedido ha sido enviado por          │
│  WhatsApp a la sucursal.                │
│                                          │
│  Recibirás confirmación en breve.       │
│                                          │
│  [Volver al inicio]                     │
└─────────────────────────────────────────┘
                +
        [WhatsApp se abre automáticamente]
```

---

## ✅ Checklist de Implementación

### Preparación:
- [ ] Leer y entender este documento completo
- [ ] Confirmar números de WhatsApp de cada sucursal
- [ ] Definir horarios de atención
- [ ] Preparar términos y condiciones

### Backend:
- [ ] Modificar esquema de base de datos
- [ ] Implementar endpoints nuevos
- [ ] Configurar validaciones
- [ ] Probar generación de mensajes
- [ ] Probar encoding de URLs

### Frontend:
- [ ] Crear componente de formulario
- [ ] Modificar página de carrito
- [ ] Crear página de confirmación
- [ ] Implementar validaciones cliente
- [ ] Testing en navegadores

### Pruebas:
- [ ] Flujo completo desktop
- [ ] Flujo completo móvil
- [ ] Caracteres especiales
- [ ] Emojis en mensajes
- [ ] Múltiples productos
- [ ] Observaciones largas

### Deploy:
- [ ] Actualizar base de datos producción
- [ ] Configurar números reales
- [ ] Capacitar personal
- [ ] Monitorear pedidos
- [ ] Recopilar feedback

---

## 🆘 Troubleshooting

### Problema: WhatsApp no se abre
**Solución:**
- Verificar que el número esté en formato correcto (sin +, sin espacios)
- Probar en modo incógnito
- Verificar que WhatsApp Web esté habilitado

### Problema: Mensaje aparece cortado
**Solución:**
- Reducir longitud del mensaje
- Simplificar formato
- Eliminar emojis innecesarios

### Problema: Caracteres raros (�, ?, etc.)
**Solución:**
- Usar `encodeURIComponent()` correctamente
- Verificar encoding UTF-8
- Probar caracteres especiales individualmente

### Problema: No se guarda en BD
**Solución:**
- Verificar logs de backend
- Revisar validaciones
- Confirmar conexión a BD
- Verificar permisos de tablas

---

## 📞 Contacto y Soporte

Este sistema fue diseñado para **Gustito** con el objetivo de simplificar el proceso de pedidos y eliminar la necesidad de pasarelas de pago complejas.

**Ventajas del sistema:**
- ✅ 100% gratis
- ✅ Comunicación directa
- ✅ Fácil de usar para clientes
- ✅ Control total para la sucursal
- ✅ Sin costos de transacción
- ✅ Implementación simple

**Para implementar este sistema:**
1. Proporciona este documento al agente de IA de backend
2. Sigue el plan de implementación paso a paso
3. Realiza pruebas exhaustivas antes de producción
4. Capacita al personal de las sucursales

---

**Documento creado:** 11 de diciembre de 2025  
**Versión:** 1.0  
**Estado:** Listo para implementación

---

_¡Éxito con la implementación! 🚀_
