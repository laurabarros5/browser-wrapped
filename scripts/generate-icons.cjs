const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');
const { deflateSync } = require('zlib');

const iconsDir = join(__dirname, '..', 'icons');
mkdirSync(iconsDir, { recursive: true });

function crc32(buf) {
  let c = 0xffffffff;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let v = n;
    for (let k = 0; k < 8; k++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
    table[n] = v;
  }
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeB, data])), 0);
  return Buffer.concat([len, typeB, data, crc]);
}

function makePNG(size) {
  const pixels = [];
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.22;

  for (let y = 0; y < size; y++) {
    pixels.push(0);
    for (let x = 0; x < size; x++) {
      const inRoundedRect = isInRoundedRect(x, y, size, size, radius);
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (inRoundedRect) {
        if (dist < r && dist > r * 0.85) {
          pixels.push(255, 255, 255, 255);
        } else if (dist <= r * 0.85) {
          pixels.push(255, 255, 255, dist < r * 0.12 ? 0 : 180);
        } else {
          pixels.push(29, 185, 84, 255);
        }
      } else {
        pixels.push(0, 0, 0, 0);
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.from(pixels))),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

function isInRoundedRect(x, y, w, h, r) {
  if (x < r && y < r) return Math.hypot(x - r, y - r) <= r;
  if (x >= w - r && y < r) return Math.hypot(x - (w - r), y - r) <= r;
  if (x < r && y >= h - r) return Math.hypot(x - r, y - (h - r)) <= r;
  if (x >= w - r && y >= h - r) return Math.hypot(x - (w - r), y - (h - r)) <= r;
  return x >= 0 && x < w && y >= 0 && y < h;
}

[16, 48, 128].forEach(size => {
  const path = join(iconsDir, `icon${size}.png`);
  writeFileSync(path, makePNG(size));
  console.log('Created', path);
});
