import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  platform: 'node',
  target: 'node18',
  clean: true,
  minify: true,
  sourcemap: true,
  outDir: 'dist',
}); 
