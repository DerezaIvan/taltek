import path from 'node:path';
import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: false,
    }),
    paths: {
      base: process.env.BASE_PATH ?? '',
      relative: false,
    },
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'ignore',
      entries: ['*'],
    },
    alias: {
      $presentation: path.resolve(__dirname, 'src/presentation'),
      $shared: path.resolve(__dirname, 'src/shared'),
      $infrastructure: path.resolve(__dirname, 'src/infrastructure'),
    },
  },
};

export default config;
