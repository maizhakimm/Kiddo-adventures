import fs from 'fs';
import path from 'path';
import { QUESTION_BANK } from '../web/src/questionBank.js';

const outDir = path.join(process.cwd(), 'web', 'public', 'visuals', 'bank');
fs.mkdirSync(outDir, { recursive: true });

const palettes = {
  nombor: ['#4d9bd1', '#e6f5ff', '#2f2b50'],
  warna_bentuk: ['#7a5bc8', '#efe8ff', '#2f2b50'],
  padan_gambar: ['#3c9c78', '#e2f8ee', '#2f2b50'],
  jigsaw: ['#d39a31', '#fff5cd', '#2f2b50'],
  kira_asas: ['#d65e86', '#ffe7ef', '#2f2b50']
};

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function chunks(value, size) {
  const chars = Array.from(String(value));
  const rows = [];
  for (let i = 0; i < chars.length; i += size) rows.push(chars.slice(i, i + size).join(''));
  return rows.slice(0, 4);
}

function svg(gameKey, q) {
  const [accent, soft, ink] = palettes[gameKey] || ['#6752bd', '#f2efff', '#2f2b50'];
  const visual = String(q.visual || '');
  const fontSize = visual.length > 34 ? 42 : visual.length > 18 ? 54 : 72;
  const rows = chunks(visual, visual.length > 28 ? 18 : 14);
  const rowStart = 172 - (rows.length - 1) * 28;
  const prompt = chunks(q.prompt || '', 28);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(q.prompt)}</title>
  <desc id="desc">Visual pembelajaran Kiddo Adventures ${gameKey} level ${q.level}</desc>
  <defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fffdf9"/><stop offset="1" stop-color="${soft}"/></linearGradient></defs>
  <rect width="640" height="400" rx="36" fill="url(#bg)"/>
  <circle cx="92" cy="82" r="46" fill="${accent}" opacity=".18"/>
  <circle cx="548" cy="84" r="58" fill="${accent}" opacity=".14"/>
  <path d="M0 338 C118 302 196 372 316 338 S508 304 640 342 V400 H0Z" fill="#fff" opacity=".72"/>
  <rect x="62" y="54" width="516" height="246" rx="34" fill="#fff" opacity=".72" stroke="${accent}" stroke-width="6"/>
  ${rows.map((line, i) => `<text x="320" y="${rowStart + i * 56}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="900" fill="${ink}">${escapeXml(line)}</text>`).join('\n  ')}
  <text x="320" y="338" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="900" fill="${ink}">${escapeXml(prompt[0] || '')}</text>
  ${prompt[1] ? `<text x="320" y="368" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="800" fill="#68657d">${escapeXml(prompt[1])}</text>` : ''}
</svg>
`;
}

for (const [gameKey, bank] of Object.entries(QUESTION_BANK)) {
  if (gameKey === 'huruf') continue;
  for (const q of bank) {
    const file = path.join(outDir, `${gameKey}-${String(q.level).padStart(2, '0')}.svg`);
    fs.writeFileSync(file, svg(gameKey, q));
  }
}

console.log('Generated generic visuals for non-huruf question banks.');
