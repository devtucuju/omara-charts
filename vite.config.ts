import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/charts/',
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
