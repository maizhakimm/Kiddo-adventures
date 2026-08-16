from pathlib import Path

p=Path('web/src/main.jsx')
s=p.read_text()

# Repair a typo left by an earlier automated patch so production builds can proceed.
s=s.replace('async async function handleComplete(ok,next,isLast){','async function handleComplete(ok,next,isLast){')

helper=r'''function ChallengeExperience({challenge,choose,disabled}){
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

'''
marker='function GameScreen({game,child,level,onBack,onComplete,soundOn,onToggleSound}){'
if 'function ChallengeExperience(' not in s:
    s=s.replace(marker,helper+marker)

old='''    <div className="gameBoard">\n      <div className={`gameVisual ${challenge.visualType==='letter'?'bigLetter':''}`}>{challenge.visual}</div>\n      <h1>{challenge.prompt}</h1>\n      <div className="answerGrid">{challenge.options.map((o,i)=><button key={`${o}-${i}`} disabled={!!result} onClick={()=>choose(o)}>{o}</button>)}</div>\n    </div>'''
new='''    <div className="gameBoard"><ChallengeExperience challenge={challenge} choose={choose} disabled={!!result}/></div>'''
s=s.replace(old,new)

voice=r'''  useEffect(()=>{
    if(!soundOn||!challenge?.prompt||typeof window==='undefined'||!window.speechSynthesis)return;
    const t=setTimeout(()=>{try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(challenge.prompt);u.lang=challenge.language==='en'?'en-US':'ms-MY';u.rate=.88;u.pitch=1.08;window.speechSynthesis.speak(u)}catch{}},250);
    return()=>{clearTimeout(t);try{window.speechSynthesis.cancel()}catch{}};
  },[challenge,soundOn]);
'''
needle="  const isLast=level>=game.total_levels;\n"
if 'SpeechSynthesisUtterance(challenge.prompt)' not in s:
    s=s.replace(needle,voice+needle,1)

p.write_text(s)
