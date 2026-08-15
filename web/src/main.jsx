import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import'./styles.css';

const API='';
const PRICE=39;
const PROMO=29;
const COMMISSION=10;
const AVATARS=[
  {id:'panda',icon:'🐼',label:'Panda'},
  {id:'kucing',icon:'🐱',label:'Kucing'},
  {id:'beruang',icon:'🐻',label:'Beruang'},
  {id:'arnab',icon:'🐰',label:'Arnab'},
  {id:'musang',icon:'🦊',label:'Musang'},
  {id:'gajah',icon:'🐘',label:'Gajah'}
];
const avatarIcon=id=>AVATARS.find(a=>a.id===id)?.icon||'🧒';
const worldMeta={
  huruf:{icon:'🔤',world:'Pulau Huruf',tag:'Bunyi • Huruf • Perkataan',tone:'sunset'},
  nombor:{icon:'🔢',world:'Lembah Nombor',tag:'Kira • Susun • Banding',tone:'sky'},
  warna_bentuk:{icon:'🎨',world:'Hutan Warna',tag:'Warna • Bentuk • Corak',tone:'violet'},
  padan_gambar:{icon:'🧩',world:'Teluk Padan',tag:'Ingatan • Fokus • Padanan',tone:'mint'},
  jigsaw:{icon:'🧸',world:'Pulau Puzzle',tag:'Visual • Ruang • Sabar',tone:'yellow'},
  kira_asas:{icon:'➕',world:'Gunung Kira',tag:'Tambah • Tolak • Logik',tone:'rose'}
};
const stages=['Explore','Practice','Challenge','Mastery','Boss'];

async function api(path,options={}){
  const r=await fetch(`${API}${path}`,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||'Ralat sambungan');
  return d;
}

function Modal({title,onClose,children,wide=false}){
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={`modal ${wide?'wide':''}`}><button className="x" onClick={onClose}>×</button><h2>{title}</h2>{children}</div></div>
}

function AuthModal({onClose,onLogin,refCode}){
  const[mode,setMode]=useState('login');
  const[form,setForm]=useState({email:'',password:'',name:'',agent_code:refCode||''});
  const[busy,setBusy]=useState(false);const[msg,setMsg]=useState('');
  async function submit(e){e.preventDefault();setBusy(true);setMsg('');try{const path=mode==='login'?'/api/login':'/api/signup';const d=await api(path,{method:'POST',body:JSON.stringify(form)});localStorage.setItem('kiddo_parent',JSON.stringify(d));onLogin(d);onClose()}catch(err){setMsg(err.message)}finally{setBusy(false)}}
  return <Modal title={mode==='login'?'Ruang Ibu Bapa':'Daftar Akaun Ibu Bapa'} onClose={onClose}><div className="switch"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Log Masuk</button><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Daftar</button></div><form className="form" onSubmit={submit}>{mode==='signup'&&<input required placeholder="Nama ibu / bapa" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}<input type="email" required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" required minLength="6" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>{mode==='signup'&&<input placeholder="Kod agent (jika ada)" value={form.agent_code} onChange={e=>setForm({...form,agent_code:e.target.value.toUpperCase()})}/>} {msg&&<div className="alert">{msg}</div>}<button className="primary" disabled={busy}>{busy?'Tunggu…':mode==='login'?'Masuk':'Cipta Akaun'}</button></form></Modal>
}

function AgentModal({onClose}){
  const[step,setStep]=useState('join');const[form,setForm]=useState({name:'',email:'',phone:'',bank_name:'',bank_account:''});const[code,setCode]=useState('');const[data,setData]=useState(null);const[msg,setMsg]=useState('');
  async function join(e){e.preventDefault();setMsg('');try{const d=await api('/api/agents',{method:'POST',body:JSON.stringify(form)});setCode(d.agent_code);setStep('success')}catch(err){setMsg(err.message)}}
  async function dashboard(e){e.preventDefault();setMsg('');try{const d=await api(`/api/agents/${encodeURIComponent(code)}/dashboard`);setData(d);setStep('dashboard')}catch(err){setMsg(err.message)}}
  const link=code?`${location.origin}/?ref=${encodeURIComponent(code)}`:'';
  return <Modal title="Kiddo Partner" onClose={onClose} wide><div className="agentHero"><div><span className="eyebrow">PROGRAM AFFILIATE</span><h3>Share Kiddo. Jana RM{COMMISSION} setiap jualan.</h3><p>Daftar percuma, dapat link unik dan kongsi kepada parent.</p></div><div className="earn">10 jualan <b>RM100</b></div></div>{step==='join'&&<><div className="switch"><button className="active">Daftar Agent</button><button onClick={()=>setStep('lookup')}>Semak Dashboard</button></div><form className="form two" onSubmit={join}><input required placeholder="Nama" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Telefon" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input placeholder="Bank" value={form.bank_name} onChange={e=>setForm({...form,bank_name:e.target.value})}/><input className="span2" placeholder="No. akaun bank" value={form.bank_account} onChange={e=>setForm({...form,bank_account:e.target.value})}/>{msg&&<div className="alert span2">{msg}</div>}<button className="primary span2">Daftar & Dapat Link</button></form></>}{step==='lookup'&&<form className="form" onSubmit={dashboard}><input required placeholder="Kod agent contoh KIDDO-AMY1234" value={code} onChange={e=>setCode(e.target.value.toUpperCase())}/>{msg&&<div className="alert">{msg}</div>}<button className="primary">Buka Dashboard</button></form>}{step==='success'&&<div className="success"><div className="bigIcon">🎉</div><h3>Kod agent anda</h3><div className="codeBox">{code}</div><p>Link referral:</p><div className="linkBox">{link}</div><button className="primary" onClick={()=>navigator.clipboard?.writeText(link)}>Salin Link</button></div>}{step==='dashboard'&&data&&<div><div className="statGrid"><div><small>Referral</small><b>{data.summary.total_referrals}</b></div><div><small>Jumlah Komisen</small><b>RM{Number(data.summary.total_earned||0).toFixed(2)}</b></div><div><small>Pending</small><b>RM{Number(data.summary.total_pending||0).toFixed(2)}</b></div></div><div className="codeBox">{data.agent.agent_code}</div></div>}</Modal>
}

function Checkout({onClose,refCode,onLogin,parent}){
  const[code,setCode]=useState(refCode||'');const[valid,setValid]=useState(null);const[msg,setMsg]=useState('');
  async function verify(){if(!code){setValid(null);return}try{await api(`/api/agents/${encodeURIComponent(code)}/dashboard`);setValid(true);setMsg('Kod agent sah ✓')}catch{setValid(false);setMsg('Kod agent tidak dijumpai')}}
  return <Modal title="Buka Kiddo Adventures" onClose={onClose}><div className="priceCard"><span>SEKALI BAYAR • LIFETIME ACCESS</span><div className="price"><s>RM{PRICE}</s><b>RM{PROMO}</b></div><p>Launch price untuk akses semua dunia pembelajaran.</p></div><div className="benefits"><span>✓ 6 dunia permainan</span><span>✓ Adventure map & progress</span><span>✓ Sehingga 5 profil anak</span><span>✓ Tiada caj bulanan</span></div><label className="label">Kod agent / referral</label><div className="verify"><input placeholder="KIDDO-XXXX" value={code} onChange={e=>{setCode(e.target.value.toUpperCase());setValid(null);setMsg('')}}/><button onClick={verify}>Semak</button></div>{msg&&<div className={valid===false?'alert':'ok'}>{msg}</div>}{!parent?<button className="primary" onClick={()=>{onClose();onLogin()}}>Daftar / Log masuk untuk membeli</button>:<button className="primary" onClick={()=>alert('Payment gateway belum disambungkan. Akses tidak akan diaktifkan tanpa bayaran sebenar.')}>Teruskan Pembelian RM{PROMO}</button>}<small className="fine">Akses hanya akan aktif selepas transaksi pembayaran berjaya.</small></Modal>
}

function MissionMap({game,onClose}){
  const meta=worldMeta[game.game_key]||{};const missions=useMemo(()=>Array.from({length:Math.min(12,game.total_levels)},(_,i)=>({n:i+1,stage:stages[Math.min(4,Math.floor(i/3))],locked:i>0})),[game]);
  return <Modal title={meta.world||game.name_ms} onClose={onClose} wide><div className={`worldBanner ${meta.tone}`}><div className="worldIcon">{meta.icon}</div><div><span className="eyebrow">ADVENTURE WORLD</span><h3>{game.name_ms}</h3><p>{meta.tag} • Explore → Practice → Challenge → Mastery → Boss</p></div></div><div className="trail">{missions.map((m,i)=><React.Fragment key={m.n}><button className={`node ${m.locked?'locked':''} ${m.stage==='Boss'?'boss':''}`} onClick={()=>!m.locked&&alert(`Mission ${m.n}: ${m.stage}`)}><small>{m.stage}</small><b>{m.stage==='Boss'?'👑':m.n}</b><span>{m.locked?'🔒':'⭐'}</span></button>{i<missions.length-1&&<div className="path">•••</div>}</React.Fragment>)}</div><div className="mapNote"><b>Sistem difficulty:</b> Explore → Practice → Challenge → Mastery → Boss. Setiap dunia berkembang ikut kemahiran, bukan level berulang.</div></Modal>
}

function ParentPanel({parent,onClose}){
  const[profiles,setProfiles]=useState([]);const[form,setForm]=useState({name:'',age:'',avatar:'panda'});const[msg,setMsg]=useState('');const[success,setSuccess]=useState('');
  async function load(){try{const d=await api(`/api/child-profiles?parent_id=${parent.parent_id||parent.id}`);setProfiles(d.profiles||[])}catch{}}
  useEffect(()=>{load()},[]);
  async function add(e){e.preventDefault();setMsg('');setSuccess('');try{await api('/api/child-profiles',{method:'POST',body:JSON.stringify({...form,parent_id:parent.parent_id||parent.id,age:Number(form.age)})});setSuccess(`${form.name} sudah bersedia untuk adventure! 🚀`);setForm({name:'',age:'',avatar:'panda'});await load()}catch(err){setMsg(err.message)}}
  return <Modal title={`Hai, ${parent.name||'Ibu Bapa'} 👋`} onClose={onClose} wide><div className="parentGrid"><div><h3>Profil Anak</h3><div className="kids">{profiles.map(p=><div className="kid" key={p.id}><span>{avatarIcon(p.avatar)}</span><b>{p.name}</b><small>{p.age} tahun</small></div>)}{profiles.length===0&&<p className="muted">Belum ada profil anak.</p>}</div>{success&&<div className="ok" style={{marginTop:12}}>{success}</div>}</div><form className="form compact" onSubmit={add}><h3>Tambah Anak</h3><input required placeholder="Nama anak" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><select required value={form.age} onChange={e=>setForm({...form,age:e.target.value})}><option value="">Pilih umur</option>{[3,4,5,6,7].map(age=><option key={age} value={age}>{age} tahun</option>)}</select><div className="avatarLabel">Pilih avatar</div><div className="avatars">{AVATARS.map(a=><button type="button" title={a.label} aria-label={a.label} className={`avatarBtn ${form.avatar===a.id?'active':''}`} key={a.id} onClick={()=>setForm({...form,avatar:a.id})}>{a.icon}</button>)}</div>{msg&&<div className="alert">{msg}</div>}<button className="primary">Tambah Profil</button></form></div></Modal>
}

function App(){
  const[games,setGames]=useState([]);const[loading,setLoading]=useState(true);const[modal,setModal]=useState(null);const[parent,setParent]=useState(()=>{try{return JSON.parse(localStorage.getItem('kiddo_parent'))}catch{return null}});const[refCode,setRefCode]=useState(()=>localStorage.getItem('kiddo_ref')||'');
  useEffect(()=>{const ref=new URLSearchParams(location.search).get('ref');if(ref){localStorage.setItem('kiddo_ref',ref.toUpperCase());setRefCode(ref.toUpperCase())}api('/api/games').then(d=>setGames(d.games||[])).finally(()=>setLoading(false))},[]);
  function logout(){localStorage.removeItem('kiddo_parent');setParent(null);setModal(null)}
  return <main><header><button className="brand" onClick={()=>scrollTo({top:0,behavior:'smooth'})}><span>🎈</span><b>Kiddo Adventures</b></button><nav><button onClick={()=>document.getElementById('worlds')?.scrollIntoView({behavior:'smooth'})}>Dunia</button><button onClick={()=>setModal('agent')}>Jadi Agent</button>{parent?<button className="parent" onClick={()=>setModal('parent')}>👨‍👩‍👧 Ruang Ibu Bapa</button>:<button className="parent" onClick={()=>setModal('auth')}>Log Masuk</button>}</nav></header><section className="hero"><div className="heroCopy"><span className="pill">BELAJAR • MAIN • TEROKA</span><h1>Bukan sekadar level.<br/><em>Satu dunia untuk diteroka.</em></h1><p>Kiddo Adventures menukar pembelajaran awal menjadi pengembaraan dengan mission, bintang, treasure dan cabaran yang semakin berkembang.</p><div className="heroActions"><button className="cta" onClick={()=>setModal('checkout')}>Buka Semua Dunia • RM{PROMO}</button><button className="ghost" onClick={()=>document.getElementById('worlds')?.scrollIntoView({behavior:'smooth'})}>Lihat Dunia ↓</button></div><div className="trust"><span>✓ Sekali bayar</span><span>✓ Lifetime access</span><span>✓ Umur 3–7</span></div>{refCode&&<div className="refBadge">🎟️ Referral: <b>{refCode}</b></div>}</div><div className="storybook"><div className="cloud">☁️</div><div className="planet">🌈</div><div className="rocket">🚀</div><div className="star s1">⭐</div><div className="star s2">✨</div><div className="island">🏝️</div><div className="heroLabel">Adventure starts here</div></div></section><section className="journey"><div><span>01</span><b>Explore</b><small>Kenal konsep</small></div><i>→</i><div><span>02</span><b>Practice</b><small>Cuba & ulang</small></div><i>→</i><div><span>03</span><b>Challenge</b><small>Campur kemahiran</small></div><i>→</i><div><span>04</span><b>Mastery</b><small>Buktikan faham</small></div><i>→</i><div><span>👑</span><b>Boss</b><small>Unlock dunia</small></div></section><section id="worlds" className="worlds"><div className="sectionTitle"><span>PILIH PENGEMBARAAN</span><h2>6 dunia. Setiap satu rasa berbeza.</h2><p>Tekan mana-mana dunia untuk tengok adventure map dan struktur difficulty.</p></div>{loading?<div className="state">Membuka peta…</div>:<div className="worldGrid">{games.map((g,i)=>{const m=worldMeta[g.game_key]||{};return <button className={`worldCard ${m.tone}`} key={g.id} onClick={()=>setModal({type:'world',game:g})}><span className="worldNo">0{i+1}</span><div className="worldEmoji">{m.icon||'🎮'}</div><span className="age">UMUR {g.min_age}–{g.max_age}</span><h3>{m.world||g.name_ms}</h3><p>{m.tag||g.name_en}</p><div className="worldFoot"><span>{g.total_levels} mission</span><b>Teroka →</b></div></button>})}</div>}</section><section className="value"><div><span className="eyebrow">ONE-TIME PURCHASE</span><h2>Sekali beli. Anak boleh kembali bermain bila-bila.</h2><p>Tiada subscription bulanan. Launch price RM{PROMO}, harga biasa RM{PRICE}.</p><button className="cta" onClick={()=>setModal('checkout')}>Dapatkan Kiddo • RM{PROMO}</button></div><div className="ticket"><small>KIDDO PASS</small><b>RM{PROMO}</b><span>Lifetime Access</span><i>6 Worlds • 5 Child Profiles</i></div></section><section className="partner"><div><span className="eyebrow">KIDDO PARTNER</span><h2>Suka Kiddo? Kongsi dan jana pendapatan.</h2><p>Setiap agent dapat referral link sendiri. Setiap pembelian berjaya melalui link atau kod agent memberi komisen RM{COMMISSION}.</p><button className="ghost dark" onClick={()=>setModal('agent')}>Daftar Agent Percuma →</button></div><div className="partnerNumbers"><div><b>RM{COMMISSION}</b><span>/ successful sale</span></div><div><b>RM100</b><span>contoh 10 sales</span></div></div></section><footer><div><b>🎈 Kiddo Adventures</b><span>Play. Learn. Discover.</span></div><div className="footlinks">{parent&&<button onClick={logout}>Log keluar</button>}</div></footer>{modal==='auth'&&<AuthModal onClose={()=>setModal(null)} refCode={refCode} onLogin={d=>{setParent(d);setModal('parent')}}/>}{modal==='agent'&&<AgentModal onClose={()=>setModal(null)}/>} {modal==='checkout'&&<Checkout onClose={()=>setModal(null)} refCode={refCode} parent={parent} onLogin={()=>setModal('auth')}/>} {modal==='parent'&&parent&&<ParentPanel parent={parent} onClose={()=>setModal(null)}/>} {modal?.type==='world'&&<MissionMap game={modal.game} onClose={()=>setModal(null)}/>}</main>
}

createRoot(document.getElementById('root')).render(<App/>);
