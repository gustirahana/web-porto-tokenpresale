import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Load all VITE_* environment variables
  const env = loadEnv(mode, process.cwd(), '');

  // Determine API URL based on mode and override flag
  const apiUrl = env.VITE_FORCE_PROD_MODE === 'true'
      ? env.VITE_API_URL // Production API when forced
      : env.VITE_API_BASE_URL; // Normal mode-based API

  return {
    plugins: [react()],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@toolkit', replacement: path.resolve(__dirname, 'src/toolkit') },
        { find: '@Common', replacement: path.resolve(__dirname, 'src/Common') },
        { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
        { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@store', replacement: path.resolve(__dirname, 'src/store') },
      ]
    },
    server: {
      port: parseInt(env.VITE_PORT), // Use VITE_PORT or default to 3000
      open: env.VITE_OPEN_BROWSER === 'true', // Auto-open browser if enabled
    },
    define: {
      // Expose variables to your application
      __APP_ENV__: JSON.stringify({
        API_URL: apiUrl,
        DEBUG_MODE: env.VITE_DEBUG_MODE === 'true',
        IS_PRODUCTION: mode === 'production'
      }),
    },
  };
});