// Kiddo Adventures question bank
// Data-driven, deterministic and intentionally varied by learning objective.
// Keep every level auditable here instead of generating repeated questions in the UI.

function rotate(items, level) {
  const list = [...items];
  if (!list.length) return list;
  const n = (level - 1) % list.length;
  return [...list.slice(n), ...list.slice(0, n)];
}

function options(answer, distractors, level) {
  const unique = [answer, ...distractors].filter((v, i, a) => a.findIndex(x => String(x) === String(v)) === i).slice(0, 4);
  return rotate(unique, level);
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LETTER_EXAMPLES = [
  ['A', '🐔 Ayam'], ['B', '⚽ Bola'], ['C', '🥤 Cawan'], ['D', '🎲 Dadu'], ['E', '🍎 Epal'], ['F', '⛴️ Feri'],
  ['G', '🐘 Gajah'], ['H', '🐯 Harimau'], ['I', '🐟 Ikan'], ['J', '⏰ Jam'], ['K', '🐱 Kucing'], ['L', '💡 Lampu'],
  ['M', '👁️ Mata'], ['N', '🍚 Nasi'], ['O', '🍊 Oren'], ['P', '🍌 Pisang'], ['Q', 'Q'], ['R', '🏠 Rumah'],
  ['S', '🥛 Susu'], ['T', '🎩 Topi'], ['U', '🐍 Ular'], ['V', '🚐 Van'], ['W', '🪁 Wau'], ['X', '🩻 X-ray'],
  ['Y', '🪀 Yo-yo'], ['Z', '🦓 Zebra']
];

const huruf = LETTER_EXAMPLES.map(([letter, example], index) => {
  const level = index + 1;
  const prev = LETTERS[(index + 25) % 26];
  const next = LETTERS[(index + 1) % 26];
  const far = LETTERS[(index + 7) % 26];
  if (level <= 13) {
    return {
      level,
      skill: 'kenal-huruf',
      prompt: `Cari huruf ${letter}`,
      visual: letter,
      visualType: 'letter',
      options: options(letter, [prev, next, far], level),
      answer: letter
    };
  }
  return {
    level,
    skill: 'huruf-awal',
    prompt: example === 'Q' ? 'Cari huruf Q' : `Huruf awal untuk ${example.replace(/^\S+\s/, '')}?`,
    visual: example,
    visualType: example === 'Q' ? 'letter' : 'word',
    options: options(letter, [prev, next, far], level),
    answer: letter
  };
});

const nombor = [
  {skill:'kenal-nombor',prompt:'Cari nombor 1',visual:'1',options:['1','2','4','3'],answer:'1'},
  {skill:'kenal-nombor',prompt:'Cari nombor 2',visual:'2',options:['3','2','1','4'],answer:'2'},
  {skill:'kenal-nombor',prompt:'Cari nombor 3',visual:'3',options:['2','4','3','5'],answer:'3'},
  {skill:'kenal-nombor',prompt:'Cari nombor 4',visual:'4',options:['5','3','1','4'],answer:'4'},
  {skill:'kenal-nombor',prompt:'Cari nombor 5',visual:'5',options:['2','5','6','4'],answer:'5'},
  {skill:'kira-objek',prompt:'Berapa biji epal?',visual:'🍎🍎',options:['1','3','2','4'],answer:'2'},
  {skill:'kira-objek',prompt:'Berapa ekor ikan?',visual:'🐟🐟🐟',options:['4','2','3','5'],answer:'3'},
  {skill:'kira-objek',prompt:'Berapa bintang?',visual:'⭐⭐⭐⭐',options:['4','5','3','2'],answer:'4'},
  {skill:'kira-objek',prompt:'Berapa belon?',visual:'🎈🎈🎈🎈🎈',options:['6','4','5','3'],answer:'5'},
  {skill:'kira-objek',prompt:'Berapa bunga?',visual:'🌼🌼🌼🌼🌼🌼',options:['5','7','6','4'],answer:'6'},
  {skill:'kenal-nombor',prompt:'Cari nombor 6',visual:'6',options:['6','8','5','7'],answer:'6'},
  {skill:'kenal-nombor',prompt:'Cari nombor 7',visual:'7',options:['9','6','7','8'],answer:'7'},
  {skill:'kenal-nombor',prompt:'Cari nombor 8',visual:'8',options:['7','9','6','8'],answer:'8'},
  {skill:'kenal-nombor',prompt:'Cari nombor 9',visual:'9',options:['10','8','9','7'],answer:'9'},
  {skill:'kenal-nombor',prompt:'Cari nombor 10',visual:'10',options:['9','10','8','7'],answer:'10'},
  {skill:'urutan',prompt:'Nombor apa yang hilang?',visual:'1  •  2  •  ?  •  4',options:['5','3','2','1'],answer:'3'},
  {skill:'urutan',prompt:'Nombor apa selepas 5?',visual:'4  •  5  •  ?',options:['5','7','6','4'],answer:'6'},
  {skill:'urutan',prompt:'Nombor apa sebelum 8?',visual:'?  •  8  •  9',options:['6','9','7','8'],answer:'7'},
  {skill:'banding',prompt:'Yang mana lebih banyak?',visual:'⭐⭐⭐⭐⭐⭐⭐⭐  vs  ⭐⭐⭐⭐⭐⭐',options:['6','8','7','5'],answer:'8'},
  {skill:'urutan',prompt:'Lengkapkan urutan',visual:'7  •  8  •  9  •  ?',options:['10','8','11','9'],answer:'10'}
].map((q,i)=>({...q,level:i+1}));

const warna_bentuk = [
  {skill:'warna',prompt:'Pilih warna merah',visual:'🎨',options:['🔴','🔵','🟢','🟡'],answer:'🔴'},
  {skill:'warna',prompt:'Pilih warna biru',visual:'🎨',options:['🟡','🔵','🟣','🔴'],answer:'🔵'},
  {skill:'warna',prompt:'Pilih warna hijau',visual:'🎨',options:['🔵','🟢','🟡','🟣'],answer:'🟢'},
  {skill:'warna',prompt:'Pilih warna kuning',visual:'🎨',options:['🟣','🔴','🟡','🟢'],answer:'🟡'},
  {skill:'warna',prompt:'Pilih warna ungu',visual:'🎨',options:['🟢','🟣','🔵','🔴'],answer:'🟣'},
  {skill:'bentuk',prompt:'Pilih bulatan',visual:'🔎 Bentuk',options:['⚪','🔺','◼️','⭐'],answer:'⚪'},
  {skill:'bentuk',prompt:'Pilih segi tiga',visual:'🔎 Bentuk',options:['⭐','🔺','❤️','⚪'],answer:'🔺'},
  {skill:'bentuk',prompt:'Pilih segi empat',visual:'🔎 Bentuk',options:['❤️','⚪','◼️','🔺'],answer:'◼️'},
  {skill:'bentuk',prompt:'Pilih bintang',visual:'🔎 Bentuk',options:['⭐','❤️','⚪','◼️'],answer:'⭐'},
  {skill:'bentuk',prompt:'Pilih bentuk hati',visual:'🏆 Cabaran bentuk',options:['🔺','❤️','⭐','◼️'],answer:'❤️'}
].map((q,i)=>({...q,level:i+1}));

const padan_gambar = [
  {skill:'padan-sama',prompt:'Cari gambar yang sama',visual:'🐶',options:['🐱','🐶','🐰','🐼'],answer:'🐶'},
  {skill:'padan-sama',prompt:'Cari gambar yang sama',visual:'🍎',options:['🍌','🍊','🍎','🍇'],answer:'🍎'},
  {skill:'padan-sama',prompt:'Cari gambar yang sama',visual:'🚗',options:['🚲','🚌','🚗','🚂'],answer:'🚗'},
  {skill:'padan-sama',prompt:'Cari gambar yang sama',visual:'⭐',options:['🌙','☀️','⭐','☁️'],answer:'⭐'},
  {skill:'padan-sama',prompt:'Cari gambar yang sama',visual:'👟',options:['🎩','👟','🧦','👕'],answer:'👟'},
  {skill:'padan-sama',prompt:'Cari gambar yang sama',visual:'✏️',options:['📚','✏️','🎒','📏'],answer:'✏️'},
  {skill:'kategori',prompt:'Yang mana satu lagi haiwan?',visual:'🐶  🐱  🐰',options:['🐼','🍎','🚗','⭐'],answer:'🐼'},
  {skill:'kategori',prompt:'Yang mana satu lagi buah?',visual:'🍎  🍌  🍊',options:['🐟','🍇','🚌','👟'],answer:'🍇'},
  {skill:'kategori',prompt:'Yang mana satu lagi kenderaan?',visual:'🚗  🚌  🚲',options:['🚂','🐱','🍎','☁️'],answer:'🚂'},
  {skill:'kategori',prompt:'Yang mana hidup di laut?',visual:'🌊',options:['🐠','🐯','🐔','🐰'],answer:'🐠'},
  {skill:'kategori',prompt:'Yang mana dipakai di kepala?',visual:'👕  👟  🧦  ?',options:['🎩','🍎','🚗','📚'],answer:'🎩'},
  {skill:'kategori',prompt:'Yang mana barang sekolah?',visual:'🏫 Cabaran akhir',options:['🎒','🐟','🍌','🚗'],answer:'🎒'}
].map((q,i)=>({...q,level:i+1}));

const jigsaw = [
  {skill:'corak',prompt:'Apa yang datang seterusnya?',visual:'🔴  🔵  🔴  ?',options:['🔵','🟢','🟡','🔴'],answer:'🔵'},
  {skill:'corak',prompt:'Apa yang datang seterusnya?',visual:'⭐  🌙  ⭐  ?',options:['☁️','🌙','⭐','☀️'],answer:'🌙'},
  {skill:'corak',prompt:'Lengkapkan corak',visual:'🐱  🐶  🐱  ?',options:['🐶','🐰','🐼','🐱'],answer:'🐶'},
  {skill:'pasangan',prompt:'Cari pasangan yang betul',visual:'🧦 + ?',options:['👟','🧦','🎩','🧤'],answer:'🧦'},
  {skill:'hubungan',prompt:'Bulan biasanya muncul waktu...',visual:'🌙',options:['malam','pagi','tengah hari','petang'],answer:'malam'},
  {skill:'hubungan',prompt:'Ikan tinggal di...',visual:'🐟',options:['air','pokok','langit','jalan'],answer:'air'},
  {skill:'fungsi',prompt:'Kasut dipakai pada...',visual:'👟',options:['kaki','kepala','tangan','telinga'],answer:'kaki'},
  {skill:'fungsi',prompt:'Kunci digunakan untuk...',visual:'🔑',options:['buka pintu','makan','melukis','tidur'],answer:'buka pintu'},
  {skill:'beza',prompt:'Cari yang berbeza',visual:'🍎  🍎  🍌  🍎',options:['🍌','🍎','🍇','🍊'],answer:'🍌'},
  {skill:'corak',prompt:'🏆 Lengkapkan cabaran akhir',visual:'🔺  ⚪  🔺  ⚪  ?',options:['🔺','⚪','⭐','◼️'],answer:'🔺'}
].map((q,i)=>({...q,level:i+1}));

const kira_asas = [
  {skill:'tambah',prompt:'1 + 1 = ?',visual:'🍎 + 🍎',options:['2','1','3','4'],answer:'2'},
  {skill:'tambah',prompt:'2 + 1 = ?',visual:'⭐⭐ + ⭐',options:['2','4','3','1'],answer:'3'},
  {skill:'tambah',prompt:'2 + 2 = ?',visual:'🐟🐟 + 🐟🐟',options:['4','3','5','2'],answer:'4'},
  {skill:'tambah',prompt:'3 + 1 = ?',visual:'🎈🎈🎈 + 🎈',options:['5','4','3','2'],answer:'4'},
  {skill:'tambah',prompt:'3 + 2 = ?',visual:'🍊🍊🍊 + 🍊🍊',options:['4','6','5','3'],answer:'5'},
  {skill:'tolak',prompt:'3 − 1 = ?',visual:'⭐⭐⭐ buang ⭐',options:['2','3','1','4'],answer:'2'},
  {skill:'tolak',prompt:'4 − 1 = ?',visual:'🍎🍎🍎🍎 buang 🍎',options:['4','2','3','1'],answer:'3'},
  {skill:'tolak',prompt:'5 − 2 = ?',visual:'🎈🎈🎈🎈🎈 buang 🎈🎈',options:['2','4','3','5'],answer:'3'},
  {skill:'tolak',prompt:'6 − 3 = ?',visual:'🐟🐟🐟🐟🐟🐟',options:['3','2','4','5'],answer:'3'},
  {skill:'tolak',prompt:'7 − 2 = ?',visual:'⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐',options:['6','5','4','7'],answer:'5'},
  {skill:'banding',prompt:'Mana lebih banyak?',visual:'🍎🍎🍎  atau  🍎🍎',options:['3','2','1','4'],answer:'3'},
  {skill:'banding',prompt:'Mana lebih kecil?',visual:'4  atau  6',options:['4','6','5','3'],answer:'4'},
  {skill:'nombor-hilang',prompt:'2 + ? = 5',visual:'🧠 Cari nombor hilang',options:['3','2','4','1'],answer:'3'},
  {skill:'cerita',prompt:'Ada 3 epal. Dapat 2 lagi. Jadi berapa?',visual:'🍎🍎🍎  +  🍎🍎',options:['5','4','6','3'],answer:'5'},
  {skill:'campuran',prompt:'🏆 Cabaran akhir: 5 − 2 = ?',visual:'🏆',options:['3','2','4','5'],answer:'3'}
].map((q,i)=>({...q,level:i+1}));

export const QUESTION_BANK = { huruf, nombor, warna_bentuk, padan_gambar, jigsaw, kira_asas };

export function makeChallenge(gameKey, level) {
  const bank = QUESTION_BANK[gameKey] || [];
  const challenge = bank[level - 1];
  if (challenge) return challenge;
  return {
    level,
    skill: 'fallback',
    prompt: 'Pilih jawapan yang betul',
    visual: '🎮',
    options: ['A','B','C','D'],
    answer: 'A'
  };
}

export function getBankAudit() {
  return Object.fromEntries(Object.entries(QUESTION_BANK).map(([key, bank]) => [key, {
    levels: bank.length,
    skills: [...new Set(bank.map(q => q.skill))],
    duplicatePrompts: bank.length - new Set(bank.map(q => `${q.prompt}|${q.visual}`)).size
  }]));
}
