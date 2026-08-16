from pathlib import Path

main_path=Path('web/src/main.jsx')
worker_path=Path('worker/src/index.js')
main=main_path.read_text()
worker=worker_path.read_text()

# Friendlier adventure-world names.
repls={
"world:'Pulau Huruf'":"world:'Kota Abjad'",
"world:'Lembah Nombor'":"world:'Kota Nombor'",
"world:'Hutan Warna'":"world:'Hutan Pelangi'",
"world:'Teluk Padan'":"world:'Teluk Ingatan'",
"world:'Pulau Puzzle'":"world:'Pulau Teka-Teki'",
"world:'Gunung Kira'":"world:'Gunung Matematik'",
}
for a,b in repls.items(): main=main.replace(a,b)

# Score against the full world, not only the current session.
main=main.replace("function calcStars(correct,answered){\n  const ratio=answered?correct/answered:0;\n  if(ratio>=.9)return 3;\n  if(ratio>=.65)return 2;\n  return 1;\n}","function calcStars(correct,totalLevels){\n  const ratio=totalLevels?correct/totalLevels:0;\n  if(ratio>=.8)return 3;\n  if(ratio>=.5)return 2;\n  return 1;\n}")

# Record mastery per level before saving ordinary progress.
old="""    try{await api('/api/progress',{method:'POST',body:JSON.stringify({child_id:child.id,game_key:game.game_key,level_reached:isLast?game.total_levels:nextLevel})})}catch{}finally{setBusy(false)}"""
new="""    try{\n      await api('/api/performance',{method:'POST',body:JSON.stringify({child_id:child.id,game_key:game.game_key,level,correct:ok})});\n      await api('/api/progress',{method:'POST',body:JSON.stringify({child_id:child.id,game_key:game.game_key,level_reached:isLast?game.total_levels:nextLevel})});\n    }catch{}finally{setBusy(false)}"""
main=main.replace(old,new)

# Result screen always uses total levels as denominator.
main=main.replace("const stars=calcStars(stats.correct,stats.answered);\n  const percent=stats.answered?Math.round(stats.correct/stats.answered*100):0;","const total=game.total_levels||stats.total||1;\n  const stars=calcStars(stats.correct,total);\n  const percent=Math.round((stats.correct||0)/total*100);")
main=main.replace("<div className=\"scoreStats\"><div><b>{stats.correct}/{stats.answered}</b><span>Jawapan betul</span></div>","<div className=\"scoreStats\"><div><b>{stats.correct}/{total}</b><span>Level dikuasai</span></div>")

# Give the final node a trophy identity.
main=main.replace("<div className={`levelNodeWrap ${open?'open':'locked'}`} key={n}><button className=\"levelNode\" disabled={!open} onClick={()=>open&&onPlay(n)}><span>{open?'▶':'🔒'}</span><b>{n}</b></button></div>","<div className={`levelNodeWrap ${n===missions.length?'finalLevel ':''}${open?'open':'locked'}`} key={n}><button className=\"levelNode\" disabled={!open} onClick={()=>open&&onPlay(n)}><span>{n===missions.length?'🏆':open?'▶':'🔒'}</span><b>{n}</b></button></div>")

# Parent performance page component.
marker="function ParentDashboard({parent,games,onLogout}){"
component=r'''function ParentProgressPage({profiles,games,onBack}){
  const[rows,setRows]=useState([]),[loading,setLoading]=useState(true);
  useEffect(()=>{let alive=true;(async()=>{setLoading(true);const data=await Promise.all(profiles.map(async p=>{const perf=await api(`/api/performance?child_id=${p.id}`).catch(()=>({performance:[]}));const byKey=Object.fromEntries((perf.performance||[]).map(x=>[x.game_key,x]));const worlds=games.map(g=>{const r=byKey[g.game_key]||{};const correct=Number(r.correct_levels||0),attempted=Number(r.attempted_levels||0),stars=correct?calcStars(correct,g.total_levels):0;return{...g,correct,attempted,stars,percent:Math.round(correct/(g.total_levels||1)*100)}});return{...p,worlds,totalStars:worlds.reduce((s,w)=>s+w.stars,0),mastered:worlds.reduce((s,w)=>s+w.correct,0),possible:worlds.reduce((s,w)=>s+(w.total_levels||0),0)}}));if(alive){data.sort((a,b)=>b.totalStars-a.totalStars||b.mastered-a.mastered);setRows(data);setLoading(false)}})();return()=>{alive=false}},[profiles,games]);
  return <section className="parentProgressPage"><div className="parentProgressHead"><button className="levelBack" onClick={onBack}>← Kembali</button><div><span className="eyebrow">KAWASAN IBU BAPA</span><h1>Prestasi Anak</h1><p>Ringkasan kemajuan, bintang dan penguasaan setiap dunia.</p></div></div>{loading?<div className="state">Memuat prestasi…</div>:<><div className="rankingBoard"><h2>🏅 Ranking Keluarga</h2>{rows.map((p,i)=><div className="rankRow" key={p.id}><b>{i+1}</b><span className="rankAvatar">{avatarIcon(p.avatar)}</span><div><strong>{p.name}</strong><small>{p.mastered}/{p.possible} level dikuasai</small></div><em>{p.totalStars} 🌟</em></div>)}</div><div className="progressKids">{rows.map(p=><article className="progressKid" key={p.id}><div className="progressKidHead"><span>{avatarIcon(p.avatar)}</span><div><h2>{p.name}</h2><p>{p.age} tahun • {p.totalStars} bintang</p></div></div><div className="progressWorldGrid">{p.worlds.map(w=><div className="progressWorld" key={w.game_key}><div><b>{worldMeta[w.game_key]?.world||w.name_ms}</b><span>{w.correct}/{w.total_levels} level</span></div><strong>{w.percent}%</strong><div className="miniStars">{[1,2,3].map(n=><span key={n} className={n<=w.stars?'earned':''}>🌟</span>)}</div></div>)}</div></article>)}</div></>}</section>;
}

'''
if marker in main and 'function ParentProgressPage' not in main:
    main=main.replace(marker,component+marker)

# ParentDashboard state + parent-gated progress page.
main=main.replace("[soundOn,setSoundOn]=useState(()=>localStorage.getItem('kiddo_sound')!=='off');","[soundOn,setSoundOn]=useState(()=>localStorage.getItem('kiddo_sound')!=='off'),[parentView,setParentView]=useState(''),[gateMode,setGateMode]=useState('edit');")
main=main.replace("const atProfileChooser=!selected&&!world&&!playing&&!worldResult;","const atProfileChooser=!selected&&!world&&!playing&&!worldResult&&!parentView;")
main=main.replace("function handleComplete(ok,next,isLast){","async function handleComplete(ok,next,isLast){")
old_last="""      const stars=calcStars(updated.correct,updated.answered);
      setPlaying(null);setWorldResult({...updated,stars});
      api('/api/progress',{method:'POST',body:JSON.stringify({child_id:selected.id,game_key:world.game_key,level_reached:world.total_levels,stars})}).catch(()=>{});"""
new_last="""      let mastered=updated.correct;
      try{const perf=await api(`/api/performance?child_id=${selected.id}&game_key=${world.game_key}`);mastered=Number(perf.correct_levels||0)}catch{}
      const stars=calcStars(mastered,world.total_levels);
      setPlaying(null);setWorldResult({...updated,correct:mastered,total:world.total_levels,stars});
      api('/api/progress',{method:'POST',body:JSON.stringify({child_id:selected.id,game_key:world.game_key,level_reached:world.total_levels,stars})}).catch(()=>{});"""
main=main.replace(old_last,new_last)
main=main.replace("onClick={()=>{setPlaying(null);setWorldResult(null);setWorld(null);setSelected(null)}}","onClick={()=>{setPlaying(null);setWorldResult(null);setWorld(null);setSelected(null);setParentView('')}}")
main=main.replace("<main className=\"dashboardMain\">{playing&&world&&selected?","<main className=\"dashboardMain\">{parentView==='progress'?<ParentProgressPage profiles={profiles} games={games} onBack={()=>setParentView('')}/>:playing&&world&&selected?")
main=main.replace("<span className=\"eyebrow\">RUANG KELUARGA</span><h1>Siapa nak main?</h1><p>Pilih profil anak. Setiap anak ada progress dan adventure sendiri.</p></div>","<span className=\"eyebrow\">RUANG KELUARGA</span><h1>Siapa nak main?</h1><p>Pilih profil anak. Setiap anak ada progress dan adventure sendiri.</p><button className=\"parentProgressBtn\" onClick={()=>{setGateMode('progress');setGate(true)}}>📊 Prestasi Anak</button></div>")
main=main.replace("{gate&&<ParentGate parent={parent} onClose={()=>setGate(false)} onVerified={()=>{setGate(false);setEditor(selected)}}/>","{gate&&<ParentGate parent={parent} onClose={()=>setGate(false)} onVerified={()=>{setGate(false);if(gateMode==='progress')setParentView('progress');else setEditor(selected)}}/>")
main=main.replace("onClick={()=>setGate(true)}>🔐 Urus Profil</button>","onClick={()=>{setGateMode('edit');setGate(true)}}>🔐 Urus Profil</button>")

# Backend: persistent per-level mastery/attempt tracking.
insert_before='      if (path === "/api/agents" && request.method === "POST") {'
perf_code=r'''      if (path === "/api/performance" && request.method === "POST") {
        const { child_id, game_key, level, correct } = await request.json();
        if (!child_id || !game_key || !level) return json({ error: "child_id, game_key, level diperlukan" }, 400);
        await db.prepare("CREATE TABLE IF NOT EXISTS level_results (id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL, game_key TEXT NOT NULL, level INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, correct INTEGER NOT NULL DEFAULT 0, last_correct INTEGER NOT NULL DEFAULT 0, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(child_id, game_key, level))").run();
        await db.prepare("INSERT INTO level_results (child_id, game_key, level, attempts, correct, last_correct) VALUES (?, ?, ?, 1, ?, ?) ON CONFLICT(child_id, game_key, level) DO UPDATE SET attempts = attempts + 1, correct = MAX(correct, excluded.correct), last_correct = excluded.last_correct, updated_at = CURRENT_TIMESTAMP")
          .bind(child_id, game_key, Number(level), correct ? 1 : 0, correct ? 1 : 0).run();
        return json({ saved: true });
      }

      if (path === "/api/performance" && request.method === "GET") {
        const child_id = url.searchParams.get("child_id");
        const game_key = url.searchParams.get("game_key");
        if (!child_id) return json({ error: "child_id diperlukan" }, 400);
        await db.prepare("CREATE TABLE IF NOT EXISTS level_results (id INTEGER PRIMARY KEY AUTOINCREMENT, child_id INTEGER NOT NULL, game_key TEXT NOT NULL, level INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, correct INTEGER NOT NULL DEFAULT 0, last_correct INTEGER NOT NULL DEFAULT 0, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(child_id, game_key, level))").run();
        if (game_key) {
          const row = await db.prepare("SELECT game_key, COUNT(*) attempted_levels, COALESCE(SUM(correct),0) correct_levels, COALESCE(SUM(attempts),0) total_attempts FROM level_results WHERE child_id = ? AND game_key = ? GROUP BY game_key").bind(child_id, game_key).first();
          return json(row || { game_key, attempted_levels: 0, correct_levels: 0, total_attempts: 0 });
        }
        const { results } = await db.prepare("SELECT game_key, COUNT(*) attempted_levels, COALESCE(SUM(correct),0) correct_levels, COALESCE(SUM(attempts),0) total_attempts FROM level_results WHERE child_id = ? GROUP BY game_key").bind(child_id).all();
        return json({ performance: results });
      }

'''
if insert_before in worker and '/api/performance' not in worker:
    worker=worker.replace(insert_before,perf_code+insert_before)

main_path.write_text(main)
worker_path.write_text(worker)
