import React,{useEffect,useState}from'react';
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
  huruf:{icon:'🔤',world:'Pulau Huruf',tag:'Bunyi • Huruf • Perkataan',tone:'sunset'},
  nombor:{icon:'🔢',world:'Lembah Nombor',tag:'Kira • Susun • Banding',tone:'sky'},
  warna_bentuk:{icon:'🎨',world:'Hutan Warna',tag:'Warna • Bentuk • Corak',tone:'violet'},
  padan_gambar:{icon:'🧩',world:'Teluk Padan',tag:'Ingatan • Fokus • Padanan',tone:'mint'},
  jigsaw:{icon:'🧸',world:'Pulau Puzzle',tag:'Visual • Ruang • Sabar',tone:'yellow'},
  kira_asas:{icon:'➕',world:'Gunung Kira',tag:'Tambah • Tolak • Logik',tone:'rose'}
};

async function api(path,options={}){
  const r=await fetch(`${API}${path}`,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||'Ralat sambungan');
  return d;
}

function Modal({title,onClose,children,wide=false}){
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className={`modal ${wide?'wide':''}`}>
      <button className="x" onClick={onClose}>×</button>
      <h2>{title}</h2>
      {children}
    </div>
  </div>;
}

function AuthModal({onClose,onLogin,refCode}){
  const[mode,setMode]=useState('login');
  const[form,setForm]=useState({email:'',password:'',name:'',agent_code:refCode||''});
  const[busy,setBusy]=useState(false);const[msg,setMsg]=useState('');
  async function submit(e){
    e.preventDefault();setBusy(true);setMsg('');
    try{
      const path=mode==='login'?'/api/login':'/api/signup';
      const d=await api(path,{method:'POST',body:JSON.stringify(form)});
      localStorage.setItem('kiddo_parent',JSON.stringify(d));
      onLogin(d);
    }catch(err){setMsg(err.message)}finally{setBusy(false)}
  }
  return <Modal title={mode==='login'?'Log Masuk Ibu Bapa':'Daftar Akaun Ibu Bapa'} onClose={onClose}>
    <div className="switch">
      <button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Log Masuk</button>
      <button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Daftar</button>
    </div>
    <form className="form" onSubmit={submit}>
      {mode==='signup'&&<input required placeholder="Nama ibu / bapa" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}      
      <input type="email" required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input type="password" required minLength="6" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      {mode==='signup'&&<input placeholder="Kod agent (jika ada)" value={form.agent_code} onChange={e=>setForm({...form,agent_code:e.target.value.toUpperCase()})}/>}      
      {msg&&<div className="alert">{msg}</div>}
      <button className="primary" disabled={busy}>{busy?'Tunggu…':mode==='login'?'Masuk':'Cipta Akaun'}</button>
    </form>
  </Modal>;
}

function ProfileEditor({parent,profile,onClose,onSaved}){
  const isEdit=!!profile;
  const[form,setForm]=useState({name:profile?.name||'',age:String(profile?.age||''),avatar:profile?.avatar||'panda'});
  const[msg,setMsg]=useState('');const[busy,setBusy]=useState(false);
  async function save(e){
    e.preventDefault();setBusy(true);setMsg('');
    try{
      const body={...form,parent_id:parent.parent_id||parent.id,age:Number(form.age)};
      if(isEdit)await api(`/api/child-profiles/${profile.id}`,{method:'PUT',body:JSON.stringify(body)});
      else await api('/api/child-profiles',{method:'POST',body:JSON.stringify(body)});
      await onSaved();onClose();
    }catch(err){setMsg(err.message)}finally{setBusy(false)}
  }
  async function remove(){
    if(!confirm(`Buang profil ${profile.name}? Progress profil ini juga akan dipadam.`))return;
    setBusy(true);setMsg('');
    try{await api(`/api/child-profiles/${profile.id}`,{method:'DELETE'});await onSaved();onClose()}catch(err){setMsg(err.message)}finally{setBusy(false)}
  }
  return <Modal title={isEdit?'Edit Profil Anak':'Tambah Profil Anak'} onClose={onClose}>
    <form className="form" onSubmit={save}>
      <input required placeholder="Nama anak" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <select required value={form.age} onChange={e=>setForm({...form,age:e.target.value})}>
        <option value="">Pilih umur</option>{[3,4,5,6,7].map(age=><option key={age} value={age}>{age} tahun</option>)}
      </select>
      <div className="avatarLabel">Pilih avatar</div>
      <div className="avatars">{AVATARS.map(a=><button type="button" key={a.id} className={`avatarBtn ${form.avatar===a.id?'active':''}`} onClick={()=>setForm({...form,avatar:a.id})}>{a.icon}</button>)}</div>
      {msg&&<div className="alert">{msg}</div>}
      <button className="primary" disabled={busy}>{busy?'Tunggu…':isEdit?'Simpan Perubahan':'Tambah Profil'}</button>
      {isEdit&&<button type="button" className="dangerBtn" disabled={busy} onClick={remove}>Buang Profil</button>}
    </form>
  </Modal>;
}

function MissionMap({game,child,onClose}){
  const meta=worldMeta[game.game_key]||{};
  const missions=Array.from({length:Math.min(12,game.total_levels)},(_,i)=>i+1);
  return <Modal title={`${meta.world||game.name_ms} • ${child.name}`} onClose={onClose} wide>
    <div className={`worldBanner ${meta.tone}`}><div className="worldIcon">{meta.icon}</div><div><span className="eyebrow">ADVENTURE WORLD</span><h3>{game.name_ms}</h3><p>{meta.tag}</p></div></div>
    <div className="trail">{missions.map((n,i)=><React.Fragment key={n}><button className={`node ${i>0?'locked':''}`} onClick={()=>i===0&&alert(`Mission ${n} untuk ${child.name}`)}><small>{i===0?'Explore':'Locked'}</small><b>{n}</b><span>{i===0?'▶':'🔒'}</span></button>{i<missions.length-1&&<div className="path">•••</div>}</React.Fragment>)}</div>
  </Modal>;
}

function ParentDashboard({parent,games,onLogout}){
  const[profiles,setProfiles]=useState([]);const[loading,setLoading]=useState(true);
  const[selected,setSelected]=useState(null);const[editor,setEditor]=useState(null);const[world,setWorld]=useState(null);
  async function load(){
    setLoading(true);
    try{
      const d=await api(`/api/child-profiles?parent_id=${parent.parent_id||parent.id}`);
      setProfiles(d.profiles||[]);
      if(selected){const fresh=(d.profiles||[]).find(p=>p.id===selected.id);setSelected(fresh||null)}
    }finally{setLoading(false)}
  }
  useEffect(()=>{load()},[]);
  return <div className="dashboardShell">
    <header className="dashHeader">
      <button className="brand" onClick={()=>setSelected(null)}><span>🎈</span><b>Kiddo Adventures</b></button>
      <div className="dashActions">
        <span>Hai, {parent.name||'Ibu Bapa'} 👋</span>
        {selected&&<button className="ghost mini" onClick={()=>setSelected(null)}>Tukar Profil</button>}
        <button className="ghost mini logoutBtn" onClick={onLogout}>Log keluar</button>
      </div>
    </header>
    <main className="dashboardMain">
      {!selected?
        <section className="profileStage">
          <div className="profileHeading"><span className="eyebrow">RUANG KELUARGA</span><h1>Siapa nak main?</h1><p>Pilih profil anak. Setiap anak ada progress dan adventure sendiri.</p></div>
          {loading?<div className="state">Memuat profil…</div>:<div className="profileGrid">
            {profiles.map(p=><div className="profileTile" key={p.id}>
              <button className="profilePick" onClick={()=>setSelected(p)}><span>{avatarIcon(p.avatar)}</span><b>{p.name}</b><small>{p.age} tahun</small><em>Masuk Adventure →</em></button>
              <button className="profileEdit" onClick={()=>setEditor(p)}>✏️</button>
            </div>)}
            {profiles.length<5&&<button className="profileAdd" onClick={()=>setEditor('new')}><span>＋</span><b>Tambah Anak</b><small>Maksimum 5 profil</small></button>}
          </div>}
        </section>
      :<>
        <section className="kidHero">
          <div className="kidHeroIdentity"><div className="kidBigAvatar">{avatarIcon(selected.avatar)}</div><div><span className="eyebrow">PROFIL AKTIF</span><h1>Jom main, {selected.name}!</h1><p>{selected.age} tahun • Pilih dunia untuk sambung adventure.</p></div></div>
          <div className="kidHeroActions"><button className="ghost" onClick={()=>setEditor(selected)}>✏️ Edit Profil</button><button className="ghost" onClick={()=>setSelected(null)}>Tukar Anak</button></div>
        </section>
        <section className="dashWorlds"><div className="dashSectionTitle"><div><span className="eyebrow">PILIH DUNIA</span><h2>Adventure {selected.name}</h2></div><span className="statusPill">Progress disimpan automatik</span></div>
          <div className="worldGrid dashGrid">{games.map((g,i)=>{const m=worldMeta[g.game_key]||{};return <button className={`worldCard ${m.tone}`} key={g.id} onClick={()=>setWorld(g)}><span className="worldNo">0{i+1}</span><div className="worldEmoji">{m.icon||'🎮'}</div><span className="age">UMUR {g.min_age}–{g.max_age}</span><h3>{m.world||g.name_ms}</h3><p>{m.tag||g.name_en}</p><div className="worldFoot"><span>{g.total_levels} mission</span><b>▶ Main</b></div></button>})}</div>
        </section>
      </>}
    </main>
    {editor&&<ProfileEditor parent={parent} profile={editor==='new'?null:editor} onClose={()=>setEditor(null)} onSaved={load}/>}    
    {world&&selected&&<MissionMap game={world} child={selected} onClose={()=>setWorld(null)}/>}  
  </div>;
}

function AgentModal({onClose}){
  const[form,setForm]=useState({name:'',email:'',phone:'',bank_name:'',bank_account:''});const[msg,setMsg]=useState('');const[done,setDone]=useState(null);
  async function submit(e){e.preventDefault();setMsg('');try{setDone(await api('/api/agents',{method:'POST',body:JSON.stringify(form)}))}catch(err){setMsg(err.message)}}
  return <Modal title="Jadi Agent Kiddo" onClose={onClose}>{done?<div className="success"><h3>Berjaya 🎉</h3><div className="codeBox">{done.agent_code}</div><p>Simpan kod ini untuk semak dashboard agent.</p></div>:<form className="form" onSubmit={submit}><input required placeholder="Nama" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Telefon" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input placeholder="Bank" value={form.bank_name} onChange={e=>setForm({...form,bank_name:e.target.value})}/><input placeholder="No. akaun bank" value={form.bank_account} onChange={e=>setForm({...form,bank_account:e.target.value})}/>{msg&&<div className="alert">{msg}</div>}<button className="primary">Daftar Agent</button></form>}</Modal>;
}

function Landing({onLogin,onAgent,onBuy}){
  return <main>
    <header><button className="brand"><span>🎈</span><b>Kiddo Adventures</b></button><nav><button onClick={onAgent}>Jadi Agent</button><button className="parent" onClick={onLogin}>Log Masuk</button></nav></header>
    <section className="hero"><div className="heroCopy"><span className="pill">BELAJAR • MAIN • TEROKA</span><h1>Bukan sekadar level.<br/><em>Satu dunia untuk diteroka.</em></h1><p>Kiddo Adventures menukar pembelajaran awal menjadi pengembaraan dengan mission, bintang, treasure dan cabaran yang semakin berkembang.</p><div className="heroActions"><button className="cta" onClick={onBuy}>Buka Semua Dunia • RM{PRICE}</button></div><div className="trust"><span>✓ Sekali bayar</span><span>✓ Lifetime access</span><span>✓ Umur 3–7</span></div></div><div className="storybook"><div className="planet">🌈</div><div className="rocket">🚀</div><div className="cloud">☁️</div><div className="island">🏝️</div></div></section>
  </main>;
}

function App(){
  const[parent,setParent]=useState(()=>{try{return JSON.parse(localStorage.getItem('kiddo_parent'))}catch{return null}});
  const[games,setGames]=useState([]);const[modal,setModal]=useState(null);const[refCode,setRefCode]=useState('');
  useEffect(()=>{
    const ref=new URLSearchParams(location.search).get('ref');if(ref){localStorage.setItem('kiddo_ref',ref.toUpperCase());setRefCode(ref.toUpperCase())}
    api('/api/games').then(d=>setGames(d.games||[])).catch(()=>{});
  },[]);
  function loginDone(d){setParent(d);setModal(null)}
  function logout(){localStorage.removeItem('kiddo_parent');setParent(null);setModal(null)}
  if(parent)return <ParentDashboard parent={parent} games={games} onLogout={logout}/>;
  return <>
    <Landing onLogin={()=>setModal('auth')} onAgent={()=>setModal('agent')} onBuy={()=>setModal('auth')}/>
    {modal==='auth'&&<AuthModal onClose={()=>setModal(null)} onLogin={loginDone} refCode={refCode}/>}    
    {modal==='agent'&&<AgentModal onClose={()=>setModal(null)}/>}  
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
