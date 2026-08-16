(()=>{
  let ctx=null,unlocked=false,lastSignature='';
  function enabled(){return localStorage.getItem('kiddo_sound')!=='off'}
  async function unlock(){
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
      ctx=ctx||new Ctx();if(ctx.state==='suspended')await ctx.resume();unlocked=ctx.state==='running';
    }catch{}
  }
  function tone(freq,start,duration,type='sine',gainValue=.22){
    if(!ctx||ctx.state!=='running')return;
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,ctx.currentTime+start);
    g.gain.setValueAtTime(.0001,ctx.currentTime+start);g.gain.exponentialRampToValueAtTime(gainValue,ctx.currentTime+start+.015);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+start+duration);
    o.connect(g);g.connect(ctx.destination);o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+duration+.02);
  }
  async function play(kind){
    if(!enabled())return;await unlock();if(!unlocked)return;
    if(kind==='correct'){tone(523,0,.16);tone(659,.1,.18);tone(784,.21,.25);tone(1047,.34,.28)}
    else if(kind==='wrong'){tone(330,0,.18,'triangle',.18);tone(247,.16,.28,'triangle',.2)}
    else{tone(523,0,.17);tone(659,.1,.17);tone(784,.2,.18);tone(1047,.33,.35)}
  }
  document.addEventListener('pointerdown',unlock,{passive:true});
  const obs=new MutationObserver(()=>{
    const overlay=document.querySelector('.resultOverlay');
    if(overlay){const kind=overlay.classList.contains('resultCorrect')?'correct':'wrong';const sig=kind+':'+(document.querySelector('.gameBar b')?.textContent||'');if(sig!==lastSignature){lastSignature=sig;play(kind)}}
    const finish=document.querySelector('.worldResultCard');if(finish){const sig='finish:'+finish.textContent.slice(0,30);if(sig!==lastSignature){lastSignature=sig;play('finish')}}
    document.querySelectorAll('.starScore span').forEach((el,i)=>{if(el.textContent==='★')el.textContent='🌟'});
  });
  obs.observe(document.documentElement,{subtree:true,childList:true});
})();
