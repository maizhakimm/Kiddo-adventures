import React,{useEffect,useState} from 'react';
import{createRoot}from'react-dom/client';
import'./styles.css';

const API='https://kiddo-adventures.maizhakim-m.workers.dev';
const icons={huruf:'🔤',nombor:'🔢',warna_bentuk:'🎨',padan_gambar:'🧩',jigsaw:'🧸',kira_asas:'➕'};
const avatars=['🐼','🐱','🐻','🐰','🦊','🐘'];

async function api(path,options={}){
 const r=await fetch(API+path,{headers:{'Content-Type':'application/json'},...options});
 const d=await r.json().catch(()=>({}));
 if(!r.ok) throw new Error(d.error||'Ralat sambungan');
 return d;
}

function ParentModal({parent,onClose}){
 const [profiles,setProfiles]=useState([]);
 const [form,setForm]=useState({name:'',age:'',avatar:'panda'});
 const [msg,setMsg]=useState('');
 async function load(){const d=await api(`/api/child-profiles?parent_id=${parent.parent_id||parent.id}`);setProfiles(d.profiles||[])}
 useEffect(()=>{load()},[]);
 async function add(e){e.preventDefault();try{await api('/api/child-profiles',{method:'POST',body:JSON.stringify({parent_id:parent.parent_id||parent.id,name:form.name,age:Number(form.age),avatar:form.avatar})});setForm({name:'',age:'',avatar:'panda'});load()}catch(e){setMsg(e.message)}}
 return <div className="overlay"><div className="modal"><button onClick={onClose}>×</button><h2>Hai, {parent.name||'Ibu Bapa'} 👋</h2><h3>Profil Anak</h3><div className="kids">{profiles.map(p=><div className="kid" key={p.id}><span>{p.avatar==='panda'?'🐼':'🧒'}</span><b>{p.name}</b><small>{p.age} tahun</small></div>)}</div><form onSubmit={add} className="form"><h3>Tambah Anak</h3><input required placeholder="Nama anak" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><select required value={form.age} onChange={e=>setForm({...form,age:e.target.value})}><option value="">Pilih umur</option>{[3,4,5,6,7].map(x=><option key={x} value={x}>{x} tahun</option>)}</select><div className="avatars">{avatars.map((a,i)=><button type="button" key={a} onClick={()=>setForm({...form,avatar:['panda','kucing','beruang','arnab','musang','gajah'][i]})}>{a}</button>)}</div>{msg&&<p>{msg}</p>}<button className="primary">Tambah Profil</button></form></div></div>
}

function App(){
 const[games,setGames]=useState([]);const[parent,setParent]=useState(()=>JSON.parse(localStorage.getItem('kiddo_parent')||'null'));const[show,setShow]=useState(false);
 useEffect(()=>{api('/api/games').then(d=>setGames(d.games||[])).catch(()=>{})},[]);
 return <main><header><div className="brand">🎈 <b>Kiddo Adventures</b></div><button className="parent" onClick={()=>parent&&setShow(true)}>Ruang Ibu Bapa</button></header><section className="hero"><h1>Bukan sekadar level.<br/><em>Satu dunia untuk diteroka.</em></h1><p>Belajar sambil bermain dengan adventure.</p></section><section className="games">{games.map(g=><article className="card" key={g.id}>{icons[g.game_key]} {g.name_ms}</article>)}</section>{show&&<ParentModal parent={parent} onClose={()=>setShow(false)}/>}</main>
}
createRoot(document.getElementById('root')).render(<App/>);