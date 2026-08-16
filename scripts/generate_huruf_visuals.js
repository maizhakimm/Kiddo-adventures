const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'web', 'public', 'visuals', 'bank');
fs.mkdirSync(outDir, { recursive: true });

const items = [
  { t: 'A', label: 'Cari huruf A', obj: 'apple', c1: '#ff6b6b', c2: '#ffd166' },
  { t: 'B', label: 'Cari huruf B', obj: 'balloon', c1: '#6c63ff', c2: '#ffb4a2' },
  { t: 'C', label: 'Cari huruf C', obj: 'cat', c1: '#ffb703', c2: '#8ecae6' },
  { t: 'D', label: 'Cari huruf D', obj: 'drum', c1: '#00b4d8', c2: '#f77f00' },
  { t: 'E', label: 'Epal', obj: 'apple', c1: '#ef476f', c2: '#caffbf' },
  { t: 'F', label: 'Feri', obj: 'boat', c1: '#118ab2', c2: '#ffd166' },
  { t: 'G', label: 'Cari huruf G', obj: 'gift', c1: '#06d6a0', c2: '#f15bb5' },
  { t: 'H', label: 'Harimau', obj: 'tiger', c1: '#fb8500', c2: '#ffdd00' },
  { t: 'I', label: 'Ikan', obj: 'fish', c1: '#00bbf9', c2: '#fee440' },
  { t: 'J', label: 'Jam', obj: 'clock', c1: '#9b5de5', c2: '#f15bb5' },
  { t: 'K', label: 'Kucing', obj: 'cat', c1: '#f4a261', c2: '#2a9d8f' },
  { t: 'L', label: 'Lampu', obj: 'lamp', c1: '#ffd166', c2: '#4cc9f0' },
  { t: 'M', label: 'Cari huruf M', obj: 'mountain', c1: '#43aa8b', c2: '#90be6d' },
  { t: 'N', label: 'Nasi', obj: 'bowl', c1: '#f8f9fa', c2: '#adb5bd' },
  { t: 'O', label: 'Oren', obj: 'orange', c1: '#fb8500', c2: '#ffb703' },
  { t: 'P', label: 'Pisang', obj: 'banana', c1: '#ffd60a', c2: '#74c69d' },
  { t: 'Q', label: 'Cari huruf Q', obj: 'queen', c1: '#b5179e', c2: '#f72585' },
  { t: 'R', label: 'Rumah', obj: 'house', c1: '#e76f51', c2: '#2a9d8f' },
  { t: 'S', label: 'Susu', obj: 'milk', c1: '#ffffff', c2: '#80ed99' },
  { t: 'T', label: 'Topi', obj: 'hat', c1: '#3a0ca3', c2: '#f72585' },
  { t: 'U', label: 'Ular', obj: 'snake', c1: '#80b918', c2: '#d9ed92' },
  { t: 'V', label: 'Van', obj: 'van', c1: '#48cae4', c2: '#ffd166' },
  { t: 'W', label: 'Wau', obj: 'kite', c1: '#ff006e', c2: '#8338ec' },
  { t: 'X', label: 'Cari huruf X', obj: 'xylophone', c1: '#ffbe0b', c2: '#3a86ff' },
  { t: 'Y', label: 'Yo-yo', obj: 'yoyo', c1: '#06d6a0', c2: '#118ab2' },
  { t: 'Z', label: 'Zebra', obj: 'zebra', c1: '#343a40', c2: '#ffffff' },
  { t: 'BAJU', label: 'Baju', obj: 'shirt', c1: '#00b4d8', c2: '#caf0f8' },
  { t: 'BOLA', label: 'Bola', obj: 'ball', c1: '#ff595e', c2: '#ffca3a' },
  { t: 'K', label: 'Kucing', obj: 'cat', c1: '#f4a261', c2: '#90be6d' },
  { t: 'ZEBRA', label: 'Cabaran akhir', obj: 'zebra', c1: '#111827', c2: '#ffd166' }
];

function shape(obj, a, b) {
  const common = `<ellipse cx="320" cy="300" rx="150" ry="22" fill="#000" opacity=".08"/>`;
  const map = {
    apple: `<circle cx="320" cy="220" r="82" fill="${a}"/><circle cx="286" cy="204" r="48" fill="${a}"/><circle cx="354" cy="204" r="48" fill="${a}"/><rect x="314" y="112" width="16" height="54" rx="8" fill="#7f4f24"/><ellipse cx="360" cy="136" rx="38" ry="19" fill="#52b788" transform="rotate(-24 360 136)"/>`,
    balloon: `<ellipse cx="320" cy="198" rx="86" ry="102" fill="${a}"/><path d="M320 300 C298 340 350 356 320 392" stroke="#6b7280" stroke-width="7" fill="none"/><path d="M296 286 L344 286 L320 318 Z" fill="${b}"/>`,
    cat: `<circle cx="320" cy="216" r="90" fill="${a}"/><path d="M250 156 L274 84 L304 146 ZM390 156 L366 84 L336 146 Z" fill="${a}"/><circle cx="290" cy="210" r="10"/><circle cx="350" cy="210" r="10"/><path d="M320 226 q-10 14-24 0M320 226 q10 14 24 0" stroke="#3b2f2f" stroke-width="6" fill="none"/><circle cx="320" cy="225" r="8" fill="#ef476f"/>`,
    drum: `<ellipse cx="320" cy="154" rx="96" ry="34" fill="${b}"/><rect x="224" y="154" width="192" height="138" fill="${a}"/><ellipse cx="320" cy="292" rx="96" ry="34" fill="#fefae0"/><path d="M244 170 L396 276M396 170 L244 276" stroke="#fff" stroke-width="10"/><path d="M232 88 L300 138M408 88 L340 138" stroke="#7c3f00" stroke-width="9" stroke-linecap="round"/>`,
    boat: `<path d="M188 258 h264 l-42 70 H230 Z" fill="${a}"/><path d="M286 94 v154 h116 Z" fill="${b}"/><path d="M286 114 v134 h-84 Z" fill="#fff"/><path d="M168 332 q72 34 152 0 t152 0" stroke="#48cae4" stroke-width="18" fill="none"/>`,
    gift: `<rect x="220" y="180" width="200" height="140" rx="18" fill="${a}"/><rect x="304" y="180" width="32" height="140" fill="${b}"/><rect x="210" y="158" width="220" height="42" rx="12" fill="${b}"/><path d="M318 156 C250 112 246 194 318 176 C390 194 390 112 318 156Z" fill="#fff" opacity=".85"/>`,
    tiger: `<circle cx="320" cy="218" r="94" fill="${a}"/><path d="M250 148 L274 82 L306 146 ZM390 148 L366 82 L334 146 Z" fill="${a}"/><path d="M278 142 l24 62M362 142 l-24 62M242 212 h58M340 212 h58" stroke="#222" stroke-width="10"/><circle cx="290" cy="226" r="10"/><circle cx="350" cy="226" r="10"/><ellipse cx="320" cy="254" rx="38" ry="26" fill="#fff2cc"/><circle cx="320" cy="244" r="8" fill="#222"/>`,
    fish: `<ellipse cx="306" cy="220" rx="110" ry="68" fill="${a}"/><path d="M416 220 l72-58 v116 Z" fill="${b}"/><circle cx="270" cy="206" r="10" fill="#111"/><path d="M210 220 q34 35 80 0" stroke="#fff" stroke-width="8" fill="none"/>`,
    clock: `<circle cx="320" cy="220" r="100" fill="#fff" stroke="${a}" stroke-width="18"/><path d="M320 220 v-58M320 220 h50" stroke="#22223b" stroke-width="11" stroke-linecap="round"/><circle cx="320" cy="220" r="9" fill="${b}"/><rect x="270" y="322" width="100" height="20" rx="10" fill="${a}"/>`,
    lamp: `<path d="M252 164 h136 l-34 100 H286 Z" fill="${a}"/><rect x="304" y="264" width="32" height="64" rx="10" fill="#8d99ae"/><rect x="250" y="326" width="140" height="24" rx="12" fill="${b}"/><circle cx="320" cy="144" r="52" fill="#fff3b0" opacity=".75"/>`,
    mountain: `<path d="M176 316 L282 132 L354 316 Z" fill="${a}"/><path d="M286 316 L390 158 L488 316 Z" fill="${b}"/><path d="M282 132 l30 52 h-60 ZM390 158 l28 48 h-58 Z" fill="#fff"/>`,
    bowl: `<ellipse cx="320" cy="192" rx="112" ry="52" fill="${a}" stroke="${b}" stroke-width="10"/><path d="M214 196 h212 l-34 104 q-72 34-144 0 Z" fill="#dee2e6"/><circle cx="276" cy="160" r="11" fill="#fff"/><circle cx="320" cy="150" r="11" fill="#fff"/><circle cx="364" cy="162" r="11" fill="#fff"/>`,
    orange: `<circle cx="320" cy="220" r="94" fill="${a}"/><ellipse cx="366" cy="136" rx="38" ry="18" fill="#52b788" transform="rotate(-20 366 136)"/><path d="M286 162 q34 52 0 116M354 162 q-34 52 0 116" stroke="#ffcf70" stroke-width="8" fill="none"/>`,
    banana: `<path d="M216 148 C258 328 424 332 460 182 C406 264 302 268 254 128 Z" fill="${a}"/><path d="M218 148 l36-20M458 182 l28-8" stroke="#6f4518" stroke-width="12" stroke-linecap="round"/>`,
    queen: `<path d="M218 286 h204 l26-138 l-64 50 l-64-86 l-64 86 l-64-50 Z" fill="${a}"/><circle cx="256" cy="150" r="20" fill="${b}"/><circle cx="320" cy="110" r="20" fill="${b}"/><circle cx="384" cy="150" r="20" fill="${b}"/>`,
    house: `<path d="M198 210 L320 108 L442 210 Z" fill="${a}"/><rect x="226" y="208" width="188" height="118" rx="12" fill="${b}"/><rect x="298" y="250" width="44" height="76" rx="8" fill="#7f4f24"/><rect x="246" y="232" width="40" height="36" rx="7" fill="#caf0f8"/>`,
    milk: `<path d="M264 140 h112 l24 56 v132 H240 V196 Z" fill="${a}" stroke="${b}" stroke-width="10"/><path d="M264 140 l28-44 h56 l28 44" fill="#fff" stroke="${b}" stroke-width="10"/><rect x="260" y="218" width="120" height="62" rx="14" fill="${b}"/><text x="320" y="260" text-anchor="middle" font-family="Arial" font-weight="900" font-size="28" fill="#fff">SUSU</text>`,
    hat: `<ellipse cx="320" cy="278" rx="140" ry="34" fill="${b}"/><path d="M246 270 q26-128 148 0 Z" fill="${a}"/><rect x="268" y="234" width="104" height="26" rx="13" fill="${b}"/>`,
    snake: `<path d="M202 270 C230 142 392 148 392 232 C392 320 260 302 286 224 C304 170 420 192 448 132" stroke="${a}" stroke-width="42" fill="none" stroke-linecap="round"/><circle cx="448" cy="132" r="38" fill="${a}"/><circle cx="436" cy="124" r="6"/><path d="M474 134 h36" stroke="#ef476f" stroke-width="6" stroke-linecap="round"/>`,
    van: `<rect x="186" y="188" width="268" height="100" rx="22" fill="${a}"/><path d="M292 188 h92 l44 50 H292 Z" fill="${b}"/><rect x="216" y="208" width="56" height="36" rx="8" fill="#caf0f8"/><circle cx="250" cy="296" r="28" fill="#333"/><circle cx="394" cy="296" r="28" fill="#333"/>`,
    kite: `<path d="M320 94 L424 202 L320 330 L216 202 Z" fill="${a}"/><path d="M320 94 v236M216 202 h208" stroke="${b}" stroke-width="10"/><path d="M320 330 C272 370 386 398 320 430" stroke="#555" stroke-width="6" fill="none"/>`,
    xylophone: `<g transform="rotate(-12 320 226)"><rect x="220" y="150" width="42" height="160" rx="12" fill="#ff006e"/><rect x="270" y="160" width="42" height="140" rx="12" fill="#fb5607"/><rect x="320" y="170" width="42" height="120" rx="12" fill="${a}"/><rect x="370" y="180" width="42" height="100" rx="12" fill="${b}"/><path d="M208 178 h220M216 282 h200" stroke="#6c584c" stroke-width="10"/></g>`,
    yoyo: `<circle cx="286" cy="220" r="64" fill="${a}"/><circle cx="354" cy="220" r="64" fill="${b}"/><circle cx="320" cy="220" r="28" fill="#fff"/><path d="M320 248 C320 342 450 316 426 404" stroke="#555" stroke-width="7" fill="none"/>`,
    zebra: `<ellipse cx="320" cy="226" rx="112" ry="72" fill="#fff" stroke="#111" stroke-width="8"/><circle cx="226" cy="194" r="48" fill="#fff" stroke="#111" stroke-width="8"/><path d="M264 170 l18 108M314 156 l-30 134M368 162 l-34 128M410 190 l-42 80M206 154 l24 78" stroke="#111" stroke-width="12"/><circle cx="214" cy="184" r="7"/><path d="M430 222 q60 10 74-42" stroke="#111" stroke-width="12" fill="none"/>`,
    shirt: `<path d="M242 140 l50-36 h56 l50 36 l54 52 l-48 52 l-30-28 v112 H266 V216 l-30 28 l-48-52 Z" fill="${a}"/><path d="M292 104 q28 36 56 0" stroke="#fff" stroke-width="10" fill="none"/>`,
    ball: `<circle cx="320" cy="220" r="104" fill="${a}"/><path d="M226 188 q94 38 188 0M226 252 q94-38 188 0M320 116 q-46 104 0 208M320 116 q46 104 0 208" stroke="${b}" stroke-width="12" fill="none"/>`
  };
  return common + (map[obj] || map.gift);
}

function svg(item, index) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-labelledby="title desc">
  <title id="title">${item.label}</title>
  <desc id="desc">Visual pembelajaran Kiddo Adventures level ${index}</desc>
  <defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff8ec"/><stop offset="1" stop-color="#eaf5ff"/></linearGradient></defs>
  <rect width="640" height="400" rx="36" fill="url(#bg)"/>
  <circle cx="86" cy="78" r="46" fill="${item.c2}" opacity=".35"/>
  <circle cx="552" cy="92" r="58" fill="${item.c1}" opacity=".18"/>
  <path d="M0 340 C110 302 196 376 314 340 S510 302 640 342 V400 H0Z" fill="#fff" opacity=".7"/>
  ${shape(item.obj, item.c1, item.c2)}
  <rect x="36" y="32" width="132" height="104" rx="30" fill="#fff" stroke="${item.c1}" stroke-width="8"/>
  <text x="102" y="${item.t.length > 1 ? 98 : 110}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${item.t.length > 4 ? 36 : item.t.length > 1 ? 42 : 78}" font-weight="900" fill="#302d50">${item.t}</text>
  <text x="320" y="374" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="#514b66">${item.label}</text>
</svg>
`;
}

items.forEach((item, i) => {
  const file = path.join(outDir, `huruf-${String(i + 1).padStart(2, '0')}.svg`);
  fs.writeFileSync(file, svg(item, i + 1));
});

console.log(`Generated ${items.length} visuals in ${outDir}`);
