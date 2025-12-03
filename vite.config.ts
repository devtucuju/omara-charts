import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
function getBaseUrl(): string {
  if (process.env.VITE_BASE_URL) {
    return process.env.VITE_BASE_URL;
  }
  return process.env.NODE_ENV === 'production' ? '/charts/' : '/';
}

export default defineConfig({
  base: getBaseUrl(),
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
