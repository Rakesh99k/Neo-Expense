/**
 * Vite configuration for the React frontend.
 * - Registers the React plugin (Fast Refresh, JSX transform).
 * - Defines path aliases for cleaner, maintainable imports.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@context': '/src/context',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@styles': '/src/styles'
    }
  }
});
