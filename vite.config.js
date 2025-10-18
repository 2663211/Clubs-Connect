import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        parserOpts: {
          plugins: ['jsx'],
        },
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: false, // Allow fallback to other ports if 3000 is busy
    open: true,
    proxy: {
      '/api': {
        target: 'https://clubs-connect-api.onrender.com',
        changeOrigin: true,
        secure: false,
        //rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    exclude: [
      'node_modules',
      'dist',
      'server/**', // skip backend tests
    ],
  },
});
