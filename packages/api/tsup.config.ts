import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false, // 开发环境不压缩
  splitting: false,
  treeshake: true,
  outDir: 'dist',
  target: 'node18', // 根据你的 Node.js 版本调整
  platform: 'node',
  esbuildOptions(options) {
    options.banner = {
      js: '#!/usr/bin/env node',
    };
  },
}); 
