import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Target modern browsers - no unnecessary polyfills
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // Optimize CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size to reduce number of CSS files
    rollupOptions: {
      output: {
        // Manual chunks configuration for better CSS splitting
        manualChunks: {
          // Core vendor libraries
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // Query and state management
          'queries': [
            '@tanstack/react-query',
          ],
          // UI components library
          'ui-lib': [
            'lucide-react',
          ],
        },
      },
    },
    // Increase chunk size limit to reduce fragmentation
    chunkSizeWarningLimit: 1000,
    // Use esbuild for minification (built-in, faster than terser)
    minify: 'esbuild',
    // Optimize module preload
    modulePreload: {
      polyfill: false,
    },
  },
  // Optimize dev server
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
