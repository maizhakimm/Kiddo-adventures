import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{makeChallenge}from'./questionBank.js';
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
  huruf:{icon:'🔤',world:'Kota Abjad',tag:'Bunyi • Huruf • Perkataan',tone:'sunset',scene:'🏝️  🌊  🐚'},
  nombor:{icon:'🔢',world:'Kota Nombor',tag:'Kira • Susun • Banding',tone:'sky',scene:'🚂  🌤️  ⛰️'},
  warna_bentuk:{icon:'🎨',world:'Hutan Pelangi',tag:'Warna • Bentuk • Corak',tone:'violet',scene:'🌳  🌈  🦋'},
  padan_gambar:{icon:'🧩',world:'Teluk Ingatan',tag:'Ingatan • Fokus • Padanan',tone:'mint',scene:'🛶  🐠  🐚'},
  jigsaw:{icon:'🧸',world:'Pulau Teka-Teki',tag:'Visual • Ruang • Sabar',tone:'yellow',scene:'🏰  🧸  ⭐'},
  kira_asas:{icon:'➕',world:'Gunung Matematik',tag:'Tambah • Tolak • Logik',tone:'rose',scene:'🚗  🛣️  🏔️'}
};

async function api(path,options={}){
  const r=await fetch(`${API}${path}`,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||'Ralat sambungan');
  return d;
}

let audioCtx;
function playSfx(type,enabled=true){
  if(!enabled||typeof window==='undefined')return;
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    audioCtx=audioCtx||new Ctx();
    if(audioCtx.state==='suspended')audioCtx.resume();
    const notes=type==='correct'?[523.25,659.25,783.99]:type==='finish'?[523.25,659.25,783.99,1046.5]:[220,174.61];
    notes.forEach((freq,i)=>{
      const osc=audioCtx.createOscillator();
      const gain=audioCtx.createGain();
      osc.type=type==='wrong'?'triangle':'sine';
      osc.frequency.value=freq;
      gain.gain.setValueAtTime(.0001,audioCtx.currentTime+i*.11);
      gain.gain.exponentialRampToValueAtTime(.18,audioCtx.currentTime+i*.11+.02);
      gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+i*.11+.16);
      osc.connect(gain);gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime+i*.11);osc.stop(audioCtx.currentTime+i*.11+.18);
    });
  }catch{}
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

function calcStars(correct,totalLevels){
  const ratio=totalLevels?correct/totalLevels:0;
  if(ratio>=.8)return 3;
  if(ratio>=.5)return 2;
  return 1;
}

const confettiBits=Array.from({length:28},(_,i)=>i);
function ChallengeExperience({challenge,choose,disabled}){
  const type=challenge.interaction||'tap-choice';
  const math=['count-choice','compare','story-math','mixed'].includes(type)||['tambah','tolak','banding','nombor-hilang','cerita','finale-matematik'].includes(challenge.skill);
  const spell=type==='spell-complete';
  const combine=type==='word-combine';
  const parts=combine?String(challenge.visual).split('+').map(x=>x.trim()):[];
  const visual=String(challenge.visual||'');
  const firstSpace=visual.indexOf(' ');
  const icon=spell&&firstSpace>0?visual.slice(0,firstSpace):'';
  const word=spell&&firstSpace>0?visual.slice(firstSpace+1):visual;
  const optionStyle={minHeight:92,border:'3px solid #e4dfeb',borderRadius:24,background:'#fbf9ff',color:'#302d50',fontWeight:900,fontSize:spell?'clamp(28px,7vw,44px)':'clamp(20px,5vw,32px)',boxShadow:'0 5px 0 #ded8e8',padding:'12px 10px'};
  return <div style={{display:'grid',gap:20,textAlign:'center'}}>
    {combine?<div><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexWrap:'wrap'}}>{parts.map((x,i)=><React.Fragment key={i}><div style={{minWidth:125,padding:'18px 12px',borderRadius:26,background:i?'#eaf5ff':'#fff0df',fontSize:'clamp(28px,8vw,48px)',fontWeight:900,boxShadow:'0 6px 0 #00000010'}}>{x}</div>{i<parts.length-1&&<b style={{fontSize:42,color:'#6652ba'}}>＋</b>}</React.Fragment>)}</div><div style={{fontSize:13,fontWeight:900,color:'#8b8497',marginTop:10}}>CANTUMKAN DUA PETUNJUK</div></div>
    :spell?<div><div style={{fontSize:70,lineHeight:1}}>{icon}</div><div style={{fontFamily:'Baloo 2, Nunito, sans-serif',fontSize:'clamp(38px,10vw,64px)',fontWeight:900,letterSpacing:8,color:'#40375f',marginTop:8}}>{word.split('').map((c,i)=><span key={i} style={c==='_'?{display:'inline-block',minWidth:34,borderBottom:'6px solid #f08b5b',color:'transparent',margin:'0 3px'}:{}}>{c}</span>)}</div></div>
    :math?<div style={{fontFamily:'Baloo 2, Nunito, sans-serif',fontSize:'clamp(48px,13vw,82px)',fontWeight:900,lineHeight:1.15,color:'#40375f',padding:'8px 4px'}}>{challenge.visual}</div>
    :<div style={{fontSize:challenge.visualType==='letter'?'clamp(72px,20vw,120px)':'clamp(58px,16vw,92px)',fontWeight:900,lineHeight:1.15}}>{challenge.visual}</div>}
    <h1 style={{fontFamily:'Baloo 2, Nunito, sans-serif',fontSize:'clamp(26px,7vw,42px)',lineHeight:1.05,margin:'0 0 4px'}}>{challenge.prompt}</h1>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:14}}>{challenge.options.map((o,i)=><button key={`${o}-${i}`} disabled={disabled} onClick={()=>choose(o)} style={optionStyle}>{o}</button>)}</div>
  </div>;
}

function GameScreen({game,child,level,onBack,onComplete,soundOn,onToggleSound}){
  const challenge=useMemo(()=>makeChallenge(game.game_key,level),[game.game_key,level]);
  const[result,setResult]=useState(''),[busy,setBusy]=useState(false),[countdown,setCountdown]=useState(5);
  useEffect(()=>{
    if(!soundOn||!challenge?.prompt||typeof window==='undefined'||!window.speechSynthesis)return;
    const t=setTimeout(()=>{try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(challenge.prompt);u.lang=challenge.language==='en'?'en-US':'ms-MY';u.rate=.88;u.pitch=1.08;window.speechSynthesis.speak(u)}catch{}},250);
    return()=>{clearTimeout(t);try{window.speechSynthesis.cancel()}catch{}};
  },[challenge,soundOn]);
  const isLast=level>=game.total_levels;
  const nextLevel=isLast?level:level+1;
  useEffect(()=>{
    if(!result)return;
    setCountdown(5);
    const id=setInterval(()=>setCountdown(v=>Math.max(0,v-1)),1000);
    const jump=setTimeout(()=>onComplete(result==='correct',nextLevel,isLast),5000);
    return()=>{clearInterval(id);clearTimeout(jump)};
  },[result,nextLevel,isLast,onComplete]);
  async function choose(value){
    if(result||busy)return;
    const ok=String(value)===String(challenge.answer);
    playSfx(ok?'correct':'wrong',soundOn);
    setResult(ok?'correct':'wrong');
    setBusy(true);
    try{
      await api('/api/performance',{method:'POST',body:JSON.stringify({child_id:child.id,game_key:game.game_key,level,correct:ok})});
      await api('/api/progress',{method:'POST',body:JSON.stringify({child_id:child.id,game_key:game.game_key,level_reached:isLast?game.total_levels:nextLevel})});
    }catch{}finally{setBusy(false)}
  }
  const isCorrect=result==='correct';
  return <section className={`gameScreen level-${worldMeta[game.game_key]?.tone||'sky'}`}>
    <div className="gameBar"><button className="levelBack" onClick={onBack}>← Level</button><div><small>{worldMeta[game.game_key]?.world}</small><b>Level {level}</b></div><button className="soundToggle" onClick={onToggleSound}>{soundOn?'🔊 Bunyi':'🔇 Senyap'}</button></div>
    <div className="gameBoard"><ChallengeExperience challenge={challenge} choose={choose} disabled={!!result}/></div>
    {result&&<div className={`resultOverlay ${isCorrect?'resultCorrect':'resultWrong'}`}>
      {isCorrect&&<div className="confettiLayer" aria-hidden="true">{confettiBits.map(i=><i key={i} style={{'--i':i}} />)}</div>}
      <div className="resultPopup" role="dialog" aria-live="assertive">
        <div className="resultIcon">{isCorrect?'🎉':'😢'}</div>
        <h2>{isCorrect?'Betul! Hebat!':'Belum tepat'}</h2>
        <p>{isCorrect?`Bagus, ${child.name}!`:<>Jawapan yang betul ialah <strong>{String(challenge.answer)}</strong>.</>}</p>
        <div className="resultCountdown"><span>⏱️</span><b>{countdown}</b><small>{isLast?'saat ke keputusan':'saat ke level seterusnya'}</small></div>
        <button onClick={()=>onComplete(isCorrect,nextLevel,isLast)}>{isLast?'Lihat keputusan →':'Teruskan sekarang →'}</button>
      </div>
    </div>}
  </section>;
}

function WorldResult({game,child,stats,onMap,onWorlds,soundOn,onToggleSound}){
  const meta=worldMeta[game.game_key]||{};
  const total=game.total_levels||stats.total||1;
  const stars=calcStars(stats.correct,total);
  const percent=Math.round((stats.correct||0)/total*100);
  useEffect(()=>{playSfx('finish',soundOn)},[]);
  return <section className={`worldResult level-${meta.tone||'sky'}`}>
    <div className="worldResultTop"><button className="levelBack" onClick={onMap}>← Peta level</button><button className="soundToggle" onClick={onToggleSound}>{soundOn?'🔊 Bunyi':'🔇 Senyap'}</button></div>
    <div className="worldResultCard">
      {stars===3&&<div className="confettiLayer" aria-hidden="true">{confettiBits.map(i=><i key={i} style={{'--i':i}} />)}</div>}
      <div className="resultTrophy">🏆</div>
      <span className="eyebrow">ADVENTURE SELESAI</span>
      <h1>Syabas, {child.name}!</h1>
      <p>{meta.world||game.name_ms} selesai untuk sesi ini.</p>
      <div className="starScore" aria-label={`${stars} bintang`}>{[1,2,3].map(n=><span key={n} className={n<=stars?'earned':''}>★</span>)}</div>
      <div className="scoreStats"><div><b>{stats.correct}/{total}</b><span>Level dikuasai</span></div><div><b>{percent}%</b><span>Ketepatan</span></div><div><b>{stars}/3</b><span>Bintang</span></div></div>
      <div className="resultActions"><button className="primary" onClick={onMap}>Lihat peta level</button><button className="ghost" onClick={onWorlds}>Pilih dunia lain</button></div>
      <small className="parentTrackNote">⭐ Skor bintang ini disimpan untuk paparan progress ibu bapa.</small>
    </div>
  </section>;
}

function LevelPage({game,child,onBack,onPlay,refreshKey}){
  const meta=worldMeta[game.game_key]||{};const missions=Array.from({length:game.total_levels||1},(_,i)=>i+1);const[reached,setReached]=useState(1);
  useEffect(()=>{api(`/api/progress?child_id=${child.id}`).then(d=>{const row=(d.progress||[]).find(p=>p.game_key===game.game_key);setReached(Math.max(1,row?.level_reached||1))}).catch(()=>setReached(1))},[child.id,game.game_key,refreshKey]);
  return <section className={`levelPage level-${meta.tone||'sky'}`}><div className="levelTopbar"><button className="levelBack" onClick={onBack}>← Dunia</button><div className="levelTitle"><span className="levelEmoji">{meta.icon||'🎮'}</span><div><span className="eyebrow">{meta.world||game.name_ms}</span><h1>{game.name_ms} • {child.name}</h1><p>{meta.tag||game.name_en}</p></div></div><div className="levelScene">{meta.scene}</div></div><div className="levelMapWrap"><div className="levelMapLabel"><b>Pilih level</b><span>Ikut laluan sampai habis ✨</span></div><div className="levelTrack">{missions.map(n=>{const open=n<=reached;return <div className={`levelNodeWrap ${n===missions.length?'finalLevel ':''}${open?'open':'locked'}`} key={n}><button className="levelNode" disabled={!open} onClick={()=>open&&onPlay(n)}><span>{n===missions.length?'🏆':open?'▶':'🔒'}</span><b>{n}</b></button></div>})}</div></div></section>;
}

function ParentProgressPage({profiles,games,onBack}){
  const[rows,setRows]=useState([]),[loading,setLoading]=useState(true);
  useEffect(()=>{let alive=true;(async()=>{setLoading(true);const data=await Promise.all(profiles.map(async p=>{const perf=await api(`/api/performance?child_id=${p.id}`).catch(()=>({performance:[]}));const byKey=Object.fromEntries((perf.performance||[]).map(x=>[x.game_key,x]));const worlds=games.map(g=>{const r=byKey[g.game_key]||{};const correct=Number(r.correct_levels||0),attempted=Number(r.attempted_levels||0),stars=correct?calcStars(correct,g.total_levels):0;return{...g,correct,attempted,stars,percent:Math.round(correct/(g.total_levels||1)*100)}});return{...p,worlds,totalStars:worlds.reduce((s,w)=>s+w.stars,0),mastered:worlds.reduce((s,w)=>s+w.correct,0),possible:worlds.reduce((s,w)=>s+(w.total_levels||0),0)}}));if(alive){data.sort((a,b)=>b.totalStars-a.totalStars||b.mastered-a.mastered);setRows(data);setLoading(false)}})();return()=>{alive=false}},[profiles,games]);
  return <section className="parentProgressPage"><div className="parentProgressHead"><button className="levelBack" onClick={onBack}>← Kembali</button><div><span className="eyebrow">KAWASAN IBU BAPA</span><h1>Prestasi Anak</h1><p>Ringkasan kemajuan, bintang dan penguasaan setiap dunia.</p></div></div>{loading?<div className="state">Memuat prestasi…</div>:<><div className="rankingBoard"><h2>🏅 Ranking Keluarga</h2>{rows.map((p,i)=><div className="rankRow" key={p.id}><b>{i+1}</b><span className="rankAvatar">{avatarIcon(p.avatar)}</span><div><strong>{p.name}</strong><small>{p.mastered}/{p.possible} level dikuasai</small></div><em>{p.totalStars} 🌟</em></div>)}</div><div className="progressKids">{rows.map(p=><article className="progressKid" key={p.id}><div className="progressKidHead"><span>{avatarIcon(p.avatar)}</span><div><h2>{p.name}</h2><p>{p.age} tahun • {p.totalStars} bintang</p></div></div><div className="progressWorldGrid">{p.worlds.map(w=><div className="progressWorld" key={w.game_key}><div><b>{worldMeta[w.game_key]?.world||w.name_ms}</b><span>{w.correct}/{w.total_levels} level</span></div><strong>{w.percent}%</strong><div className="miniStars">{[1,2,3].map(n=><span key={n} className={n<=w.stars?'earned':''}>🌟</span>)}</div></div>)}</div></article>)}</div></>}</section>;
}

function ParentDashboard({parent,games,onLogout}){
  const[profiles,setProfiles]=useState([]),[loading,setLoading]=useState(true),[selected,setSelected]=useState(null),[editor,setEditor]=useState(null),[world,setWorld]=useState(null),[playing,setPlaying]=useState(null),[gate,setGate]=useState(false),[progressTick,setProgressTick]=useState(0),[worldResult,setWorldResult]=useState(null),[runStats,setRunStats]=useState({correct:0,answered:0,startLevel:1}),[soundOn,setSoundOn]=useState(()=>localStorage.getItem('kiddo_sound')!=='off'),[parentView,setParentView]=useState(''),[gateMode,setGateMode]=useState('edit');
  async function load(){setLoading(true);try{const d=await api(`/api/child-profiles?parent_id=${parent.parent_id||parent.id}`);setProfiles(d.profiles||[]);if(selected){const fresh=(d.profiles||[]).find(p=>p.id===selected.id);setSelected(fresh||null)}}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  const atProfileChooser=!selected&&!world&&!playing&&!worldResult&&!parentView;
  function toggleSound(){setSoundOn(v=>{const next=!v;localStorage.setItem('kiddo_sound',next?'on':'off');return next})}
  function startRun(level){setRunStats({correct:0,answered:0,startLevel:level});setWorldResult(null);setPlaying(level)}
  async async function handleComplete(ok,next,isLast){
    const updated={...runStats,correct:runStats.correct+(ok?1:0),answered:runStats.answered+1};
    setRunStats(updated);setProgressTick(x=>x+1);
    if(isLast){
      let mastered=updated.correct;
      try{const perf=await api(`/api/performance?child_id=${selected.id}&game_key=${world.game_key}`);mastered=Number(perf.correct_levels||0)}catch{}
      const stars=calcStars(mastered,world.total_levels);
      setPlaying(null);setWorldResult({...updated,correct:mastered,total:world.total_levels,stars});
      api('/api/progress',{method:'POST',body:JSON.stringify({child_id:selected.id,game_key:world.game_key,level_reached:world.total_levels,stars})}).catch(()=>{});
    }else setPlaying(next);
  }
  return <div className="dashboardShell"><header className="dashHeader"><button className="brand" onClick={()=>{setPlaying(null);setWorldResult(null);setWorld(null);setSelected(null);setParentView('')}}><span>🎈</span><b>Kiddo Adventures</b></button><div className="dashActions"><span>Hai, {parent.name||'Ibu Bapa'} 👋</span>{atProfileChooser&&<button className="ghost mini logoutBtn" onClick={onLogout}>Log keluar</button>}</div></header>
    <main className="dashboardMain">{parentView==='progress'?<ParentProgressPage profiles={profiles} games={games} onBack={()=>setParentView('')}/>:playing&&world&&selected?<GameScreen key={`${world.id||world.game_key}-${playing}`} game={world} child={selected} level={playing} onBack={()=>setPlaying(null)} onComplete={handleComplete} soundOn={soundOn} onToggleSound={toggleSound}/>:worldResult&&world&&selected?<WorldResult game={world} child={selected} stats={worldResult} soundOn={soundOn} onToggleSound={toggleSound} onMap={()=>{setWorldResult(null);setPlaying(null)}} onWorlds={()=>{setWorldResult(null);setPlaying(null);setWorld(null)}}/>:world&&selected?<LevelPage game={world} child={selected} refreshKey={progressTick} onBack={()=>{setWorldResult(null);setWorld(null)}} onPlay={startRun}/>:!selected?<section className="profileStage"><div className="profileHeading"><span className="eyebrow">RUANG KELUARGA</span><h1>Siapa nak main?</h1><p>Pilih profil anak. Setiap anak ada progress dan adventure sendiri.</p><button className="parentProgressBtn" onClick={()=>{setGateMode('progress');setGate(true)}}>📊 Prestasi Anak</button></div>{loading?<div className="state">Memuat profil…</div>:<div className="profileGrid">{profiles.map(p=><div className="profileTile" key={p.id}><button className="profilePick" onClick={()=>setSelected(p)}><span>{avatarIcon(p.avatar)}</span><b>{p.name}</b><small>{p.age} tahun</small></button></div>)}{profiles.length<5&&<button className="profileAdd" onClick={()=>setEditor('new')}><span>＋</span><b>Tambah Anak</b><small>Maksimum 5 profil</small></button>}</div>}</section>:<><section className="kidHero"><div className="kidHeroIdentity"><div className="kidBigAvatar">{avatarIcon(selected.avatar)}</div><div><span className="eyebrow">PROFIL AKTIF</span><h1>Jom main, {selected.name}!</h1><p>{selected.age} tahun • Pilih dunia untuk sambung adventure.</p></div></div><div className="kidHeroActions"><button className="ghost parentControl" onClick={()=>{setGateMode('edit');setGate(true)}}>🔐 Urus Profil</button><button className="ghost" onClick={()=>setSelected(null)}>Tukar Anak</button></div></section><section className="dashWorlds"><div className="dashSectionTitle"><div><span className="eyebrow">PILIH DUNIA</span><h2>Adventure {selected.name}</h2></div><span className="statusPill">Progress disimpan automatik</span></div><div className="worldGrid dashGrid">{games.map((g,i)=>{const m=worldMeta[g.game_key]||{};return <button className={`worldCard ${m.tone}`} key={g.id} onClick={()=>{setWorldResult(null);setWorld(g)}}><span className="worldNo">0{i+1}</span><div className="worldEmoji">{m.icon||'🎮'}</div><span className="age">UMUR {g.min_age}–{g.max_age}</span><h3>{m.world||g.name_ms}</h3><p>{m.tag||g.name_en}</p><div className="worldFoot"><span>{g.total_levels} mission</span><b>▶ Main</b></div></button>})}</div></section></>}</main>
    {gate&&<ParentGate parent={parent} onClose={()=>setGate(false)} onVerified={()=>{setGate(false);if(gateMode==='progress')setParentView('progress');else setEditor(selected)}}/>}{editor&&<ProfileEditor parent={parent} profile={editor==='new'?null:editor} onClose={()=>setEditor(null)} onSaved={load}/>}</div>;
}

function AgentModal({onClose}){const[form,setForm]=useState({name:'',email:'',phone:'',bank_name:'',bank_account:''}),[msg,setMsg]=useState(''),[done,setDone]=useState(null);async function submit(e){e.preventDefault();setMsg('');try{setDone(await api('/api/agents',{method:'POST',body:JSON.stringify(form)}))}catch(err){setMsg(err.message)}}return <Modal title="Jadi Agent Kiddo" onClose={onClose}>{done?<div className="success"><h3>Berjaya 🎉</h3><div className="codeBox">{done.agent_code}</div><p>Simpan kod ini untuk semak dashboard agent.</p></div>:<form className="form" onSubmit={submit}><input required placeholder="Nama" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Telefon" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><input placeholder="Bank" value={form.bank_name} onChange={e=>setForm({...form,bank_name:e.target.value})}/><input placeholder="No. akaun bank" value={form.bank_account} onChange={e=>setForm({...form,bank_account:e.target.value})}/>{msg&&<div className="alert">{msg}</div>}<button className="primary">Daftar Agent</button></form>}</Modal>}

function Landing({onLogin,onAgent,onBuy}){return <main><header><button className="brand"><span>🎈</span><b>Kiddo Adventures</b></button><nav><button onClick={onAgent}>Jadi Agent</button><button className="parent" onClick={onLogin}>Log Masuk</button></nav></header><section className="hero"><div className="heroCopy"><span className="pill">BELAJAR • MAIN • TEROKA</span><h1>Bukan sekadar level.<br/><em>Satu dunia untuk diteroka.</em></h1><p>Kiddo Adventures menukar pembelajaran awal menjadi pengembaraan dengan mission, bintang, treasure dan cabaran yang semakin berkembang.</p><div className="heroActions"><button className="cta" onClick={onBuy}>Buka Semua Dunia • RM{PRICE}</button></div><div className="trust"><span>✓ Sekali bayar</span><span>✓ Lifetime access</span><span>✓ Umur 3–7</span></div></div><div className="storybook"><div className="planet">🌈</div><div className="rocket">🚀</div><div className="cloud">☁️</div><div className="island">🏝️</div></div></section></main>}

function App(){const[parent,setParent]=useState(()=>{try{return JSON.parse(localStorage.getItem('kiddo_parent'))}catch{return null}}),[games,setGames]=useState([]),[modal,setModal]=useState(null),[refCode,setRefCode]=useState('');useEffect(()=>{const ref=new URLSearchParams(location.search).get('ref');if(ref){localStorage.setItem('kiddo_ref',ref.toUpperCase());setRefCode(ref.toUpperCase())}api('/api/games').then(d=>setGames(d.games||[])).catch(()=>{})},[]);function loginDone(d){setParent(d);setModal(null)}function logout(){localStorage.removeItem('kiddo_parent');setParent(null);setModal(null)}if(parent)return <ParentDashboard parent={parent} games={games} onLogout={logout}/>;return <><Landing onLogin={()=>setModal('auth')} onAgent={()=>setModal('agent')} onBuy={()=>setModal('auth')}/>{modal==='auth'&&<AuthModal onClose={()=>setModal(null)} onLogin={loginDone} refCode={refCode}/>} {modal==='agent'&&<AgentModal onClose={()=>setModal(null)}/>}</>}

createRoot(document.getElementById('root')).render(<App/>);