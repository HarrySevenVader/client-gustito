# 🎨 Guía Visual del Nuevo Dashboard - Gustito Admin

## 📍 Ubicación
**URL:** `http://localhost:3000/admin/dashboard`

---

## 🎯 Componentes del Dashboard

### 1. HEADER PRINCIPAL
```
┌─────────────────────────────────────────────────────────┐
│  Panel de Control                    📅 lunes, 23 de    │
│  Bienvenido al dashboard...             diciembre 2025  │
└─────────────────────────────────────────────────────────┘
```
- **Título con gradiente**: Verde oscuro → Verde Gustito
- **Fecha en tiempo real**: Con icono y formato largo
- **Subtítulo descriptivo**: Contexto para el usuario

---

### 2. TARJETAS DE MÉTRICAS (Fila 1)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 🍽️  TOTAL    │ │ 💬  CONSULTAS│ │ 📰  NOTICIAS │ │ ⚡  TASA      │
│   PRODUCTOS  │ │              │ │              │ │   RESPUESTA  │
│              │ │              │ │              │ │              │
│     10       │ │      9       │ │      0       │ │     94%      │
│              │ │              │ │              │ │              │
│ 8 activos    │ │ 9 pendientes │ │ Publicadas   │ │ Promedio mes │
│ ↗ +12%       │ │ ↗ +8%        │ │              │ │ ↗ +5%        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Características:**
- **Borde superior coloreado** que aparece al hover
- **Icono con fondo degradado** que rota al hover
- **Tendencia con indicador** (↗ positivo verde / ↘ negativo rojo)
- **Animación de entrada** con delay escalonado

**Colores por tarjeta:**
- Verde: `#10b981` - Productos
- Azul: `#3b82f6` - Consultas
- Morado: `#8b5cf6` - Noticias
- Naranja: `#f59e0b` - Métricas

---

### 3. GRÁFICOS PRINCIPALES (Fila 2)

#### Gráfico Completo - Consultas por Mes
```
┌─────────────────────────────────────────────────────────┐
│  Consultas de clientes por mes                          │
│                                                          │
│  📊                                                      │
│    15│     █                                            │
│    12│     █     █                                      │
│     9│     █     █     █                                │
│     6│ █   █     █     █   █   █                       │
│     3│ █   █     █     █   █   █                       │
│     0└─────────────────────────────                     │
│       Jul Ago Sep Oct Nov Dic                           │
└─────────────────────────────────────────────────────────┘
```

#### Gráfico Medio - Productos por Categoría
```
┌────────────────────────────────┐
│  Productos por categoría       │
│                                │
│   6│                           │
│   5│ █                         │
│   4│ █   █                     │
│   3│ █   █   █                 │
│   2│ █   █   █   █             │
│   1│ █   █   █   █   █        │
│   0└─────────────              │
│     P.P Beb Pos Ent S/C       │
└────────────────────────────────┘
```

**Características:**
- **Canvas API** para dibujo de gráficos
- **Gradientes en barras** de arriba hacia abajo
- **Valores en la parte superior** de cada barra
- **Etiquetas rotadas** para mejor legibilidad
- **Colores personalizados** por categoría

---

### 4. SECCIÓN INFERIOR (Fila 3)

#### Feed de Actividad (Izquierda)
```
┌─────────────────────────────────────────┐
│  Actividad Reciente                     │
│ ┌─────────────────────────────────────┐ │
│ │ 💬  Nueva consulta recibida         │ │
│ │     Juan Pérez - Consulta sobre...  │ │
│ │     Hace 2 horas                    │ │
│ ├─────────────────────────────────────┤ │
│ │ 🍽️  Producto actualizado            │ │
│ │     Helado casata                   │ │
│ │     Hace 5 horas                    │ │
│ ├─────────────────────────────────────┤ │
│ │ 💬  Nueva consulta recibida         │ │
│ │     María López - Pregunta por...   │ │
│ │     Hace 1 día                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Características:**
- **Scroll personalizado** con barra estilizada
- **Iconos por tipo**: 🍽️ productos, 💬 consultas, 📰 noticias
- **Timestamps relativos**: "Hace X horas/días"
- **Hover effect**: Se desliza a la derecha
- **Animación de entrada**: Desde la izquierda con delay

#### Estadísticas Rápidas (Derecha)
```
┌─────────────────────────────────────────┐
│  Estadísticas Rápidas                   │
│ ┌─────────────────┬─────────────────┐   │
│ │ ✅ Productos    │ 📊 Promedio     │   │
│ │    Activos      │    Cons/Día     │   │
│ │    8            │    0.3          │   │
│ ├─────────────────┼─────────────────┤   │
│ │ ⏱️ Tiempo de    │ ⭐ Satisfacción│   │
│ │    Respuesta    │    Cliente      │   │
│ │    2.5h         │    4.8/5        │   │
│ └─────────────────┴─────────────────┘   │
└─────────────────────────────────────────┘
```

**Características:**
- **Grid adaptativo** 2x2
- **Borde izquierdo coloreado** por categoría
- **Icono con fondo degradado**
- **Hover effect**: Se desliza a la derecha con sombra

---

## 🎨 Paleta de Colores Completa

### Colores Principales
```css
Verde Primario:  #10b981  ■ Productos, éxito
Azul:            #3b82f6  ■ Consultas, información
Morado:          #8b5cf6  ■ Noticias, contenido
Naranja:         #f59e0b  ■ Métricas, alertas
Rojo:            #ef4444  ■ Errores, urgente
```

### Colores de Fondo
```css
Blanco:          #ffffff  □ Fondo principal
Gris claro:      #f8fafc  □ Fondo de tarjetas
Gris borde:      #e5e7eb  □ Bordes sutiles
```

### Colores de Texto
```css
Negro:           #111827  ■ Títulos
Gris oscuro:     #374151  ■ Texto principal
Gris medio:      #6b7280  ■ Subtítulos
Gris claro:      #9ca3af  ■ Texto secundario
```

---

## ✨ Animaciones y Efectos

### Al Cargar la Página
1. **FadeIn**: Toda la página aparece suavemente
2. **SlideIn**: Tarjetas aparecen desde abajo con delay
3. **SlideInLeft**: Actividades aparecen desde la izquierda
4. **SlideInUp**: Estadísticas rápidas desde abajo

### Al Hacer Hover
- **Tarjetas de métricas**: Se elevan 4px con sombra más intensa
- **Iconos**: Rotan 5° y escalan 1.1x
- **Actividades**: Se deslizan 4px a la derecha
- **Gráficos**: Elevan 2px con sombra

### Transiciones
- **Duración**: 0.3s (300ms)
- **Timing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Propiedades**: transform, box-shadow, opacity

---

## 📱 Vistas Responsive

### Desktop (>1200px)
- ✅ 4 columnas en métricas
- ✅ 2 gráficos lado a lado
- ✅ 2 columnas en sección inferior

### Tablet (768px - 1200px)
- ✅ 2 columnas en métricas
- ✅ 1 columna en gráficos (apilados)
- ✅ 1 columna en sección inferior

### Mobile (<768px)
- ✅ 1 columna en todo
- ✅ Tarjetas de ancho completo
- ✅ Espaciado optimizado

---

## 🔄 Flujo de Datos

```
┌─────────────────┐
│   Usuario       │
│   accede al     │
│   dashboard     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   useEffect     │
│   ejecuta       │
│   cargarDatos() │
└────────┬────────┘
         │
         ├─────────────────────────────┐
         │                             │
         ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│ Fetch Productos  │         │ Fetch Consultas  │
│ /api/comidas     │         │ backend:4000     │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         └──────────┬─────────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │ Procesar Datos   │
         │ - Agrupar        │
         │ - Calcular       │
         │ - Formatear      │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Actualizar State │
         │ setStats()       │
         │ setActivities()  │
         │ setChartData()   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Renderizar UI    │
         │ con animaciones  │
         └──────────────────┘
```

---

## 🚀 Cómo Acceder

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Asegúrate de que el backend esté corriendo:**
   ```bash
   # En otra terminal
   cd ../backend
   npm run dev
   ```

3. **Accede al dashboard:**
   - URL: `http://localhost:3000/admin/dashboard`
   - Usuario admin requerido

---

## 💻 Tecnología Detrás del Dashboard

```
Frontend Framework:     Next.js 15.5.4
Lenguaje:              TypeScript
Estilos:               CSS Modules
Gráficos:              Canvas API (nativo)
Tipografía:            Inter, Baloo 2
Iconos:                Emoji nativos
Estado:                React Hooks (useState, useEffect)
Fetching:              Fetch API nativa
Animaciones:           CSS Keyframes
```

---

## 🎯 Métricas que Muestra

| Métrica | Origen | Actualización |
|---------|--------|---------------|
| Total Productos | `/api/comidas` | Tiempo real |
| Productos Activos | Filtrado local | Tiempo real |
| Total Consultas | Backend API | Tiempo real |
| Consultas Pendientes | Backend API | Tiempo real |
| Total Noticias | Supabase | Próximamente |
| Tasa de Respuesta | Calculado | Simulado |
| Consultas/Mes | Backend API | Histórico |
| Productos/Categoría | Agrupación local | Tiempo real |
| Actividad Reciente | Múltiples fuentes | Tiempo real |
| Satisfacción Cliente | - | Simulado |

---

**🎉 Dashboard listo para producción - Diciembre 2025**
