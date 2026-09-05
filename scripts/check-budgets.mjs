import { readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const assets = readdirSync('dist/assets').map((name) => `dist/assets/${name}`);
const largestGzip = (extension) => Math.max(0, ...assets
  .filter((path) => path.endsWith(extension))
  .map((path) => gzipSync(readFileSync(path)).byteLength));

const jsGzip = largestGzip('.js');
const cssGzip = largestGzip('.css');
const mobileScene = statSync('dist/assets/sf-founder-fork-launch-table-768.avif').size;

console.log(JSON.stringify({ js_gzip_bytes: jsGzip, css_gzip_bytes: cssGzip, mobile_scene_bytes: mobileScene }, null, 2));

if (jsGzip > 150_000) throw new Error(`Initial JavaScript exceeds 150 KB gzip: ${jsGzip}`);
if (cssGzip > 50_000) throw new Error(`CSS exceeds 50 KB gzip: ${cssGzip}`);
if (mobileScene > 300_000) throw new Error(`Mobile scene exceeds 300 KB: ${mobileScene}`);
