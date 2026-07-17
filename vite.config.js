import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Frontend-only demo — no backend, no proxy.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/sge-[name]-[hash].js',
        chunkFileNames: 'assets/sge-[name]-[hash].js',
        assetFileNames: 'assets/sge-[name]-[hash][extname]',
      },
    },
  },
});
