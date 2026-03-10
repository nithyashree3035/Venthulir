import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isAdmin = mode === 'admin';

  return {
    plugins: [react()],
    // If admin mode, set base to /admin/ so assets load correctly from subdirectory
    base: isAdmin ? '/admin/' : '/',
    // Separate entry point for customer vs admin
    root: path.resolve(__dirname),
    build: isAdmin
      ? {
        rollupOptions: {
          input: path.resolve(__dirname, 'admin.html'),
        },
        outDir: 'dist-admin',
      }
      : {
        rollupOptions: {
          input: path.resolve(__dirname, 'index.html'),
        },
        outDir: 'dist',
      },
    server: {
      port: isAdmin ? 5175 : 5173,
    },
  };
});
