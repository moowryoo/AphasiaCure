import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Rounded rectangle background (terracotta)
  const radius = size * 0.15;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = '#D4845A';
  ctx.fill();

  // Speech bubble
  const cx = size * 0.48;
  const cy = size * 0.42;
  const bw = size * 0.5;
  const bh = size * 0.36;
  const br = size * 0.1;

  ctx.beginPath();
  ctx.moveTo(cx - bw / 2 + br, cy - bh / 2);
  ctx.lineTo(cx + bw / 2 - br, cy - bh / 2);
  ctx.quadraticCurveTo(cx + bw / 2, cy - bh / 2, cx + bw / 2, cy - bh / 2 + br);
  ctx.lineTo(cx + bw / 2, cy + bh / 2 - br);
  ctx.quadraticCurveTo(cx + bw / 2, cy + bh / 2, cx + bw / 2 - br, cy + bh / 2);
  ctx.lineTo(cx - bw / 2 + bw * 0.35, cy + bh / 2);
  // Tail
  ctx.lineTo(cx - bw / 2 + bw * 0.15, cy + bh / 2 + size * 0.12);
  ctx.lineTo(cx - bw / 2 + bw * 0.22, cy + bh / 2);
  ctx.lineTo(cx - bw / 2 + br, cy + bh / 2);
  ctx.quadraticCurveTo(cx - bw / 2, cy + bh / 2, cx - bw / 2, cy + bh / 2 - br);
  ctx.lineTo(cx - bw / 2, cy - bh / 2 + br);
  ctx.quadraticCurveTo(cx - bw / 2, cy - bh / 2, cx - bw / 2 + br, cy - bh / 2);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Three dots inside bubble
  const dotRadius = size * 0.028;
  const dotY = cy;
  const dotSpacing = size * 0.08;
  ctx.fillStyle = '#D4845A';
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(cx + i * dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toBuffer('image/png');
}

const outDir = resolve(__dirname, '..', 'public');

writeFileSync(resolve(outDir, 'icon-192.png'), generateIcon(192));
console.log('Created icon-192.png');

writeFileSync(resolve(outDir, 'icon-512.png'), generateIcon(512));
console.log('Created icon-512.png');
