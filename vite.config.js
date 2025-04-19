import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/TerraBloom/', // GitHub Pages URL path
  plugins: [
    react(),
    tailwindcss(),
  ],
});
