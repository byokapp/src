import prefresh from '@prefresh/vite';
import { resolve } from 'path';
import type { UserConfig } from 'vite';
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl';

const config: UserConfig = {
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  plugins: [prefresh(), ViteWebfontDownload()],
  resolve: {
    alias: [
      { find: 'react', replacement: 'preact/compat' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: '@', replacement: resolve('src') },
    ],
  },
};

export default config;
