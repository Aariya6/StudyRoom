const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const rooms = {
  raven: {
    index:'I', kicker:'THE RAVEN', title:'Grand Library', sub:'A PLACE FOR DEEP READING',
    line:'The shelves remember everything.', description:'A cathedral of dark wood, old leather and firelight. Come here when you want the world to become very small.',
    detail:'Firelight & old books', detailText:'Dust drifts through the arches while distant rain moves against the stained glass.',
    image:'./assets/room-library.png', position:'54% center', tint:'library', rain:true, candle:true, pen:false, pages:true, particles:'dust'
  },
  nocturne: {
    index:'II', kicker:'NOCTURNE', title:'Moonlit Desk', sub:'A PLACE FOR QUIET WORK',
    line:'Write until the room goes quiet.', description:'A private desk beneath the window. Rain on glass, a green lamp, ink, and enough darkness to make concentration feel ceremonial.',
    detail:'Rain on glass', detailText:'The lamp breathes. A fountain pen moves once in a while, as if someone invisible is still writing.',
    image:'./assets/room-desk.png', position:'center center', tint:'nocturne', rain:true, candle:true, pen:true, pages:true, particles:'dust'
  },
  alchemy: {
    index:'III', kicker:'THE ALCHEMIST', title:'Curiosity Room', sub:'A PLACE FOR STRANGE IDEAS',
    line:'Make the unknown tangible.', description:'An intimate study of instruments, books and unfinished thoughts. Less classroom. More private laboratory.',
    detail:'Ink, brass & experiments', detailText:'A candle gutters beside the desk while faint smoke gathers near the old bottles and sketches.',
    image:'./assets/room-alchemist.png', position:'center center', tint:'alchemy', rain:false, candle:true, pen:true, pages:true, particles:'motes'
  },
  conservatory: {
    index:'IV', kicker:'THE CONSERVATORY', title:'Rain & Poetry', sub:'A PLACE FOR LANGUAGE & REFLECTION',
    line:'Let the weather finish the sentence.', description:'A stone library with enormous windows, low firelight and rain darkening every surface outside.',
    detail:'Stormlight & poetry', detailText:'Water slides down the glass. Candle flames lean with the draft. A loose page turns itself.',
    image:'./assets/room-conservatory.png', position:'center center', tint:'conservatory', rain:true, candle:true, pen:false, pages:true, particles:'rain'
  }
};

const screens = $$('.screen');
function show(id){ screens.forEach(s=>s.classList.toggle('active', s.id===id)); window.scrollTo({top:0, behavior:'instant'}); }
function setRoomData(key){
  const r=rooms[key];
  $('#roomKicker').textContent=r.kicker; $('#roomTitle').textContent=r.title; $('#roomIndex').textContent=r.index;
  $('#roomSub').textContent=r.sub; $('#roomLine').textContent=r.line; $('#roomDescription').textContent=r.description;
  $('#roomDetailTitle').textContent=r.detail; $('#roomDetailText').textContent=r.detailText;
  const bg=$('#roomBg'); bg.style.backgroundImage=`url("${r.image}")`; bg.style.backgroundPosition=r.position;
  const room=$('#studyRoom'); room.dataset.room=key; room.dataset.tint=r.tint;
  room.classList.toggle('has-pen', !!r.pen); room.classList.toggle('has-pages', !!r.pages); room.classList.toggle('has-candle', !!r.candle);
  $('#rainField').classList.toggle('on', !!r.rain); $('#rainBtn').classList.toggle('active', !!r.rain);
  $('#dustField').dataset.kind=r.particles;
  $('#status').textContent=`${r.title} is waiting.`;
  if(r.tint==='nocturne') $('.ambient-candle').style.setProperty('--candle-x','72%');
  else if(r.tint==='alchemy') $('.ambient-candle').style.setProperty('--candle-x','23%');
  else $('.ambient-candle').style.setProperty('--candle-x','78%');
}

$('#enterBtn').addEventListener('click',()=>show('choose'));
$('#chooseBack').addEventListener('click',()=>show('landing'));
$$('.room-card').forEach(card=>card.addEventListener('click',()=>enterRoom(card.dataset.room)));

async function enterRoom(key){
  setRoomData(key); show('study');
  requestAnimationFrame(()=>$('#studyRoom').classList.add('entered'));
  // Fullscreen is requested directly from the room-card click gesture.
  try{ if(!document.fullscreenElement) await $('#study').requestFullscreen(); }
  catch(e){ $('#status').textContent='The room is open. Use FULL to lock it to the screen.'; }
  startAmbience();
}

async function leaveRoom(){
  stopSound();
  if(document.fullscreenElement){ try{await document.exitFullscreen();}catch(e){} }
  $('#studyRoom').classList.remove('entered','focused'); show('choose');
}
$('#backBtn').addEventListener('click',leaveRoom);
$('#fullscreenBtn').addEventListener('click',async()=>{
  try{ if(!document.fullscreenElement) await $('#study').requestFullscreen(); else await document.exitFullscreen(); }
  catch(e){ $('#status').textContent='Fullscreen is unavailable in this browser.'; }
});
document.addEventListener('fullscreenchange',()=>{
  $('#studyRoom').classList.toggle('locked', !!document.fullscreenElement);
  if(document.fullscreenElement) $('#status').textContent='The room is sealed. Esc returns to the foyer.';
});

$('#rainBtn').addEventListener('click',()=>{
  const on=$('#rainField').classList.toggle('on'); $('#rainBtn').classList.toggle('active',on);
  $('#status').textContent=on?'Rain is moving across the glass.':'The windows have gone still.';
});
$('#focusBtn').addEventListener('click',()=>{
  const focused=$('#studyRoom').classList.toggle('focused');
  $('#status').textContent=focused?'The interface has disappeared.':'The room is listening again.';
});
$('#soundBtn').addEventListener('click',()=>{
  if(audioCtx){ stopSound(); $('#soundBtn').classList.remove('active'); $('#status').textContent='The room has fallen silent.'; }
  else { startSound(); $('#soundBtn').classList.add('active'); $('#status').textContent='Rain and candlelight are breathing with the room.'; }
});

let audioCtx=null, source=null, gain=null, crackleTimer=null;
function startSound(){
  if(audioCtx) return;
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate), data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*0.13;
  source=audioCtx.createBufferSource(); source.buffer=buffer; source.loop=true;
  const filter=audioCtx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=1500;
  gain=audioCtx.createGain(); gain.gain.value=.018; source.connect(filter).connect(gain).connect(audioCtx.destination); source.start();
  crackleTimer=setInterval(()=>{
    const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.frequency.value=700+Math.random()*1600;
    g.gain.setValueAtTime(.0001,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.008,audioCtx.currentTime+.008); g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.06);
    o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+.07);
  },1300);
}
function stopSound(){ if(audioCtx){clearInterval(crackleTimer); audioCtx.close(); audioCtx=null; source=null; gain=null;} }
function startAmbience(){
  // Let visual ambience begin immediately; audio remains user-controlled.
  $('#soundBtn').classList.remove('active');
}

// Atmospheric particles and rain are generated in the DOM so the project has no runtime asset dependency.
const rainField=$('#rainField');
for(let i=0;i<150;i++){ const d=document.createElement('i'); d.className='raindrop'; d.style.left=`${Math.random()*100}%`; d.style.animationDelay=`${-Math.random()*1.8}s`; d.style.animationDuration=`${.55+Math.random()*.65}s`; d.style.opacity=(.08+Math.random()*.25).toFixed(2); rainField.appendChild(d); }
const dust=$('#dustField');
for(let i=0;i<46;i++){ const p=document.createElement('i'); p.className='mote'; p.style.left=`${Math.random()*100}%`; p.style.top=`${50+Math.random()*55}%`; p.style.animationDelay=`${-Math.random()*14}s`; p.style.animationDuration=`${8+Math.random()*13}s`; dust.appendChild(p); }
const ambientParticles=$('#ambientParticles');
for(let i=0;i<26;i++){ const p=document.createElement('i'); p.style.left=`${Math.random()*100}%`; p.style.animationDelay=`${-Math.random()*15}s`; p.style.animationDuration=`${12+Math.random()*14}s`; ambientParticles.appendChild(p); }

// Candle wax slowly lowers while a tiny drip appears; the flame stays anchored to the wick.
const candle=$('.ambient-candle');
setInterval(()=>{
  if(!candle || !$('#study').classList.contains('active')) return;
  candle.classList.toggle('melt-pulse');
}, 9000);

// Editorial foyer calls-to-action return to the same four-door chooser.
$('#enterBtnBottom')?.addEventListener('click',()=>{
  show('choose');
  window.scrollTo({top:0,behavior:'instant'});
});
$('#enterBtnEnd')?.addEventListener('click',()=>{
  show('choose');
  window.scrollTo({top:0,behavior:'instant'});
});
