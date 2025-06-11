import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false, // 开发环境不压缩
  splitting: false,
  treeshake: true,
  outDir: 'dist',
  target: 'es2020',
  platform: 'browser',
  external: ['react', 'react-dom'], // 外部依赖
  esbuildOptions(options) {
    options.jsx = 'automatic'; // 支持 React 17+ 的 JSX 转换
  },
}); 
