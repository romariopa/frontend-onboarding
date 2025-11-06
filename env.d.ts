/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // API Configuration
    readonly NEXT_PUBLIC_API_URL?: string;
    readonly NEXT_PUBLIC_API_TIMEOUT?: string;

    // Application Configuration
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT?: string;
    readonly NEXT_PUBLIC_APP_URL?: string;

    // Authentication & Security
    readonly NEXT_PUBLIC_AUTH_STORAGE_KEY?: string;
    readonly NEXT_PUBLIC_TOKEN_WARNING_TIME?: string;

    // MSW Configuration
    readonly NEXT_PUBLIC_ENABLE_MSW?: string;
    readonly NEXT_PUBLIC_MSW_ON_UNHANDLED_REQUEST?: 'bypass' | 'warn' | 'error';

    // Feature Flags
    readonly NEXT_PUBLIC_ENABLE_TOKEN_TIMER?: string;
    readonly NEXT_PUBLIC_ENABLE_HEALTH_CHECK?: string;
    readonly NEXT_PUBLIC_ENABLE_PRODUCTS?: string;
    readonly NEXT_PUBLIC_ENABLE_ONBOARDING?: string;

    // UI/UX Configuration
    readonly NEXT_PUBLIC_THEME?: 'light' | 'dark' | 'auto';
    readonly NEXT_PUBLIC_LOCALE?: string;

    // Analytics & Monitoring
    readonly NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
    readonly NEXT_PUBLIC_GA_ID?: string;
    readonly NEXT_PUBLIC_SENTRY_DSN?: string;

    // Development
    readonly NEXT_PUBLIC_DEBUG?: string;
    readonly NEXT_PUBLIC_LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';

    // Production
    readonly NEXT_PUBLIC_APP_VERSION?: string;
    readonly NEXT_PUBLIC_BUILD_TIME?: string;
  }
}

