# 🏪 API de Sucursales y Carrito - Documentación para Frontend

## 📋 Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Base URL](#base-url)
- [Endpoints de Sucursales](#endpoints-de-sucursales)
- [Endpoints de Comidas por Sucursal](#endpoints-de-comidas-por-sucursal)
- [Endpoint de Validación de Carrito](#endpoint-de-validación-de-carrito)
- [Flujo de Trabajo Completo](#flujo-de-trabajo-completo)
- [Ejemplos de Integración](#ejemplos-de-integración)

---

## 🎯 Descripción General

Esta API permite gestionar **sucursales** (ubicaciones físicas del negocio) y la **disponibilidad de comidas** en cada sucursal. El sistema incluye una funcionalidad crítica de **validación de carrito** que verifica que todos los productos en el carrito estén disponibles en la sucursal seleccionada antes del pago.

### Características Principales:
- ✅ CRUD completo de sucursales
- ✅ Gestión de qué comidas están disponibles en cada sucursal
- ✅ Validación de carrito contra inventario de sucursal
- ✅ Consulta de sucursales donde está disponible una comida específica
- ✅ Asignación individual o múltiple de comidas a sucursales

---

## 🌐 Base URL

```
http://localhost:4000/api
```

---

## 🏢 Endpoints de Sucursales

### 1. Obtener Todas las Sucursales

**GET** `/sucursales`

Retorna todas las sucursales registradas.

**Ejemplo de respuesta exitosa:**
```json
{
  "success": true,
  "cantidad": 2,
  "data": [
    {
      "id_sucursal": 1,
      "nombre": "Sucursal Centro",
      "direccion": "Calle Principal #123",
      "telefono": "+56912345678",
      "horario": "Lun-Vie: 9:00-20:00, Sáb: 10:00-18:00",
      "activo": true
    },
    {
      "id_sucursal": 2,
      "nombre": "Sucursal Mall Plaza",
      "direccion": "Av. Libertador #456, Local 25",
      "telefono": "+56987654321",
      "horario": "Lun-Dom: 10:00-22:00",
      "activo": true
    }
  ]
}
```

**Código Frontend (React):**
```javascript
const obtenerSucursales = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/sucursales');
    const resultado = await response.json();
    
    if (resultado.success) {
      setSucursales(resultado.data);
    }
  } catch (error) {
    console.error('Error al cargar sucursales:', error);
  }
};
```

---

### 2. Obtener una Sucursal por ID

**GET** `/sucursales/:id`

Retorna los detalles de una sucursal específica.

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "id_sucursal": 1,
    "nombre": "Sucursal Centro",
    "direccion": "Calle Principal #123",
    "telefono": "+56912345678",
    "horario": "Lun-Vie: 9:00-20:00, Sáb: 10:00-18:00",
    "activo": true
  }
}
```

---

### 3. Crear Nueva Sucursal

**POST** `/sucursales`

Crea una nueva sucursal.

**Body requerido:**
```json
{
  "nombre": "Sucursal Norte",
  "direccion": "Av. Norte #789",
  "telefono": "+56911223344",
  "horario": "Lun-Vie: 8:00-19:00"
}
```

**Código Frontend (React):**
```javascript
const crearSucursal = async (datosSucursal) => {
  try {
    const response = await fetch('http://localhost:4000/api/sucursales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosSucursal)
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      alert('Sucursal creada exitosamente');
      // Recargar lista de sucursales
      obtenerSucursales();
    } else {
      alert('Error: ' + resultado.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Uso en componente
<form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  crearSucursal({
    nombre: formData.get('nombre'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono'),
    horario: formData.get('horario')
  });
}}>
  <input name="nombre" placeholder="Nombre de la sucursal" required />
  <input name="direccion" placeholder="Dirección" required />
  <input name="telefono" placeholder="Teléfono" required />
  <textarea name="horario" placeholder="Horario de atención"></textarea>
  <button type="submit">Crear Sucursal</button>
</form>
```

---

### 4. Actualizar Sucursal

**PUT** `/sucursales/:id`

Actualiza los datos de una sucursal existente.

**Body (todos los campos son opcionales):**
```json
{
  "nombre": "Sucursal Centro - Actualizado",
  "telefono": "+56900000000",
  "horario": "Lun-Dom: 8:00-21:00"
}
```

---

### 5. Eliminar Sucursal

**DELETE** `/sucursales/:id`

Elimina una sucursal (soft delete - marca como inactivo).

**Ejemplo de uso:**
```javascript
const eliminarSucursal = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta sucursal?')) return;
  
  try {
    const response = await fetch(`http://localhost:4000/api/sucursales/${id}`, {
      method: 'DELETE'
    });
    
    const resultado = await response.json();
    
    if (resultado.success) {
      alert('Sucursal eliminada');
      obtenerSucursales();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🍕 Endpoints de Comidas por Sucursal

### 6. Obtener Comidas Disponibles en una Sucursal

**GET** `/sucursales/:id/comidas`

Retorna todas las comidas disponibles en una sucursal específica.

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "cantidad": 5,
  "data": [
    {
      "id_comida_sucursal": 1,
      "comida_id": 15,
      "nombre_comida": "Pizza Napolitana",
      "descripcion": "Pizza con tomate, mozzarella, jamón y orégano",
      "precio": 8500,
      "imagen_url": "https://ejemplo.com/pizza.jpg",
      "categoria_id": 6,
      "disponible": true
    },
    {
      "id_comida_sucursal": 2,
      "comida_id": 16,
      "nombre_comida": "Hamburguesa Clásica",
      "descripcion": "Carne, lechuga, tomate, queso",
      "precio": 6500,
      "imagen_url": "https://ejemplo.com/burger.jpg",
      "categoria_id": 7,
      "disponible": true
    }
  ]
}
```

**Código Frontend:**
```javascript
const cargarMenuSucursal = async (sucursalId) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/sucursales/${sucursalId}/comidas`
    );
    const resultado = await response.json();
    
    if (resultado.success) {
      setMenuDisponible(resultado.data);
    }
  } catch (error) {
    console.error('Error al cargar menú:', error);
  }
};
```

---

### 7. Asignar una Comida a una Sucursal

**POST** `/sucursales/:sucursalId/comidas`

Agrega una comida al inventario de una sucursal.

**Body:**
```json
{
  "comida_id": 15,
  "disponible": true
}
```

**Código Frontend:**
```javascript
const asignarComidaASucursal = async (sucursalId, comidaId) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/sucursales/${sucursalId}/comidas`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          comida_id: comidaId, 
          disponible: true 
        })
      }
    );
    
    const resultado = await response.json();
    
    if (resultado.success) {
      alert('Comida agregada a la sucursal');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### 8. Asignar Múltiples Comidas a una Sucursal

**POST** `/sucursales/:sucursalId/comidas/multiple`

Agrega varias comidas al inventario de una sucursal en una sola operación.

**Body:**
```json
{
  "comidas": [
    { "comida_id": 15, "disponible": true },
    { "comida_id": 16, "disponible": true },
    { "comida_id": 17, "disponible": false }
  ]
}
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "message": "Comidas asignadas a la sucursal",
  "cantidad": 3,
  "data": [
    { "id_comida_sucursal": 10, "comida_id": 15, "sucursal_id": 1, "disponible": true },
    { "id_comida_sucursal": 11, "comida_id": 16, "sucursal_id": 1, "disponible": true },
    { "id_comida_sucursal": 12, "comida_id": 17, "sucursal_id": 1, "disponible": false }
  ]
}
```

**Código Frontend:**
```javascript
const asignarVariasComidas = async (sucursalId, listaComidas) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/sucursales/${sucursalId}/comidas/multiple`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comidas: listaComidas })
      }
    );
    
    const resultado = await response.json();
    
    if (resultado.success) {
      alert(`${resultado.cantidad} comidas asignadas correctamente`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejemplo de uso: asignar todo el menú de pizzas a una sucursal
const comidasPizzas = [
  { comida_id: 15, disponible: true },
  { comida_id: 16, disponible: true },
  { comida_id: 17, disponible: true }
];

asignarVariasComidas(1, comidasPizzas);
```

---

### 9. Actualizar Disponibilidad de una Comida en Sucursal

**PATCH** `/sucursales/:sucursalId/comidas/:comidaId`

Cambia el estado de disponibilidad de una comida en una sucursal (sin eliminarla).

**Body:**
```json
{
  "disponible": false
}
```

**Código Frontend:**
```javascript
const toggleDisponibilidad = async (sucursalId, comidaId, disponible) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/sucursales/${sucursalId}/comidas/${comidaId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disponible })
      }
    );
    
    const resultado = await response.json();
    
    if (resultado.success) {
      alert(`Producto ${disponible ? 'activado' : 'desactivado'}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### 10. Quitar Comida de una Sucursal

**DELETE** `/sucursales/:sucursalId/comidas/:comidaId`

Elimina completamente una comida del inventario de la sucursal.

**Código Frontend:**
```javascript
const quitarComidaDeSucursal = async (sucursalId, comidaId) => {
  if (!confirm('¿Eliminar este producto de la sucursal?')) return;
  
  try {
    const response = await fetch(
      `http://localhost:4000/api/sucursales/${sucursalId}/comidas/${comidaId}`,
      { method: 'DELETE' }
    );
    
    const resultado = await response.json();
    
    if (resultado.success) {
      alert('Producto eliminado de la sucursal');
      cargarMenuSucursal(sucursalId);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### 11. Obtener Sucursales donde está Disponible una Comida

**GET** `/comidas/:id/sucursales`

Retorna todas las sucursales donde una comida específica está disponible.

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "comida_id": 15,
  "cantidad": 2,
  "data": [
    {
      "sucursal_id": 1,
      "nombre": "Sucursal Centro",
      "direccion": "Calle Principal #123",
      "telefono": "+56912345678",
      "disponible": true
    },
    {
      "sucursal_id": 2,
      "nombre": "Sucursal Mall Plaza",
      "direccion": "Av. Libertador #456",
      "telefono": "+56987654321",
      "disponible": true
    }
  ]
}
```

**Código Frontend:**
```javascript
const verDondeEstaDisponible = async (comidaId) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/comidas/${comidaId}/sucursales`
    );
    const resultado = await response.json();
    
    if (resultado.success) {
      // Mostrar lista de sucursales donde está disponible
      setSucursalesDisponibles(resultado.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🛒 Endpoint de Validación de Carrito

### 12. Validar Carrito contra Sucursal

**POST** `/carrito/validar`

**⭐ ENDPOINT CRÍTICO PARA CHECKOUT ⭐**

Valida que todos los productos en el carrito estén disponibles en la sucursal seleccionada antes de proceder al pago. Calcula el total y retorna información detallada sobre productos válidos y no disponibles.

**Body requerido:**
```json
{
  "sucursal_id": 1,
  "items": [
    { "comida_id": 15, "cantidad": 2 },
    { "comida_id": 16, "cantidad": 1 },
    { "comida_id": 20, "cantidad": 3 }
  ]
}
```

**Ejemplo de respuesta exitosa (todos los productos disponibles):**
```json
{
  "success": true,
  "valido": true,
  "message": "Todos los productos están disponibles en la sucursal seleccionada",
  "sucursal": {
    "id_sucursal": 1,
    "nombre": "Sucursal Centro",
    "direccion": "Calle Principal #123"
  },
  "total_items": 6,
  "total_precio": 40000,
  "items_validos": [
    {
      "comida_id": 15,
      "nombre_comida": "Pizza Napolitana",
      "precio": 8500,
      "cantidad": 2,
      "subtotal": 17000,
      "disponible": true
    },
    {
      "comida_id": 16,
      "nombre_comida": "Hamburguesa Clásica",
      "precio": 6500,
      "cantidad": 1,
      "subtotal": 6500,
      "disponible": true
    },
    {
      "comida_id": 20,
      "nombre_comida": "Papas Fritas",
      "precio": 2500,
      "cantidad": 3,
      "subtotal": 7500,
      "disponible": true
    }
  ],
  "items_no_disponibles": []
}
```

**Ejemplo de respuesta con productos no disponibles:**
```json
{
  "success": true,
  "valido": false,
  "message": "Algunos productos no están disponibles en esta sucursal",
  "sucursal": {
    "id_sucursal": 1,
    "nombre": "Sucursal Centro",
    "direccion": "Calle Principal #123"
  },
  "total_items": 4,
  "total_precio": 17000,
  "items_validos": [
    {
      "comida_id": 15,
      "nombre_comida": "Pizza Napolitana",
      "precio": 8500,
      "cantidad": 2,
      "subtotal": 17000,
      "disponible": true
    }
  ],
  "items_no_disponibles": [
    {
      "comida_id": 25,
      "nombre_comida": "Sushi Roll",
      "cantidad": 2,
      "razon": "No disponible en esta sucursal"
    }
  ]
}
```

---

## 🔄 Flujo de Trabajo Completo

### Flujo de Checkout (Proceso de Pago)

```javascript
// ============================================
// FLUJO COMPLETO DE CHECKOUT CON VALIDACIÓN
// ============================================

// 1. Usuario selecciona sucursal al inicio
const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
const [carrito, setCarrito] = useState([]);

// 2. Cargar solo las comidas disponibles en esa sucursal
useEffect(() => {
  if (sucursalSeleccionada) {
    cargarMenuSucursal(sucursalSeleccionada.id_sucursal);
  }
}, [sucursalSeleccionada]);

// 3. Usuario agrega productos al carrito
const agregarAlCarrito = (comida, cantidad) => {
  setCarrito([...carrito, { comida_id: comida.id_comida, cantidad }]);
};

// 4. Al momento de PAGAR, validar el carrito
const procederAlPago = async () => {
  try {
    // Construir payload de validación
    const payload = {
      sucursal_id: sucursalSeleccionada.id_sucursal,
      items: carrito.map(item => ({
        comida_id: item.comida_id,
        cantidad: item.cantidad
      }))
    };
    
    // Llamar al endpoint de validación
    const response = await fetch('http://localhost:4000/api/carrito/validar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const resultado = await response.json();
    
    if (!resultado.success) {
      alert('Error al validar carrito');
      return;
    }
    
    // Verificar si el carrito es válido
    if (resultado.valido) {
      // ✅ TODOS LOS PRODUCTOS DISPONIBLES - PROCEDER AL PAGO
      console.log('Total a pagar:', resultado.total_precio);
      console.log('Productos:', resultado.items_validos);
      
      // Redirigir a pasarela de pago o confirmar orden
      confirmarOrden(resultado);
      
    } else {
      // ❌ HAY PRODUCTOS NO DISPONIBLES
      alert('Algunos productos ya no están disponibles en esta sucursal');
      
      // Mostrar productos no disponibles
      resultado.items_no_disponibles.forEach(item => {
        console.log(`${item.nombre_comida}: ${item.razon}`);
      });
      
      // Opción: actualizar carrito eliminando productos no disponibles
      const idsValidos = resultado.items_validos.map(i => i.comida_id);
      setCarrito(carrito.filter(i => idsValidos.includes(i.comida_id)));
    }
    
  } catch (error) {
    console.error('Error al validar carrito:', error);
    alert('Error de conexión');
  }
};
```

---

## 🎨 Ejemplos de Integración

### Componente Selector de Sucursal

```javascript
import { useState, useEffect } from 'react';

function SelectorSucursal({ onSucursalSeleccionada }) {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('http://localhost:4000/api/sucursales')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSucursales(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <p>Cargando sucursales...</p>;
  
  return (
    <div className="selector-sucursal">
      <h3>Selecciona una sucursal:</h3>
      <div className="lista-sucursales">
        {sucursales.map(sucursal => (
          <div 
            key={sucursal.id_sucursal}
            className="sucursal-card"
            onClick={() => onSucursalSeleccionada(sucursal)}
          >
            <h4>{sucursal.nombre}</h4>
            <p>{sucursal.direccion}</p>
            <p>📞 {sucursal.telefono}</p>
            <p>🕒 {sucursal.horario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectorSucursal;
```

---

### Componente Menú por Sucursal

```javascript
import { useState, useEffect } from 'react';

function MenuSucursal({ sucursalId, onAgregarAlCarrito }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`http://localhost:4000/api/sucursales/${sucursalId}/comidas`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filtrar solo productos disponibles
          setMenu(data.data.filter(item => item.disponible));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [sucursalId]);
  
  if (loading) return <p>Cargando menú...</p>;
  
  return (
    <div className="menu-grid">
      {menu.map(comida => (
        <div key={comida.comida_id} className="comida-card">
          <img src={comida.imagen_url} alt={comida.nombre_comida} />
          <h4>{comida.nombre_comida}</h4>
          <p>{comida.descripcion}</p>
          <p className="precio">${comida.precio.toLocaleString()}</p>
          <button onClick={() => onAgregarAlCarrito(comida)}>
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}

export default MenuSucursal;
```

---

### Componente Validación de Carrito

```javascript
import { useState } from 'react';

function BotonPagar({ sucursalId, carrito }) {
  const [validando, setValidando] = useState(false);
  
  const validarYPagar = async () => {
    setValidando(true);
    
    try {
      const payload = {
        sucursal_id: sucursalId,
        items: carrito.map(item => ({
          comida_id: item.id_comida,
          cantidad: item.cantidad
        }))
      };
      
      const response = await fetch('http://localhost:4000/api/carrito/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const resultado = await response.json();
      
      if (resultado.success && resultado.valido) {
        // Carrito válido - proceder al pago
        alert(`Total a pagar: $${resultado.total_precio.toLocaleString()}`);
        // Redirigir a checkout
        window.location.href = '/checkout';
      } else {
        // Mostrar productos no disponibles
        alert(
          'Productos no disponibles:\n' + 
          resultado.items_no_disponibles
            .map(i => `- ${i.nombre_comida}`)
            .join('\n')
        );
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al validar carrito');
    } finally {
      setValidando(false);
    }
  };
  
  return (
    <button 
      onClick={validarYPagar} 
      disabled={validando || carrito.length === 0}
      className="btn-pagar"
    >
      {validando ? 'Validando...' : 'Proceder al Pago'}
    </button>
  );
}

export default BotonPagar;
```

---

## 🚀 Panel de Administración - Gestión de Inventario

```javascript
function PanelInventarioSucursal({ sucursalId }) {
  const [comidasDisponibles, setComidasDisponibles] = useState([]);
  const [todasLasComidas, setTodasLasComidas] = useState([]);
  
  useEffect(() => {
    // Cargar comidas de la sucursal
    fetch(`http://localhost:4000/api/sucursales/${sucursalId}/comidas`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setComidasDisponibles(data.data);
      });
    
    // Cargar todas las comidas
    fetch('http://localhost:4000/api/comidas')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTodasLasComidas(data.data);
      });
  }, [sucursalId]);
  
  const agregarComida = async (comidaId) => {
    const response = await fetch(
      `http://localhost:4000/api/sucursales/${sucursalId}/comidas`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comida_id: comidaId, disponible: true })
      }
    );
    
    if (response.ok) {
      alert('Comida agregada');
      // Recargar inventario
    }
  };
  
  const toggleDisponibilidad = async (comidaId, disponible) => {
    const response = await fetch(
      `http://localhost:4000/api/sucursales/${sucursalId}/comidas/${comidaId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disponible: !disponible })
      }
    );
    
    if (response.ok) {
      alert('Disponibilidad actualizada');
      // Recargar inventario
    }
  };
  
  return (
    <div>
      <h2>Inventario de la Sucursal</h2>
      
      {/* Lista de comidas en inventario */}
      <div>
        <h3>Productos en esta sucursal:</h3>
        {comidasDisponibles.map(comida => (
          <div key={comida.comida_id}>
            <span>{comida.nombre_comida}</span>
            <label>
              <input 
                type="checkbox" 
                checked={comida.disponible}
                onChange={() => toggleDisponibilidad(
                  comida.comida_id, 
                  comida.disponible
                )}
              />
              Disponible
            </label>
          </div>
        ))}
      </div>
      
      {/* Agregar nuevas comidas */}
      <div>
        <h3>Agregar productos:</h3>
        {todasLasComidas
          .filter(c => !comidasDisponibles.find(d => d.comida_id === c.id_comida))
          .map(comida => (
            <div key={comida.id_comida}>
              <span>{comida.nombre_comida}</span>
              <button onClick={() => agregarComida(comida.id_comida)}>
                Agregar
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Implementación

### Para el Frontend de Clientes:
- [ ] Implementar selector de sucursal al inicio
- [ ] Cargar menú dinámicamente según sucursal seleccionada
- [ ] Agregar productos al carrito con cantidades
- [ ] Implementar botón "Proceder al Pago" con validación
- [ ] Manejar casos de productos no disponibles
- [ ] Mostrar total calculado por el backend

### Para el Panel de Administración:
- [ ] CRUD de sucursales
- [ ] Gestión de inventario por sucursal
- [ ] Toggle de disponibilidad de productos
- [ ] Asignación masiva de productos a sucursales

---

## 🔐 Notas de Seguridad

> **IMPORTANTE**: Estos endpoints actualmente NO tienen autenticación. Recomendaciones:
> - Agregar middleware de autenticación para endpoints de administración
> - Proteger endpoints de creación/edición/eliminación
> - Mantener público solo: listado de sucursales, menú por sucursal, validación de carrito

---

## 📞 Soporte

Para dudas o problemas:
- Revisar logs del servidor en consola
- Verificar que Supabase esté configurado correctamente
- Asegurarse de que las tablas `sucursales` y `comidas_sucursales` existan

---

**Versión:** 1.0.0  
**Fecha:** Diciembre 2025  
**Backend:** Node.js + Express + Supabase
