/* ============================================
   PROFESSIONAL 2D PLATFORMER – Super Pixel Quest
   Parallax backgrounds | patrol AI | boss fight
   checkpoints | coyote time | jump buffer
   coin sparkle | particles | save system
   ============================================ */

export function createPlatformerGame(config = {}) {
  const {
    hasParallax = true, hasBoss = true, hasCheckpoints = true,
    hasCoins = true, difficulty = 'normal', isPixelArt = true,
  } = config;

  const title = 'Super Pixel Quest: Rise of the Boss';
  const description = 'Epic 2D platformer with parallax scrolling, patrol enemies, boss battles, checkpoints, and coin collection.';
  const controls = '← → Move | SPACE/↑/Z Jump | Double Jump | P Pause | R Restart';

  const diffCfg = difficulty === 'hard' ? 1.3 : difficulty === 'easy' ? 0.7 : 1.0;

  const js = `
(function(){
'use strict';

const W=800, H=480, DIFF=${diffCfg}, TILE=32;
const GRAVITY=0.55, JUMP_FORCE=-13, DOUBLE_JUMP=-11;
const COYOTE_TIME=8, JUMP_BUFFER=8;

// ── SAVE ─────────────────────────────────────────────────────────────────────
const SAVE_KEY='pixel_quest_save';
function loadSave(){ try{ return JSON.parse(localStorage.getItem(SAVE_KEY))||{}; }catch{ return{}; } }
function writeSave(d){ try{ localStorage.setItem(SAVE_KEY,JSON.stringify(d)); }catch{} }
let save = loadSave();
let bestCoins = save.bestCoins||0;

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
function resize(){
  const r=Math.min(window.innerWidth/W, window.innerHeight/H);
  canvas.style.width=(W*r)+'px'; canvas.style.height=(H*r)+'px';
}
window.addEventListener('resize',resize); resize();

// ── AUDIO ─────────────────────────────────────────────────────────────────────
const AC=(window.AudioContext||window.webkitAudioContext)?new(window.AudioContext||window.webkitAudioContext)():null;
function resumeAC(){ if(AC&&AC.state==='suspended') AC.resume(); }
function beep(freq,dur,type='square',vol=0.2){
  if(!AC)return;
  const g=AC.createGain(); g.gain.setValueAtTime(vol,AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+dur);
  const o=AC.createOscillator(); o.type=type; o.frequency.value=freq;
  o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+dur);
}
function sfxJump()    { beep(320,0.1,'square',0.18); beep(480,0.08,'square',0.12); }
function sfxCoin()    { beep(660,0.06,'square',0.15); beep(880,0.1,'square',0.1); }
function sfxHurt()    { beep(120,0.3,'sawtooth',0.3); }
function sfxBossHit() { beep(200,0.15,'triangle',0.25); beep(150,0.2,'sawtooth',0.2); }
function sfxWin()     {
  [523,659,784,1047].forEach((f,i)=>{
    setTimeout(()=>beep(f,0.25,'square',0.15),i*120);
  });
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
let particles=[];
function addParticle(x,y,opts={}){
  particles.push({
    x,y,vx:opts.vx||(Math.random()-0.5)*4,vy:opts.vy||(-2-Math.random()*3),
    life:1,decay:opts.decay||0.03,size:opts.size||(3+Math.random()*4),
    color:opts.color||'#fbbf24',gravity:opts.gravity||0.15,type:opts.type||'dot',
  });
}
function spawnCoinSparkle(x,y){
  for(let i=0;i<8;i++) addParticle(x,y,{color:i%2?'#fbbf24':'#fcd34d',size:3+Math.random()*3,decay:0.04});
}
function spawnDust(x,y){ for(let i=0;i<5;i++) addParticle(x,y,{color:'rgba(200,180,140,0.8)',vy:-0.5,size:4,decay:0.05}); }
function spawnBlood(x,y,c='#ef4444'){ for(let i=0;i<10;i++) addParticle(x,y,{color:c,size:3+Math.random()*4,decay:0.025}); }
function spawnExplosion(x,y){
  for(let i=0;i<20;i++){
    const a=Math.random()*Math.PI*2, s=2+Math.random()*5;
    addParticle(x,y,{vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,color:i%3?'#f97316':'#fbbf24',size:5+Math.random()*6,decay:0.02});
  }
}
function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.life-=p.decay;
    if(p.life<=0) particles.splice(i,1);
  }
}
function drawParticles(){
  for(const p of particles){
    ctx.save(); ctx.globalAlpha=p.life;
    ctx.fillStyle=p.color;
    ctx.beginPath(); ctx.arc(p.x-camX,p.y,p.size*(0.5+p.life*0.5),0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}

// ── PARALLAX BACKGROUND ───────────────────────────────────────────────────────
function drawParallax(){
  // Sky gradient
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#1a1035'); sky.addColorStop(0.6,'#2d1b69'); sky.addColorStop(1,'#1e3a8a');
  ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

  // Stars (static)
  ctx.fillStyle='rgba(255,255,255,0.7)';
  for(let i=0;i<80;i++){
    const sx=(i*137.5)%W, sy=(i*71.3)%200;
    const twinkle=0.4+0.6*Math.abs(Math.sin(Date.now()*0.001+i));
    ctx.globalAlpha=twinkle;
    ctx.fillRect(sx,sy,1.5,1.5);
  }
  ctx.globalAlpha=1;

  // Mountains (layer 1 – slow)
  ctx.fillStyle='#2d1b69';
  const mx=camX*0.08;
  for(let i=0;i<8;i++){
    const bx=(i*160-mx%160); ctx.beginPath();
    ctx.moveTo(bx,H*0.65); ctx.lineTo(bx+80,H*0.35); ctx.lineTo(bx+160,H*0.65);
    ctx.closePath(); ctx.fill();
  }

  // Hills (layer 2 – medium)
  ctx.fillStyle='#1e3a5f';
  const hx=camX*0.2;
  for(let i=0;i<12;i++){
    const bx=(i*110-hx%110); ctx.beginPath();
    ctx.arc(bx+55,H*0.7,55,Math.PI,0); ctx.fill();
  }

  // Trees (layer 3 – faster)
  const tx=camX*0.45;
  for(let i=0;i<20;i++){
    const bx=(i*90-tx%90);
    ctx.fillStyle='#14532d';
    ctx.fillRect(bx+17,H*0.68,8,24);
    ctx.fillStyle='#166534';
    ctx.beginPath(); ctx.arc(bx+21,H*0.66,16,0,Math.PI*2); ctx.fill();
  }
}

// ── LEVEL DESIGN ──────────────────────────────────────────────────────────────
let camX=0;
// World is 6000px wide
const WORLD_W=6000;

// Platforms: {x,y,w,h, type}
const platforms=[
  {x:0,y:420,w:400,h:32,type:'ground'},
  {x:440,y:380,w:120,h:16,type:'ground'},
  {x:610,y:330,w:100,h:16,type:'ground'},
  {x:760,y:270,w:120,h:16,type:'ground'},
  {x:940,y:310,w:140,h:16,type:'ground'},
  {x:1130,y:360,w:100,h:16,type:'ground'},
  {x:1280,y:300,w:80,h:16,type:'ground'},
  {x:1400,y:240,w:100,h:16,type:'ground'},
  {x:1550,y:280,w:120,h:16,type:'ground'},
  {x:1720,y:350,w:200,h:16,type:'ground'},
  {x:1980,y:420,w:300,h:32,type:'ground'},
  {x:2340,y:360,w:100,h:16,type:'ground'},
  {x:2500,y:300,w:140,h:16,type:'ground'},
  {x:2700,y:240,w:100,h:16,type:'ground'},
  {x:2860,y:300,w:160,h:16,type:'ground'},
  {x:3080,y:420,w:300,h:32,type:'ground'},
  {x:3440,y:370,w:100,h:16,type:'ground'},
  {x:3600,y:300,w:120,h:16,type:'ground'},
  {x:3780,y:240,w:100,h:16,type:'ground'},
  {x:3940,y:290,w:160,h:16,type:'ground'},
  {x:4160,y:420,w:400,h:32,type:'ground'},
  {x:4620,y:360,w:120,h:16,type:'ground'},
  {x:4800,y:300,w:100,h:16,type:'ground'},
  {x:4960,y:420,w:800,h:32,type:'ground'}, // boss arena
];

// Checkpoints
const checkpoints=[
  {x:1990,y:370,w:20,h:50,reached:false},
  {x:3100,y:370,w:20,h:50,reached:false},
];

// Coins
let coins=[];
function buildCoins(){
  coins=[];
  const coinPos=[
    440,445,510,280,625,295,775,235,960,275,1140,325,1300,205,1415,205,
    1560,245,1730,315,1740,315,1750,315,2000,385,2020,385,2040,385,
    2360,325,2520,265,2720,205,2880,265,3100,385,3120,385,3140,385,
    3460,335,3620,265,3800,205,3960,255,4180,385,4200,385,4220,385,
    4640,325,4820,265,
  ];
  for(let i=0;i<coinPos.length;i+=2){
    coins.push({x:coinPos[i],y:coinPos[i+1],w:16,h:16,collected:false,anim:Math.random()*Math.PI*2});
  }
}
buildCoins();

// Enemies (patrol)
let enemies=[];
function buildEnemies(){
  enemies=[
    {x:500,y:348,w:28,h:28,vx:1.2*DIFF,dir:1,left:440,right:560,type:'goomba',alive:true,hitTimer:0},
    {x:780,y:238,w:28,h:28,vx:1.0*DIFF,dir:1,left:760,right:880,type:'goomba',alive:true,hitTimer:0},
    {x:1000,y:278,w:28,h:28,vx:1.4*DIFF,dir:1,left:940,right:1080,type:'goomba',alive:true,hitTimer:0},
    {x:1300,y:208,w:30,h:30,vx:1.5*DIFF,dir:1,left:1280,right:1400,type:'spike',alive:true,hitTimer:0},
    {x:1600,y:248,w:28,h:28,vx:1.3*DIFF,dir:1,left:1550,right:1670,type:'goomba',alive:true,hitTimer:0},
    {x:2000,y:388,w:28,h:28,vx:1.5*DIFF,dir:1,left:1980,right:2200,type:'goomba',alive:true,hitTimer:0},
    {x:2510,y:268,w:30,h:30,vx:1.6*DIFF,dir:1,left:2500,right:2640,type:'spike',alive:true,hitTimer:0},
    {x:2720,y:208,w:28,h:28,vx:1.4*DIFF,dir:1,left:2700,right:2800,type:'goomba',alive:true,hitTimer:0},
    {x:3200,y:388,w:28,h:28,vx:1.5*DIFF,dir:1,left:3080,right:3380,type:'goomba',alive:true,hitTimer:0},
    {x:3650,y:268,w:30,h:30,vx:1.8*DIFF,dir:1,left:3600,right:3720,type:'spike',alive:true,hitTimer:0},
    {x:4300,y:388,w:28,h:28,vx:1.6*DIFF,dir:1,left:4160,right:4560,type:'goomba',alive:true,hitTimer:0},
    {x:4800,y:268,w:28,h:28,vx:1.5*DIFF,dir:1,left:4800,right:4900,type:'goomba',alive:true,hitTimer:0},
  ];
}
buildEnemies();

// Boss
let boss={
  x:5100,y:340,w:80,h:80,hp:8*Math.ceil(DIFF),maxHp:8*Math.ceil(DIFF),
  vx:2*DIFF,vy:0,dir:1,alive:true,phase:1,
  projectiles:[],shootTimer:0,jumpTimer:0,
  hitTimer:0, defeated:false,
};

// Flagpole (end of boss arena)
const flagpole={x:5850,y:260,w:12,h:160,reached:false};

// ── PLAYER ────────────────────────────────────────────────────────────────────
let player={
  x:60,y:360,w:26,h:36,
  vx:0,vy:0,
  onGround:false,
  coyoteTimer:0,
  jumpBuffer:0,
  jumpsLeft:2,
  hp:3,maxHp:3,
  hurtTimer:0,
  facing:1,
  runFrame:0,runTimer:0,
  dead:false,coins:0,
  checkpointX:60,checkpointY:360,
};

let phase='start'; // start|playing|paused|gameover|win
let frameCount=0, keys={};
let comboCount=0, comboTimer=0;
let screenShake=0;

function resetPlayer(){
  player.x=player.checkpointX; player.y=player.checkpointY;
  player.vx=0; player.vy=0;
  player.hp=player.maxHp; player.dead=false; player.hurtTimer=0;
}

// ── COLLISION ─────────────────────────────────────────────────────────────────
function aabb(a,b){ return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y; }

function resolvePlayer(){
  player.onGround=false;
  for(const p of platforms){
    if(!aabb(player,p)) continue;
    const ox=Math.min(player.x+player.w-p.x, p.x+p.w-player.x);
    const oy=Math.min(player.y+player.h-p.y, p.y+p.h-player.y);
    if(oy<ox){
      if(player.vy>0&&player.y+player.h-player.vy<=p.y+2){ player.y=p.y-player.h; player.vy=0; player.onGround=true; }
      else{ player.y=p.y+p.h; player.vy=Math.max(0,player.vy); }
    } else {
      if(player.x<p.x) player.x=p.x-player.w; else player.x=p.x+p.w;
      player.vx=0;
    }
  }
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
function update(){
  if(phase!=='playing') return;
  frameCount++;

  const left  = keys['ArrowLeft']||keys['KeyA']||keys['a'];
  const right  = keys['ArrowRight']||keys['KeyD']||keys['d'];
  const jump   = keys['Space']||keys['ArrowUp']||keys['KeyW']||keys['KeyZ']||keys['z'];

  // Horizontal movement
  const spd=4.5*DIFF;
  if(left){  player.vx=-spd; player.facing=-1; }
  else if(right){ player.vx= spd; player.facing= 1; }
  else player.vx*=0.8;

  // Jump buffer
  if(jump) player.jumpBuffer=JUMP_BUFFER;
  if(player.jumpBuffer>0) player.jumpBuffer--;

  // Coyote time
  if(player.onGround){ player.coyoteTimer=COYOTE_TIME; player.jumpsLeft=2; }
  if(player.coyoteTimer>0) player.coyoteTimer--;

  // Jump
  if(player.jumpBuffer>0 && (player.coyoteTimer>0||player.jumpsLeft>0)){
    const force = player.jumpsLeft===2 ? JUMP_FORCE : DOUBLE_JUMP;
    player.vy=force; player.jumpsLeft--; player.jumpBuffer=0; player.coyoteTimer=0;
    sfxJump(); spawnDust(player.x+player.w/2, player.y+player.h);
  }

  // Gravity
  player.vy=Math.min(player.vy+GRAVITY, 16);

  // Move
  player.x+=player.vx; player.y+=player.vy;

  // Clamp world
  player.x=Math.max(0,Math.min(WORLD_W-player.w,player.x));

  // Death pits
  if(player.y>H+100){ hurtPlayer(true); return; }

  resolvePlayer();

  // Checkpoints
  for(const cp of checkpoints){
    if(!cp.reached && player.x+player.w>cp.x && player.x<cp.x+cp.w){
      cp.reached=true;
      player.checkpointX=cp.x; player.checkpointY=cp.y-player.h;
      for(let i=0;i<12;i++) addParticle(cp.x+10,cp.y,{color:i%2?'#10b981':'#34d399',vx:(Math.random()-0.5)*5,vy:-4-Math.random()*3,gravity:0.1,decay:0.03});
    }
  }

  // Coins
  for(const c of coins){
    if(!c.collected && aabb(player, c)){
      c.collected=true; player.coins++;
      sfxCoin(); spawnCoinSparkle(c.x-camX,c.y);
      if(player.coins>bestCoins){ bestCoins=player.coins; writeSave({bestCoins}); }
    }
    c.anim+=0.08;
  }

  // Enemies
  for(const e of enemies){
    if(!e.alive) continue;
    if(e.hitTimer>0){ e.hitTimer--; continue; }
    e.x+=e.vx*e.dir;
    if(e.x<e.left||e.x+e.w>e.right) e.dir*=-1;

    if(player.hurtTimer>0) continue;
    if(aabb(player,{x:e.x,y:e.y,w:e.w,h:e.h})){
      // Stomp from above
      if(player.vy>0 && player.y+player.h<e.y+e.h*0.5+4){
        e.alive=false;
        player.vy=JUMP_FORCE*0.65;
        comboCount++; comboTimer=120;
        spawnBlood(e.x+e.w/2,e.y,e.type==='spike'?'#9333ea':'#ef4444');
        sfxCoin();
      } else {
        hurtPlayer(false);
      }
    }
  }

  // Boss
  if(boss.alive && !boss.defeated){
    boss.vy=Math.min(boss.vy+GRAVITY,16);
    boss.x+=boss.vx*boss.dir;
    boss.y+=boss.vy;
    // Boss platforms
    for(const p of platforms){
      if(boss.x+boss.w>p.x&&boss.x<p.x+p.w&&boss.y+boss.h>p.y&&boss.y<p.y+p.h){
        if(boss.vy>=0){ boss.y=p.y-boss.h; boss.vy=0; }
      }
    }
    if(boss.x<4960){ boss.x=4960; boss.dir=1; }
    if(boss.x+boss.w>WORLD_W){ boss.x=WORLD_W-boss.w; boss.dir=-1; }

    // Boss jump
    boss.jumpTimer++;
    if(boss.jumpTimer>90/DIFF){ boss.vy=-11; boss.jumpTimer=0; }

    // Projectiles
    boss.shootTimer++;
    if(boss.shootTimer > 60/DIFF){
      boss.shootTimer=0;
      const dx=player.x-boss.x; const dy=player.y-boss.y;
      const dist=Math.sqrt(dx*dx+dy*dy)||1;
      boss.projectiles.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,vx:(dx/dist)*5*DIFF,vy:(dy/dist)*5*DIFF,r:8});
    }

    // Update projectiles
    for(let i=boss.projectiles.length-1;i>=0;i--){
      const b=boss.projectiles[i];
      b.x+=b.vx; b.y+=b.vy; b.vy+=GRAVITY*0.2;
      if(b.x<0||b.x>WORLD_W||b.y>H) boss.projectiles.splice(i,1);
      else if(player.hurtTimer===0 && aabb(player,{x:b.x-b.r,y:b.y-b.r,w:b.r*2,h:b.r*2})){
        boss.projectiles.splice(i,1);
        hurtPlayer(false);
      }
    }

    // Player hits boss (stomp)
    if(boss.hitTimer===0 && player.vy>0 && aabb(player,{x:boss.x,y:boss.y,w:boss.w,h:boss.h}) && player.y+player.h<boss.y+boss.h*0.4+4){
      boss.hp--;
      boss.hitTimer=45;
      player.vy=JUMP_FORCE*0.7;
      screenShake=8;
      sfxBossHit();
      spawnBlood(boss.x+boss.w/2,boss.y,'#7c3aed');
      if(boss.hp<=2) boss.phase=2; // enrage
      if(boss.hp<=0){ boss.defeated=true; spawnExplosion(boss.x+boss.w/2,boss.y+boss.h/2); }
    } else if(boss.hitTimer===0 && aabb(player,{x:boss.x,y:boss.y,w:boss.w,h:boss.h}) && player.hurtTimer===0){
      hurtPlayer(false);
    }
    if(boss.hitTimer>0) boss.hitTimer--;
    if(boss.phase===2){ boss.vx=3.5*DIFF; }
  }

  // Flagpole
  if(!flagpole.reached && aabb(player,{x:flagpole.x,y:flagpole.y,w:flagpole.w,h:flagpole.h})){
    flagpole.reached=true; sfxWin();
    phase='win'; document.getElementById('win-score').textContent=player.coins;
    document.getElementById('win-screen').classList.add('active');
  }

  // Combo timer
  if(comboTimer>0) comboTimer--; else comboCount=0;
  if(player.hurtTimer>0) player.hurtTimer--;
  if(screenShake>0) screenShake=Math.max(0,screenShake-0.7);

  // Camera follow
  camX=Math.max(0,Math.min(WORLD_W-W, player.x-W*0.35));

  updateParticles();
}

function hurtPlayer(instant){
  if(player.hurtTimer>0&&!instant) return;
  sfxHurt(); screenShake=10;
  player.hp--;
  player.hurtTimer=80;
  player.vy=-8; player.vx*=-0.5;
  spawnBlood(player.x+player.w/2,player.y+player.h/2,'#ef4444');
  if(player.hp<=0||instant){
    player.dead=true;
    setTimeout(()=>{ player.dead=false; resetPlayer(); player.hp=player.maxHp; }, 900);
  }
}

// ── DRAW ──────────────────────────────────────────────────────────────────────
function drawPixelRect(x,y,w,h,c){
  ctx.fillStyle=c;
  ctx.fillRect(Math.round(x-camX),Math.round(y),w,h);
}

function drawPlatform(p){
  const colors={ground:['#7c3aed','#5b21b6','#8b5cf6']};
  const [top,body,edge]=colors.ground;
  ctx.fillStyle=body; ctx.fillRect(p.x-camX,p.y,p.w,p.h);
  ctx.fillStyle=top;  ctx.fillRect(p.x-camX,p.y,p.w,6);
  ctx.fillStyle=edge; ctx.fillRect(p.x-camX,p.y+p.h-4,p.w,4);
  // Brick pattern
  ctx.fillStyle='rgba(0,0,0,0.2)';
  for(let bx=0;bx<p.w;bx+=16) ctx.fillRect(p.x-camX+bx,p.y+8,1,p.h-8);
}

function drawEnemy(e){
  if(!e.alive) return;
  const sx=Math.round(e.x-camX), sy=Math.round(e.y);
  if(e.type==='goomba'){
    // Body
    ctx.fillStyle='#b45309'; ctx.fillRect(sx,sy+6,e.w,e.h-6);
    // Head
    ctx.fillStyle='#d97706'; ctx.fillRect(sx+2,sy,e.w-4,16);
    // Eyes
    ctx.fillStyle='#fff'; ctx.fillRect(sx+5,sy+4,5,5); ctx.fillRect(sx+e.w-10,sy+4,5,5);
    ctx.fillStyle='#000'; ctx.fillRect(sx+6,sy+5,3,3); ctx.fillRect(sx+e.w-9,sy+5,3,3);
    // Feet
    ctx.fillStyle='#92400e'; ctx.fillRect(sx+2,sy+e.h-6,10,6); ctx.fillRect(sx+e.w-12,sy+e.h-6,10,6);
  } else {
    ctx.fillStyle='#9333ea'; ctx.fillRect(sx,sy,e.w,e.h);
    ctx.fillStyle='#ec4899';
    for(let s=0;s<5;s++) ctx.fillRect(sx+s*7,sy+e.h-8,5,8);
  }
  if(e.hitTimer>0){ ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(sx,sy,e.w,e.h); }
}

function drawBoss(){
  if(!boss.alive||boss.defeated) return;
  const bx=Math.round(boss.x-camX), by=Math.round(boss.y);
  const flash=boss.hitTimer>0;

  // Body
  ctx.fillStyle=flash?'#fff':boss.phase===2?'#dc2626':'#7c3aed';
  ctx.fillRect(bx,by,boss.w,boss.h);
  // Head ornament
  ctx.fillStyle='#c026d3'; ctx.fillRect(bx+10,by-14,boss.w-20,14);
  // Eyes (angry)
  ctx.fillStyle='#fff'; ctx.fillRect(bx+12,by+14,18,14); ctx.fillRect(bx+50,by+14,18,14);
  ctx.fillStyle=boss.phase===2?'#dc2626':'#1e1b4b';
  ctx.fillRect(bx+14,by+16,14,10); ctx.fillRect(bx+52,by+16,14,10);
  // Mouth
  ctx.fillStyle='#fff'; ctx.fillRect(bx+18,by+38,boss.w-36,8);
  ctx.fillStyle='#000'; for(let t=0;t<5;t++) ctx.fillRect(bx+20+t*9,by+38,6,8);

  // HP bar
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(bx-5,by-26,boss.w+10,10);
  const hpGrad=ctx.createLinearGradient(bx-5,0,bx+boss.w+5,0);
  hpGrad.addColorStop(0,'#ef4444'); hpGrad.addColorStop(1,'#fbbf24');
  ctx.fillStyle=hpGrad; ctx.fillRect(bx-5,by-26,(boss.w+10)*(boss.hp/boss.maxHp),10);
  ctx.fillStyle='#fff'; ctx.font='bold 9px monospace';
  ctx.fillText('BOSS',bx+boss.w/2-12,by-18);

  // Projectiles
  for(const b of boss.projectiles){
    const px=Math.round(b.x-camX);
    ctx.fillStyle='#fbbf24';
    ctx.beginPath(); ctx.arc(px,b.y,b.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#f97316'; ctx.beginPath(); ctx.arc(px,b.y,b.r*0.5,0,Math.PI*2); ctx.fill();
  }
}

function drawPlayer(){
  if(player.dead) return;
  const flash=player.hurtTimer>0&&Math.floor(player.hurtTimer/6)%2;
  if(flash) return;
  const px=Math.round(player.x-camX), py=Math.round(player.y);
  const f=player.facing;

  // Body
  ctx.fillStyle='#6366f1'; ctx.fillRect(px,py+14,player.w,player.h-14);
  // Head
  ctx.fillStyle='#fde68a'; ctx.fillRect(px+(f>0?2:2),py,22,18);
  // Eyes
  ctx.fillStyle='#1e1b4b';
  ctx.fillRect(f>0?px+14:px+4,py+6,4,4);
  // Hair
  ctx.fillStyle='#1e3a8a'; ctx.fillRect(px,py,player.w,8);
  // Cape
  ctx.fillStyle='#dc2626';
  ctx.fillRect(f>0?px-4:px+player.w, py+10,8,18);
  // Legs (animated)
  if(Math.abs(player.vx)>0.5){
    player.runTimer++;
    if(player.runTimer>6){ player.runFrame=(player.runFrame+1)%4; player.runTimer=0; }
  }
  const legOff=[0,4,0,-4][player.runFrame];
  ctx.fillStyle='#4338ca';
  ctx.fillRect(px+2,py+player.h-12,9,12);
  ctx.fillRect(px+player.w-11,py+player.h-12+legOff,9,12);
}

function drawCoins(){
  for(const c of coins){
    if(c.collected) continue;
    const cx=Math.round(c.x-camX), cy=Math.round(c.y+Math.sin(c.anim)*3);
    const grd=ctx.createRadialGradient(cx+8,cy+8,0,cx+8,cy+8,10);
    grd.addColorStop(0,'#fde68a'); grd.addColorStop(1,'#f59e0b');
    ctx.fillStyle=grd;
    ctx.beginPath(); ctx.ellipse(cx+8,cy+8,7,8,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillRect(cx+3,cy+4,4,4);
  }
}

function drawCheckpoints(){
  for(const cp of checkpoints){
    const cx=Math.round(cp.x-camX);
    ctx.fillStyle=cp.reached?'#10b981':'#6b7280';
    ctx.fillRect(cx,cp.y,4,cp.h);
    // Flag
    ctx.fillStyle=cp.reached?'#34d399':'#9ca3af';
    ctx.beginPath(); ctx.moveTo(cx+4,cp.y); ctx.lineTo(cx+22,cp.y+8); ctx.lineTo(cx+4,cp.y+16); ctx.fill();
  }
}

function drawFlagpole(){
  const fx=Math.round(flagpole.x-camX);
  ctx.fillStyle='#fbbf24'; ctx.fillRect(fx+4,flagpole.y,4,flagpole.h);
  ctx.fillStyle=flagpole.reached?'#10b981':'#ef4444';
  ctx.beginPath(); ctx.moveTo(fx+8,flagpole.y); ctx.lineTo(fx+28,flagpole.y+12); ctx.lineTo(fx+8,flagpole.y+24); ctx.fill();
}

function drawHUD(){
  // HP hearts
  for(let i=0;i<player.maxHp;i++){
    ctx.font='20px serif';
    ctx.globalAlpha = i<player.hp?1:0.3;
    ctx.fillText('❤️',10+i*26,28);
  }
  ctx.globalAlpha=1;

  // Coins
  ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.roundRect(W-140,8,130,34,8); ctx.fill();
  ctx.font='bold 13px monospace'; ctx.fillStyle='#fbbf24';
  ctx.fillText('🪙 '+player.coins+' / '+coins.length, W-130, 30);

  // Best
  ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.roundRect(W-140,48,130,28,8); ctx.fill();
  ctx.font='bold 10px monospace'; ctx.fillStyle='#fcd34d';
  ctx.fillText('BEST: '+bestCoins, W-130, 67);

  // Combo
  if(comboCount>1&&comboTimer>0){
    ctx.save(); ctx.font='bold '+(18+comboCount*2)+'px monospace';
    ctx.fillStyle='#fbbf24'; ctx.globalAlpha=comboTimer/120;
    ctx.fillText(comboCount+'x COMBO!', W/2-60, 60);
    ctx.restore();
  }
}

let lastTime=0;
function loop(ts){
  const dt=Math.min((ts-lastTime)/16.67,3); lastTime=ts;
  ctx.clearRect(0,0,W,H);

  if(screenShake>0){
    ctx.save(); ctx.translate((Math.random()-0.5)*screenShake,(Math.random()-0.5)*screenShake);
  }

  drawParallax();
  for(const p of platforms) drawPlatform(p);
  drawCheckpoints();
  drawFlagpole();
  drawCoins();
  for(const e of enemies) drawEnemy(e);
  drawBoss();
  drawParticles();
  drawPlayer();

  if(screenShake>0) ctx.restore();

  drawHUD();
  if(phase==='playing') update();

  requestAnimationFrame(loop);
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  keys[e.code]=true; keys[e.key?.toLowerCase()]=true;
  if(e.code==='KeyP'||e.key==='p') togglePause();
  if(e.code==='KeyR'||e.key==='r') restartGame();
  e.preventDefault();
});
document.addEventListener('keyup',e=>{ keys[e.code]=false; keys[e.key?.toLowerCase()]=false; });

// ── TOUCH ─────────────────────────────────────────────────────────────────────
function touchBind(id,k){ const el=document.getElementById(id); if(!el)return; el.addEventListener('touchstart',e=>{e.preventDefault();keys[k]=true;resumeAC();},{passive:false}); el.addEventListener('touchend',e=>{e.preventDefault();keys[k]=false;},{passive:false}); }
touchBind('mc-left','ArrowLeft'); touchBind('mc-right','ArrowRight');
touchBind('mc-up','Space'); touchBind('mc-action','Space');

// ── OVERLAY ACTIONS ───────────────────────────────────────────────────────────
function startGame(){
  resumeAC();
  document.getElementById('start-screen').classList.remove('active');
  phase='playing';
}
function restartGame(){
  phase='playing';
  player={x:60,y:360,w:26,h:36,vx:0,vy:0,onGround:false,coyoteTimer:0,jumpBuffer:0,jumpsLeft:2,hp:3,maxHp:3,hurtTimer:0,facing:1,runFrame:0,runTimer:0,dead:false,coins:0,checkpointX:60,checkpointY:360};
  buildCoins(); buildEnemies();
  boss={x:5100,y:340,w:80,h:80,hp:8*Math.ceil(DIFF),maxHp:8*Math.ceil(DIFF),vx:2*DIFF,vy:0,dir:1,alive:true,phase:1,projectiles:[],shootTimer:0,jumpTimer:0,hitTimer:0,defeated:false};
  flagpole.reached=false; camX=0; particles=[]; screenShake=0; comboCount=0; comboTimer=0;
  for(const cp of checkpoints) cp.reached=false;
  document.getElementById('gameover-screen').classList.remove('active');
  document.getElementById('win-screen').classList.remove('active');
}
function togglePause(){
  if(phase==='playing'){phase='paused'; document.getElementById('pause-screen').classList.add('active');}
  else if(phase==='paused'){phase='playing'; document.getElementById('pause-screen').classList.remove('active');}
}

document.getElementById('btn-start')?.addEventListener('click',startGame);
document.getElementById('btn-restart')?.addEventListener('click',restartGame);
document.getElementById('btn-restart-go')?.addEventListener('click',restartGame);
document.getElementById('btn-resume')?.addEventListener('click',togglePause);

requestAnimationFrame(ts=>{ lastTime=ts; requestAnimationFrame(loop); });

})();
`;

  const html = `
<div class="game-wrapper">
  <canvas id="gameCanvas" width="800" height="480"></canvas>

  <div id="start-screen" class="overlay active">
    <div class="overlay-card">
      <div class="logo-icon">🍄</div>
      <h1>${title}</h1>
      <p>Parallax world • Enemies • Boss Fight • Checkpoints • 💰 ${hasCoins ? 'Coins' : ''}</p>
      <div class="key-grid">
        <div class="key-item"><kbd>← →</kbd> Move</div>
        <div class="key-item"><kbd>SPACE</kbd> Jump</div>
        <div class="key-item"><kbd>↑ / Z</kbd> Jump (Alt)</div>
        <div class="key-item"><kbd>Double</kbd> 2nd Jump</div>
        <div class="key-item"><kbd>P</kbd> Pause</div>
        <div class="key-item"><kbd>R</kbd> Restart</div>
      </div>
      <button id="btn-start" class="glow-btn">🚀 START ADVENTURE</button>
    </div>
  </div>

  <div id="gameover-screen" class="overlay">
    <div class="overlay-card danger">
      <div class="logo-icon">💀</div>
      <h2>GAME OVER</h2>
      <p>You ran out of lives. Try again!</p>
      <button id="btn-restart-go" class="glow-btn" style="margin-top:18px">🔄 RETRY</button>
    </div>
  </div>

  <div id="win-screen" class="overlay">
    <div class="overlay-card victory">
      <div class="logo-icon">🏆</div>
      <h2>YOU WIN!</h2>
      <p>You defeated the boss and collected <span id="win-score" style="color:#fbbf24;font-weight:800">0</span> coins!</p>
      <button id="btn-restart" class="glow-btn victory-btn" style="margin-top:18px">🔄 PLAY AGAIN</button>
    </div>
  </div>

  <div id="pause-screen" class="overlay">
    <div class="overlay-card">
      <h2>⏸ PAUSED</h2>
      <button id="btn-resume" class="glow-btn" style="margin-top:14px">▶ RESUME</button>
    </div>
  </div>

  <div class="mobile-controls">
    <div class="dpad-h">
      <button id="mc-left" class="dpad-btn">◄</button>
      <button id="mc-right" class="dpad-btn">►</button>
    </div>
    <button id="mc-action" class="action-btn jump-btn">JUMP</button>
  </div>
</div>
`;

  const css = `
* { box-sizing:border-box; margin:0; padding:0; }
body,html { width:100%; height:100%; overflow:hidden; background:#0a0015; font-family:'Segoe UI',sans-serif; }
.game-wrapper { position:relative; width:100%; height:100vh; display:flex; align-items:center; justify-content:center; }
#gameCanvas { display:block; max-width:100%; max-height:100vh; image-rendering:pixelated; image-rendering:crisp-edges; }
.overlay { display:none; position:absolute; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); align-items:center; justify-content:center; z-index:20; }
.overlay.active { display:flex; }
.overlay-card { background:linear-gradient(135deg,#0f0a1e,#1e1035); border:1px solid rgba(139,92,246,0.45); border-radius:22px; padding:36px 44px; text-align:center; max-width:440px; box-shadow:0 20px 60px rgba(99,102,241,0.3); }
.overlay-card.danger { border-color:rgba(239,68,68,0.5); box-shadow:0 20px 60px rgba(239,68,68,0.2); }
.overlay-card.victory { border-color:rgba(251,191,36,0.5); box-shadow:0 20px 60px rgba(251,191,36,0.3); }
.logo-icon { font-size:52px; margin-bottom:10px; }
h1 { font-size:20px; font-weight:800; color:#fff; margin-bottom:8px; }
h2 { font-size:22px; font-weight:800; color:#fff; margin-bottom:10px; }
p { color:#94a3b8; font-size:13px; }
.key-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin:18px 0 24px; text-align:left; }
.key-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#cbd5e1; }
kbd { background:#334155; color:#e2e8f0; padding:2px 7px; border-radius:5px; font-size:11px; border:1px solid #475569; }
.glow-btn { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; padding:13px 30px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 6px 20px rgba(99,102,241,0.35); }
.glow-btn.victory-btn { background:linear-gradient(135deg,#f59e0b,#fbbf24); box-shadow:0 6px 20px rgba(251,191,36,0.4); color:#000; }
.glow-btn:hover { transform:translateY(-2px); }
.mobile-controls { display:none; position:absolute; bottom:16px; width:100%; padding:0 16px; justify-content:space-between; align-items:flex-end; z-index:15; }
@media (max-width:768px),(pointer:coarse) { .mobile-controls { display:flex; } }
.dpad-h { display:flex; gap:8px; }
.dpad-btn { width:54px; height:54px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); border-radius:12px; color:#fff; font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center; user-select:none; }
.action-btn { width:70px; height:70px; border:none; border-radius:50%; color:#fff; font-size:12px; font-weight:800; cursor:pointer; user-select:none; }
.jump-btn { background:radial-gradient(circle,#10b981,#059669); box-shadow:0 0 18px rgba(16,185,129,0.5); }
`;

  return { title, description, controls, html, css, js };
}
