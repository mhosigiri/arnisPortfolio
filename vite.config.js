import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['three'], // Split 'three' into a separate chunk
        },
      },
    },
    outDir: 'dist',
  },
});
