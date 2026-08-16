// Kiddo Adventures Question Bank V2
// Auditable curriculum: varied skills, BM + English word play, spelling and age metadata.
// Current game engine renders choice-based interactions; `interaction` prepares us for drag/drop,
// memory reveal and letter-slot UI without changing the learning content again.

const withLevels = bank => bank.map((q, i) => ({ level: i + 1, ...q }));
const q = (skill, interaction, prompt, visual, options, answer, age='3-7', extra={}) =>
  ({ skill, interaction, prompt, visual, options, answer, age, ...extra });

const huruf = withLevels([
  q('kenal-huruf','tap-choice','Cari huruf A','A',['A','B','D','E'],'A','3-4',{visualType:'letter'}),
  q('kenal-huruf','tap-choice','Cari huruf B','B',['D','B','P','A'],'B','3-4',{visualType:'letter'}),
  q('kenal-huruf','tap-choice','Cari huruf C','C',['G','O','C','S'],'C','3-4',{visualType:'letter'}),
  q('kenal-huruf','tap-choice','Mana satu huruf D?','D',['B','P','D','O'],'D','3-4',{visualType:'letter'}),
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
  q('finale-huruf','image-choice','🏆 Zebra bermula dengan huruf apa?','🦓 Zebra',['S','Z','J','X'],'Z','5-7',{finale:true})
]);

const nombor = withLevels([
  q('kenal-nombor','tap-choice','Cari nombor 1','1',['1','2','3','4'],'1','3-4',{visualType:'letter'}),
  q('kenal-nombor','tap-choice','Cari nombor 2','2',['3','2','1','4'],'2','3-4',{visualType:'letter'}),
  q('kenal-nombor','tap-choice','Cari nombor 3','3',['2','4','3','5'],'3','3-4',{visualType:'letter'}),
  q('kenal-nombor','tap-choice','Cari nombor 4','4',['5','3','1','4'],'4','3-4',{visualType:'letter'}),
  q('kenal-nombor','tap-choice','Cari nombor 5','5',['2','5','6','4'],'5','3-4',{visualType:'letter'}),
  q('kira-objek','count-choice','Berapa biji epal?','🍎 🍎',['1','3','2','4'],'2','3-4'),
  q('kira-objek','count-choice','Berapa ekor ikan?','🐟 🐟 🐟',['4','2','3','5'],'3','3-4'),
  q('kira-objek','count-choice','Berapa bintang?','⭐ ⭐ ⭐ ⭐',['4','5','3','2'],'4','3-4'),
  q('kuantiti','image-choice','Pilih kumpulan yang ada 5 objek','5',['⭐⭐⭐⭐','🍎🍎🍎🍎🍎','🐟🐟🐟','🌼🌼'],'🍎🍎🍎🍎🍎','4-5'),
  q('kenal-nombor','tap-choice','Cari nombor 6','6',['6','8','5','7'],'6','3-4',{visualType:'letter'}),
  q('kenal-nombor','tap-choice','Cari nombor 7','7',['9','6','7','8'],'7','3-4',{visualType:'letter'}),
  q('kira-objek','count-choice','Berapa belon?','🎈🎈🎈🎈🎈🎈🎈🎈',['6','8','7','9'],'8','4-5'),
  q('kenal-nombor','tap-choice','Cari nombor 9','9',['10','8','9','7'],'9','3-4',{visualType:'letter'}),
  q('kenal-nombor','tap-choice','Cari nombor 10','10',['9','10','8','7'],'10','4-5',{visualType:'letter'}),
  q('urutan','sequence','Lengkapkan urutan','1  •  2  •  ?  •  4',['5','3','2','1'],'3','5-6'),
  q('urutan','sequence','Nombor apa selepas 5?','4  •  5  •  ?',['5','7','6','4'],'6','5-6'),
  q('urutan','sequence','Nombor apa sebelum 8?','?  •  8  •  9',['6','9','7','8'],'7','5-6'),
  q('banding','compare','Kumpulan mana lebih banyak?','⭐⭐⭐⭐⭐⭐⭐⭐   vs   ⭐⭐⭐⭐⭐⭐',['8','6','7','5'],'8','5-6'),
  q('banding','compare','Nombor mana lebih kecil?','4   atau   7',['4','7','6','5'],'4','5-6'),
  q('finale-nombor','sequence','🏆 Lengkapkan urutan','7  •  8  •  9  •  ?',['10','8','11','9'],'10','5-7',{finale:true})
]);

const warna_bentuk = withLevels([
  q('warna','tap-choice','Pilih warna merah','🍓 Strawberi',['🔴','🔵','🟢','🟡'],'🔴','3-4'),
  q('warna','tap-choice','Pilih warna biru','🌊 Laut',['🟡','🔵','🟣','🔴'],'🔵','3-4'),
  q('warna','tap-choice','Pilih warna hijau','🌿 Daun',['🔵','🟢','🟡','🟣'],'🟢','3-4'),
  q('warna','tap-choice','Pilih warna kuning','☀️ Matahari',['🟣','🔴','🟡','🟢'],'🟡','3-4'),
  q('warna-objek','image-choice','Pisang biasanya warna apa?','🍌',['🟢','🟡','🔵','🟣'],'🟡','4-5'),
  q('bentuk','tap-choice','Cari bulatan','⚽ Bola',['⚪','🔺','◼️','⭐'],'⚪','3-4'),
  q('bentuk','tap-choice','Cari segi tiga','🔺',['⭐','🔺','❤️','⚪'],'🔺','3-4'),
  q('bentuk','tap-choice','Cari segi empat','🪟 Tingkap',['❤️','⚪','◼️','🔺'],'◼️','4-5'),
  q('bentuk-objek','image-choice','Bola berbentuk apa?','⚽',['bulat','segi tiga','segi empat','bintang'],'bulat','4-5'),
  q('finale-bentuk','odd-one','🏆 Cari bentuk hati','🔺  ⚪  ❤️  ⭐',['🔺','❤️','⭐','⚪'],'❤️','4-6',{finale:true})
]);

const padan_gambar = withLevels([
  q('padan-sama','match','Cari gambar yang sama','🐶',['🐱','🐶','🐰','🐼'],'🐶','3-4'),
  q('padan-sama','match','Cari gambar yang sama','🍎',['🍌','🍊','🍎','🍇'],'🍎','3-4'),
  q('padan-sama','match','Cari gambar yang sama','🚗',['🚲','🚌','🚗','🚂'],'🚗','3-4'),
  q('ingatan','memory-reveal','Ingat haiwan ini. Mana satu tadi?','🐶  🐱  🐰',['🐰','🍎','🚗','⭐'],'🐰','4-5',{memorySeconds:3}),
  q('ingatan','memory-reveal','Ingat buah ini. Mana satu tadi?','🍎  🍌  🍊',['🍊','🐟','🚌','👟'],'🍊','4-5',{memorySeconds:3}),
  q('pasangan','match','Cari pasangan kasut','👟 + ?',['👟','🎩','🧤','👕'],'👟','4-5'),
  q('kategori','category','Yang mana satu haiwan?','🐶  🐱  🐰',['🐼','🍎','🚗','⭐'],'🐼','4-5'),
  q('kategori','category','Yang mana satu buah?','🍎  🍌  🍊',['🐟','🍇','🚌','👟'],'🍇','4-5'),
  q('kategori','category','Yang mana satu kenderaan?','🚗  🚌  🚲',['🚂','🐱','🍎','☁️'],'🚂','4-5'),
  q('ingatan-susunan','memory-order','Ingat susunan ini','🐶  🍎',['🐶 🍎','🍎 🐶','🐱 🍎','🐶 🍌'],'🐶 🍎','5-6',{memorySeconds:3}),
  q('ingatan-hilang','memory-reveal','Apa yang hilang?','✏️  📚  🎒',['🎒','🐟','🍌','🚗'],'🎒','5-6',{memorySeconds:3}),
  q('finale-ingatan','memory-order','🏆 Ingat 3 objek mengikut susunan','🐱  ⭐  🍎',['🐱 ⭐ 🍎','⭐ 🐱 🍎','🍎 ⭐ 🐱','🐱 🍎 ⭐'],'🐱 ⭐ 🍎','5-7',{memorySeconds:4,finale:true})
]);

const jigsaw = withLevels([
  q('corak','sequence','Apa yang datang seterusnya?','🔴  🔵  🔴  ?',['🔵','🟢','🟡','🔴'],'🔵','4-5'),
  q('corak','sequence','Apa yang datang seterusnya?','⭐  🌙  ⭐  ?',['☁️','🌙','⭐','☀️'],'🌙','4-5'),
  q('hubungan','logic','Ikan tinggal di...','🐟',['air','pokok','langit','jalan'],'air','4-5'),
  q('fungsi','logic','Kunci digunakan untuk...','🔑',['buka pintu','makan','melukis','tidur'],'buka pintu','4-5'),
  q('cantum-kata-bm','word-combine','Cantumkan dua gambar ini','🚗 Kereta  +  🔥 Api',['Kereta api','Kereta air','Api kereta','Kereta panas'],'Kereta api','5-6',{language:'bm'}),
  q('ejaan-bm','spell-complete','Lengkapkan perkataan','👕  B A _ _',['JU','KU','TU','LU'],'JU','5-6',{language:'bm'}),
  q('word-combine-en','word-combine','Combine the words','🌧️ RAIN  +  🏹 BOW',['RAINBOW','RAINHOUSE','BOWRAIN','SUNBOW'],'RAINBOW','6-7',{language:'en'}),
  q('word-combine-en','word-combine','Combine the words','💡 LIGHT  +  🏠 HOUSE',['LIGHTHOUSE','HOUSELIGHT','LIGHTROOM','SUNHOUSE'],'LIGHTHOUSE','6-7',{language:'en'}),
  q('beza','odd-one','Cari yang berbeza','🍎  🍎  🍌  🍎',['🍌','🍎','🍇','🍊'],'🍌','4-6'),
  q('finale-logik','sequence','🏆 Lengkapkan cabaran akhir','🔺  ⚪  🔺  ⚪  ?',['🔺','⚪','⭐','◼️'],'🔺','5-7',{finale:true})
]);

const kira_asas = withLevels([
  q('tambah','count-choice','Berapa semuanya?','🍎 + 🍎',['2','1','3','4'],'2','4-5'),
  q('tambah','count-choice','Berapa semuanya?','⭐⭐ + ⭐',['2','4','3','1'],'3','4-5'),
  q('tambah','count-choice','2 + 2 = ?','🐟🐟 + 🐟🐟',['4','3','5','2'],'4','4-5'),
  q('tambah','tap-choice','3 + 1 = ?','🎈🎈🎈 + 🎈',['5','4','3','2'],'4','5-6'),
  q('tambah','tap-choice','3 + 2 = ?','🍊🍊🍊 + 🍊🍊',['4','6','5','3'],'5','5-6'),
  q('tolak','count-choice','Ada 3 bintang. 1 hilang. Tinggal berapa?','⭐⭐⭐  ➖  ⭐',['2','3','1','4'],'2','4-5'),
  q('tolak','count-choice','Ada 4 epal. 1 dimakan. Tinggal berapa?','🍎🍎🍎🍎  ➖  🍎',['4','2','3','1'],'3','4-5'),
  q('tolak','count-choice','5 belon, 2 terbang. Tinggal berapa?','🎈🎈🎈🎈🎈  ➖  🎈🎈',['2','4','3','5'],'3','5-6'),
  q('tolak','tap-choice','6 − 3 = ?','6 − 3',['3','2','4','5'],'3','5-6'),
  q('tolak','tap-choice','7 − 2 = ?','7 − 2',['6','5','4','7'],'5','5-6'),
  q('banding','compare','Mana lebih banyak?','🍎🍎🍎   atau   🍎🍎',['3','2','1','4'],'3','4-5'),
  q('banding','compare','Mana lebih kecil?','4   atau   6',['4','6','5','3'],'4','5-6'),
  q('nombor-hilang','sequence','Cari nombor yang hilang','2 + ? = 5',['3','2','4','1'],'3','6-7'),
  q('cerita','story-math','Daryl ada 3 epal. Dapat 2 lagi. Berapa semuanya?','🍎🍎🍎  +  🍎🍎',['5','4','6','3'],'5','5-7'),
  q('finale-matematik','mixed','🏆 Cabaran akhir: 5 − 2 = ?','🏆 5 − 2',['3','2','4','5'],'3','5-7',{finale:true})
]);

export const QUESTION_BANK = { huruf, nombor, warna_bentuk, padan_gambar, jigsaw, kira_asas };

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
