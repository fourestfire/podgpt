import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { resolve } from 'path';

export default defineConfig({
  base: '/static/',
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // generate .vite/manifest.json in outDir
    // manifest: true,
    manifest: "manifest.json",
    // outDir: resolve(__dirname, "./dist"), default is dist
    // assetsDir: default is assets folder nested under outdir
    rollupOptions: {
      // overwrite default .html entry
      // input: '/path/to/main.js',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
});


