/* ============================================
   PROFESSIONAL CAR RACING GAME – Turbo Horizon
   2.5D pseudo-perspective highway | drift smoke
   nitro flames | rain/snow/fog | traffic AI
   motion blur | headlights | save system
   ============================================ */

export function createRacingGame(config = {}) {
  const {
    weather = 'clear', hasNitro = true, hasDrifting = true,
    hasTraffic = true, hasHeadlights = false, fog = false,
    difficulty = 'normal', isGtaStyle = false,
  } = config;

  const title = isGtaStyle ? 'Urban Drift: Open City Racing' : 'Turbo Horizon: Pro Racing';
  const description = `High-octane ${weather !== 'clear' ? weather + ' ' : ''}highway racing with traffic AI, nitro boost, drift mechanics, particle FX, and full save system.`;
  const controls = '← → Steer | ↑ Accelerate | ↓ Brake | SPACE Nitro | SHIFT Drift | P Pause | R Restart';

  const weatherCfg = JSON.stringify({ type: weather, fog: !!fog, headlights: hasHeadlights || fog || weather === 'fog' });
  const diffCfg    = difficulty === 'hard' ? 1.4 : difficulty === 'easy' ? 0.7 : 1.0;

  const js = `
(function(){
'use strict';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const WEATHER   = ${weatherCfg};
const DIFF      = ${diffCfg};
const HAS_NITRO = ${hasNitro};
const HAS_DRIFT = ${hasDrifting};
const HAS_TRAFFIC = ${hasTraffic};
const W = 800, H = 480;
const HORIZON   = 0.42;   // fraction of canvas height
const ROAD_SEGS = 150;
const SEG_LEN   = 200;
const CAMERA_DEPTH = 0.84;
const LANE_W    = 0.35;

// ── SAVE SYSTEM ───────────────────────────────────────────────────────────────
const SAVE_KEY = 'turbo_horizon_save';
function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch{ return {}; }
}
function writeSave(d) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(d)); } catch{}
}
let save = loadSave();
let bestScore = save.bestScore || 0;
let totalRaces = save.totalRaces || 0;

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

function resize() {
  const ratio = Math.min(window.innerWidth / W, window.innerHeight / H);
  canvas.style.width  = (W * ratio) + 'px';
  canvas.style.height = (H * ratio) + 'px';
}
window.addEventListener('resize', resize);
resize();

// ── AUDIO ENGINE ──────────────────────────────────────────────────────────────
const AC = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
function resumeAC(){ if(AC && AC.state === 'suspended') AC.resume(); }
let engineGain, engineOsc, driftGain, driftOsc;

function startEngineSound(){
  if(!AC) return;
  engineGain = AC.createGain(); engineGain.gain.value = 0;
  engineOsc  = AC.createOscillator(); engineOsc.type = 'sawtooth';
  engineOsc.frequency.value = 60;
  engineOsc.connect(engineGain); engineGain.connect(AC.destination);
  engineOsc.start();
  driftGain = AC.createGain(); driftGain.gain.value = 0;
  driftOsc  = AC.createOscillator(); driftOsc.type = 'triangle';
  driftOsc.frequency.value = 140;
  driftOsc.connect(driftGain); driftGain.connect(AC.destination);
  driftOsc.start();
}

function playCollision(){
  if(!AC) return;
  const g = AC.createGain(); g.gain.setValueAtTime(0.6,AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+0.4);
  const o = AC.createOscillator(); o.type='sawtooth'; o.frequency.value=80;
  o.frequency.exponentialRampToValueAtTime(30, AC.currentTime+0.4);
  o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+0.4);
}

function playNitroSound(){
  if(!AC) return;
  const g = AC.createGain(); g.gain.setValueAtTime(0.3,AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+0.5);
  const o = AC.createOscillator(); o.type='square'; o.frequency.value=200;
  o.frequency.exponentialRampToValueAtTime(800, AC.currentTime+0.5);
  o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+0.5);
}

// ── ROAD SEGMENTS ─────────────────────────────────────────────────────────────
const segments = [];
function buildRoad(){
  segments.length = 0;
  let curve = 0, hill = 0;
  for(let i=0;i<ROAD_SEGS;i++){
    // gentle S-curves and hills
    if(i % 40 === 0) curve = (Math.random()-0.5)*2.5;
    if(i % 55 === 0) hill  = (Math.random()-0.5)*300;
    segments.push({ curve, hill, color: i%2 });
  }
}
buildRoad();

// ── STATE ─────────────────────────────────────────────────────────────────────
let phase = 'start'; // start | racing | paused | gameover
let camPos = 0, speed = 0, maxSpeed = 8 * DIFF;
let playerX = 0, driftX = 0;
let nitro = 100, isDrifting = false, nitroActive = false;
let score = 0, topSpeed = 0;
let screenShake = 0;
let frameCount = 0;
let lastTime = 0;
let keys = {};

// ── TRAFFIC ───────────────────────────────────────────────────────────────────
const TRAFFIC_COLORS = ['#e74c3c','#3498db','#f39c12','#2ecc71','#9b59b6','#e67e22','#1abc9c'];
let trafficCars = [];
function spawnTraffic(){
  trafficCars = [];
  if(!HAS_TRAFFIC) return;
  const count = 8 + Math.floor(DIFF*4);
  for(let i=0;i<count;i++){
    trafficCars.push({
      pos:  (i/count) * ROAD_SEGS * SEG_LEN,
      lane: Math.random() > 0.5 ? -1 : 1,
      speed: (2 + Math.random()*2) * DIFF,
      color: TRAFFIC_COLORS[Math.floor(Math.random()*TRAFFIC_COLORS.length)],
      len: 80 + Math.random()*40,
      type: Math.random() > 0.6 ? 'truck' : 'car',
    });
  }
}
spawnTraffic();

// ── PARTICLES ─────────────────────────────────────────────────────────────────
let particles = [];
function addParticles(type, x, y, count, options={}){
  for(let i=0;i<count;i++){
    const angle  = options.angle !== undefined ? options.angle + (Math.random()-0.5)*1.2 : Math.random()*Math.PI*2;
    const speed_ = options.speed !== undefined ? options.speed*(0.5+Math.random()) : 1+Math.random()*3;
    particles.push({
      x, y,
      vx: Math.cos(angle)*speed_,
      vy: Math.sin(angle)*speed_ - (options.upward||0),
      life: 1.0,
      decay: 0.02 + Math.random()*0.03,
      size: options.size || (4+Math.random()*6),
      color: options.color || '#ffffff',
      type,
      gravity: options.gravity || 0.05,
    });
  }
}

function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.vy += p.gravity;
    p.life -= p.decay;
    if(p.life<=0) particles.splice(i,1);
  }
}

function drawParticles(){
  for(const p of particles){
    ctx.save();
    ctx.globalAlpha = p.life * 0.85;
    if(p.type==='smoke'){
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*(2-p.life),0,Math.PI*2);
      ctx.fillStyle = p.color; ctx.fill();
    } else if(p.type==='flame'){
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
      grad.addColorStop(0,'#fff700'); grad.addColorStop(0.5,'#ff6600'); grad.addColorStop(1,'rgba(200,0,0,0)');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle=grad; ctx.fill();
    } else if(p.type==='rain_streak'){
      ctx.strokeStyle = p.color; ctx.lineWidth = 1; ctx.globalAlpha = p.life * 0.5;
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.vx*5, p.y-p.vy*5);
      ctx.stroke();
    } else if(p.type==='snow'){
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*0.6,0,Math.PI*2);
      ctx.fillStyle='#fff'; ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle=p.color; ctx.fill();
    }
    ctx.restore();
  }
}

// ── RAIN / SNOW ───────────────────────────────────────────────────────────────
function spawnWeather(){
  if(WEATHER.type==='rain' && frameCount%2===0){
    addParticles('rain_streak', Math.random()*W, Math.random()*(H*HORIZON+80), 1, {
      vx: -1, vy: 18, gravity: 0, life: 0.6, decay: 0.06, color: 'rgba(150,200,255,0.7)',
    });
  }
  if(WEATHER.type==='snow' && frameCount%3===0){
    addParticles('snow', Math.random()*W, Math.random()*(H*0.4), 1, {
      vx: (Math.random()-0.5)*0.5, vy: 1+Math.random(), gravity: 0, decay: 0.003, size: 2+Math.random()*3,
    });
  }
}

// ── PERSPECTIVE ROAD RENDERER ─────────────────────────────────────────────────
function projectPoint(seg, i, cameraX){
  const depth = (camPos + i*SEG_LEN) / (ROAD_SEGS * SEG_LEN);
  const scale = CAMERA_DEPTH / (i * 0.02 + 0.001);
  const projX = (0.5 + seg.curve * scale * 0.3 - cameraX * scale) * W;
  const projY = (HORIZON + seg.hill * scale * 0.00001) * H - depth * 2;
  const projW = scale * LANE_W * W * 2;
  return { x: projX, y: projY, w: projW, scale };
}

function drawRoad(){
  const skyTop    = WEATHER.type==='rain' ? '#1a1a2e' : WEATHER.type==='snow' ? '#b8c5d6' : '#0a2463';
  const skyBottom = WEATHER.type==='rain' ? '#16213e' : WEATHER.type==='snow' ? '#d6e4f0' : '#1e3a8a';
  const grad = ctx.createLinearGradient(0,0,0,H*HORIZON);
  grad.addColorStop(0, skyTop); grad.addColorStop(1, skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H*HORIZON);

  // Sun / moon
  if(WEATHER.type==='clear'){
    ctx.beginPath(); ctx.arc(W*0.8, H*0.12, 28, 0, Math.PI*2);
    const sunGrad = ctx.createRadialGradient(W*0.8, H*0.12, 0, W*0.8, H*0.12, 40);
    sunGrad.addColorStop(0,'#fff9c4'); sunGrad.addColorStop(1,'rgba(255,240,100,0)');
    ctx.fillStyle=sunGrad; ctx.fill();
  }

  // Fog overlay
  if(WEATHER.fog || WEATHER.type==='fog'){
    ctx.save();
    const fogGrad = ctx.createLinearGradient(0, H*HORIZON, 0, H*HORIZON+100);
    fogGrad.addColorStop(0,'rgba(200,220,240,0.7)');
    fogGrad.addColorStop(1,'rgba(200,220,240,0)');
    ctx.fillStyle=fogGrad; ctx.fillRect(0,H*HORIZON,W,100);
    ctx.restore();
  }

  // Draw segments back-to-front (nearest to camera last for overdraw)
  const startSeg = Math.floor(camPos / SEG_LEN) % ROAD_SEGS;
  let prevX=W/2, prevY=H*HORIZON, prevW=0;

  for(let i=ROAD_SEGS;i>0;i--){
    const segIdx = (startSeg + i) % ROAD_SEGS;
    const seg = segments[segIdx];
    const { x, y, w, scale } = projectPoint(seg, i, playerX*0.5);
    if(y >= H) continue;

    // Road base
    const roadColor = seg.color===0 ? '#444' : '#555';
    const grassColor = seg.color===0 ?
      (WEATHER.type==='snow' ? '#cde' : '#2d7a2d') :
      (WEATHER.type==='snow' ? '#bcd' : '#25682a');

    // Grass
    ctx.fillStyle = grassColor;
    ctx.fillRect(0, y, W, prevY-y);

    // Road surface
    ctx.fillStyle = roadColor;
    const rx = x - w/2;
    ctx.fillRect(rx, y, w, prevY-y);

    // Lane markings (dashed white center)
    if(i%4===0){
      ctx.fillStyle = '#fff';
      ctx.fillRect(x-3, y, 6, prevY-y+2);
    }

    // Road edges (rumble strips)
    ctx.fillStyle = seg.color===0 ? '#fff' : '#e74c3c';
    ctx.fillRect(rx-12, y, 12, prevY-y+1);
    ctx.fillRect(rx+w,  y, 12, prevY-y+1);

    // Traffic cars on this segment
    if(i < 80){
      for(const car of trafficCars){
        const carSegPos = (car.pos / SEG_LEN) % ROAD_SEGS;
        const distSeg = Math.abs(carSegPos - ((startSeg+i)%ROAD_SEGS));
        if(distSeg < 2){
          const carScale = scale * 0.8;
          const carX = x + car.lane * w * 0.3;
          const carW = carScale * (car.type==='truck' ? 220 : 140);
          const carH = carScale * (car.type==='truck' ? 160 : 110);
          // Body
          ctx.fillStyle = car.color;
          ctx.fillRect(carX - carW/2, y - carH, carW, carH);
          // Roof
          ctx.fillStyle = '#222';
          if(car.type==='car') ctx.fillRect(carX - carW*0.3, y - carH*1.4, carW*0.6, carH*0.45);
          // Headlights
          if(WEATHER.headlights || WEATHER.type==='rain'){
            ctx.fillStyle='#fffacd';
            ctx.fillRect(carX-carW/2+2, y-carH*0.3, 10, 6);
            ctx.fillRect(carX+carW/2-12, y-carH*0.3, 10, 6);
          }
        }
      }
    }

    prevX=x; prevY=y; prevW=w;
  }
}

// ── PLAYER CAR ────────────────────────────────────────────────────────────────
function drawPlayerCar(){
  const cx = W/2 + playerX * 180;
  const cy = H - 110;
  const s  = isDrifting ? 1.04 : 1;

  // Motion blur (ghost)
  if(speed > 5){
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(cx-32*s, cy-36*s + speed*2, 64*s, 76*s);
    ctx.restore();
  }

  // Shadow
  ctx.save(); ctx.globalAlpha=0.3;
  ctx.beginPath(); ctx.ellipse(cx, cy+38, 36, 10, 0, 0, Math.PI*2);
  ctx.fillStyle='#000'; ctx.fill(); ctx.restore();

  // Car body
  ctx.save();
  ctx.translate(cx, cy + driftX*0.1);
  ctx.rotate(driftX * 0.06);

  // Main body
  const bGrad = ctx.createLinearGradient(-34,-38,34,38);
  bGrad.addColorStop(0,'#7c3aed'); bGrad.addColorStop(0.5,'#6366f1'); bGrad.addColorStop(1,'#4f46e5');
  ctx.fillStyle = bGrad;
  ctx.beginPath();
  ctx.roundRect(-32,-38,64,76,8);
  ctx.fill();

  // Roof
  ctx.fillStyle='#312e81';
  ctx.beginPath(); ctx.roundRect(-20,-30,40,28,5); ctx.fill();

  // Windshield
  ctx.fillStyle='rgba(147,197,253,0.75)';
  ctx.beginPath(); ctx.roundRect(-17,-28,34,22,3); ctx.fill();

  // Wheels
  ctx.fillStyle='#111';
  for(const [wx,wy] of [[-28,-22],[ 28,-22],[-28,24],[28,24]]){
    ctx.beginPath(); ctx.ellipse(wx,wy,9,9,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#555'; ctx.lineWidth=3; ctx.stroke();
  }

  // Nitro exhaust flames
  if(nitroActive){
    for(let n=0;n<3;n++){
      ctx.save();
      ctx.translate(-8+n*8, 38);
      const fg = ctx.createLinearGradient(0,0,0,18);
      fg.addColorStop(0,'#fff700'); fg.addColorStop(0.5,'#ff4500'); fg.addColorStop(1,'rgba(255,0,0,0)');
      ctx.fillStyle=fg;
      ctx.beginPath(); ctx.ellipse(0,8,4,12+Math.random()*6,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  // Headlights (front)
  if(WEATHER.headlights || WEATHER.type==='rain' || WEATHER.type==='fog'){
    ctx.fillStyle='#fffacd'; ctx.globalAlpha=0.9;
    ctx.fillRect(-30,-40,14,8); ctx.fillRect(16,-40,14,8);
    ctx.globalAlpha=0.08;
    ctx.beginPath();
    ctx.moveTo(-23,-40); ctx.lineTo(-60,-120); ctx.lineTo(-5,-120); ctx.lineTo(-23,-40);
    ctx.moveTo(23,-40); ctx.lineTo(5,-120); ctx.lineTo(60,-120); ctx.lineTo(23,-40);
    ctx.fillStyle='#fffacd'; ctx.fill();
  }

  ctx.restore();
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function drawHUD(){
  const kmh = Math.round(speed * 25 * DIFF);
  topSpeed = Math.max(topSpeed, kmh);

  // Speed readout
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,0.45)';
  ctx.beginPath(); ctx.roundRect(10,10,130,70,10); ctx.fill();
  ctx.fillStyle='#38bdf8'; ctx.font='bold 11px monospace'; ctx.fillText('SPEED',22,30);
  ctx.fillStyle='#fff'; ctx.font='bold 28px monospace';
  ctx.fillText(kmh.toString().padStart(3,' '), 22, 60);
  ctx.fillStyle='#94a3b8'; ctx.font='bold 11px monospace'; ctx.fillText('KM/H',86,60);

  // Distance / Score
  ctx.fillStyle='rgba(0,0,0,0.45)';
  ctx.beginPath(); ctx.roundRect(10,88,130,44,10); ctx.fill();
  ctx.fillStyle='#a78bfa'; ctx.font='bold 10px monospace'; ctx.fillText('DISTANCE',22,106);
  ctx.fillStyle='#fff'; ctx.font='bold 16px monospace';
  ctx.fillText(Math.round(score).toString()+'m', 22, 125);

  // Best
  ctx.fillStyle='rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.roundRect(10,140,130,38,10); ctx.fill();
  ctx.fillStyle='#fbbf24'; ctx.font='bold 10px monospace'; ctx.fillText('BEST: '+(bestScore||0)+'m',22,164);

  // Nitro bar
  if(HAS_NITRO){
    ctx.fillStyle='rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.roundRect(W-145,10,135,44,10); ctx.fill();
    ctx.fillStyle='#94a3b8'; ctx.font='bold 10px monospace'; ctx.fillText('NITRO',W-133,30);
    ctx.fillStyle='#1e293b';
    ctx.beginPath(); ctx.roundRect(W-133,35,110,12,6); ctx.fill();
    const nGrad = ctx.createLinearGradient(W-133,0,W-23,0);
    nGrad.addColorStop(0,'#38bdf8'); nGrad.addColorStop(1,'#0ea5e9');
    ctx.fillStyle = nitroActive ? '#7dd3fc' : nGrad;
    ctx.beginPath(); ctx.roundRect(W-133,35,110*(nitro/100),12,6); ctx.fill();
  }

  // Weather indicator
  const wxIcon = WEATHER.type==='rain'?'🌧':(WEATHER.type==='snow'?'❄':'☀');
  ctx.font='18px serif'; ctx.fillText(wxIcon, W/2-10, 30);

  // FPS counter
  ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='10px monospace';
  ctx.fillText('60 FPS', W-55, H-8);

  ctx.restore();
}

// ── SCREEN SHAKE ──────────────────────────────────────────────────────────────
function applyShake(){
  if(screenShake > 0){
    ctx.translate((Math.random()-0.5)*screenShake, (Math.random()-0.5)*screenShake);
    screenShake = Math.max(0, screenShake - 0.8);
  }
}

// ── GAME LOOP ─────────────────────────────────────────────────────────────────
function update(dt){
  if(phase !== 'racing') return;
  frameCount++;

  // Input
  const accel   = keys['ArrowUp']||keys['KeyW']||keys['w']||keys['arrowup'];
  const brake   = keys['ArrowDown']||keys['KeyS']||keys['s']||keys['arrowdown'];
  const left    = keys['ArrowLeft']||keys['KeyA']||keys['a']||keys['arrowleft'];
  const right   = keys['ArrowRight']||keys['KeyD']||keys['d']||keys['arrowright'];
  const nitroK  = keys['Space']||keys['space'];
  const driftK  = keys['ShiftLeft']||keys['ShiftRight']||keys['shift'];

  // Acceleration
  if(accel){
    speed = Math.min(speed + 0.08, maxSpeed);
  } else if(brake){
    speed = Math.max(speed - 0.12, -maxSpeed*0.4);
  } else {
    speed = speed > 0 ? Math.max(speed - 0.04, 0) : Math.min(speed + 0.04, 0);
  }

  // Nitro
  if(HAS_NITRO && nitroK && nitro > 0 && speed > 0){
    nitroActive = true; resumeAC();
    speed = Math.min(speed + 0.16, maxSpeed * 1.6);
    nitro = Math.max(0, nitro - 0.9);
    if(nitro<=0){ nitroActive=false; }
  } else {
    nitroActive = false;
    if(nitro < 100) nitro = Math.min(100, nitro + 0.25);
  }

  // Steering
  const steerFactor = isDrifting ? 0.016 : 0.012;
  if(left)  playerX -= steerFactor * (speed/maxSpeed);
  if(right) playerX += steerFactor * (speed/maxSpeed);
  playerX = Math.max(-1, Math.min(1, playerX));

  // Drift
  isDrifting = HAS_DRIFT && driftK && speed > 3;
  if(isDrifting){
    driftX = playerX * 25;
    if(frameCount%2===0){
      const bx = W/2 + playerX*180;
      addParticles('smoke', bx-20+(playerX*30), H-80, 3, {
        color:'rgba(200,200,200,0.7)', size:10+Math.random()*8,
        vx:(-speed*0.5 + (Math.random()-0.5)*2), gravity:-0.02, decay:0.015, upward:0.5,
      });
    }
  } else {
    driftX *= 0.85;
  }

  // Nitro flame particles
  if(nitroActive && frameCount%2===0){
    const bx = W/2 + playerX*180;
    addParticles('flame', bx+(Math.random()-0.5)*20, H-75, 2, {
      size:8+Math.random()*6, gravity:-0.1, decay:0.06, upward:2,
    });
  }

  // Camera advance
  camPos += speed * SEG_LEN * 0.01;
  score  += speed * 0.4;

  // Traffic movement & collision
  if(HAS_TRAFFIC){
    for(const car of trafficCars){
      car.pos += car.speed;
      if(car.pos > ROAD_SEGS*SEG_LEN) car.pos -= ROAD_SEGS*SEG_LEN;

      // Simple collision: car close to camera + player overlapping lane
      const relPos = ((car.pos - camPos) % (ROAD_SEGS*SEG_LEN) + ROAD_SEGS*SEG_LEN) % (ROAD_SEGS*SEG_LEN);
      if(relPos < SEG_LEN*3 && relPos > 0){
        const laneDiff = Math.abs(playerX - car.lane*0.38);
        if(laneDiff < 0.15 && speed > 1){
          screenShake = 14; playCollision();
          speed = Math.max(0, speed - 4);
          addParticles('smoke', W/2+playerX*180, H-100, 12, {
            color:'rgba(80,80,80,0.9)', size:12, gravity:0.02, decay:0.02,
          });
          if(score > bestScore){ bestScore=Math.round(score); writeSave({bestScore,totalRaces}); }
          phase='gameover';
          document.getElementById('go-score').textContent=Math.round(score)+'m';
          document.getElementById('go-topspeed').textContent=topSpeed;
          document.getElementById('go-best').textContent=bestScore+'m';
          document.getElementById('gameover-screen').classList.add('active');
        }
      }
    }
  }

  // Engine audio
  if(engineOsc && engineGain){
    const rpm = 60 + speed * 28 + (nitroActive ? 80 : 0);
    engineOsc.frequency.linearRampToValueAtTime(rpm, AC.currentTime+0.05);
    engineGain.gain.linearRampToValueAtTime(speed>0?0.08:0.02, AC.currentTime+0.1);
    if(isDrifting){
      driftOsc.frequency.linearRampToValueAtTime(140+speed*10, AC.currentTime+0.05);
      driftGain.gain.linearRampToValueAtTime(0.06, AC.currentTime+0.1);
    } else {
      driftGain.gain.linearRampToValueAtTime(0, AC.currentTime+0.1);
    }
  }

  spawnWeather();
  updateParticles();
}

function draw(){
  ctx.save();
  applyShake();

  drawRoad();
  drawParticles();
  drawPlayerCar();
  drawHUD();

  ctx.restore();
}

let rafId = null;
function loop(ts){
  const dt = Math.min((ts - lastTime)/16.67, 3);
  lastTime = ts;
  ctx.clearRect(0,0,W,H);
  update(dt);
  draw();
  rafId = requestAnimationFrame(loop);
}

// ── CONTROLS ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e=>{
  keys[e.code] = true; keys[e.key?.toLowerCase()] = true;
  if(e.code==='KeyP'||e.key==='p') togglePause();
  if(e.code==='KeyR'||e.key==='r') restartGame();
  e.preventDefault();
});
document.addEventListener('keyup', e=>{
  keys[e.code] = false; keys[e.key?.toLowerCase()] = false;
});

// Mobile touch controls
function setupTouchBtn(id, key){
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('touchstart', e=>{ e.preventDefault(); keys[key]=true; resumeAC(); }, {passive:false});
  el.addEventListener('touchend',   e=>{ e.preventDefault(); keys[key]=false; }, {passive:false});
}
setupTouchBtn('mc-up','ArrowUp');
setupTouchBtn('mc-down','ArrowDown');
setupTouchBtn('mc-left','ArrowLeft');
setupTouchBtn('mc-right','ArrowRight');
setupTouchBtn('mc-action','Space');
setupTouchBtn('mc-secondary','ShiftLeft');

// ── OVERLAY BUTTONS ───────────────────────────────────────────────────────────
function startGame(){
  resumeAC(); startEngineSound();
  phase='racing'; score=0; topSpeed=0;
  speed=0; playerX=0; driftX=0; nitro=100;
  camPos=0; particles=[];
  spawnTraffic();
  document.getElementById('start-screen').classList.remove('active');
  document.getElementById('gameover-screen').classList.remove('active');
  document.getElementById('pause-screen').classList.remove('active');
}

function restartGame(){
  totalRaces++;
  if(score > bestScore){ bestScore=Math.round(score); }
  writeSave({bestScore, totalRaces});
  document.getElementById('gameover-screen').classList.remove('active');
  document.getElementById('pause-screen').classList.remove('active');
  phase='racing'; score=0; topSpeed=0;
  speed=0; playerX=0; driftX=0; nitro=100;
  camPos=0; particles=[]; screenShake=0;
  spawnTraffic();
}

function togglePause(){
  if(phase==='racing'){
    phase='paused';
    document.getElementById('pause-screen').classList.add('active');
  } else if(phase==='paused'){
    phase='racing';
    document.getElementById('pause-screen').classList.remove('active');
  }
}

document.getElementById('btn-start')?.addEventListener('click',()=>startGame());
document.getElementById('btn-restart')?.addEventListener('click',()=>restartGame());
document.getElementById('btn-restart2')?.addEventListener('click',()=>restartGame());
document.getElementById('btn-resume')?.addEventListener('click',()=>togglePause());
document.getElementById('btn-pause-hud')?.addEventListener('click',()=>togglePause());
document.getElementById('btn-restart-hud')?.addEventListener('click',()=>restartGame());

// Start loop
requestAnimationFrame(ts=>{ lastTime=ts; rafId=requestAnimationFrame(loop); });

})();
`;

  const html = `
<div class="game-wrapper">
  <canvas id="gameCanvas" width="800" height="480"></canvas>

  <!-- HUD overlay (rendered via canvas, this is just for buttons) -->
  <div class="hud-btns">
    <button id="btn-pause-hud" class="hud-btn" title="Pause">⏸</button>
    <button id="btn-restart-hud" class="hud-btn" title="Restart">🔄</button>
  </div>

  <!-- Start Screen -->
  <div id="start-screen" class="overlay active">
    <div class="overlay-card">
      <div class="game-logo">🏎️</div>
      <h1>${title}</h1>
      <p>${weather !== 'clear' ? `${weather.toUpperCase()} conditions •` : ''} Traffic AI • Nitro • Drift • Particles</p>
      <div class="key-grid">
        <div class="key-item"><kbd>↑</kbd> Gas</div>
        <div class="key-item"><kbd>↓</kbd> Brake</div>
        <div class="key-item"><kbd>← →</kbd> Steer</div>
        <div class="key-item"><kbd>SPACE</kbd> Nitro</div>
        <div class="key-item"><kbd>SHIFT</kbd> Drift</div>
        <div class="key-item"><kbd>P</kbd> Pause</div>
      </div>
      <button id="btn-start" class="glow-btn">🚦 START RACE</button>
    </div>
  </div>

  <!-- Game Over Screen -->
  <div id="gameover-screen" class="overlay">
    <div class="overlay-card danger">
      <div class="game-logo">💥</div>
      <h2>CRASHED!</h2>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">Distance</span><span id="go-score" class="stat-val">0</span><span class="stat-unit">m</span></div>
        <div class="stat-item"><span class="stat-label">Top Speed</span><span id="go-topspeed" class="stat-val">0</span><span class="stat-unit">km/h</span></div>
        <div class="stat-item"><span class="stat-label">Best Run</span><span id="go-best" class="stat-val">0</span><span class="stat-unit">m</span></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button id="btn-restart" class="glow-btn">🔄 RACE AGAIN</button>
        <button id="btn-restart2" class="glow-btn ghost">🏠 MENU</button>
      </div>
    </div>
  </div>

  <!-- Pause Screen -->
  <div id="pause-screen" class="overlay">
    <div class="overlay-card">
      <h2>⏸ PAUSED</h2>
      <p style="color:#94a3b8;margin:8px 0 20px">Press [P] or click Resume</p>
      <button id="btn-resume" class="glow-btn">▶ RESUME</button>
    </div>
  </div>

  <!-- Mobile Controls -->
  <div class="mobile-controls">
    <div class="dpad">
      <button id="mc-up" class="dpad-btn up">▲</button>
      <div class="dpad-row">
        <button id="mc-left" class="dpad-btn left">◄</button>
        <button id="mc-down" class="dpad-btn down">▼</button>
        <button id="mc-right" class="dpad-btn right">►</button>
      </div>
    </div>
    <div class="action-btns">
      <button id="mc-action" class="action-btn nitro-btn">NITRO</button>
      <button id="mc-secondary" class="action-btn drift-btn">DRIFT</button>
    </div>
  </div>
</div>
`;

  const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body, html { width:100%; height:100%; overflow:hidden; background:#000; font-family:'Segoe UI',sans-serif; }
.game-wrapper { position:relative; width:100%; height:100vh; display:flex; align-items:center; justify-content:center; }
#gameCanvas { display:block; max-width:100%; max-height:100vh; image-rendering:pixelated; }

.hud-btns { position:absolute; top:12px; right:12px; display:flex; gap:8px; z-index:10; }
.hud-btn { background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:6px 10px; border-radius:8px; cursor:pointer; font-size:16px; transition:all 0.15s; }
.hud-btn:hover { background:rgba(255,255,255,0.1); }

.overlay { display:none; position:absolute; inset:0; background:rgba(0,0,0,0.82); backdrop-filter:blur(4px); align-items:center; justify-content:center; z-index:20; }
.overlay.active { display:flex; }
.overlay-card { background:linear-gradient(135deg,#0f172a,#1e293b); border:1px solid rgba(99,102,241,0.4); border-radius:20px; padding:36px 44px; text-align:center; max-width:440px; box-shadow:0 20px 60px rgba(99,102,241,0.3); }
.overlay-card.danger { border-color:rgba(239,68,68,0.5); box-shadow:0 20px 60px rgba(239,68,68,0.2); }
.game-logo { font-size:52px; margin-bottom:8px; }
h1 { font-size:22px; font-weight:800; color:#fff; margin-bottom:8px; }
h2 { font-size:20px; font-weight:800; color:#fff; margin-bottom:12px; }
p { color:#94a3b8; font-size:13px; }

.key-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin:18px 0 24px; }
.key-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#cbd5e1; }
kbd { background:#334155; color:#e2e8f0; padding:2px 7px; border-radius:5px; font-size:11px; border:1px solid #475569; }

.stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:16px 0 22px; }
.stat-item { background:rgba(255,255,255,0.05); border-radius:10px; padding:10px 6px; }
.stat-label { display:block; font-size:10px; color:#64748b; text-transform:uppercase; margin-bottom:4px; }
.stat-val { display:block; font-size:22px; font-weight:800; color:#fff; }
.stat-unit { display:block; font-size:10px; color:#94a3b8; }

.glow-btn { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; padding:13px 30px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 6px 20px rgba(99,102,241,0.35); margin:4px; }
.glow-btn:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(99,102,241,0.5); }
.glow-btn.ghost { background:transparent; border:2px solid rgba(99,102,241,0.5); }

/* Mobile Controls */
.mobile-controls { display:none; position:absolute; bottom:16px; width:100%; padding:0 16px; justify-content:space-between; align-items:flex-end; z-index:15; }
@media (max-width:768px), (pointer:coarse) { .mobile-controls { display:flex; } }
.dpad { display:grid; grid-template-rows:auto auto; gap:4px; }
.dpad-row { display:flex; gap:4px; }
.dpad-btn { width:48px; height:48px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); border-radius:10px; color:#fff; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; user-select:none; -webkit-user-select:none; }
.dpad-btn.up,.dpad-btn.down { margin-left:52px; }
.dpad-btn.up { margin-bottom:0; }
.action-btns { display:flex; flex-direction:column; gap:8px; }
.action-btn { width:66px; height:66px; border:none; border-radius:50%; color:#fff; font-size:11px; font-weight:800; cursor:pointer; user-select:none; }
.nitro-btn { background:radial-gradient(circle,#38bdf8,#0284c7); box-shadow:0 0 16px rgba(56,189,248,0.5); }
.drift-btn { background:radial-gradient(circle,#f59e0b,#d97706); box-shadow:0 0 16px rgba(245,158,11,0.5); }
`;

  return { title, description, controls, html, css, js };
}
