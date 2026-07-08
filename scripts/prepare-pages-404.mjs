import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('build/404/index.html');
const target = resolve('build/404.html');

if (!existsSync(source)) {
  console.error('Missing prerendered 404 page:', source);
  process.exit(1);
}

copyFileSync(source, target);
console.log('Created build/404.html for GitHub Pages');
