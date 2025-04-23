import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/', // Base URL for the app
  plugins: [
    react(),
    tailwindcss(),
  ],
});
