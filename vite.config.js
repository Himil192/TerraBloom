import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow connections from phone
    port: 5173
  },
  plugins: [
    react(),
    tailwindcss(),
  ]
});
