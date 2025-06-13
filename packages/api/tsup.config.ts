import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  target: 'es2020',
  platform: 'browser',
  outDir: 'dist',
}); 
