# Sistema de Selección de Sucursales

## 📋 Descripción

Este sistema permite a los usuarios seleccionar una sucursal antes de agregar productos al carrito. La sucursal seleccionada se mantiene en el contexto global y en localStorage para persistencia entre sesiones.

## 🎯 Flujo de Usuario

1. **Primera vez agregando al carrito:**
   - Usuario hace clic en "Disponible" en una tarjeta del menú
   - Se abre el modal de detalle del producto
   - Usuario hace clic en "Agregar al carrito"
   - **Si no hay sucursal seleccionada:** Se abre el modal de selección de sucursal
   - Usuario selecciona una sucursal de la lista
   - El producto se agrega al carrito automáticamente
   - Se muestra un toast de confirmación

2. **Agregando más productos:**
   - Si ya hay una sucursal seleccionada, los productos se agregan directamente
   - No se vuelve a mostrar el selector de sucursal

3. **Cambiar de sucursal:**
   - Desde la página del carrito, hacer clic en "Cambiar sucursal"
   - Se abre el modal de selección
   - Al cambiar la sucursal, **el carrito se vacía automáticamente**
   - Esto previene inconsistencias de productos entre sucursales

## 🧩 Componentes Principales

### 1. SucursalSelector.tsx
**Ubicación:** `components/SucursalSelector.tsx`

Modal que muestra la lista de sucursales activas obtenidas del backend.

**Props:**
```typescript
interface SucursalSelectorProps {
  isOpen: boolean;                    // Controla visibilidad del modal
  onClose: () => void;                // Callback al cerrar
  onSelect: (sucursal: Sucursal) => void;  // Callback al seleccionar
  currentSucursal?: Sucursal | null;  // Sucursal actualmente seleccionada
}
```

**Características:**
- Carga sucursales desde `GET /api/sucursales`
- Filtra solo sucursales activas
- Muestra loader mientras carga
- Radio buttons para selección
- Animaciones con Framer Motion

### 2. CartContext.tsx
**Ubicación:** `contexts/CartContext.tsx`

Contexto global que maneja el carrito y la sucursal seleccionada.

**Estado adicional:**
```typescript
sucursal: Sucursal | null;           // Sucursal seleccionada
setSucursal: (sucursal: Sucursal | null) => void;  // Actualizar sucursal
```

**Interfaz Sucursal:**
```typescript
export interface Sucursal {
  id_sucursal: number;
  nombre_sucursal: string;
  direccion_sucursal: string;
}
```

**Lógica de negocio:**
- Al cambiar de sucursal, el carrito se vacía automáticamente
- La sucursal se guarda en `localStorage` con key: `'gustito-sucursal'`
- Se carga automáticamente al iniciar la aplicación

### 3. ProductoDetalle.tsx
**Ubicación:** `components/ProductoDetalle.tsx`

Modal de detalle del producto que integra el selector de sucursal.

**Flujo de agregado al carrito:**
```typescript
const handleAddToCart = () => {
  // Si no hay sucursal seleccionada, mostrar selector
  if (!sucursal) {
    setShowSucursalSelector(true);
    return;
  }
  
  // Si hay sucursal, agregar directamente
  addToCart(comida);
  toastSuccess(`${comida.nombre} agregado al carrito`);
  onClose();
};

const handleSucursalSelected = (selectedSucursal: Sucursal) => {
  setSucursal(selectedSucursal);
  setShowSucursalSelector(false);
  
  // Agregar producto después de seleccionar sucursal
  addToCart(comida);
  toastSuccess(`${comida.nombre} agregado al carrito`);
  onClose();
};
```

### 4. Carrito Page
**Ubicación:** `app/carrito/page.tsx`

Página del carrito que muestra la sucursal seleccionada y permite cambiarla.

**Elementos visuales:**
- Banner con información de sucursal (nombre y dirección)
- Botón "Cambiar sucursal"
- Al cambiar sucursal desde aquí, se vacía el carrito

### 5. Navbar
**Ubicación:** `components/Navbar.tsx`

Muestra un indicador de la sucursal seleccionada en la barra de navegación.

**Características:**
- Icono de MapPin
- Nombre de la sucursal (truncado si es muy largo)
- Solo visible cuando hay sucursal seleccionada
- Animación de entrada

## 💾 Persistencia de Datos

### localStorage Keys:
```javascript
'gustito-cart'      // Array de items del carrito
'gustito-sucursal'  // Objeto de sucursal seleccionada
```

### Ciclo de vida:
1. **Carga inicial:** Se leen ambos valores de localStorage
2. **Actualización:** Cada cambio se guarda automáticamente
3. **Limpieza:** Al cambiar sucursal, se elimina el carrito

## 🔄 Integración con Backend

### Endpoint requerido:
```
GET http://localhost:4000/api/sucursales
```

**Respuesta esperada:**
```json
{
  "ok": true,
  "data": [
    {
      "id_sucursal": 1,
      "nombre_sucursal": "Sucursal Centro",
      "direccion_sucursal": "Av. Principal 123",
      "activo": true
    },
    {
      "id_sucursal": 2,
      "nombre_sucursal": "Sucursal Norte",
      "direccion_sucursal": "Calle Norte 456",
      "activo": true
    }
  ]
}
```

### Endpoints futuros (ver BACKEND_REQUIREMENTS.md):
- `GET /api/sucursales/:id/comidas` - Productos disponibles en sucursal
- `POST /api/sucursales/:id/validar-carrito` - Validar disponibilidad antes de pago

## 🎨 Estilos

### SucursalSelector.module.css
- Modal centrado con overlay
- Cards de sucursal con hover effects
- Radio buttons personalizados
- Animaciones suaves
- Scrollbar personalizado

### carrito.css
**Nuevos estilos:**
- `.carrito-sucursal-info` - Banner de información de sucursal
- `.sucursal-info-content` - Contenedor de texto e icono
- `.carrito-btn-change-sucursal` - Botón de cambio

## 📱 Responsive

- **Desktop:** Sucursal visible en navbar
- **Mobile:** Información visible en carrito
- Modal de selección adaptativo

## ⚠️ Consideraciones Importantes

1. **Limpieza de carrito:** Al cambiar de sucursal, el carrito se vacía para evitar inconsistencias
2. **Validación:** Solo se cargan sucursales activas
3. **UX:** El usuario debe seleccionar sucursal solo una vez, no en cada producto
4. **Persistencia:** La sucursal se mantiene entre sesiones

## 🚀 Próximos Pasos

1. **Validación de disponibilidad:**
   - Antes de pago, validar que todos los productos del carrito estén disponibles en la sucursal
   - Usar endpoint `POST /api/sucursales/:id/validar-carrito`

2. **Precios por sucursal:**
   - Implementar precios diferenciados según sucursal
   - Usar campo `precio_sucursal` de `comidas_sucursales`

3. **Filtrado de productos:**
   - Solo mostrar productos disponibles en la sucursal seleccionada
   - Implementar filtro en el menú

## 🔍 Testing

### Escenarios a probar:

1. ✅ Seleccionar sucursal en primera adición al carrito
2. ✅ Agregar múltiples productos con sucursal ya seleccionada
3. ✅ Cambiar de sucursal desde página de carrito
4. ✅ Verificar que el carrito se vacía al cambiar sucursal
5. ✅ Persistencia de sucursal tras recargar página
6. ✅ Manejo de errores al cargar sucursales
7. ✅ Cerrar modal sin seleccionar (no agrega producto)

## 📚 Documentación Relacionada

- `BACKEND_REQUIREMENTS.md` - Especificaciones para backend
- `README_SUCURSALES.md` - Documentación completa de API de sucursales
- `README_comidas.md` - Documentación de sistema de productos
