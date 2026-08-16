import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import'./styles.css';

const API='';
const PRICE=29;
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
  huruf:{icon:'🔤',world:'Pulau Huruf',tag:'Bunyi • Huruf • Perkataan',tone:'sunset',scene:'🏝️  🌊  🐚'},
  nombor:{icon:'🔢',world:'Lembah Nombor',tag:'Kira • Susun • Banding',tone:'sky',scene:'🚂  🌤️  ⛰️'},
  warna_bentuk:{icon:'🎨',world:'Hutan Warna',tag:'Warna • Bentuk • Corak',tone:'violet',scene:'🌳  🌈  🦋'},
  padan_gambar:{icon:'🧩',world:'Teluk Padan',tag:'Ingatan • Fokus • Padanan',tone:'mint',scene:'🛶  🐠  🐚'},
  jigsaw:{icon:'🧸',world:'Pulau Puzzle',tag:'Visual • Ruang • Sabar',tone:'yellow',scene:'🏰  🧸  ⭐'},
  kira_asas:{icon:'➕',world:'Gunung Kira',tag:'Tambah • Tolak • Logik',tone:'rose',scene:'🚗  🛣️  🏔️'}
};

async function api(path,options={}){
  const r=await fetch(`${API}${path}`,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||'Ralat sambungan');
  return d;
}

function Modal({title,onClose,children}){
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><button className="x" onClick={onClose}>×</button><h2>{title}</h2>{children}</div></div>;
}

function AuthModal({onClose,onLogin,refCode}){
  const[mode,setMode]=useState('login');
  const[form,setForm]=useState({email:'',password:'',name:'',agent_code:refCode||''});
  const[busy,setBusy]=useState(false),[msg,setMsg]=useState('');
  async function submit(e){e.preventDefault();setBusy(true);setMsg('');try{const d=await api(mode==='login'?'/api/login':'/api/signup',{method:'POST',body:JSON.stringify(form)});localStorage.setItem('kiddo_parent',JSON.stringify(d));onLogin(d)}catch(err){setMsg(err.message)}finally{setBusy(false)}}
  return <Modal title={mode==='login'?'Log Masuk Ibu Bapa':'Daftar Akaun Ibu Bapa'} onClose={onClose}>
    <div className="switch"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Log Masuk</button><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Daftar</button></div>
    <form className="form" onSubmit={submit}>{mode==='signup'&&<input required placeholder="Nama ibu / bapa" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}<input type="email" required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" required minLength="6" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>{mode==='signup'&&<input placeholder="Kod agent (jika ada)" value={form.agent_code} onChange={e=>setForm({...form,agent_code:e.target.value.toUpperCase()})}/>} {msg&&<div className="alert">{msg}</div>}<button className="primary" disabled={busy}>{busy?'Tunggu…':mode==='login'?'Masuk':'Cipta Akaun'}</button></form>
  </Modal>;
}

function ParentGate({parent,onClose,onVerified}){
  const[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');
  async function verify(e){e.preventDefault();setBusy(true);setMsg('');try{await api('/api/login',{method:'POST',body:JSON.stringify({email:parent.email,password})});onVerified()}catch{setMsg('Password ibu bapa tidak betul.')}finally{setBusy(false)}}
  return <Modal title="Kawasan Ibu Bapa 🔐" onClose={onClose}><p className="parentGateText">Masukkan semula password ibu bapa untuk mengubah atau memadam profil anak.</p><form className="form" onSubmit={verify}><input autoFocus type="password" required minLength="6" placeholder="Password ibu bapa" value={password} onChange={e=>setPassword(e.target.value)}/>{msg&&<div className="alert">{msg}</div>}<button className="primary" disabled={busy}>{busy?'Semak…':'Buka Tetapan Profil'}</button></form></Modal>;
}

function ProfileEditor({parent,profile,onClose,onSaved}){
  const isEdit=!!profile;
  const[form,setForm]=useState({name:profile?.name||'',age:String(profile?.age||''),avatar:profile?.avatar||'panda'});
  const[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[confirmDelete,setConfirmDelete]=useState(false);
  async function save(e){e.preventDefault();setBusy(true);setMsg('');try{const body={...form,parent_id:parent.parent_id||parent.id,age:Number(form.age)};if(isEdit)await api(`/api/child-profiles/${profile.id}`,{method:'PUT',body:JSON.stringify(body)});else await api('/api/child-profiles',{method:'POST',body:JSON.stringify(body)});await onSaved();onClose()}catch(err){setMsg(err.message)}finally{setBusy(false)}}
  async function remove(){setBusy(true);setMsg('');try{await api(`/api/child-profiles/${profile.id}`,{method:'DELETE'});await onSaved();onClose()}catch(err){setMsg(err.message)}finally{setBusy(false)}}
  return <Modal title={isEdit?'Urus Profil Anak':'Tambah Profil Anak'} onClose={onClose}><form className="form" onSubmit={save}><input required placeholder="Nama anak" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><select required value={form.age} onChange={e=>setForm({...form,age:e.target.value})}><option value="">Pilih umur</option>{[3,4,5,6,7].map(age=><option key={age} value={age}>{age} tahun</option>)}</select><div className="avatarLabel">Pilih avatar</div><div className="avatars">{AVATARS.map(a=><button type="button" key={a.id} className={`avatarBtn ${form.avatar===a.id?'active':''}`} onClick={()=>setForm({...form,avatar:a.id})}>{a.icon}</button>)}</div>{msg&&<div className="alert">{msg}</div>}<button className="primary" disabled={busy}>{busy?'Tunggu…':isEdit?'Simpan Perubahan':'Tambah Profil'}</button>{isEdit&&!confirmDelete&&<button type="button" className="dangerBtn" onClick={()=>setConfirmDelete(true)}>🗑️ Padam Profil</button>}{isEdit&&confirmDelete&&<div className="deleteConfirm"><b>Padam {profile.name}?</b><p>Semua progress permainan profil ini akan dipadam dan tidak boleh dipulihkan.</p><div><button type="button" className="ghost" onClick={()=>setConfirmDelete(false)}>Batal</button><button type="button" className="dangerBtn" disabled={busy} onClick={remove}>Ya, Padam</button></div></div>}</form></Modal>;
}

function makeChallenge(gameKey,level){
  const seed=(level-1)%6;
  if(gameKey==='huruf'){
    const letters=['A','B','C','D','E','F'];const answer=letters[seed];const options=[answer,...letters.filter(x=>x!==answer).slice(0,3)].sort(()=>.5-Math.random());
    return{prompt:`Cari huruf ${answer}`,visual:answer,visualType:'letter',options,answer};
  }
  if(gameKey==='nombor'){
    const answer=(level%9)+1;const options=[answer,Math.max(1,answer-1),answer+1,answer+2].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4).sort(()=>.5-Math.random());
    return{prompt:'Berapa jumlah bintang?',visual:'⭐'.repeat(Math.min(answer,9)),options,answer:String(answer)};
  }
  if(gameKey==='warna_bentuk'){
    const items=[['Bulatan','🔵'],['Segi tiga','🔺'],['Segi empat','🟩'],['Bintang','⭐'],['Hati','💜'],['Berlian','🔶']];const item=items[seed];
    return{prompt:`Pilih ${item[0]}`,visual:'🎨',options:items.slice(0,4).map(x=>x[1]).concat(seed>3?[item[1]]:[]).slice(-4).sort(()=>.5-Math.random()),answer:item[1]};
  }
  if(gameKey==='padan_gambar'){
    const icons=['🐶','🐱','🐰','🐼','🦊','🐸'];const answer=icons[seed];return{prompt:'Cari gambar yang sama',visual:answer,options:icons.slice(0,4).concat(seed>3?[answer]:[]).slice(-4).sort(()=>.5-Math.random()),answer};
  }
  if(gameKey==='jigsaw'){
    const sets=[['🍎','🍊','🍋','🍇'],['🚗','🚌','🚲','🚂'],['🌞','☁️','🌧️','🌈']];const set=sets[level%sets.length];const answer=set[seed%4];return{prompt:'Pilih kepingan yang sepadan',visual:`❓ + ${answer}`,options:[...set].sort(()=>.5-Math.random()),answer};
  }
  const a=(level%5)+1,b=((level+1)%4)+1,answer=a+b;return{prompt:`${a} + ${b} = ?`,visual:'➕',options:[answer,answer+1,Math.max(0,answer-1),answer+2].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4).sort(()=>.5-Math.random()),answer:String(answer)};
}

const confettiBits=Array.from({length:28},(_,i)=>i);
function GameScreen({game,child,level,onBack,onComplete}){
  const challenge=useMemo(()=>makeChallenge(game.game_key,level),[game.game_key,level]);
  const[result,setResult]=useState(''),[busy,setBusy]=useState(false),[countdown,setCountdown]=useState(10);
  const nextLevel=Math.min(level+1,game.total_levels);
  useEffect(()=>{
    if(result!=='correct')return;
    setCountdown(10);
    const id=setInterval(()=>setCountdown(v=>v-1),1000);
    const jump=setTimeout(()=>onComplete(nextLevel),10000);
    return()=>{clearInterval(id);clearTimeout(jump)};
  },[result,nextLevel,onComplete]);
  async function choose(value){
    if(result==='correct'||busy)return;
    const ok=String(value)===String(challenge.answer);
    if(!ok){setResult('wrong');setTimeout(()=>setResult(''),700);return}
    setResult('correct');setBusy(true);
    try{await api('/api/progress',{method:'POST',body:JSON.stringify({child_id:child.id,game_key:game.game_key,level_reached:nextLevel,stars:level})})}catch{}finally{setBusy(false)}
  }
  return <section className={`gameScreen level-${worldMeta[game.game_key]?.tone||'sky'}`}>
    <div className="gameBar"><button className="levelBack" onClick={onBack}>← Level</button><div><small>{worldMeta[game.game_key]?.world}</small><b>Level {level}</b></div></div>
    <div className={`gameBoard ${result}`}>
      {result==='correct'&&<div className="confettiLayer" aria-hidden="true">{confettiBits.map(i=><i key={i} style={{'--i':i}} />)}</div>}
      <div className={`gameVisual ${challenge.visualType==='letter'?'bigLetter':''}`}>{challenge.visual}</div>
      <h1>{challenge.prompt}</h1>
      <div className="answerGrid">{challenge.options.map((o,i)=><button key={`${o}-${i}`} onClick={()=>choose(o)}>{o}</button>)}</div>
      {result==='wrong'&&<div className="gameFeedback bad">Cuba lagi 💪</div>}
      {result==='correct'&&<div className="gameFeedback good"><div className="successRow"><span>Bagus! ⭐</span><span className="countdownBadge">⏱️ {Math.max(0,countdown)}s</span></div><small>Level seterusnya akan bermula automatik.</small><button onClick={()=>onComplete(nextLevel)}>Teruskan sekarang →</button></div>}
    </div>
  </section>;
}

function LevelPage({game,child,onBack,onPlay,refreshKey}){
  const meta=worldMeta[game.game_key]||{};const missions=Array.from({length:game.total_levels||1},(_,i)=>i+1);const[reached,setReached]=useState(1);
  useEffect(()=>{api(`/api/progress?child_id=${child.id}`).then(d=>{const row=(d.progress||[]).find(p=>p.game_key===game.game_key);setReached(Math.max(1,row?.level_reached||1))}).catch(()=>setReached(1))},[child.id,game.game_key,refreshKey]);
  return <section className={`levelPage level-${meta.tone||'sky'}`}><div className="levelTopbar"><button className="levelBack" onClick={onBack}>← Dunia</button><div className="levelTitle"><span className="levelEmoji">{meta.icon||'🎮'}</span><div><span className="eyebrow">{meta.world||game.name_ms}</span><h1>{game.name_ms} • {child.name}</h1><p>{meta.tag||game.name_en}</p></div></div><div className="levelScene">{meta.scene}</div></div><div className="levelMapWrap"><div className="levelMapLabel"><b>Pilih level</b><span>Ikut laluan sampai habis ✨</span></div><div className="levelTrack">{missions.map(n=>{const open=n<=reached;return <div className={`levelNodeWrap ${open?'open':'locked'}`} key={n}><button className="levelNode" disabled={!open} onClick={()=>open&&onPlay(n)}><span>{open?'▶':'🔒'}</span><b>{n}</b></button></div>})}</div></div></section>;
}

function ParentDashboard({parent,games,onLogout}){
  const[profiles,setProfiles]=useState([]),[loading,setLoading]=useState(true),[selected,setSelected]=useState(null),[editor,setEditor]=useState(null),[world,setWorld]=useState(null),[playing,setPlaying]=useState(null),[gate,setGate]=useState(false),[progressTick,setProgressTick]=useState(0);
  async function load(){setLoading(true);try{const d=await api(`/api/child-profiles?parent_id=${parent.parent_id||parent.id}`);setProfiles(d.profiles||[]);if(selected){const fresh=(d.profiles||[]).find(p=>p.id===selected.id);setSelected(fresh||null)}}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  const atProfileChooser=!selected&&!world&&!playing;
  const handleComplete=next=>{setProgressTick(x=>x+1);if(world&&next<=world.total_levels)setPlaying(next);else setPlaying(null)};
  return <div className="dashboardShell"><header className="dashHeader"><button className="brand" onClick={()=>{setPlaying(null);setWorld(null);setSelected(null)}}><span>🎈</span><b>Kiddo Adventures</b></button><div className="dashActions"><span>Hai, {parent.name||'Ibu Bapa'} 👋</span>{atProfileChooser&&<button className="ghost mini logoutBtn" onClick={onLogout}>Log keluar</button>}</div></header>
    <main className="dashboardMain">{playing&&world&&selected?<GameScreen game={world} child={selected} level={playing} onBack={()=>setPlaying(null)} onComplete={handleComplete}/>:world&&selected?<LevelPage game={world} child={selected} refreshKey={progressTick} onBack={()=>setWorld(null)} onPlay={setPlaying}/>:!selected?<section className="profileStage"><div className="profileHeading"><span className="eyebrow">RUANG KELUARGA</span><h1>Siapa nak main?</h1><p>Pilih profil anak. Setiap anak ada progress dan adventure sendiri.</p></div>{loading?<div className="state">Memuat profil…</div>:<div className="profileGrid">{profiles.map(p=><div className="profileTile" key={p.id}><button className="profilePick" onClick={()=>setSelected(p)}><span>{avatarIcon(p.avatar)}</span><b>{p.name}</b><small>{p.age} tahun</small></button></div>)}{profiles.length<5&&<button className="profileAdd" onClick={()=>setEditor('new')}><span>＋</span><b>Tambah Anak</b><small>Maksimum 5 profil</small></button>}</div>}</section>:<><section className="kidHero"><div className="kidHeroIdentity"><div className="kidBigAvatar">{avatarIcon(selected.avatar)}</div><div><span className="eyebrow">PROFIL AKTIF</span><h1>Jom main, {selected.name}!</h1><p>{selected.age} tahun • Pilih dunia untuk sambung adventure.</p></div></div><div className="kidHeroActions"><button className="ghost parentControl" onClick={()=>setGate(true)}>🔐 Urus Profil</button><button className="ghost" onClick={()=>setSelected(null)}>Tukar Anak</button></div></section><section className="dashWorlds"><div className="dashSectionTitle"><div><span className="eyebrow">PILIH DUNIA</span><h2>Adventure {selected.name}</h2></div><span className="statusPill">Progress disimpan automatik</span></div><div className="worldGrid dashGrid">{games.map((g,i)=>{const m=worldMeta[g.game_key]||{};return <button className={`worldCard ${m.tone}`} key={g.id} onClick={()=>setWorld(g)}><span className="worldNo">0{i+1}</span><div className="worldEmoji">{m.icon||'🎮'}</div><span className="age">UMUR {g.min_age}–{g.max_age}</span><h3>{m.world||g.name_ms}</h3><p>{m.tag||g.name_en}</p><div className="worldFoot"><span>{g.total_levels} mission</span><b>▶ Main</b></div></button>})}</div></section></>}</main>
    {gate&&<ParentGate parent={parent} onClose={()=>setGate(false)} onVerified={()=>{setGate(false);setEditor(selected)}}/>}{editor&&<ProfileEditor parent={parent} profile={editor==='new'?null:editor} onClose={()=>setEditor(null)} onSaved={load}/>}</div>;
}

function AgentModal({onClose}){const[form,setForm]=useState({name:'',email:'',phone:'',bank_name:'',bank_account:''}),[msg,setMsg]=useState(''),[done,setDone]=useState(null);async function submit(e){e.preventDefault();setMsg('');try{setDone(await api('/api/agents',{method:'POST',body:JSON.stringify(form)}))}catch(err){setMsg(err.message)}}return <Modal title="Jadi Agent Kiddo" onClose={onClose}>{done?<div className="success"><h3>Berjaya 🎉</h3><div className="codeBox">{done.agent_code}</div><p>Simpan kod ini untuk semak dashboard agent.</p></div>:<form className="form" onSubmit={submit}><input required placeholder="Nama" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Telefon" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input placeholder="Bank" value={form.bank_name} onChange={e=>setForm({...form,bank_name:e.target.value})}/><input placeholder="No. akaun bank" value={form.bank_account} onChange={e=>setForm({...form,bank_account:e.target.value})}/>{msg&&<div className="alert">{msg}</div>}<button className="primary">Daftar Agent</button></form>}</Modal>}

function Landing({onLogin,onAgent,onBuy}){return <main><header><button className="brand"><span>🎈</span><b>Kiddo Adventures</b></button><nav><button onClick={onAgent}>Jadi Agent</button><button className="parent" onClick={onLogin}>Log Masuk</button></nav></header><section className="hero"><div className="heroCopy"><span className="pill">BELAJAR • MAIN • TEROKA</span><h1>Bukan sekadar level.<br/><em>Satu dunia untuk diteroka.</em></h1><p>Kiddo Adventures menukar pembelajaran awal menjadi pengembaraan dengan mission, bintang, treasure dan cabaran yang semakin berkembang.</p><div className="heroActions"><button className="cta" onClick={onBuy}>Buka Semua Dunia • RM{PRICE}</button></div><div className="trust"><span>✓ Sekali bayar</span><span>✓ Lifetime access</span><span>✓ Umur 3–7</span></div></div><div className="storybook"><div className="planet">🌈</div><div className="rocket">🚀</div><div className="cloud">☁️</div><div className="island">🏝️</div></div></section></main>}

function App(){const[parent,setParent]=useState(()=>{try{return JSON.parse(localStorage.getItem('kiddo_parent'))}catch{return null}}),[games,setGames]=useState([]),[modal,setModal]=useState(null),[refCode,setRefCode]=useState('');useEffect(()=>{const ref=new URLSearchParams(location.search).get('ref');if(ref){localStorage.setItem('kiddo_ref',ref.toUpperCase());setRefCode(ref.toUpperCase())}api('/api/games').then(d=>setGames(d.games||[])).catch(()=>{})},[]);function loginDone(d){setParent(d);setModal(null)}function logout(){localStorage.removeItem('kiddo_parent');setParent(null);setModal(null)}if(parent)return <ParentDashboard parent={parent} games={games} onLogout={logout}/>;return <><Landing onLogin={()=>setModal('auth')} onAgent={()=>setModal('agent')} onBuy={()=>setModal('auth')}/>{modal==='auth'&&<AuthModal onClose={()=>setModal(null)} onLogin={loginDone} refCode={refCode}/>} {modal==='agent'&&<AgentModal onClose={()=>setModal(null)}/>}</>}

createRoot(document.getElementById('root')).render(<App/>);