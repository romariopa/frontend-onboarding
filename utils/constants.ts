/**
 * Constantes de la aplicación
 * Centraliza todas las variables de entorno y valores de configuración
 */

// ============================================
// API Configuration
// ============================================
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
} as const;

// ============================================
// Application Configuration
// ============================================
export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3500,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// ============================================
// Authentication & Security
// ============================================
export const AUTH_CONFIG = {
  STORAGE_KEY: process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY || 'auth-storage',
  TOKEN_WARNING_TIME: Number(process.env.NEXT_PUBLIC_TOKEN_WARNING_TIME) || 60, // segundos
} as const;

// ============================================
// MSW (Mock Service Worker) Configuration
// ============================================
export const MSW_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_MSW === 'true' || APP_CONFIG.IS_DEVELOPMENT,
  ON_UNHANDLED_REQUEST: (process.env.NEXT_PUBLIC_MSW_ON_UNHANDLED_REQUEST || 'bypass') as 'bypass' | 'warn' | 'error',
} as const;

// ============================================
// Feature Flags
// ============================================
export const FEATURE_FLAGS = {
  TOKEN_TIMER: process.env.NEXT_PUBLIC_ENABLE_TOKEN_TIMER !== 'false',
  HEALTH_CHECK: process.env.NEXT_PUBLIC_ENABLE_HEALTH_CHECK !== 'false',
  PRODUCTS: process.env.NEXT_PUBLIC_ENABLE_PRODUCTS !== 'false',
  ONBOARDING: process.env.NEXT_PUBLIC_ENABLE_ONBOARDING !== 'false',
} as const;

// ============================================
// UI/UX Configuration
// ============================================
export const UI_CONFIG = {
  THEME: (process.env.NEXT_PUBLIC_THEME || 'light') as 'light' | 'dark' | 'auto',
  LOCALE: process.env.NEXT_PUBLIC_LOCALE || 'es',
} as const;

// ============================================
// Analytics & Monitoring
// ============================================
export const ANALYTICS_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
} as const;

// ============================================
// Development Configuration
// ============================================
export const DEV_CONFIG = {
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
  LOG_LEVEL: (process.env.NEXT_PUBLIC_LOG_LEVEL || 'info') as 'error' | 'warn' | 'info' | 'debug',
} as const;

// ============================================
// Production Configuration
// ============================================
export const PROD_CONFIG = {
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
} as const;

// ============================================
// Routes
// ============================================
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  ONBOARDING: '/onboarding',
  CLIENTS: '/clients',
} as const;

// ============================================
// API Endpoints
// ============================================
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: number) => `/products/${id}`,
  },
  ONBOARDING: '/onboarding',
  HEALTH: '/health',
} as const;

// ============================================
// Default Values
// ============================================
export const DEFAULTS = {
  CREDENTIALS: {
    USERNAME: 'guardian',
    PASSWORD: 'onboarding123',
  },
  TOKEN_EXPIRATION: {
    ACCESS_TOKEN_MINUTES: 5,
    REFRESH_TOKEN_MINUTES: 5,
  },
} as const;

