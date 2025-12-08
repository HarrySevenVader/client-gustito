# 📧 Sistema de Consultas/Contacto - Documentación Frontend

## 🎯 Descripción General
Sistema completo para gestionar consultas de clientes desde la vista pública hacia el panel de administración.

---

## 📡 Endpoints Disponibles

### **VISTA PÚBLICA**

#### **1. Enviar Consulta**
```
POST http://localhost:4000/api/consultas
```

**Uso:** Formulario de contacto público donde los clientes envían sus consultas.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan.perez@ejemplo.com",
  "celular": "987654321",
  "mensaje": "Hola, me gustaría obtener más información sobre sus servicios."
}
```

**Todos los campos son OBLIGATORIOS:**
- `nombre` (string) - Nombre del cliente
- `apellido` (string) - Apellido del cliente
- `correo` (string) - Email válido
- `celular` (string) - Número de teléfono
- `mensaje` (string) - Máximo 500 caracteres

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "mensaje": "Tu consulta ha sido enviada exitosamente. Te contactaremos pronto.",
  "data": {
    "id_consulta": 1,
    "fecha_envio": "2025-12-08T10:30:00.000Z"
  }
}
```

**Errores posibles:**
- `400` - Campos faltantes o inválidos
- `400` - Correo electrónico con formato inválido
- `400` - Mensaje excede 500 caracteres
- `500` - Error del servidor

---

### **PANEL DE ADMINISTRACIÓN**

#### **2. Listar Todas las Consultas**
```
GET http://localhost:4000/api/consultas
```

**Uso:** Ver todas las consultas recibidas en el panel de administración.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "total": 5,
  "data": [
    {
      "id_consulta": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "juan.perez@ejemplo.com",
      "celular": "987654321",
      "mensaje": "Hola, me gustaría obtener más información...",
      "fecha_envio": "2025-12-08T10:30:00.000Z"
    }
  ]
}
```

---

#### **3. Ver Consulta Específica**
```
GET http://localhost:4000/api/consultas/:id
```

**Ejemplo:** `GET http://localhost:4000/api/consultas/1`

**Uso:** Ver detalles completos de una consulta específica.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": {
    "id_consulta": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan.perez@ejemplo.com",
    "celular": "987654321",
    "mensaje": "Hola, me gustaría obtener más información...",
    "fecha_envio": "2025-12-08T10:30:00.000Z"
  }
}
```

**Errores:**
- `404` - Consulta no encontrada

---

#### **4. Consultas Recientes (Últimas 10)**
```
GET http://localhost:4000/api/consultas/recientes
```

**Uso:** Dashboard del admin - mostrar últimas consultas recibidas.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id_consulta": 10,
      "nombre": "María",
      "apellido": "González",
      "correo": "maria@ejemplo.com",
      "celular": "912345678",
      "mensaje": "Consulta sobre horarios de atención",
      "fecha_envio": "2025-12-08T15:00:00.000Z"
    }
  ]
}
```

---

#### **5. Estadísticas de Consultas**
```
GET http://localhost:4000/api/consultas/estadisticas
```

**Uso:** Dashboard - mostrar total de consultas recibidas.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "data": {
    "total_consultas": 45
  }
}
```

---

#### **6. Eliminar Consulta**
```
DELETE http://localhost:4000/api/consultas/:id
```

**Ejemplo:** `DELETE http://localhost:4000/api/consultas/1`

**Uso:** Eliminar consultas ya atendidas o no relevantes del panel de administración.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Consulta eliminada exitosamente"
}
```

**Errores:**
- `404` - Consulta no encontrada
- `500` - Error del servidor

---

## 🎨 Implementación en el Frontend

### **VISTA PÚBLICA - Formulario de Contacto**

#### Componente del Formulario
```jsx
import { useState } from 'react';

function FormularioContacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    celular: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.correo || 
        !formData.celular || !formData.mensaje) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    // Validar longitud del mensaje
    if (formData.mensaje.length > 500) {
      setError('El mensaje no puede exceder los 500 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/consultas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.mensaje);
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          correo: '',
          celular: '',
          mensaje: ''
        });
      } else {
        setError(data.mensaje);
      }
    } catch (error) {
      setError('Error al enviar la consulta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Envía tu mensaje</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div>
        <label>Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingresa tu nombre"
          required
        />
      </div>

      <div>
        <label>Apellido *</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          placeholder="Ingresa tu apellido"
          required
        />
      </div>

      <div>
        <label>Correo electrónico *</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          required
        />
      </div>

      <div>
        <label>Número de teléfono móvil *</label>
        <input
          type="tel"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          placeholder="1234567890"
          required
        />
      </div>

      <div>
        <label>Mensaje *</label>
        <textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Escribe tu mensaje aquí..."
          maxLength={500}
          required
        />
        <small>{formData.mensaje.length}/500</small>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}

export default FormularioContacto;
```

---

### **PANEL ADMIN - Lista de Consultas**

```jsx
import { useState, useEffect } from 'react';

function ListaConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarConsultas();
  }, []);

  const cargarConsultas = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/consultas');
      const data = await response.json();

      if (response.ok) {
        setConsultas(data.data);
      } else {
        setError(data.mensaje);
      }
    } catch (error) {
      setError('Error al cargar las consultas');
    } finally {
      setLoading(false);
    }
  };

  const eliminarConsulta = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta consulta?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/consultas/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        cargarConsultas(); // Recargar lista
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      alert('Error al eliminar la consulta');
    }
  };

  if (loading) return <div>Cargando consultas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Consultas Recibidas ({consultas.length})</h2>

      {consultas.length === 0 ? (
        <p>No hay consultas pendientes</p>
      ) : (
        <div className="lista-consultas">
          {consultas.map(consulta => (
            <div key={consulta.id_consulta} className="consulta-card">
              <div className="consulta-header">
                <h3>{consulta.nombre} {consulta.apellido}</h3>
                <span className="fecha">
                  {new Date(consulta.fecha_envio).toLocaleString()}
                </span>
              </div>

              <div className="consulta-info">
                <p><strong>Email:</strong> {consulta.correo}</p>
                <p><strong>Teléfono:</strong> {consulta.celular}</p>
              </div>

              <div className="consulta-mensaje">
                <p><strong>Mensaje:</strong></p>
                <p>{consulta.mensaje}</p>
              </div>

              <div className="consulta-acciones">
                <button
                  onClick={() => eliminarConsulta(consulta.id_consulta)}
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaConsultas;
```

---

### **PANEL ADMIN - Dashboard con Estadísticas**

```jsx
import { useState, useEffect } from 'react';

function DashboardConsultas() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [recientes, setRecientes] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar estadísticas
      const resStats = await fetch('http://localhost:4000/api/consultas/estadisticas');
      const dataStats = await resStats.json();
      if (resStats.ok) setEstadisticas(dataStats.data);

      // Cargar consultas recientes
      const resRecientes = await fetch('http://localhost:4000/api/consultas/recientes');
      const dataRecientes = await resRecientes.json();
      if (resRecientes.ok) setRecientes(dataRecientes.data);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard de Consultas</h2>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="stats-card">
          <h3>Total de Consultas Recibidas</h3>
          <p className="stat-number">{estadisticas.total_consultas}</p>
        </div>
      )}

      {/* Consultas Recientes */}
      <div className="recientes">
        <h3>Últimas Consultas</h3>
        {recientes.length === 0 ? (
          <p>No hay consultas recientes</p>
        ) : (
          <ul>
            {recientes.map(c => (
              <li key={c.id_consulta}>
                <strong>{c.nombre} {c.apellido}</strong> - {c.correo}
                <br />
                <small>{new Date(c.fecha_envio).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardConsultas;
```

---

## ✅ Checklist de Implementación

### **Vista Pública**
- [ ] Crear formulario de contacto con todos los campos
- [ ] Validar campos obligatorios
- [ ] Validar formato de email
- [ ] Validar límite de 500 caracteres en mensaje
- [ ] Mostrar contador de caracteres
- [ ] Implementar función para enviar consulta
- [ ] Mostrar mensaje de éxito
- [ ] Limpiar formulario después de enviar
- [ ] Mostrar errores de validación
- [ ] Deshabilitar botón mientras se envía

### **Panel de Administración**
- [ ] Crear vista para listar todas las consultas
- [ ] Mostrar información completa de cada consulta
- [ ] Implementar función para eliminar consultas
- [ ] Confirmación antes de eliminar
- [ ] Actualizar lista después de eliminar
- [ ] Crear dashboard con estadísticas
- [ ] Mostrar consultas recientes en dashboard
- [ ] Formatear fechas correctamente
- [ ] Agregar indicadores de carga

---

## 🔐 Notas de Seguridad

- La ruta `POST /api/consultas` es **PÚBLICA** (cualquiera puede enviar consultas)
- Las rutas `GET` y `DELETE` deberían estar **protegidas con autenticación** en producción
- Validar y sanitizar todos los inputs para prevenir inyecciones
- Considerar agregar rate limiting para prevenir spam
- Implementar CAPTCHA en el formulario público para prevenir bots

---

## 💡 Mejoras Futuras Sugeridas

1. **Marcar como leída:** Agregar campo `leida: boolean` para saber qué consultas ya fueron atendidas
2. **Responder consulta:** Sistema para responder directamente desde el panel
3. **Filtros:** Filtrar consultas por fecha, leídas/no leídas
4. **Búsqueda:** Buscar consultas por nombre, email o contenido
5. **Exportar:** Descargar consultas en CSV/Excel
6. **Notificaciones:** Email al admin cuando llega nueva consulta

---

## 🚀 Para Empezar

1. Asegúrate de que el backend esté corriendo
2. Verifica que la tabla `consultas_contacto` exista en Supabase con RLS configurado
3. Implementa primero el formulario público
4. Prueba enviar consultas
5. Implementa el panel de administración
6. Prueba listar y eliminar consultas

¡El sistema está listo para usarse! 🎉
