// Kiddo Adventures Question Bank V3
// 30 levels per world. Content is visual-first, age-aware and auditable.

const withLevels = bank => bank.map((q, i) => ({ level: i + 1, ...q }));
const withVisualLevels = (prefix, bank) => withLevels(bank).map(item => ({
  ...item,
  visualSrc: item.visualSrc || `/visuals/bank/${prefix}-${String(item.level).padStart(2, '0')}.svg`
}));
const q = (skill, interaction, prompt, visual, options, answer, age='3-7', extra={}) =>
  ({ skill, interaction, prompt, visual, options, answer, age, ...extra });

const huruf = withVisualLevels('huruf', [
  q('kenal-huruf','tap-choice','Cari huruf A','A',['A','B','D','E'],'A','3-4',{visualType:'letter',visualSrc:'/visuals/bank/huruf-01.webp'}),
  q('kenal-huruf','tap-choice','Cari huruf B','B',['D','B','P','A'],'B','3-4',{visualType:'letter'}),
  q('kenal-huruf','tap-choice','Cari huruf C','C',['G','O','C','S'],'C','3-4',{visualType:'letter'}),
  q('kenal-huruf','tap-choice','Cari huruf D','D',['B','P','D','O'],'D','3-4',{visualType:'letter'}),
  q('huruf-awal','image-choice','Epal bermula dengan huruf apa?','🍎 Epal',['A','E','I','O'],'E','4-5'),
  q('huruf-awal','image-choice','Feri bermula dengan huruf apa?','⛴️ Feri',['V','P','F','T'],'F','4-5'),
  q('kenal-huruf','tap-choice','Cari huruf G','G',['C','G','J','Q'],'G','3-4',{visualType:'letter'}),
  q('huruf-awal','image-choice','Harimau bermula dengan huruf apa?','🐯 Harimau',['K','H','R','M'],'H','4-5'),
  q('huruf-awal','image-choice','Ikan bermula dengan huruf apa?','🐟 Ikan',['E','A','I','U'],'I','4-5'),
  q('huruf-awal','image-choice','Jam bermula dengan huruf apa?','⏰ Jam',['G','J','C','Z'],'J','4-5'),
  q('padan-perkataan','image-choice','Pilih perkataan yang bermula dengan K','K',['🐱 Kucing','💡 Lampu','👁️ Mata','🍚 Nasi'],'🐱 Kucing','5-6'),
  q('padan-perkataan','image-choice','Pilih perkataan yang bermula dengan L','L',['👁️ Mata','💡 Lampu','🏠 Rumah','🥛 Susu'],'💡 Lampu','5-6'),
  q('kenal-huruf','tap-choice','Cari huruf M','M',['N','W','M','H'],'M','3-4',{visualType:'letter'}),
  q('ejaan','spell-complete','Lengkapkan ejaan NASI','🍚 N A _ I',['S','R','M','T'],'S','5-6'),
  q('ejaan','spell-complete','Lengkapkan ejaan OREN','🍊 O _ E N',['A','R','U','L'],'R','5-6'),
  q('ejaan','spell-complete','Lengkapkan ejaan PISANG','🍌 P I _ A N G',['S','R','T','L'],'S','5-6'),
  q('kenal-huruf','tap-choice','Cari huruf Q','Q',['O','Q','G','C'],'Q','5-6',{visualType:'letter'}),
  q('ejaan','spell-complete','Lengkapkan ejaan RUMAH','🏠 R U _ A H',['N','M','L','B'],'M','5-6'),
  q('ejaan','spell-complete','Lengkapkan ejaan SUSU','🥛 S U _ U',['S','C','Z','T'],'S','5-6'),
  q('ejaan','spell-complete','Lengkapkan ejaan TOPI','🎩 T O _ I',['B','P','D','F'],'P','5-6'),
  q('huruf-awal','image-choice','Ular bermula dengan huruf apa?','🐍 Ular',['O','U','V','A'],'U','4-5'),
  q('huruf-awal','image-choice','Van bermula dengan huruf apa?','🚐 Van',['W','V','F','B'],'V','4-5'),
  q('huruf-awal','image-choice','Wau bermula dengan huruf apa?','🪁 Wau',['V','M','W','Y'],'W','4-5'),
  q('kenal-huruf','tap-choice','Cari huruf X','X',['K','X','Y','Z'],'X','5-6',{visualType:'letter'}),
  q('ejaan','spell-complete','Lengkapkan ejaan YO-YO','🪀 _ O - Y O',['Y','V','U','J'],'Y','5-6'),
  q('huruf-awal','image-choice','Zebra bermula dengan huruf apa?','🦓 Zebra',['S','Z','J','X'],'Z','5-7'),
  q('ejaan','spell-complete','Lengkapkan perkataan BAJU','👕 B A _ _',['JU','KU','TU','LU'],'JU','5-6'),
  q('ejaan','spell-complete','Lengkapkan perkataan BOLA','⚽ B _ L A',['O','U','A','I'],'O','5-6'),
  q('padan-perkataan','image-choice','Mana satu bermula dengan huruf K?','K',['🐱 Kucing','🍎 Epal','🏠 Rumah','🐟 Ikan'],'🐱 Kucing','5-7'),
  q('finale-huruf','spell-complete','🏆 Cabaran akhir: lengkapkan ZEBRA','🦓 Z E _ R A',['B','P','D','V'],'B','5-7',{finale:true})
]);

const nombor = withVisualLevels('nombor', [
  q('kira-objek','count-choice','Berapa batang mancis?','🟫  🟫  🟫',['2','3','4','5'],'3','3-4'),
  q('kira-objek','count-choice','Berapa biji epal?','🍎 🍎 🍎 🍎 🍎 🍎',['5','6','7','8'],'6','3-4'),
  q('kira-objek','count-choice','Berapa bintang?','⭐ ⭐ ⭐ ⭐',['3','4','5','6'],'4','3-4'),
  q('kira-objek','count-choice','Berapa ekor ikan?','🐟 🐟',['1','2','3','4'],'2','3-4'),
  q('kira-objek','count-choice','Berapa belon?','🎈 🎈 🎈 🎈 🎈',['4','5','6','7'],'5','3-4'),
  q('kira-objek','count-choice','Berapa bunga?','🌼 🌼 🌼 🌼 🌼 🌼 🌼',['6','7','8','9'],'7','4-5'),
  q('kira-objek','count-choice','Berapa kereta?','🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗',['7','8','9','10'],'8','4-5'),
  q('kira-objek','count-choice','Berapa bola?','⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽',['8','9','10','11'],'9','4-5'),
  q('kira-objek','count-choice','Berapa blok?','🧱 🧱 🧱 🧱 🧱 🧱 🧱 🧱 🧱 🧱',['8','9','10','11'],'10','4-5'),
  q('kira-objek','count-choice','Berapa matahari?','☀️',['1','2','3','4'],'1','3-4'),
  q('tambah','count-choice','Ada 2 epal, tambah 1. Jadi berapa?','🍎 🍎  +  🍎',['2','3','4','5'],'3','4-5'),
  q('tambah','count-choice','Ada 3 bintang, tambah 2. Jadi berapa?','⭐⭐⭐  +  ⭐⭐',['4','5','6','7'],'5','4-5'),
  q('tambah','count-choice','2 ikan tambah 2 ikan. Berapa semuanya?','🐟🐟  +  🐟🐟',['3','4','5','6'],'4','4-5'),
  q('tambah','count-choice','4 belon tambah 1. Berapa semuanya?','🎈🎈🎈🎈  +  🎈',['4','5','6','7'],'5','4-5'),
  q('tambah','count-choice','5 bunga tambah 2. Berapa semuanya?','🌼🌼🌼🌼🌼  +  🌼🌼',['6','7','8','9'],'7','5-6'),
  q('tolak','count-choice','Ada 5 epal, 1 dimakan. Tinggal berapa?','🍎🍎🍎🍎🍎  −  🍎',['3','4','5','6'],'4','4-5'),
  q('tolak','count-choice','Ada 6 bintang, 2 hilang. Tinggal berapa?','⭐⭐⭐⭐⭐⭐  −  ⭐⭐',['3','4','5','6'],'4','4-5'),
  q('tolak','count-choice','Ada 7 ikan, 3 berenang pergi. Tinggal berapa?','🐟🐟🐟🐟🐟🐟🐟  −  🐟🐟🐟',['3','4','5','6'],'4','5-6'),
  q('tolak','count-choice','Ada 8 belon, 2 terbang. Tinggal berapa?','🎈🎈🎈🎈🎈🎈🎈🎈  −  🎈🎈',['5','6','7','8'],'6','5-6'),
  q('tolak','count-choice','Ada 9 bunga, 4 dipetik. Tinggal berapa?','🌼🌼🌼🌼🌼🌼🌼🌼🌼  −  🌼🌼🌼🌼',['4','5','6','7'],'5','5-6'),
  q('urutan','sequence','Lengkapkan urutan nombor','1  •  2  •  ?  •  4',['2','3','4','5'],'3','5-6'),
  q('urutan','sequence','Nombor apa selepas 6?','5  •  6  •  ?',['6','7','8','9'],'7','5-6'),
  q('urutan','sequence','Nombor apa sebelum 9?','?  •  9  •  10',['7','8','9','10'],'8','5-6'),
  q('banding','compare','Kumpulan mana lebih banyak?','🍎🍎🍎🍎🍎   vs   🍎🍎🍎',['3','4','5','6'],'5','4-6'),
  q('banding','compare','Kumpulan mana lebih sedikit?','⭐⭐   vs   ⭐⭐⭐⭐⭐',['2','3','4','5'],'2','4-6'),
  q('kira-objek','count-choice','Berapa cawan?','🥤 🥤 🥤 🥤 🥤 🥤 🥤 🥤 🥤 🥤 🥤',['10','11','12','13'],'11','6-7'),
  q('kira-objek','count-choice','Berapa pensel?','✏️ ✏️ ✏️ ✏️ ✏️ ✏️ ✏️ ✏️ ✏️ ✏️ ✏️ ✏️',['11','12','13','14'],'12','6-7'),
  q('tambah','tap-choice','7 + 3 = ?','7  +  3',['9','10','11','12'],'10','6-7'),
  q('tolak','tap-choice','10 − 4 = ?','10  −  4',['5','6','7','8'],'6','6-7'),
  q('finale-nombor','mixed','🏆 Cabaran akhir: 6 + 2 − 3 = ?','6  +  2  −  3',['4','5','6','7'],'5','6-7',{finale:true})
]);

export const QUESTION_BANK = { huruf, nombor, warna_bentuk: [], padan_gambar: [], jigsaw: [], kira_asas: [] };

export function makeChallenge(gameKey, level, age = 5) {
  const bank = QUESTION_BANK[gameKey] || [];
  const challenge = bank[level - 1];
  if (challenge) return { ...challenge, playerAge: age };
  return { level, skill:'fallback', interaction:'tap-choice', prompt:'Pilih jawapan yang betul', visual:'🎮', options:['A','B','C','D'], answer:'A', age:'3-7', playerAge:age };
}

export function getBankAudit() {
  return Object.fromEntries(Object.entries(QUESTION_BANK).map(([key, bank]) => [key, {
    levels: bank.length,
    skills: [...new Set(bank.map(x => x.skill))],
    interactions: [...new Set(bank.map(x => x.interaction))],
    ageBands: [...new Set(bank.map(x => x.age))],
    duplicatePrompts: bank.length - new Set(bank.map(x => `${x.prompt}|${x.visual}`)).size
  }]));
}
