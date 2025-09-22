import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ExtendedDemoSignalsPlugin',
      fileName: (format) => `index.${format === 'cjs' ? 'js' : format}`,
      formats: ['cjs']
    },
    target: 'node14',
    minify: 'terser'
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});