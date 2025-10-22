import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/cnn': { target: 'http://localhost:4000', changeOrigin: true },
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
    fs: {
      allow: [
        '.',
        path.resolve(__dirname, 'Store'),
        path.resolve(__dirname, 'cropdate'),
      ],
    },
  },
  resolve: {
    alias: {
      '@store': path.resolve(__dirname, 'Store'),
      '@cropdate': path.resolve(__dirname, 'cropdate'),
    },
  },
});
