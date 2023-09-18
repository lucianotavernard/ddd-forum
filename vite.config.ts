import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: {
        type: 'es6',
      },
    }),
  ],
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
    },
  },
});
