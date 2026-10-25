import { readdir, stat, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const path = decodeURIComponent(root.pathname);
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const children = await Promise.all(entries.map(entry => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : file;
  }));
  return children.flat();
}

const files = await walk(path);
const sizes = await Promise.all(files.map(async file => ({ file, bytes: (await stat(file)).size })));
const oversized = sizes.filter(item => item.bytes > 25 * 1024 * 1024);
if (files.length > 20_000 || oversized.length) {
  console.error('Cloudflare Pages 免费版资源限制检查未通过。');
  oversized.forEach(item => console.error(`${relative(path, item.file)}: ${(item.bytes / 1024 ** 2).toFixed(2)} MiB > 25 MiB`));
  if (files.length > 20_000) console.error(`${files.length} files > 20000`);
  process.exitCode = 1;
} else {
  const html = await readFile(join(path, 'index.html'), 'utf8');
  if (html.includes('/src/main.jsx')) throw new Error('dist/index.html 仍指向开发源码，请重新执行 npm run build。');
  const total = sizes.reduce((sum, item) => sum + item.bytes, 0);
  const largest = sizes.reduce((max, item) => item.bytes > max.bytes ? item : max);
  console.log(`PASS: ${files.length} static files, ${(total / 1024 ** 2).toFixed(2)} MiB total.`);
  console.log(`Largest: ${relative(path, largest.file)} (${(largest.bytes / 1024 ** 2).toFixed(2)} MiB < 25 MiB).`);
}
