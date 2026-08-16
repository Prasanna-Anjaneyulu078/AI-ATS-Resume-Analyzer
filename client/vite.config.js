import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'https://resumeats-ai.onrender.com',
      '/resume': 'https://resumeats-ai.onrender.com',
      '/contact': 'https://resumeats-ai.onrender.com',
    },
  },
});
