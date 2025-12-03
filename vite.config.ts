import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base URL: /charts/ em produção, / em desenvolvimento
// Pode ser sobrescrito pela variável de ambiente VITE_BASE_URL
const baseUrl = process.env.VITE_BASE_URL || '/charts/';

export default defineConfig({
  base: baseUrl,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3003,
    allowedHosts: [
      'omara-obs.com',
      'www.omara-obs.com',
      'localhost',
      '127.0.0.1',
    ],
  },
});
