from pathlib import Path

main = Path('web/src/main.jsx')
s = main.read_text()

old_level = '''function LevelPage({game,child,onBack,onPlay,refreshKey}){const meta=worldMeta[game.game_key]||{};const missions=Array.from({length:game.total_levels||1},(_,i)=>i+1);const[reached,setReached]=useState(1);useEffect(()=>{api(`/api/progress?child_id=${child.id}`).then(d=>{const row=(d.progress||[]).find(p=>p.game_key===game.game_key);setReached(Math.max(1,row?.level_reached||1))}).catch(()=>setReached(1))},[child.id,game.game_key,refreshKey]);return <section className={`levelPage level-${meta.tone||'sky'}`}><button className="levelBack" onClick={onBack}>← Dunia</button><h1>{meta.world||game.name_ms} • {child.name}</h1><div className="levelTrack">{missions.map(n=>{const open=n<=reached;return <button className="levelNode" key={n} disabled={!open} onClick={()=>open&&onPlay(n)}><b>{n}</b></button>})}</div></section>}'''

new_level = '''function LevelPage({game,child,onBack,onPlay,refreshKey}){const meta=worldMeta[game.game_key]||{};const missions=Array.from({length:game.total_levels||1},(_,i)=>i+1);const[reached,setReached]=useState(1),[attempted,setAttempted]=useState(new Set()),[correct,setCorrect]=useState(new Set());useEffect(()=>{let alive=true;Promise.all([api(`/api/progress?child_id=${child.id}`),api(`/api/performance?child_id=${child.id}&game_key=${game.game_key}&detail=1`).catch(()=>({levels:[]}))]).then(([d,p])=>{if(!alive)return;const row=(d.progress||[]).find(x=>x.game_key===game.game_key);setReached(Math.max(1,row?.level_reached||1));const levels=p.levels||[];setAttempted(new Set(levels.map(x=>Number(x.level))));setCorrect(new Set(levels.filter(x=>Number(x.correct)===1).map(x=>Number(x.level))))}).catch(()=>{});return()=>{alive=false}},[child.id,game.game_key,refreshKey]);return <section className={`levelPage level-${meta.tone||'sky'}`}><button className="levelBack" onClick={onBack}>← Dunia</button><h1>{meta.world||game.name_ms} • {child.name}</h1><div className="levelLegend"><span><i className="legendDone"/> Selesai</span><span><i className="legendRetry"/> Cuba lagi</span><span><i className="legendLocked"/> Belum buka</span></div><div className="levelTrack">{missions.map(n=>{const open=n<=reached;const done=correct.has(n);const tried=attempted.has(n)&&!done;const cls=`levelNode ${done?'levelDone':tried?'levelRetry':open?'levelOpen':'levelLocked'} ${n===game.total_levels?'levelFinale':''}`;return <button className={cls} key={n} disabled={!open} onClick={()=>open&&onPlay(n)}><b>{n===game.total_levels?'🏆':n}</b>{done&&<small>✓</small>}{tried&&<small>↻</small>}</button>})}</div></section>}'''

if old_level not in s:
    raise SystemExit('LevelPage source pattern not found')
s = s.replace(old_level, new_level)

old_selected = '''<section className="dashWorlds"><h1>Jom main, {selected.name}!</h1><div className="worldGrid dashGrid">'''
new_selected = '''<section className="dashWorlds"><div className="activeProfileBar"><div className="activeProfileIdentity"><span>{avatarIcon(selected.avatar)}</span><div><small>PROFIL AKTIF</small><h1>Jom main, {selected.name}!</h1><p>{selected.age} tahun • Pilih dunia untuk sambung adventure.</p></div></div><div className="activeProfileActions"><button onClick={()=>{setGateMode('edit');setGate(true)}}>✏️ Edit Profil</button><button onClick={()=>{setPlaying(null);setWorld(null);setSelected(null)}}>Tukar Profil</button></div></div><div className="worldGrid dashGrid">'''
if old_selected not in s:
    raise SystemExit('Selected profile source pattern not found')
s = s.replace(old_selected, new_selected)

# Keep logout strictly on profile chooser / parent home.
s = s.replace("{!selected&&!world&&!playing&&<button className=\"ghost\" onClick={onLogout}>Log keluar</button>}", "{!selected&&!world&&!playing&&!parentView&&<button className=\"ghost\" onClick={onLogout}>Log keluar</button>}")

main.write_text(s)

css = Path('web/src/styles.css')
c = css.read_text()
addon = r'''

/* Restored active-profile controls + clear level state */
.activeProfileBar{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px;margin-bottom:22px;border-radius:28px;background:linear-gradient(135deg,#fff2df,#eee8ff 55%,#e6f7ff);border:1px solid rgba(70,58,105,.08)}
.activeProfileIdentity{display:flex;align-items:center;gap:14px}.activeProfileIdentity>span{display:grid;place-items:center;width:72px;height:72px;border-radius:22px;background:#fff;font-size:46px}.activeProfileIdentity small{font-weight:900;letter-spacing:.16em;color:#d87955}.activeProfileIdentity h1{margin:2px 0 2px}.activeProfileIdentity p{margin:0;color:#77748b}.activeProfileActions{display:flex;gap:10px}.activeProfileActions button{border:1px solid #dcd5e8;background:#fffaf2;border-radius:18px;padding:13px 18px;font-weight:800;color:#3d385a}
.levelLegend{display:flex;gap:14px;flex-wrap:wrap;margin:0 0 16px;font-size:13px;font-weight:800;color:#77748b}.levelLegend span{display:flex;align-items:center;gap:6px}.levelLegend i{width:12px;height:12px;border-radius:4px;display:inline-block}.legendDone{background:#65bf86}.legendRetry{background:#f5b85d}.legendLocked{background:#d9d6df}
.levelNode.levelDone{background:linear-gradient(180deg,#78d49a,#55b879)!important;color:white!important;box-shadow:0 7px 0 #3f9360!important}.levelNode.levelRetry{background:linear-gradient(180deg,#ffd477,#f5b85d)!important;color:#5a4319!important;box-shadow:0 7px 0 #d99b3e!important}.levelNode.levelOpen{background:#fff!important;color:#4a4566!important;border:2px solid #e5dfec!important}.levelNode.levelLocked{background:#dcd9e2!important;color:#777383!important}.levelNode small{display:block;font-size:12px;margin-top:2px}.levelNode.levelFinale{border-radius:50% 50% 42% 42%!important;background:linear-gradient(180deg,#ffd866,#efa933)!important;color:#624510!important;box-shadow:0 7px 0 #c98522!important}.levelNode.levelFinale b{font-size:22px}
@media(max-width:700px){.activeProfileBar{display:block}.activeProfileActions{margin-top:14px;display:grid;grid-template-columns:1fr 1fr}.activeProfileIdentity>span{width:58px;height:58px;font-size:38px}.activeProfileIdentity h1{font-size:28px}}
'''
if 'Restored active-profile controls + clear level state' not in c:
    css.write_text(c + addon)
