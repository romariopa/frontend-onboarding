# 🛡️ Onboarding Guardian - Frontend

Aplicación web desarrollada con Next.js 16 (App Router) que interactúa con la API NestJS del Guardián del Onboarding, validando todo el ciclo de autenticación, refresh token, onboarding y salud del sistema.

## 🚀 Características

### Autenticación
- ✅ **Autenticación completa** con JWT (access_token y refresh_token)
- ✅ **Refresh automático de tokens** antes de cada request protegido
- ✅ **Persistencia de sesión** en localStorage con validación
- ✅ **Restauración automática de sesión** al recargar la página (si los tokens son válidos)
- ✅ **Cierre automático de sesión** al cerrar la pestaña del navegador
- ✅ **Contador visual de expiración** de tokens
- ✅ **Logout automático** cuando los tokens expiran

### Funcionalidades
- ✅ **Dashboard principal** con navegación a todas las secciones
- ✅ **Listado de productos** con cards expandibles y detalles
- ✅ **Formulario de onboarding** con validación completa
- ✅ **Gestión de clientes** - Lista temporal de clientes registrados
- ✅ **Monitoreo de salud** del backend
- ✅ **MSW (Mock Service Worker)** para pruebas sin backend real

### UI/UX
- ✅ **Diseño moderno** con TailwindCSS y shadcn/ui
- ✅ **Animaciones fluidas** con Framer Motion
- ✅ **Responsive design** - Optimizado para móviles, tablets y desktop
- ✅ **Manejo de errores** con mensajes claros al usuario
- ✅ **Estados de carga** con spinners y feedback visual

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- API del Onboarding Guardian corriendo en `http://localhost:3000` (opcional si usas MSW)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de entorno (opcional)
cp .env.example .env.local
```

## 🎯 Uso

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3500`.

### Producción

```bash
npm run build
npm start
```

## 🔐 Credenciales de Prueba

- **Usuario:** `guardian`
- **Contraseña:** `onboarding123`

## 📁 Estructura del Proyecto

```
/app
 ├── login/page.tsx          # Página de login con validación
 ├── dashboard/page.tsx       # Dashboard principal
 ├── products/page.tsx        # Lista de productos con cards expandibles
 ├── onboarding/page.tsx      # Formulario de onboarding
 ├── clients/page.tsx         # Lista de clientes registrados
 ├── page.tsx                 # Página principal (redirección)
 ├── layout.tsx               # Layout principal
 ├── providers.tsx            # Provider de MSW
 └── globals.css

/components
 ├── TokenTimer.tsx           # Contador de expiración de token
 ├── ProtectedRoute.tsx       # Wrapper de autenticación
 ├── SessionManager.tsx       # Gestor de sesión (restauración y limpieza)
 ├── ProductCard.tsx          # Tarjeta de producto (legacy)
 ├── FormInput.tsx            # Input de formulario reutilizable
 └── /ui                      # Componentes shadcn/ui
     ├── button.tsx
     └── card.tsx

/services
 ├── api.ts                   # Instancia de Axios con interceptores
 ├── auth.service.ts          # Servicio de autenticación
 ├── product.service.ts       # Servicio de productos
 ├── onboarding.service.ts    # Servicio de onboarding
 └── health.service.ts        # Servicio de health check

/store
 ├── authStore.ts             # Store de Zustand con persistencia
 └── clientsStore.ts          # Store de clientes registrados

/hooks
 ├── useAuth.ts               # Hook para login/logout
 ├── useAuthRestore.ts        # Hook para restaurar sesión al cargar
 ├── useSessionCleanup.ts     # Hook para limpiar sesión al cerrar pestaña
 └── useStoreHydration.ts     # Hook para verificar hidratación de Zustand

/mocks
 ├── handlers.ts              # Handlers de MSW
 └── browser.ts               # Inicializador de MSW

/types
 └── index.ts                 # Tipos TypeScript

/utils
 └── constants.ts             # Constantes y configuración centralizada
```

## 🔄 Flujo de Autenticación

### Login y Persistencia
1. **Login:** El usuario inicia sesión con username/password
2. **Almacenamiento:** Los tokens se guardan en Zustand store y localStorage
3. **Validación:** Los tokens se validan antes de establecer la sesión

### Requests Protegidos
4. **Interceptores:** Antes de cada request, se verifica si el access_token expiró
5. **Refresh automático:** Si expiró, se intenta refrescar con el refresh_token
6. **Actualización:** El nuevo access_token se guarda automáticamente

### Gestión de Sesión
7. **Restauración:** Al recargar la página, los tokens se restauran desde localStorage
8. **Validación:** Se valida que los tokens sean válidos antes de mantener la sesión
9. **Logout automático:** Si el refresh falla o ambos tokens expiraron, se limpia la sesión
10. **Cierre de pestaña:** Al cerrar la pestaña, la sesión se limpia automáticamente

## 🧪 MSW (Mock Service Worker)

MSW está configurado para funcionar en desarrollo. Si la API no está disponible, los mocks se activarán automáticamente.

Los mocks incluyen:
- `/auth/login` - Login con credenciales mock
- `/auth/refresh` - Refresh token mock
- `/products` - Lista de productos mock
- `/products/:id` - Detalle de producto mock
- `/onboarding` - Registro de cliente mock
- `/health` - Health check mock

## 🎨 Tecnologías Utilizadas

### Core
- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **React 19** - Biblioteca de UI

### Estilos y UI
- **TailwindCSS 4** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **shadcn/ui** - Componentes UI reutilizables
- **Lucide React** - Iconos

### Estado y Datos
- **Zustand** - Manejo de estado global con persistencia
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP

### Utilidades
- **jwt-decode** - Decodificación de JWT
- **MSW** - Mock Service Worker para desarrollo
- **cross-env** - Variables de entorno multiplataforma

## 📝 Variables de Entorno

### Configuración Básica

Crea un archivo `.env.local` con las variables necesarias:

```env
# URL base de la API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Puerto del frontend
PORT=3500

# Timeout para requests (opcional)
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Variables Disponibles

El proyecto incluye un archivo `ENV.md` con todas las variables de entorno disponibles. Las principales son:

- **`NEXT_PUBLIC_API_URL`** - URL base de la API (requerida)
- **`PORT`** - Puerto del servidor frontend (default: 3500)
- **`NEXT_PUBLIC_API_TIMEOUT`** - Timeout para requests HTTP (default: 30000ms)
- **`NEXT_PUBLIC_AUTH_STORAGE_KEY`** - Clave para localStorage (default: 'auth-storage')
- **`NEXT_PUBLIC_TOKEN_WARNING_TIME`** - Tiempo de advertencia antes de expiración (default: 60000ms)
- **`NEXT_PUBLIC_ENABLE_MSW`** - Habilitar MSW en producción (default: false)
- **`NEXT_PUBLIC_DEBUG`** - Modo debug (default: false)
- **`NEXT_PUBLIC_LOG_LEVEL`** - Nivel de logging (default: 'info')

Para ver todas las variables disponibles y su documentación completa, consulta el archivo `ENV.md`.

## 🎯 Funcionalidades Detalladas

### Dashboard
- Vista principal con cards de navegación
- Acceso rápido a todas las secciones
- Indicador de salud del backend
- Token timer visible

### Productos
- Grid responsive de productos
- Cards expandibles con animaciones
- Carga lazy de detalles
- Estados de carga y error

### Onboarding
- Formulario validado con Zod
- Campos: nombre, documento, email, monto inicial
- Feedback visual de éxito/error
- Integración con lista de clientes

### Clientes
- Lista temporal de clientes registrados
- Persistencia en localStorage
- Opción de eliminar clientes individuales
- Opción de limpiar toda la lista

## 🔒 Seguridad

- Los tokens se almacenan en localStorage con validación
- El refresh token se valida antes de cada uso
- Los tokens expirados se limpian automáticamente
- Las rutas protegidas verifican autenticación antes de renderizar
- La sesión se cierra automáticamente al cerrar la pestaña
- Los errores de autenticación se manejan sin redirecciones automáticas

## 🐛 Solución de Problemas

### MSW no funciona
- Asegúrate de estar en modo desarrollo (`npm run dev`)
- Verifica que no haya errores en la consola del navegador
- Revisa que `NEXT_PUBLIC_ENABLE_MSW` esté configurado correctamente

### Tokens no se refrescan
- Verifica que el refresh_token no haya expirado (configurable en API)
- Revisa la consola del navegador para errores
- Verifica que la API esté respondiendo correctamente

### Redirección infinita
- Limpia el localStorage: `localStorage.clear()`
- Verifica que la API esté corriendo o que MSW esté activo
- Revisa los logs de la consola para errores de autenticación

### Sesión no se restaura al recargar
- Verifica que los tokens en localStorage sean válidos
- Revisa la consola del navegador para errores de validación
- Asegúrate de que `onRehydrateStorage` esté funcionando correctamente

### Error de login no se muestra
- Verifica que el interceptor de Axios no esté redirigiendo automáticamente
- Revisa que el manejo de errores en `auth.service.ts` esté correcto
- Confirma que los mensajes de error del servidor se están capturando

## 📄 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo en puerto 3500

# Producción
npm run build        # Construye la aplicación para producción
npm start            # Inicia el servidor de producción en puerto 3500

# Linting
npm run lint         # Ejecuta ESLint
```

## 🔗 Rutas de la Aplicación

- `/` - Página principal (redirección automática)
- `/login` - Página de login
- `/dashboard` - Dashboard principal (protegida)
- `/products` - Lista de productos (protegida)
- `/onboarding` - Formulario de onboarding (protegida)
- `/clients` - Lista de clientes (protegida)

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Zustand](https://docs.pmnd.rs/zustand)
- [Documentación de React Hook Form](https://react-hook-form.com/)
- [Documentación de Zod](https://zod.dev/)
- [Documentación de TailwindCSS](https://tailwindcss.com/docs)
- [Documentación de Framer Motion](https://www.framer.com/motion/)

## 📄 Licencia

Este proyecto es parte de un ejercicio técnico.
