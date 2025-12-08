# Configuración de Supabase Storage para Imágenes

## ⚠️ IMPORTANTE: Debes completar TODOS estos pasos antes de subir imágenes

El error **"Bucket not found"** significa que aún no has creado el bucket en Supabase. Sigue estos pasos:

---

## 📋 Pasos para Configurar Supabase Storage

### 1. Accede a tu proyecto de Supabase
- Ve a https://supabase.com
- Inicia sesión y accede a tu proyecto

### 2. Crea un Bucket de Storage

**Paso a paso:**

1. En el menú lateral izquierdo de Supabase, haz clic en **Storage** (icono de carpeta)
2. Haz clic en el botón verde **"Create a new bucket"** o **"New bucket"**
3. En el formulario que aparece, completa:
   
   **Name (Nombre del bucket):**
   ```
   imagenes
   ```
   ⚠️ **IMPORTANTE:** El nombre debe ser exactamente `imagenes` (en minúsculas, sin tildes)
   
   **Public bucket (Bucket público):**
   - ✅ **MARCA ESTA CASILLA** (debe estar activada)
   - Esto permite que las imágenes sean accesibles públicamente
   
4. Haz clic en **"Create bucket"** o **"Save"**

**✅ Verificación:** Deberías ver el bucket `imagenes` en la lista de buckets

---

### 3. Configura las Políticas de Acceso (RLS Policies)

⚠️ **IMPORTANTE:** Las políticas se configuran en la sección **"Schema"** bajo **"OTHER POLICIES UNDER STORAGE.OBJECTS"**, NO en el bucket directamente.

**Pasos:**

1. En Supabase, ve a **Storage** en el menú lateral
2. Haz clic en la pestaña **"Policies"** (arriba, junto a "Buckets")
3. Busca la sección **"Schema"** 
4. Debajo encontrarás **"OTHER POLICIES UNDER STORAGE.OBJECTS"**
5. Haz clic en **"New Policy"** en esa sección
6. Crea las siguientes 4 políticas:

---

#### 🔹 Política 1: Permitir SUBIDA de archivos (INSERT)

1. Haz clic en **New Policy**
2. Selecciona **For full customization**
3. Completa los campos:

**Policy name (nombre):**
```
Permitir subida de imágenes
```

**Allowed operation (operación permitida):**
```
INSERT
```

**Policy definition (definición de política):**
```
(bucket_id = 'imagenes'::text)
```

**Target roles (usar por defecto):** `public`

**WITH CHECK expression:**
```
(bucket_id = 'imagenes'::text)
```

4. Haz clic en **Review** y luego en **Save policy**

---

#### 🔹 Política 2: Permitir LECTURA de archivos (SELECT)

1. Haz clic en **New Policy**
2. Selecciona **For full customization**
3. Completa los campos:

**Policy name (nombre):**
```
Permitir lectura pública
```

**Allowed operation (operación permitida):**
```
SELECT
```

**Policy definition (definición de política):**
```
(bucket_id = 'imagenes'::text)
```

**Target roles (usar por defecto):** `public`

4. Haz clic en **Review** y luego en **Save policy**

---

#### 🔹 Política 3: Permitir ACTUALIZACIÓN de archivos (UPDATE)

1. Haz clic en **New Policy**
2. Selecciona **For full customization**
3. Completa los campos:

**Policy name (nombre):**
```
Permitir actualización de imágenes
```

**Allowed operation (operación permitida):**
```
UPDATE
```

**Policy definition (definición de política):**
```
(bucket_id = 'imagenes'::text)
```

**Target roles (usar por defecto):** `public`

**WITH CHECK expression:**
```
(bucket_id = 'imagenes'::text)
```

4. Haz clic en **Review** y luego en **Save policy**

---

#### 🔹 Política 4: Permitir ELIMINACIÓN de archivos (DELETE)

1. Haz clic en **New Policy**
2. Selecciona **For full customization**
3. Completa los campos:

**Policy name (nombre):**
```
Permitir eliminación de imágenes
```

**Allowed operation (operación permitida):**
```
DELETE
```

**Policy definition (definición de política):**
```
(bucket_id = 'imagenes'::text)
```

**Target roles (usar por defecto):** `public`

4. Haz clic en **Review** y luego en **Save policy**

---

### ✅ Resumen de las 4 Políticas Creadas

| Operación | Nombre de Política | Allowed Operation | Policy Definition |
|-----------|-------------------|-------------------|-------------------|
| Subir | Permitir subida de imágenes | `INSERT` | `(bucket_id = 'imagenes'::text)` |
| Leer | Permitir lectura pública | `SELECT` | `(bucket_id = 'imagenes'::text)` |
| Actualizar | Permitir actualización de imágenes | `UPDATE` | `(bucket_id = 'imagenes'::text)` |
| Eliminar | Permitir eliminación de imágenes | `DELETE` | `(bucket_id = 'imagenes'::text)` |

**Nota:** Estas políticas permiten acceso público. Para producción, considera restringir INSERT, UPDATE y DELETE solo a usuarios autenticados.

### 4. Verifica las Variables de Entorno

Asegúrate de tener un archivo `.env.local` en la raíz de tu proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

Puedes obtener estos valores en:
- **Supabase Dashboard** > **Settings** > **API**

### 5. Reinicia tu Servidor de Desarrollo

Después de configurar todo, reinicia tu servidor:

```bash
npm run dev
```

## ✅ Cómo Funciona

1. **Seleccionar imagen**: El usuario hace clic en "Seleccionar imagen desde mi ordenador"
2. **Preview local**: Se muestra una vista previa de la imagen seleccionada
3. **Subir a Supabase**: Al guardar el producto, la imagen se sube automáticamente a Supabase Storage
4. **URL pública**: Supabase devuelve una URL pública permanente
5. **Guardar en BD**: La URL se guarda en la base de datos junto con el producto

## 🌐 Ventajas de Usar Supabase Storage

✅ **Sin problemas de CORS**: Las imágenes están en tu propio dominio
✅ **Alta disponibilidad**: Funciona 24/7 cuando hostees tu app
✅ **URLs permanentes**: Las imágenes no se borran ni cambian de URL
✅ **CDN incluido**: Supabase usa CDN para servir las imágenes rápido
✅ **Gratuito**: 1GB gratis, suficiente para miles de imágenes de productos
✅ **Fácil de usar**: No necesitas configurar servidores ni S3

## 🔒 Seguridad para Producción (Recomendado)

Para producción, es recomendable que **solo los usuarios autenticados** puedan subir imágenes.

Si implementas autenticación en el futuro, modifica las políticas de INSERT, UPDATE y DELETE con:

**Policy definition para usuarios autenticados:**
```
((bucket_id = 'imagenes'::text) AND (auth.role() = 'authenticated'::text))
```

Esto requerirá que implementes autenticación en tu app antes de poder subir imágenes.

## 📦 Estructura de Archivos en Storage

Las imágenes se guardarán en:
```
imagenes/
  └── productos/
      ├── 1702899123456-abc123.jpg
      ├── 1702899456789-def456.png
      └── 1702899789012-ghi789.webp
```

Cada archivo tiene un nombre único basado en timestamp + random string.

## 🆘 Solución de Problemas

### Error: "new row violates row-level security policy"
- **Causa**: No configuraste las políticas RLS correctamente
- **Solución**: Revisa los pasos 3 de esta guía

### Error: "The resource you are looking for could not be found"
- **Causa**: El bucket no existe o tiene un nombre diferente
- **Solución**: Verifica que el bucket se llame exactamente `imagenes`

### Error: "Failed to upload image"
- **Causa**: Variables de entorno incorrectas
- **Solución**: Verifica tu archivo `.env.local` y reinicia el servidor

### Las imágenes no se ven
- **Causa**: El bucket no es público
- **Solución**: Marca el bucket como público en la configuración

## 📝 Opción Alternativa: URL Manual

Si prefieres, aún puedes pegar URLs manualmente haciendo clic en "O pegar URL de imagen (opcional)". Esta opción es útil para imágenes que ya están hosteadas en otro lugar.
