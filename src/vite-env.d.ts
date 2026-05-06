// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Core App Configuration
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;

    // API Configuration
    readonly VITE_API_URL: string;
    readonly VITE_API_BASE_URL: string;

    // Development Settings
    readonly VITE_PORT?: string;
    readonly VITE_OPEN_BROWSER?: string;
    readonly VITE_DEBUG_MODE?: string;
    readonly VITE_FORCE_PROD_MODE?: string;

}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Global App Environment Variables
declare const __APP_ENV__: {
    API_URL: string;
    DEBUG_MODE: boolean;
    IS_PRODUCTION: boolean;
    AUTH_ENABLED: boolean;
    VERSION: string;
};