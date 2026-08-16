// Kiddo Adventures Question Bank V3
// 30 levels per world. Content is visual-first, age-aware and auditable.

const withLevels = bank => bank.map((q, i) => ({ level: i + 1, ...q }));
const withVisualLevels = (prefix, bank) => withLevels(bank).map(item => ({
  ...item,
  visualSrc: `/visuals/bank/${prefix}-${String(item.level).padStart(2, '0')}.svg`
}));
const q = (skill, interaction, prompt, visual, options, answer, age='3-7', extra={}) =>
  ({ skill, interaction, prompt, visual, options, answer, age, ...extra });

const huruf = withVisualLevels('huruf', [
  q('kenal-huruf','tap-choice','Cari huruf A','A',['A','B','D','E'],'A','3-4',{visualType:'letter'}),
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

const warna_bentuk = withVisualLevels('warna_bentuk', [
  q('warna','tap-choice','Pilih warna merah','🍓',['🔴','🔵','🟢','🟡'],'🔴','3-4'),
  q('warna','tap-choice','Pilih warna biru','🌊',['🟡','🔵','🟣','🔴'],'🔵','3-4'),
  q('warna','tap-choice','Pilih warna hijau','🌿',['🔵','🟢','🟡','🟣'],'🟢','3-4'),
  q('warna','tap-choice','Pilih warna kuning','☀️',['🟣','🔴','🟡','🟢'],'🟡','3-4'),
  q('warna','tap-choice','Pilih warna ungu','🍇',['🟢','🟣','🔵','🟡'],'🟣','4-5'),
  q('warna-objek','image-choice','Pisang biasanya warna apa?','🍌',['🟢','🟡','🔵','🟣'],'🟡','4-5'),
  q('warna-objek','image-choice','Daun biasanya warna apa?','🍃',['🟢','🔴','🟣','⚫'],'🟢','4-5'),
  q('warna-objek','image-choice','Awan biasanya warna apa?','☁️',['⚪','🔴','🟢','🟣'],'⚪','4-5'),
  q('bentuk','tap-choice','Cari bulatan','⚽',['⚪','🔺','◼️','⭐'],'⚪','3-4'),
  q('bentuk','tap-choice','Cari segi tiga','🔺',['⭐','🔺','❤️','⚪'],'🔺','3-4'),
  q('bentuk','tap-choice','Cari segi empat','🪟',['❤️','⚪','◼️','🔺'],'◼️','4-5'),
  q('bentuk','tap-choice','Cari bentuk hati','❤️',['🔺','❤️','⭐','⚪'],'❤️','3-4'),
  q('bentuk','tap-choice','Cari bentuk bintang','⭐',['◼️','⭐','❤️','⚪'],'⭐','3-4'),
  q('bentuk-objek','image-choice','Bola berbentuk apa?','⚽',['bulat','segi tiga','segi empat','bintang'],'bulat','4-5'),
  q('bentuk-objek','image-choice','Tingkap ini lebih hampir kepada bentuk apa?','🪟',['bulat','segi empat','hati','bintang'],'segi empat','4-5'),
  q('padan-warna','match','Padankan warna strawberi','🍓',['🔴','🔵','🟢','🟡'],'🔴','4-5'),
  q('padan-warna','match','Padankan warna langit','🌤️',['🔵','🟣','🟢','🔴'],'🔵','4-5'),
  q('corak-warna','sequence','Apa warna seterusnya?','🔴 🔵 🔴 ?',['🔵','🟢','🟡','🔴'],'🔵','5-6'),
  q('corak-warna','sequence','Apa warna seterusnya?','🟢 🟡 🟢 ?',['🟡','🔴','🔵','🟢'],'🟡','5-6'),
  q('corak-bentuk','sequence','Apa bentuk seterusnya?','⚪ 🔺 ⚪ ?',['🔺','◼️','⭐','❤️'],'🔺','5-6'),
  q('corak-bentuk','sequence','Apa bentuk seterusnya?','⭐ ❤️ ⭐ ?',['❤️','⚪','🔺','⭐'],'❤️','5-6'),
  q('odd-one','odd-one','Cari warna yang berbeza','🔴 🔴 🔵 🔴',['🔴','🔵','🟢','🟡'],'🔵','4-6'),
  q('odd-one','odd-one','Cari bentuk yang berbeza','⚪ ⚪ ⭐ ⚪',['⚪','⭐','❤️','🔺'],'⭐','4-6'),
  q('warna-campur','logic','Merah + kuning menghasilkan warna apa?','🔴 + 🟡',['🟠','🟢','🟣','🔵'],'🟠','6-7'),
  q('warna-campur','logic','Biru + kuning menghasilkan warna apa?','🔵 + 🟡',['🟢','🟣','🟠','🔴'],'🟢','6-7'),
  q('kategori','category','Yang mana satu berbentuk bulat?','⚪',['⚽','📚','🚪','🔺'],'⚽','4-6'),
  q('kategori','category','Yang mana satu berwarna hijau?','🟢',['🍃','🍓','☀️','🍇'],'🍃','4-6'),
  q('corak-campur','sequence','Lengkapkan corak','🔴 ⚪ 🔴 ⚪ ?',['🔴','⚪','⭐','🟢'],'🔴','5-7'),
  q('corak-campur','sequence','Lengkapkan corak','⭐ 🔺 ⭐ 🔺 ?',['⭐','🔺','❤️','⚪'],'⭐','5-7'),
  q('finale-bentuk','mixed','🏆 Pilih hati merah','❤️',['❤️','💙','💚','💛'],'❤️','5-7',{finale:true})
]);

const padan_gambar = withVisualLevels('padan_gambar', [
  q('padan-sama','match','Cari gambar yang sama','🐶',['🐱','🐶','🐰','🐼'],'🐶','3-4'),
  q('padan-sama','match','Cari gambar yang sama','🍎',['🍌','🍊','🍎','🍇'],'🍎','3-4'),
  q('padan-sama','match','Cari gambar yang sama','🚗',['🚲','🚌','🚗','🚂'],'🚗','3-4'),
  q('padan-sama','match','Cari gambar yang sama','⭐',['❤️','⭐','🌙','☀️'],'⭐','3-4'),
  q('kategori','category','Yang mana satu haiwan?','🐶 🐱 🐰',['🐼','🍎','🚗','⭐'],'🐼','4-5'),
  q('kategori','category','Yang mana satu buah?','🍎 🍌 🍊',['🐟','🍇','🚌','👟'],'🍇','4-5'),
  q('kategori','category','Yang mana satu kenderaan?','🚗 🚌 🚲',['🚂','🐱','🍎','☁️'],'🚂','4-5'),
  q('kategori','category','Yang mana satu benda sekolah?','✏️ 📚 🎒',['📏','🍌','🐟','🚗'],'📏','4-5'),
  q('pasangan','match','Cari pasangan kasut','👟 + ?',['👟','🎩','🧤','👕'],'👟','4-5'),
  q('pasangan','match','Cari pasangan sarung tangan','🧤 + ?',['🧤','👟','🎩','🧦'],'🧤','4-5'),
  q('ingatan','memory-reveal','Ingat haiwan ini. Mana satu tadi?','🐶 🐱 🐰',['🐰','🍎','🚗','⭐'],'🐰','4-5',{memorySeconds:3}),
  q('ingatan','memory-reveal','Ingat buah ini. Mana satu tadi?','🍎 🍌 🍊',['🍊','🐟','🚌','👟'],'🍊','4-5',{memorySeconds:3}),
  q('ingatan','memory-reveal','Ingat kenderaan ini. Mana satu tadi?','🚗 🚌 🚲',['🚌','🍇','🐱','⭐'],'🚌','4-5',{memorySeconds:3}),
  q('ingatan-susunan','memory-order','Ingat susunan ini','🐶 🍎',['🐶 🍎','🍎 🐶','🐱 🍎','🐶 🍌'],'🐶 🍎','5-6',{memorySeconds:3}),
  q('ingatan-susunan','memory-order','Ingat susunan ini','⭐ 🌙',['⭐ 🌙','🌙 ⭐','☀️ ⭐','⭐ ☀️'],'⭐ 🌙','5-6',{memorySeconds:3}),
  q('ingatan-hilang','memory-reveal','Apa yang hilang?','✏️ 📚 🎒',['🎒','🐟','🍌','🚗'],'🎒','5-6',{memorySeconds:3}),
  q('ingatan-hilang','memory-reveal','Apa yang hilang?','🍎 🍌 🍇',['🍌','🚗','🐶','⭐'],'🍌','5-6',{memorySeconds:3}),
  q('odd-one','odd-one','Cari yang berbeza','🐶 🐶 🐱 🐶',['🐱','🐶','🐰','🐼'],'🐱','4-6'),
  q('odd-one','odd-one','Cari yang berbeza','🍎 🍎 🍌 🍎',['🍌','🍎','🍇','🍊'],'🍌','4-6'),
  q('odd-one','odd-one','Cari yang berbeza','🚗 🚗 🚲 🚗',['🚲','🚗','🚌','🚂'],'🚲','4-6'),
  q('memory-order','memory-order','Ingat 3 objek mengikut susunan','🐱 ⭐ 🍎',['🐱 ⭐ 🍎','⭐ 🐱 🍎','🍎 ⭐ 🐱','🐱 🍎 ⭐'],'🐱 ⭐ 🍎','5-7',{memorySeconds:4}),
  q('memory-order','memory-order','Ingat 3 objek mengikut susunan','🚗 🌙 🍌',['🚗 🌙 🍌','🌙 🚗 🍌','🍌 🌙 🚗','🚗 🍌 🌙'],'🚗 🌙 🍌','5-7',{memorySeconds:4}),
  q('kategori','category','Yang mana satu boleh dimakan?','🍎',['🍞','🚗','✏️','👟'],'🍞','4-6'),
  q('kategori','category','Yang mana satu boleh terbang?','🪽',['🦋','🐟','🐘','🐢'],'🦋','4-6'),
  q('hubungan','logic','Anak kucing ialah...','🐱',['haiwan','buah','kenderaan','bentuk'],'haiwan','5-7'),
  q('hubungan','logic','Bas ialah...','🚌',['kenderaan','buah','haiwan','warna'],'kenderaan','5-7'),
  q('memory-order','memory-order','Ingat 4 objek','🐶 🍎 🚗 ⭐',['🐶 🍎 🚗 ⭐','🍎 🐶 🚗 ⭐','⭐ 🚗 🍎 🐶','🐶 🚗 🍎 ⭐'],'🐶 🍎 🚗 ⭐','6-7',{memorySeconds:4}),
  q('memory-order','memory-order','Ingat 4 objek','🌙 🐟 🍌 🎈',['🌙 🐟 🍌 🎈','🐟 🌙 🍌 🎈','🎈 🍌 🐟 🌙','🌙 🍌 🐟 🎈'],'🌙 🐟 🍌 🎈','6-7',{memorySeconds:4}),
  q('ingatan-hilang','memory-reveal','Objek mana hilang daripada kumpulan?','🐱 ⭐ 🍎 🚗',['🚗','🍌','🐟','🌙'],'🚗','6-7',{memorySeconds:4}),
  q('finale-ingatan','memory-order','🏆 Cabaran memori akhir','🐼 🌟 🚂 🍇',['🐼 🌟 🚂 🍇','🌟 🐼 🚂 🍇','🍇 🚂 🌟 🐼','🐼 🚂 🌟 🍇'],'🐼 🌟 🚂 🍇','6-7',{memorySeconds:5,finale:true})
]);

const jigsaw = withVisualLevels('jigsaw', [
  q('corak','sequence','Apa yang datang seterusnya?','🔴 🔵 🔴 ?',['🔵','🟢','🟡','🔴'],'🔵','4-5'),
  q('corak','sequence','Apa yang datang seterusnya?','⭐ 🌙 ⭐ ?',['☁️','🌙','⭐','☀️'],'🌙','4-5'),
  q('hubungan','logic','Ikan tinggal di...','🐟',['air','pokok','langit','jalan'],'air','4-5'),
  q('fungsi','logic','Kunci digunakan untuk...','🔑',['buka pintu','makan','melukis','tidur'],'buka pintu','4-5'),
  q('fungsi','logic','Payung digunakan ketika...','☂️',['hujan','tidur','makan','berenang'],'hujan','4-5'),
  q('hubungan','logic','Burung biasanya bergerak di...','🐦',['udara','laut','jalan raya','dalam tanah'],'udara','4-5'),
  q('cantum-kata-bm','word-combine','Cantumkan dua gambar ini','🚗 Kereta + 🔥 Api',['Kereta api','Kereta air','Api kereta','Kereta panas'],'Kereta api','5-6',{language:'bm'}),
  q('ejaan-bm','spell-complete','Lengkapkan perkataan','👕 B A _ _',['JU','KU','TU','LU'],'JU','5-6',{language:'bm'}),
  q('ejaan-bm','spell-complete','Lengkapkan perkataan','⚽ B _ L A',['O','U','A','I'],'O','5-6',{language:'bm'}),
  q('cantum-kata-bm','word-combine','Cantumkan perkataan','👁️ Mata + ☀️ Hari',['Matahari','Matabumi','Harimata','Matalaut'],'Matahari','5-6',{language:'bm'}),
  q('word-combine-en','word-combine','Combine the words','🌧️ RAIN + 🏹 BOW',['RAINBOW','RAINHOUSE','BOWRAIN','SUNBOW'],'RAINBOW','6-7',{language:'en'}),
  q('word-combine-en','word-combine','Combine the words','💡 LIGHT + 🏠 HOUSE',['LIGHTHOUSE','HOUSELIGHT','LIGHTROOM','SUNHOUSE'],'LIGHTHOUSE','6-7',{language:'en'}),
  q('word-combine-en','word-combine','Combine the words','☀️ SUN + 🌼 FLOWER',['SUNFLOWER','FLOWERSUN','SUNROSE','LIGHTFLOWER'],'SUNFLOWER','6-7',{language:'en'}),
  q('word-combine-en','word-combine','Combine the words','⚽ FOOT + ⚽ BALL',['FOOTBALL','BALLFOOT','FOOTGAME','KICKBALL'],'FOOTBALL','6-7',{language:'en'}),
  q('beza','odd-one','Cari yang berbeza','🍎 🍎 🍌 🍎',['🍌','🍎','🍇','🍊'],'🍌','4-6'),
  q('beza','odd-one','Cari yang berbeza','🐱 🐱 🐶 🐱',['🐶','🐱','🐰','🐼'],'🐶','4-6'),
  q('corak','sequence','Lengkapkan corak','🔺 ⚪ 🔺 ⚪ ?',['🔺','⚪','⭐','◼️'],'🔺','5-6'),
  q('corak','sequence','Lengkapkan corak','🍎 🍌 🍎 🍌 ?',['🍎','🍌','🍇','🍊'],'🍎','5-6'),
  q('analogi','logic','Siang : Matahari, Malam : ?','☀️ : ?',['🌙','⭐','☁️','🌈'],'🌙','6-7'),
  q('analogi','logic','Ikan : Air, Burung : ?','🐟 : 🐦',['udara','tanah','jalan','rumah'],'udara','6-7'),
  q('fungsi','logic','Berus gigi digunakan untuk...','🪥',['gosok gigi','makan nasi','tulis buku','buka pintu'],'gosok gigi','5-7'),
  q('fungsi','logic','Pensel digunakan untuk...','✏️',['menulis','berenang','memasak','tidur'],'menulis','5-7'),
  q('ejaan-en','spell-complete','Complete the word CAT','🐱 C _ T',['A','E','I','O'],'A','6-7',{language:'en'}),
  q('ejaan-en','spell-complete','Complete the word DOG','🐶 D _ G',['O','A','E','U'],'O','6-7',{language:'en'}),
  q('ejaan-en','spell-complete','Complete the word SUN','☀️ S _ N',['U','A','E','I'],'U','6-7',{language:'en'}),
  q('susun-logik','sequence','Apa seterusnya?','1  2  1  2  ?',['1','2','3','4'],'1','5-7'),
  q('susun-logik','sequence','Apa seterusnya?','🔵 🔵 🔴 🔵 🔵 ?',['🔴','🔵','🟢','🟡'],'🔴','5-7'),
  q('hubungan','logic','Anak ayam datang daripada...','🐣',['telur','susu','daun','air'],'telur','5-7'),
  q('hubungan','logic','Pokok tumbuh daripada...','🌱',['biji benih','batu','plastik','kaca'],'biji benih','5-7'),
  q('finale-logik','mixed','🏆 Teka-teki akhir: LIGHT + HOUSE = ?','💡 LIGHT + 🏠 HOUSE',['LIGHTHOUSE','SUNHOUSE','HOUSERAIN','LIGHTROOM'],'LIGHTHOUSE','6-7',{language:'en',finale:true})
]);

const kira_asas = withVisualLevels('kira_asas', [
  q('tambah','count-choice','Berapa semuanya?','🍎 + 🍎',['2','1','3','4'],'2','4-5'),
  q('tambah','count-choice','Berapa semuanya?','⭐⭐ + ⭐',['2','4','3','1'],'3','4-5'),
  q('tambah','count-choice','2 + 2 = ?','🐟🐟 + 🐟🐟',['4','3','5','2'],'4','4-5'),
  q('tambah','count-choice','3 + 1 = ?','🎈🎈🎈 + 🎈',['5','4','3','2'],'4','4-5'),
  q('tambah','count-choice','3 + 2 = ?','🍊🍊🍊 + 🍊🍊',['4','6','5','3'],'5','5-6'),
  q('tambah','tap-choice','4 + 1 = ?','4 + 1',['5','6','7','4'],'5','5-6'),
  q('tambah','tap-choice','4 + 3 = ?','4 + 3',['6','7','8','9'],'7','5-6'),
  q('tambah','tap-choice','5 + 2 = ?','5 + 2',['6','7','8','9'],'7','5-6'),
  q('tolak','count-choice','Ada 3 bintang. 1 hilang. Tinggal berapa?','⭐⭐⭐ − ⭐',['2','3','1','4'],'2','4-5'),
  q('tolak','count-choice','Ada 4 epal. 1 dimakan. Tinggal berapa?','🍎🍎🍎🍎 − 🍎',['4','2','3','1'],'3','4-5'),
  q('tolak','count-choice','5 belon, 2 terbang. Tinggal berapa?','🎈🎈🎈🎈🎈 − 🎈🎈',['2','4','3','5'],'3','5-6'),
  q('tolak','tap-choice','6 − 3 = ?','6 − 3',['3','2','4','5'],'3','5-6'),
  q('tolak','tap-choice','7 − 2 = ?','7 − 2',['6','5','4','7'],'5','5-6'),
  q('tolak','tap-choice','8 − 3 = ?','8 − 3',['4','5','6','7'],'5','5-6'),
  q('tolak','tap-choice','9 − 4 = ?','9 − 4',['4','5','6','7'],'5','5-6'),
  q('banding','compare','Mana lebih banyak?','🍎🍎🍎   atau   🍎🍎',['3','2','1','4'],'3','4-5'),
  q('banding','compare','Mana lebih kecil?','4   atau   6',['4','6','5','3'],'4','5-6'),
  q('banding','compare','Mana lebih besar?','7   atau   5',['5','6','7','8'],'7','5-6'),
  q('nombor-hilang','sequence','Cari nombor yang hilang','2 + ? = 5',['3','2','4','1'],'3','6-7'),
  q('nombor-hilang','sequence','Cari nombor yang hilang','? + 3 = 7',['3','4','5','6'],'4','6-7'),
  q('nombor-hilang','sequence','Cari nombor yang hilang','8 − ? = 5',['2','3','4','5'],'3','6-7'),
  q('cerita','story-math','Daryl ada 3 epal. Dapat 2 lagi. Berapa semuanya?','🍎🍎🍎 + 🍎🍎',['5','4','6','3'],'5','5-7'),
  q('cerita','story-math','Caca ada 5 belon. 2 terbang. Tinggal berapa?','🎈🎈🎈🎈🎈 − 🎈🎈',['2','3','4','5'],'3','5-7'),
  q('cerita','story-math','Daris ada 4 buku. Dapat 3 lagi. Berapa semuanya?','📚📚📚📚 + 📚📚📚',['6','7','8','9'],'7','5-7'),
  q('cerita','story-math','Kakak ada 8 gula-gula. Bagi 3. Tinggal berapa?','🍬🍬🍬🍬🍬🍬🍬🍬 − 🍬🍬🍬',['4','5','6','7'],'5','5-7'),
  q('mixed','mixed','3 + 2 − 1 = ?','3 + 2 − 1',['3','4','5','6'],'4','6-7'),
  q('mixed','mixed','5 + 3 − 2 = ?','5 + 3 − 2',['5','6','7','8'],'6','6-7'),
  q('mixed','mixed','9 − 4 + 2 = ?','9 − 4 + 2',['6','7','8','9'],'7','6-7'),
  q('mixed','mixed','10 − 3 + 1 = ?','10 − 3 + 1',['7','8','9','10'],'8','6-7'),
  q('finale-matematik','mixed','🏆 Cabaran akhir: 6 + 3 − 4 = ?','🏆 6 + 3 − 4',['4','5','6','7'],'5','6-7',{finale:true})
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
