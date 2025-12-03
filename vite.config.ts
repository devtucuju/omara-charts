import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.VITE_BASE_URL ||
    (process.env.NODE_ENV === 'production' ? '/charts/' : '/'),
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
