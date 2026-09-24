import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves a project site from https://<user>.github.io/<repo>/,
  // so every asset URL needs that prefix. The deploy workflow passes the repo
  // name in VITE_BASE; local dev and any root-domain host keep '/'.
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Libraries change far less often than the destination data: split
        // them so returning visitors keep them cached across deploys.
        manualChunks: {
          vendor: ['react', 'react-dom', 'motion/react'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
