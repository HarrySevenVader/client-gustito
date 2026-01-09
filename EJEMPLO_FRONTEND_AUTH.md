# 🔐 Guía de Implementación de Autenticación en Frontend

## 🎯 Contexto: ¿Qué cambió en el Backend?

### ⚠️ IMPORTANTE: El backend ahora está protegido

Hemos implementado **autenticación y autorización con JWT** en el backend para proteger las rutas administrativas. Esto significa que:

**❌ ANTES (Inseguro)**:
```javascript
// Cualquiera podía hacer esto sin autenticación:
fetch('https://tu-api.com/api/comidas', {
  method: 'POST',
  body: JSON.stringify({ nombre_comida: 'Pizza', precio: 10000 })
})
// ✅ Funcionaba sin ninguna verificación
```

**✅ AHORA (Seguro)**:
```javascript
// Ahora el backend responde:
// ❌ 401 Unauthorized - "Se requiere autenticación"

// Necesitas enviar un token JWT:
fetch('https://tu-api.com/api/comidas', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}` // ← OBLIGATORIO
  },
  body: JSON.stringify({ nombre_comida: 'Pizza', precio: 10000 })
})
// ✅ Ahora sí funciona
```

### 📊 Rutas Afectadas

| Ruta | Antes | Ahora | Acción Necesaria |
|------|-------|-------|------------------|
| `GET /api/menu` | 🌍 Pública | 🌍 Pública | ✅ Sigue funcionando sin cambios |
| `GET /api/noticias/activas` | 🌍 Pública | 🌍 Pública | ✅ Sigue funcionando sin cambios |
| `POST /api/consultas` | 🌍 Pública | 🌍 Pública | ✅ Sigue funcionando sin cambios |
| `POST /api/comidas` | ⚠️ Sin protección | 🔒 Requiere Admin | ⚡ DEBES agregar autenticación |
| `PUT /api/comidas/:id` | ⚠️ Sin protección | 🔒 Requiere Admin | ⚡ DEBES agregar autenticación |
| `DELETE /api/comidas/:id` | ⚠️ Sin protección | 🔒 Requiere Admin | ⚡ DEBES agregar autenticación |
| `POST /api/noticias` | ⚠️ Sin protección | 🔒 Requiere Admin | ⚡ DEBES agregar autenticación |
| `PUT /api/noticias/:id` | ⚠️ Sin protección | 🔒 Requiere Admin | ⚡ DEBES agregar autenticación |
| `DELETE /api/noticias/:id` | ⚠️ Sin protección | 🔒 Requiere Admin | ⚡ DEBES agregar autenticación |
| `GET /api/consultas` | ⚠️ Sin protección | 🔒 Requiere Admin | ⚡ DEBES agregar autenticación |

### 🚨 ¿Qué pasará si no actualizas el frontend?

Si intentas usar las funciones administrativas sin implementar autenticación:

```javascript
// Tu código actual del panel de admin probablemente hace:
const crearComida = async (comida) => {
  const res = await fetch(`${API_URL}/comidas`, {
    method: 'POST',
    body: JSON.stringify(comida)
  })
  // ❌ Error: 401 Unauthorized
  // ❌ Tu panel de admin NO funcionará
}
```

**Resultado**: ❌ Todo el panel de administración dejará de funcionar

### ✅ ¿Qué necesitas hacer?

Esta guía te muestra **paso a paso** cómo:
1. Implementar un sistema de login para administradores
2. Obtener y almacenar el token JWT de Supabase
3. Enviar el token en todas las peticiones administrativas
4. Proteger las rutas del panel de admin en el frontend
5. Manejar errores de autenticación (token expirado, sin permisos, etc.)

---

## 📋 Tabla de Contenidos

1. [Contexto: ¿Qué cambió en el Backend?](#-contexto-qué-cambió-en-el-backend)
2. [Configurar Supabase Auth en Frontend](#1-configurar-supabase-auth-en-frontend)
3. [Crear Sistema de Login](#2-crear-sistema-de-login)
4. [Almacenar el Token](#3-almacenar-el-token)
5. [Enviar Token en Peticiones](#4-enviar-token-en-peticiones)
6. [Manejar Errores de Autenticación](#5-manejar-errores-de-autenticación)
7. [Actualizar Componentes Existentes](#6-actualizar-componentes-existentes-del-panel-admin)
8. [Testing y Verificación](#7-testing-y-verificación)

---

## 1. Configurar Supabase Auth en Frontend

### Instalación

```bash
npm install @supabase/supabase-js
```

### Configuración (React)

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Variables de Entorno (.env)

```env
REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Crear Sistema de Login

### Componente de Login (React)

```jsx
// src/components/Login.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Autenticar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // El token se guarda automáticamente en localStorage por Supabase
      console.log('Login exitoso:', data.user)
      
      // Redirigir al dashboard de admin
      window.location.href = '/admin'

    } catch (error) {
      console.error('Error en login:', error)
      setError(error.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión - Admin</h2>
      
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  )
}
```

---

## 3. Almacenar el Token

El token JWT se guarda automáticamente cuando usas `supabase.auth.signInWithPassword()`.

### Verificar si hay Usuario Logueado

```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

### Componente Protegido (Solo Admin)

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    // Si no hay usuario, redirigir al login
    return <Navigate to="/login" replace />
  }

  // Verificar si es admin (opcional)
  const isAdmin = user.user_metadata?.role === 'admin'
  
  if (!isAdmin) {
    return <div>No tienes permisos de administrador</div>
  }

  return children
}
```

---

## 4. Enviar Token en Peticiones

### Opción A: Manualmente en cada petición

```javascript
// Obtener el token actual
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Hacer petición con el token
const response = await fetch('https://tu-api.com/api/comidas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ← Enviar el token
  },
  body: JSON.stringify({
    nombre_comida: 'Pizza',
    precio: 10000
  })
})

const data = await response.json()
```

### Opción B: Crear un Cliente HTTP con Token Automático (Recomendado)

```javascript
// src/lib/api.js
import { supabase } from './supabase'

const API_URL = process.env.REACT_APP_API_URL || 'https://tu-api.com/api'

/**
 * Cliente HTTP que incluye el token automáticamente
 */
class ApiClient {
  async request(endpoint, options = {}) {
    // Obtener el token de la sesión actual
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    // Configurar headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Agregar token si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Hacer la petición
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Manejar errores HTTP
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.mensaje || 'Error en la petición')
    }

    return response.json()
  }

  // Métodos de conveniencia
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
```

### Usar el Cliente HTTP

```javascript
// src/services/comidasService.js
import { api } from '../lib/api'

export const comidasService = {
  // Obtener todas las comidas (público)
  async obtenerTodas() {
    return api.get('/comidas')
  },

  // Crear comida (requiere autenticación de admin)
  async crear(comida) {
    return api.post('/comidas', comida)
  },

  // Actualizar comida (requiere autenticación de admin)
  async actualizar(id, comida) {
    return api.put(`/comidas/${id}`, comida)
  },

  // Eliminar comida (requiere autenticación de admin)
  async eliminar(id) {
    return api.delete(`/comidas/${id}`)
  },
}
```

### Uso en Componentes

```jsx
// src/pages/AdminComidas.jsx
import { useState, useEffect } from 'react'
import { comidasService } from '../services/comidasService'

export default function AdminComidas() {
  const [comidas, setComidas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar comidas
  useEffect(() => {
    cargarComidas()
  }, [])

  const cargarComidas = async () => {
    try {
      setLoading(true)
      const data = await comidasService.obtenerTodas()
      setComidas(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Crear nueva comida
  const crearComida = async (nuevaComida) => {
    try {
      await comidasService.crear(nuevaComida)
      alert('Comida creada exitosamente')
      cargarComidas() // Recargar lista
    } catch (err) {
      alert('Error al crear comida: ' + err.message)
    }
  }

  // Eliminar comida
  const eliminarComida = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta comida?')) return

    try {
      await comidasService.eliminar(id)
      alert('Comida eliminada')
      cargarComidas() // Recargar lista
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  return (
    <div>
      <h1>Administrar Comidas</h1>
      
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {comidas.map(comida => (
          <li key={comida.id_comida}>
            {comida.nombre_comida} - ${comida.precio}
            <button onClick={() => eliminarComida(comida.id_comida)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 5. Manejar Errores de Autenticación

### Interceptor de Errores

```javascript
// src/lib/api.js (actualizado)
class ApiClient {
  async request(endpoint, options = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      })

      // ❌ Error 401: No autenticado o token expirado
      if (response.status === 401) {
        // Cerrar sesión y redirigir al login
        await supabase.auth.signOut()
        window.location.href = '/login'
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      }

      // ❌ Error 403: Sin permisos
      if (response.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción.')
      }

      // ❌ Otros errores HTTP
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.mensaje || 'Error en la petición')
      }

      return response.json()

    } catch (error) {
      console.error('Error en petición:', error)
      throw error
    }
  }
}
```

---

## 6. Actualizar Componentes Existentes del Panel Admin

### 🔧 Ajustes Necesarios en Tu Frontend Actual

Si ya tienes un panel de administración funcionando, necesitas actualizar:

#### A. Modificar tus servicios/funciones API

**ANTES (Sin autenticación)**:
```javascript
// src/services/comidasService.js
export const crearComida = async (comida) => {
  const response = await fetch(`${API_URL}/comidas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(comida)
  })
  return response.json()
}
```

**DESPUÉS (Con autenticación)**:
```javascript
// src/services/comidasService.js
import { supabase } from '../lib/supabase'

export const crearComida = async (comida) => {
  // Obtener token de la sesión actual
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('No hay sesión activa. Por favor, inicia sesión.')
  }
  
  const response = await fetch(`${API_URL}/comidas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}` // ← Token agregado
    },
    body: JSON.stringify(comida)
  })
  
  if (response.status === 401) {
    // Token expirado o inválido
    await supabase.auth.signOut()
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }
  
  return response.json()
}
```

#### B. Proteger rutas del panel admin

```jsx
// src/App.jsx o tu router principal
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Cargando...</div>
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Verificar si es admin
  const isAdmin = user.user_metadata?.role === 'admin'
  if (!isAdmin) {
    return <div>⛔ Acceso denegado. Solo administradores.</div>
  }
  
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/noticias" element={<NoticiasPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas (Panel Admin) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="comidas" element={<AdminComidas />} />
          <Route path="noticias" element={<AdminNoticias />} />
          <Route path="consultas" element={<AdminConsultas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

#### C. Agregar botón de cerrar sesión

```jsx
// src/components/AdminHeader.jsx
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function AdminHeader() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }
  
  return (
    <header className="admin-header">
      <h1>Panel de Administración</h1>
      <div className="user-info">
        <span>👤 {user?.email}</span>
        <button onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}
```

#### D. Actualizar TODAS las operaciones CRUD

Necesitas actualizar estas funciones en tu frontend para incluir el token:

**Comidas**:
- ✅ `crearComida()` → Agregar `Authorization` header
- ✅ `actualizarComida()` → Agregar `Authorization` header
- ✅ `eliminarComida()` → Agregar `Authorization` header
- ✅ `restaurarComida()` → Agregar `Authorization` header
- ❌ `obtenerComidas()` → NO necesita cambios (pública)

**Noticias**:
- ✅ `crearNoticia()` → Agregar `Authorization` header
- ✅ `actualizarNoticia()` → Agregar `Authorization` header
- ✅ `eliminarNoticia()` → Agregar `Authorization` header
- ✅ `restaurarNoticia()` → Agregar `Authorization` header
- ✅ `obtenerNoticias()` (admin) → Agregar `Authorization` header
- ❌ `obtenerNoticiasActivas()` → NO necesita cambios (pública)

**Consultas**:
- ✅ `obtenerConsultas()` → Agregar `Authorization` header
- ✅ `eliminarConsulta()` → Agregar `Authorization` header
- ❌ `enviarConsulta()` → NO necesita cambios (pública)

### 💡 Consejo: Crear un Cliente HTTP Reutilizable

Para no repetir código, crea un cliente HTTP:

```javascript
// src/lib/apiClient.js
import { supabase } from './supabase'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

class ApiClient {
  async request(endpoint, options = {}) {
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })
    
    if (response.status === 401) {
      await supabase.auth.signOut()
      window.location.href = '/login'
      throw new Error('Sesión expirada')
    }
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.mensaje || 'Error en la petición')
    }
    
    return response.json()
  }
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
```

**Luego úsalo así**:

```javascript
// src/services/comidasService.js
import { api } from '../lib/apiClient'

export const comidasService = {
  obtenerTodas: () => api.get('/comidas'),
  crear: (comida) => api.post('/comidas', comida),
  actualizar: (id, comida) => api.put(`/comidas/${id}`, comida),
  eliminar: (id) => api.delete(`/comidas/${id}`),
}
```

✨ **¡Mucho más limpio y el token se agrega automáticamente!**

---

## 7. Testing y Verificación

### 🧪 Probar la Autenticación

### 1. Crear un Usuario Admin en Supabase

📖 **Ver guía completa**: [CONFIGURAR_USUARIOS_ADMIN.md](CONFIGURAR_USUARIOS_ADMIN.md)

```sql
-- En Supabase SQL Editor:

-- Agregar rol de admin a un usuario
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@gustito.cl';
```

### 2. Probar Login

1. Inicia sesión con las credenciales del admin
### 2. Flujo de Testing Completo

#### Paso 1: Verificar que el backend esté protegido

```bash
# Intentar crear una comida SIN token (debe fallar)
curl -X POST https://tu-api.com/api/comidas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_comida": "Test Pizza",
    "categoria_id": 1,
    "precio": 10000,
    "activo": true
  }'

# Resultado esperado:
# {
#   "ok": false,
#   "error": "No autorizado",
#   "mensaje": "Se requiere autenticación. Por favor, inicia sesión."
# }
```

✅ **Si obtienes 401 Unauthorized** → Backend protegido correctamente

#### Paso 2: Hacer login desde el frontend

1. Ve a `/login` en tu app
2. Inicia sesión con las credenciales del admin
3. Abre DevTools (F12) → Console
4. Ejecuta:

```javascript
// Verificar sesión activa
const { data: { session } } = await supabase.auth.getSession()
console.log('Usuario:', session.user.email)
console.log('Rol:', session.user.user_metadata.role)
console.log('Token:', session.access_token)
```

✅ **Si ves tu email y rol="admin"** → Login funcionando correctamente

#### Paso 3: Probar peticiones con token desde la consola

```javascript
// Obtener el token
const { data: { session } } = await supabase.auth.getSession()
const token = session.access_token

// Intentar crear una comida CON token (debe funcionar)
fetch('https://tu-api.com/api/comidas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nombre_comida: 'Pizza Test con Auth',
    categoria_id: 1,
    precio: 10000,
    activo: true,
    descripcion: 'Test de autenticación'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Comida creada:', data)
})
.catch(err => {
  console.error('❌ Error:', err)
})
```

✅ **Si obtienes `{ok: true, data: {...}}`** → Autenticación funcionando

#### Paso 4: Probar desde tu interfaz de admin

1. Ve al panel de administración
2. Intenta crear una comida/noticia desde el formulario
3. Verifica en Network (F12) que:
   - La petición incluye header `Authorization: Bearer ...`
   - La respuesta es 200 OK (no 401)

### 3. Checklist de Verificación

- [ ] Backend responde 401 a peticiones sin token
- [ ] Usuario admin creado en Supabase con `role: "admin"`
- [ ] Login funciona y obtiene el token
- [ ] Token se guarda en localStorage automáticamente
- [ ] Todas las funciones CRUD incluyen el header `Authorization`
- [ ] Rutas del panel admin protegidas con `<ProtectedRoute>`
- [ ] Botón de cerrar sesión funciona
- [ ] Token expirado redirige automáticamente al login
- [ ] Usuario sin rol admin no puede acceder al panel

---

## 📦 Resumen de Cambios en el Frontend

### ✅ Lo que debes implementar:

| Tarea | Archivo | Descripción |
|-------|---------|-------------|
| 1️⃣ Instalar Supabase | `package.json` | `npm install @supabase/supabase-js` |
| 2️⃣ Configurar cliente | `src/lib/supabase.js` | Crear cliente de Supabase |
| 3️⃣ Variables de entorno | `.env` | Agregar `SUPABASE_URL` y `SUPABASE_ANON_KEY` |
| 4️⃣ Hook de autenticación | `src/hooks/useAuth.js` | Verificar sesión activa |
| 5️⃣ Componente Login | `src/pages/LoginPage.jsx` | Página de inicio de sesión |
| 6️⃣ Cliente HTTP | `src/lib/apiClient.js` | Cliente que agrega token automáticamente |
| 7️⃣ Proteger rutas | `src/App.jsx` | Componente `<ProtectedRoute>` |
| 8️⃣ Actualizar servicios | `src/services/*.js` | Usar nuevo `apiClient` |
| 9️⃣ Botón logout | `src/components/AdminHeader.jsx` | Cerrar sesión |

### ⚡ Ejemplo de cambio típico:

**ANTES**:
```javascript
// Tu código actual probablemente se ve así:
export const crearComida = async (comida) => {
  const res = await fetch(`${API_URL}/comidas`, {
    method: 'POST',
    body: JSON.stringify(comida)
  })
  return res.json()
}
```

**DESPUÉS**:
```javascript
// Usa el nuevo apiClient:
import { api } from '../lib/apiClient'

export const crearComida = (comida) => {
  return api.post('/comidas', comida)
}
// ✨ El token se agrega automáticamente
```

---

## 🎯 Resumen Final

| Acción | Requiere Auth | Rol Necesario | Estado Frontend |
|--------|---------------|---------------|-----------------|
| Ver menú público | ❌ No | Ninguno | ✅ Funciona sin cambios |
| Ver noticias activas | ❌ No | Ninguno | ✅ Funciona sin cambios |
| Enviar consulta | ❌ No | Ninguno | ✅ Funciona sin cambios |
| **Crear/editar comidas** | ✅ Sí | Admin | ⚡ **DEBES actualizar** |
| **Crear/editar noticias** | ✅ Sí | Admin | ⚡ **DEBES actualizar** |
| **Ver/eliminar consultas** | ✅ Sí | Admin | ⚡ **DEBES actualizar** |

### 🚀 Pasos de Implementación Recomendados:

1. ✅ **Backend protegido** (Ya completado)
2. ⏳ **Crear usuario admin en Supabase** (5 minutos)
3. ⏳ **Instalar y configurar Supabase en frontend** (10 minutos)
4. ⏳ **Crear página de login** (30 minutos)
5. ⏳ **Crear cliente HTTP con token automático** (20 minutos)
6. ⏳ **Actualizar todos los servicios CRUD** (1 hora)
7. ⏳ **Proteger rutas del panel admin** (15 minutos)
8. ⏳ **Probar todo el flujo** (30 minutos)

**Tiempo estimado total**: 3-4 horas

---

## 🔐 Mejores Prácticas de Seguridad

1. **Nunca guardes el token manualmente**: Supabase lo maneja automáticamente en localStorage
2. **Usa HTTPS en producción**: Para encriptar las comunicaciones
3. **Los tokens expiran automáticamente**: Supabase renueva los tokens (cada 1 hora)
4. **Cierra sesión al salir**: Siempre implementa `supabase.auth.signOut()`
5. **Valida permisos en el backend**: El frontend es solo UX, la seguridad real está en el backend
6. **No confíes en el frontend**: Nunca ocultes botones como única medida de seguridad

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si el token expira mientras uso la app?**  
R: Supabase lo renueva automáticamente cada 60 minutos. Si falla, redirigirá al login.

**P: ¿Mi panel de admin actual dejará de funcionar?**  
R: Sí, hasta que implementes la autenticación. Las rutas protegidas devolverán 401.

**P: ¿Puedo tener diferentes roles además de admin?**  
R: Sí, solo modifica el middleware del backend y la verificación del frontend.

**P: ¿Cómo protejo páginas específicas en el frontend?**  
R: Usa el componente `<ProtectedRoute>` mostrado en esta guía.

**P: ¿Es seguro guardar el token en localStorage?**  
R: Para la mayoría de aplicaciones sí. Para apps muy sensibles, considera httpOnly cookies.

**P: ¿Debo actualizar TODAS mis funciones del admin?**  
R: Sí, todas las operaciones que llamen a rutas protegidas deben incluir el token.

---

## 📚 Documentos Relacionados

- 📖 [GUIA_SEGURIDAD_API.md](GUIA_SEGURIDAD_API.md) - Explicación del problema y la solución
- 📖 [CONFIGURAR_USUARIOS_ADMIN.md](CONFIGURAR_USUARIOS_ADMIN.md) - Cómo crear usuarios administradores
- 📖 [RESUMEN_IMPLEMENTACION_SEGURIDAD.md](RESUMEN_IMPLEMENTACION_SEGURIDAD.md) - Resumen completo
- 🔗 [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- 🔗 [JWT Introduction](https://jwt.io/introduction)

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas durante la implementación:

1. **Verifica los logs del backend**: ¿El token está llegando?
2. **Revisa la consola del navegador**: ¿Hay errores de autenticación?
3. **Confirma el rol del usuario**: Ejecuta la query SQL de verificación
4. **Prueba con cURL primero**: Para aislar si el problema es del frontend
5. **Revisa las DevTools → Network**: ¿El header Authorization está presente?

---

**¡Tu aplicación estará completamente protegida una vez implementes estos cambios! 🎉**

---

2. Abre las DevTools (F12) → Application → Local Storage
3. Busca la clave que comienza con `supabase.auth.token`
4. Verás el token JWT guardado

### 3. Probar Peticiones Protegidas

```javascript
// En la consola del navegador:
const { data: { session } } = await supabase.auth.getSession()
console.log('Token:', session.access_token)

// Intentar crear una comida
fetch('https://tu-api.com/api/comidas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    nombre_comida: 'Pizza Test',
    categoria_id: 1,
    precio: 10000,
    activo: true
  })
})
.then(r => r.json())
.then(console.log)
```

---

## 🎯 Resumen

| Acción | Requiere Auth | Rol Necesario |
|--------|---------------|---------------|
| Ver menú público | ❌ No | Ninguno |
| Ver noticias activas | ❌ No | Ninguno |
| Enviar consulta | ❌ No | Ninguno |
| Crear/editar comidas | ✅ Sí | Admin |
| Crear/editar noticias | ✅ Sí | Admin |
| Ver consultas | ✅ Sí | Admin |
| Eliminar contenido | ✅ Sí | Admin |

---

## 🔐 Mejores Prácticas de Seguridad

1. **Nunca guardes el token en lugares inseguros**: Solo usar localStorage/sessionStorage (Supabase lo maneja automáticamente)
2. **Usa HTTPS**: Siempre en producción para encriptar las comunicaciones
3. **Los tokens expiran**: Supabase renueva automáticamente los tokens (cada 1 hora por defecto)
4. **Cierra sesión al salir**: `supabase.auth.signOut()`
5. **Valida permisos en el backend**: Nunca confíes solo en el frontend

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si el token expira mientras uso la app?**
R: Supabase lo renueva automáticamente. Si no puede, el usuario será redirigido al login.

**P: ¿Puedo tener múltiples roles (admin, editor, etc.)?**
R: Sí, modifica el middleware `requireAdmin` para verificar diferentes roles.

**P: ¿Cómo protejo páginas específicas?**
R: Usa el componente `<ProtectedRoute>` en tus rutas de React Router.

---

**¡Tu aplicación ahora está protegida! 🎉**
