# 📝 Documentación de Variables de Entorno

Este documento describe todas las variables de entorno disponibles para el proyecto Onboarding Guardian Frontend.

## 📋 Variables Principales

### `NEXT_PUBLIC_API_URL`
- **Descripción:** URL base de la API del Onboarding Guardian
- **Tipo:** String (URL)
- **Valor por defecto:** `http://localhost:3000`
- **Ejemplo:** `http://localhost:3000` o `https://api.ejemplo.com`
- **Requerida:** No (tiene valor por defecto)
- **Uso:** Configuración de la instancia de Axios

### `NEXT_PUBLIC_API_TIMEOUT`
- **Descripción:** Timeout para requests HTTP en milisegundos
- **Tipo:** Number (milisegundos)
- **Valor por defecto:** `30000` (30 segundos)
- **Ejemplo:** `60000` para 60 segundos
- **Requerida:** No
- **Uso:** Configuración de timeout en Axios

## 🔐 Autenticación y Seguridad

### `NEXT_PUBLIC_AUTH_STORAGE_KEY`
- **Descripción:** Nombre de la clave en localStorage para almacenar tokens
- **Tipo:** String
- **Valor por defecto:** `auth-storage`
- **Ejemplo:** `onboarding-guardian-auth`
- **Requerida:** No
- **Uso:** Clave para persistencia de Zustand

### `NEXT_PUBLIC_TOKEN_WARNING_TIME`
- **Descripción:** Tiempo en segundos antes de que expire el token para mostrar advertencia
- **Tipo:** Number (segundos)
- **Valor por defecto:** `60` (1 minuto)
- **Ejemplo:** `120` para 2 minutos
- **Requerida:** No
- **Uso:** Componente TokenTimer

## 🧪 MSW (Mock Service Worker)

### `NEXT_PUBLIC_ENABLE_MSW`
- **Descripción:** Habilitar MSW incluso en producción
- **Tipo:** Boolean (string)
- **Valor por defecto:** `false` (solo en desarrollo)
- **Ejemplo:** `true` o `false`
- **Requerida:** No
- **Uso:** Control de activación de MSW

### `NEXT_PUBLIC_MSW_ON_UNHANDLED_REQUEST`
- **Descripción:** Comportamiento cuando hay requests no manejados por MSW
- **Tipo:** String
- **Valores:** `bypass`, `warn`, `error`
- **Valor por defecto:** `bypass`
- **Requerida:** No
- **Uso:** Configuración de MSW worker

## 🎛️ Feature Flags

### `NEXT_PUBLIC_ENABLE_TOKEN_TIMER`
- **Descripción:** Habilitar/deshabilitar el componente TokenTimer
- **Tipo:** Boolean (string)
- **Valor por defecto:** `true`
- **Requerida:** No

### `NEXT_PUBLIC_ENABLE_HEALTH_CHECK`
- **Descripción:** Habilitar/deshabilitar el health check en el dashboard
- **Tipo:** Boolean (string)
- **Valor por defecto:** `true`
- **Requerida:** No

### `NEXT_PUBLIC_ENABLE_PRODUCTS`
- **Descripción:** Habilitar/deshabilitar la página de productos
- **Tipo:** Boolean (string)
- **Valor por defecto:** `true`
- **Requerida:** No

### `NEXT_PUBLIC_ENABLE_ONBOARDING`
- **Descripción:** Habilitar/deshabilitar la página de onboarding
- **Tipo:** Boolean (string)
- **Valor por defecto:** `true`
- **Requerida:** No

## 🎨 UI/UX

### `NEXT_PUBLIC_THEME`
- **Descripción:** Tema de la aplicación
- **Tipo:** String
- **Valores:** `light`, `dark`, `auto`
- **Valor por defecto:** `light`
- **Requerida:** No

### `NEXT_PUBLIC_LOCALE`
- **Descripción:** Idioma de la aplicación
- **Tipo:** String
- **Valores:** `es`, `en`
- **Valor por defecto:** `es`
- **Requerida:** No

## 📊 Analytics y Monitoreo

### `NEXT_PUBLIC_ENABLE_ANALYTICS`
- **Descripción:** Habilitar analytics
- **Tipo:** Boolean (string)
- **Valor por defecto:** `false`
- **Requerida:** No

### `NEXT_PUBLIC_GA_ID`
- **Descripción:** Google Analytics ID
- **Tipo:** String
- **Ejemplo:** `G-XXXXXXXXXX`
- **Requerida:** No (solo si analytics está habilitado)

### `NEXT_PUBLIC_SENTRY_DSN`
- **Descripción:** Sentry DSN para error tracking
- **Tipo:** String (URL)
- **Ejemplo:** `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
- **Requerida:** No

## 🛠️ Desarrollo

### `NEXT_PUBLIC_DEBUG`
- **Descripción:** Mostrar información de debug en consola
- **Tipo:** Boolean (string)
- **Valor por defecto:** `false`
- **Requerida:** No

### `NEXT_PUBLIC_LOG_LEVEL`
- **Descripción:** Nivel de logging
- **Tipo:** String
- **Valores:** `error`, `warn`, `info`, `debug`
- **Valor por defecto:** `info`
- **Requerida:** No

## 📦 Producción

### `NEXT_PUBLIC_APP_VERSION`
- **Descripción:** Versión de la aplicación
- **Tipo:** String
- **Ejemplo:** `1.0.0`
- **Requerida:** No

### `NEXT_PUBLIC_BUILD_TIME`
- **Descripción:** Timestamp del build
- **Tipo:** String (ISO date)
- **Ejemplo:** `2024-01-15T10:30:00Z`
- **Requerida:** No
- **Nota:** Se establece automáticamente durante el build

## 📝 Notas Importantes

1. **Prefijo `NEXT_PUBLIC_`**: Todas las variables que se usan en el cliente deben tener este prefijo. Sin él, Next.js no las expondrá al navegador.

2. **Archivos de entorno**:
   - `.env` - Valores por defecto (se sube al repositorio)
   - `.env.local` - Valores locales (NO se sube al repositorio)
   - `.env.development` - Valores para desarrollo
   - `.env.production` - Valores para producción

3. **Prioridad**: `.env.local` > `.env.development`/`.env.production` > `.env`

4. **Reinicio necesario**: Después de cambiar variables de entorno, reinicia el servidor de desarrollo.

## 🚀 Ejemplo de Uso

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_TOKEN_WARNING_TIME=120
```

## 🔒 Seguridad

- **NUNCA** subas archivos `.env.local` al repositorio
- **NUNCA** expongas tokens, API keys o credenciales en variables `NEXT_PUBLIC_*`
- Usa variables de entorno del servidor para datos sensibles (si los hay)

