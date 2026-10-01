/* ============================================
   PROFESSIONAL ZOMBIE SURVIVAL – Outbreak
   Wave system | 3 zombie types | weapon upgrades
   blood splatter | exp bar | medkits | save system
   360° mouse/touch aiming | screen shake
   ============================================ */

export function createZombieGame(config = {}) {
  const {
    hasWaves = true, hasWeaponUpgrades = true,
    hasBloodParticles = true, hasMedkits = true,
    difficulty = 'normal', isTopDown = true,
  } = config;

  const title = 'Outbreak: Zombie Survival';
  const description = 'Top-down zombie survival with wave system, weapon upgrades, blood splatter particles, and save progress.';
  const controls = 'WASD / Arrow Keys Move | Mouse Aim & Fire | R Reload | E Upgrade | M Medkit | P Pause';

  const diffMult = difficulty === 'hard' ? 1.5 : difficulty === 'easy' ? 0.7 : 1.0;

  const js = `
(function(){
'use strict';

const W=800, H=480, DIFF=${diffMult};
const TILE=40; // room tile size

// ── SAVE ─────────────────────────────────────────────────────────────────────
const SAVE_KEY='outbreak_save';
function loadSave(){ try{ return JSON.parse(localStorage.getItem(SAVE_KEY))||{}; }catch{ return{}; } }
function writeSave(d){ try{ localStorage.setItem(SAVE_KEY,JSON.stringify(d)); }catch{} }
let save=loadSave();
let bestWave=save.bestWave||0;
let bestKills=save.bestKills||0;

// ── CANVAS ────────────────────────────────────────────────────────────────────
const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
let mouseX=W/2, mouseY=H/2;
canvas.addEventListener('mousemove',e=>{ const r=canvas.getBoundingClientRect(); const sx=canvas.clientWidth/W; mouseX=(e.clientX-r.left)/sx; mouseY=(e.clientY-r.top)/sx; });
canvas.addEventListener('click',()=>{ if(phase==='playing') shoot(); resumeAC(); });
function resize(){ const r=Math.min(window.innerWidth/W,window.innerHeight/H); canvas.style.width=(W*r)+'px'; canvas.style.height=(H*r)+'px'; }
window.addEventListener('resize',resize); resize();

// ── AUDIO ─────────────────────────────────────────────────────────────────────
const AC=(window.AudioContext||window.webkitAudioContext)?new(window.AudioContext||window.webkitAudioContext)():null;
function resumeAC(){ if(AC&&AC.state==='suspended') AC.resume(); }
function sfx(freq,dur,type='square',vol=0.2,sweep=0){
  if(!AC)return;
  const g=AC.createGain(); g.gain.setValueAtTime(vol,AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+dur);
  const o=AC.createOscillator(); o.type=type; o.frequency.value=freq;
  if(sweep) o.frequency.exponentialRampToValueAtTime(sweep,AC.currentTime+dur);
  o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+dur);
}
function sfxGunshot(){ sfx(800,0.08,'sawtooth',0.35,200); sfx(300,0.12,'triangle',0.1,100); }
function sfxZombieDie(){ sfx(120,0.3,'sawtooth',0.25,60); }
function sfxPlayerHurt(){ sfx(200,0.2,'square',0.3,80); }
function sfxReload(){ sfx(550,0.05,'square',0.15); setTimeout(()=>sfx(660,0.05,'square',0.15),100); }
function sfxMedkit(){ [440,550,660].forEach((f,i)=>setTimeout(()=>sfx(f,0.1,'triangle',0.15),i*80)); }
function sfxWaveClear(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>sfx(f,0.2,'square',0.1),i*100)); }
function sfxUpgrade(){ [300,400,600,800,1000].forEach((f,i)=>setTimeout(()=>sfx(f,0.1,'square',0.15),i*60)); }

// ── PARTICLES ─────────────────────────────────────────────────────────────────
let particles=[];
function addP(x,y,opts={}){
  particles.push({x,y,vx:opts.vx||(Math.random()-0.5)*opts.spread||0,vy:opts.vy||(Math.random()-0.5)*opts.spread||0,life:1,decay:opts.decay||0.03,size:opts.size||(3+Math.random()*4),color:opts.color||'#ef4444',type:opts.type||'dot',gravity:opts.gravity||0});
}
function spawnBlood(x,y,count=12){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2, s=1+Math.random()*5;
    addP(x,y,{vx:Math.cos(a)*s,vy:Math.sin(a)*s,color:i%3?'#ef4444':'#991b1b',size:2+Math.random()*5,decay:0.015,type:'blob'});
  }
}
function spawnMuzzleFlash(x,y,angle){
  for(let i=0;i<6;i++){
    addP(x,y,{vx:Math.cos(angle+( Math.random()-0.5)*0.5)*8,vy:Math.sin(angle+(Math.random()-0.5)*0.5)*8,color:i%2?'#fbbf24':'#fff',size:3+Math.random()*4,decay:0.15,type:'dot'});
  }
}
function spawnExplosion(x,y){
  for(let i=0;i<25;i++){
    const a=Math.random()*Math.PI*2, s=1+Math.random()*6;
    addP(x,y,{vx:Math.cos(a)*s,vy:Math.sin(a)*s,color:['#fbbf24','#f97316','#ef4444','#fff'][Math.floor(Math.random()*4)],size:4+Math.random()*8,decay:0.025});
  }
}
function updateParticles(){ for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.life-=p.decay; if(p.life<=0) particles.splice(i,1); } }
function drawParticles(){
  for(const p of particles){
    ctx.save(); ctx.globalAlpha=p.life*0.9;
    ctx.fillStyle=p.color;
    if(p.type==='blob'){ ctx.beginPath(); ctx.ellipse(p.x,p.y,p.size*(0.5+p.life*0.5),p.size*(0.5+p.life*0.5)*0.6,Math.atan2(p.vy,p.vx),0,Math.PI*2); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
}

// ── ROOM / MAP ─────────────────────────────────────────────────────────────────
const WALLS=[];
function buildRoom(){
  WALLS.length=0;
  // Outer walls
  for(let x=0;x<W;x+=TILE){ WALLS.push({x,y:0,w:TILE,h:TILE}); WALLS.push({x,y:H-TILE,w:TILE,h:TILE}); }
  for(let y=TILE;y<H-TILE;y+=TILE){ WALLS.push({x:0,y,w:TILE,h:TILE}); WALLS.push({x:W-TILE,y,w:TILE,h:TILE}); }
  // Interior obstacles
  const obstacles=[
    {x:200,y:120,w:80,h:80},{x:500,y:100,w:80,h:80},
    {x:150,y:280,w:80,h:40},{x:560,y:270,w:80,h:40},{x:360,y:200,w:40,h:120},
    {x:250,y:340,w:120,h:40},{x:450,y:340,w:120,h:40},
  ];
  for(const o of obstacles) WALLS.push(o);
}
buildRoom();

function aabb(a,b){ return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y; }
function wallCollide(obj){
  for(const w of WALLS){
    if(!aabb(obj,w)) continue;
    const ox=Math.min(obj.x+obj.w-w.x,w.x+w.w-obj.x);
    const oy=Math.min(obj.y+obj.h-w.y,w.y+w.h-obj.y);
    if(ox<oy){ if(obj.x<w.x) obj.x-=ox; else obj.x+=ox; }
    else { if(obj.y<w.y) obj.y-=oy; else obj.y+=oy; }
  }
}

// ── WEAPONS ───────────────────────────────────────────────────────────────────
const WEAPONS=[
  {name:'Pistol',    damage:25,  fireRate:18, ammo:15, maxAmmo:15, reloadTime:90,  bulletSpeed:14, spread:0.05, color:'#94a3b8'},
  {name:'Shotgun',   damage:18,  fireRate:35, ammo:8,  maxAmmo:8,  reloadTime:120, bulletSpeed:12, spread:0.3,  color:'#f59e0b', pellets:5},
  {name:'SMG',       damage:12,  fireRate:6,  ammo:30, maxAmmo:30, reloadTime:70,  bulletSpeed:16, spread:0.1,  color:'#10b981'},
  {name:'Sniper',    damage:80,  fireRate:60, ammo:5,  maxAmmo:5,  reloadTime:140, bulletSpeed:22, spread:0.01, color:'#6366f1'},
  {name:'Minigun',   damage:8,   fireRate:3,  ammo:100,maxAmmo:100,reloadTime:200, bulletSpeed:18, spread:0.15, color:'#ef4444'},
];
let currentWeaponIdx=0;
let weaponState={ ammo:WEAPONS[0].maxAmmo, cooldown:0, reloading:false, reloadTimer:0 };
let weaponsUnlocked=[0]; // indices

// ── PLAYER ────────────────────────────────────────────────────────────────────
let player={
  x:W/2-16,y:H/2-16,w:28,h:28,
  hp:100,maxHp:100,speed:3.2,
  exp:0,level:1,nextExp:100,
  kills:0,hurtTimer:0,
  medkits:3,
};
let screenShake=0;

// ── BULLETS ───────────────────────────────────────────────────────────────────
let bullets=[];
function shoot(){
  const wp=WEAPONS[currentWeaponIdx];
  if(weaponState.reloading||weaponState.cooldown>0) return;
  if(weaponState.ammo<=0){ startReload(); return; }

  weaponState.ammo--;
  weaponState.cooldown=wp.fireRate;

  const angle=Math.atan2(mouseY-(player.y+player.h/2), mouseX-(player.x+player.w/2));
  const bx=player.x+player.w/2, by=player.y+player.h/2;
  const pellets=wp.pellets||1;
  for(let p=0;p<pellets;p++){
    const spr=(Math.random()-0.5)*wp.spread*2;
    bullets.push({ x:bx,y:by,vx:Math.cos(angle+spr)*wp.bulletSpeed,vy:Math.sin(angle+spr)*wp.bulletSpeed,damage:wp.damage,r:pellets>1?4:5,life:1,team:'player' });
  }
  spawnMuzzleFlash(bx+Math.cos(angle)*20, by+Math.sin(angle)*20, angle);
  sfxGunshot(); screenShake=2;
}
function startReload(){
  if(weaponState.reloading) return;
  weaponState.reloading=true;
  weaponState.reloadTimer=WEAPONS[currentWeaponIdx].reloadTime;
  sfxReload();
}

// ── ZOMBIES ───────────────────────────────────────────────────────────────────
let zombies=[];
let wave=0, waveTimer=0, waveActive=false, betweenWave=false, betweenTimer=0;
let totalZombiesInWave=0, zombiesKilledThisWave=0;
const ZOMBIE_TYPES=[
  {name:'Walker', hp:60*DIFF,  speed:1.2*DIFF, damage:8,  size:26, color:'#16a34a', reward:20,  xpReward:10},
  {name:'Runner', hp:35*DIFF,  speed:2.6*DIFF, damage:6,  size:22, color:'#b45309', reward:30,  xpReward:15},
  {name:'Tank',   hp:200*DIFF, speed:0.7*DIFF, damage:18, size:40, color:'#6d28d9', reward:60,  xpReward:40},
];

function spawnZombie(type,x,y){
  const t=ZOMBIE_TYPES[type]||ZOMBIE_TYPES[0];
  zombies.push({x:x||Math.random()*W,y:y||20,w:t.size,h:t.size,hp:t.hp,maxHp:t.hp,speed:t.speed+(Math.random()-0.5)*0.3,damage:t.damage,color:t.color,reward:t.reward,xpReward:t.xpReward,type,hurtTimer:0,attackTimer:0,angle:0,splitOnDeath:type===2});
}

function spawnWave(){
  wave++;
  const count=Math.floor((5+wave*3)*DIFF);
  totalZombiesInWave=count; zombiesKilledThisWave=0;
  const spawnPoints=[ {x:TILE*2,y:TILE*2},{x:W-TILE*3,y:TILE*2},{x:TILE*2,y:H-TILE*3},{x:W-TILE*3,y:H-TILE*3},{x:W/2,y:TILE*2},{x:W/2,y:H-TILE*3} ];
  for(let i=0;i<count;i++){
    const sp=spawnPoints[i%spawnPoints.length];
    const offset=()=>(Math.random()-0.5)*60;
    const typeChance=Math.random();
    const t=wave>3&&typeChance<0.15?2:(typeChance<0.35?1:0);
    setTimeout(()=>spawnZombie(t, sp.x+offset(), sp.y+offset()), i*120);
  }
  waveActive=true; betweenWave=false;
}

// ── MEDKITS & DROPS ───────────────────────────────────────────────────────────
let drops=[];
function spawnDrop(x,y,type){
  drops.push({x,y,w:18,h:18,type,anim:0,life:300});
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
let phase='start',frameCount=0,keys={};
let score=0,multiplier=1,multiTimer=0;

function update(){
  if(phase!=='playing') return;
  frameCount++;

  // Wave management
  if(!waveActive && !betweenWave){ spawnWave(); }
  if(betweenWave){ betweenTimer--; if(betweenTimer<=0){ betweenWave=false; } }
  if(waveActive && zombies.length===0 && zombiesKilledThisWave>=totalZombiesInWave){
    waveActive=false; betweenWave=true; betweenTimer=180;
    if(wave>bestWave){ bestWave=wave; writeSave({bestWave,bestKills}); }
    sfxWaveClear();
    // Drop medkit every 3 waves
    if(wave%3===0) spawnDrop(W/2,H/2,'medkit');
    // Unlock weapon
    if(wave===3&&!weaponsUnlocked.includes(1)){ weaponsUnlocked.push(1); }
    if(wave===6&&!weaponsUnlocked.includes(2)){ weaponsUnlocked.push(2); }
    if(wave===10&&!weaponsUnlocked.includes(3)){ weaponsUnlocked.push(3); }
    if(wave===15&&!weaponsUnlocked.includes(4)){ weaponsUnlocked.push(4); }
  }

  // Player input
  const mv=player.speed;
  if(keys['KeyW']||keys['ArrowUp']||keys['w']||keys['arrowup'])    { player.y-=mv; }
  if(keys['KeyS']||keys['ArrowDown']||keys['s']||keys['arrowdown']) { player.y+=mv; }
  if(keys['KeyA']||keys['ArrowLeft']||keys['a']||keys['arrowleft']) { player.x-=mv; }
  if(keys['KeyD']||keys['ArrowRight']||keys['d']||keys['arrowright']){ player.x+=mv; }
  player.x=Math.max(TILE,Math.min(W-TILE-player.w, player.x));
  player.y=Math.max(TILE,Math.min(H-TILE-player.h, player.y));
  wallCollide(player);

  // Auto-shoot (hold fire)
  if(keys['mouse']||keys['MouseButton0']){
    if(weaponState.cooldown===0) shoot();
  }

  // Weapon cooldown / reload
  if(weaponState.cooldown>0) weaponState.cooldown--;
  if(weaponState.reloading){
    weaponState.reloadTimer--;
    if(weaponState.reloadTimer<=0){ weaponState.ammo=WEAPONS[currentWeaponIdx].maxAmmo; weaponState.reloading=false; }
  }

  // Medkit
  if(keys['KeyM']||keys['m']||keys['keym']){
    keys['KeyM']=false; keys['m']=false;
    if(player.medkits>0&&player.hp<player.maxHp){ player.medkits--; player.hp=Math.min(player.maxHp,player.hp+40); sfxMedkit(); }
  }

  // Weapon switch with number keys
  for(let i=0;i<weaponsUnlocked.length;i++){
    if(keys['Digit'+(i+1)]||keys[(i+1).toString()]){ currentWeaponIdx=weaponsUnlocked[i]; weaponState={ammo:WEAPONS[weaponsUnlocked[i]].maxAmmo,cooldown:0,reloading:false,reloadTimer:0}; }
  }
  if(keys['KeyR']||keys['r']||keys['keyr']){ keys['KeyR']=false; keys['r']=false; startReload(); }

  // Upgrade (E key) – spend XP to level up
  if((keys['KeyE']||keys['e']||keys['keye'])&&player.exp>=player.nextExp){
    keys['KeyE']=false; keys['e']=false;
    player.exp-=player.nextExp;
    player.level++;
    player.nextExp=Math.floor(player.nextExp*1.5);
    player.maxHp+=20; player.hp=Math.min(player.maxHp,player.hp+20);
    player.speed+=0.15; sfxUpgrade();
  }

  // Update bullets
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];
    b.x+=b.vx; b.y+=b.vy;
    let hit=false;
    if(b.x<0||b.x>W||b.y<0||b.y>H) hit=true;
    for(const w of WALLS){ if(aabb({x:b.x-b.r,y:b.y-b.r,w:b.r*2,h:b.r*2},w)){ hit=true; break; } }
    if(hit){ bullets.splice(i,1); continue; }
    // Hit zombies
    for(let j=zombies.length-1;j>=0;j--){
      const z=zombies[j];
      if(aabb({x:b.x-b.r,y:b.y-b.r,w:b.r*2,h:b.r*2},{x:z.x,y:z.y,w:z.w,h:z.h})){
        z.hp-=b.damage; z.hurtTimer=8;
        spawnBlood(b.x,b.y,6);
        bullets.splice(i,1);
        if(z.hp<=0){
          spawnBlood(z.x+z.w/2,z.y+z.h/2,18);
          spawnDrop(z.x+z.w/2,z.y+z.h/2, Math.random()<0.1?'medkit':'none');
          score+=z.reward*multiplier;
          player.kills++; player.exp+=z.xpReward;
          zombiesKilledThisWave++;
          if(player.kills>bestKills){ bestKills=player.kills; writeSave({bestWave,bestKills}); }
          multiplier=Math.min(8,multiplier+0.25); multiTimer=240;
          sfxZombieDie();
          zombies.splice(j,1);
        }
        break;
      }
    }
  }

  // Update zombies
  for(const z of zombies){
    if(z.hurtTimer>0){ z.hurtTimer--; continue; }
    // Pathfind toward player (simple chase + wall avoidance)
    const dx=player.x+player.w/2-(z.x+z.w/2);
    const dy=player.y+player.h/2-(z.y+z.h/2);
    const dist=Math.sqrt(dx*dx+dy*dy)||1;
    z.angle=Math.atan2(dy,dx);
    z.x+=Math.cos(z.angle)*z.speed;
    z.y+=Math.sin(z.angle)*z.speed;
    wallCollide(z);

    // Attack player
    if(player.hurtTimer===0&&aabb(player,{x:z.x,y:z.y,w:z.w,h:z.h})){
      player.hp-=z.damage; player.hurtTimer=30;
      screenShake=8; sfxPlayerHurt();
      if(player.hp<=0){ phase='gameover'; document.getElementById('go-wave').textContent=wave; document.getElementById('go-kills').textContent=player.kills; document.getElementById('go-score').textContent=Math.round(score); document.getElementById('go-best').textContent=bestWave; document.getElementById('gameover-screen').classList.add('active'); }
    }
  }

  // Drops
  for(let i=drops.length-1;i>=0;i--){
    const d=drops[i]; d.anim+=0.08; d.life--;
    if(d.life<=0||d.type==='none'){ drops.splice(i,1); continue; }
    if(aabb(player,{x:d.x-9,y:d.y-9,w:18,h:18})){
      if(d.type==='medkit'&&player.hp<player.maxHp){ player.hp=Math.min(player.maxHp,player.hp+30); sfxMedkit(); drops.splice(i,1); }
    }
  }

  if(multiTimer>0) multiTimer--; else multiplier=1;
  if(player.hurtTimer>0) player.hurtTimer--;
  if(screenShake>0) screenShake=Math.max(0,screenShake-0.6);
  updateParticles();
}

// ── DRAW ──────────────────────────────────────────────────────────────────────
function drawRoom(){
  ctx.fillStyle='#111827'; ctx.fillRect(0,0,W,H);
  // Floor tiles
  for(let x=TILE;x<W-TILE;x+=TILE){
    for(let y=TILE;y<H-TILE;y+=TILE){
      ctx.fillStyle=(Math.floor(x/TILE)+Math.floor(y/TILE))%2?'#1f2937':'#1a2332';
      ctx.fillRect(x,y,TILE,TILE);
    }
  }
  // Walls
  for(const w of WALLS){
    const wall=w.w>=W||w.h>=H; // skip outer boundary detection
    ctx.fillStyle='#374151';
    ctx.fillRect(w.x,w.y,w.w,w.h);
    // Wall shading
    ctx.fillStyle='rgba(0,0,0,0.3)';
    ctx.fillRect(w.x,w.y,w.w,4);
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.fillRect(w.x,w.y+4,4,w.h-4);
  }
}

function drawPlayer(){
  const px=player.x, py=player.y;
  const angle=Math.atan2(mouseY-(py+player.h/2), mouseX-(px+player.w/2));
  const flash=player.hurtTimer>0&&Math.floor(player.hurtTimer/6)%2;

  if(!flash){
    // Body
    ctx.fillStyle='#6366f1'; ctx.beginPath(); ctx.arc(px+player.w/2,py+player.h/2,player.w/2,0,Math.PI*2); ctx.fill();
    // Direction indicator
    ctx.fillStyle='#a5b4fc';
    ctx.beginPath(); ctx.arc(px+player.w/2+Math.cos(angle)*10, py+player.h/2+Math.sin(angle)*10, 5,0,Math.PI*2); ctx.fill();
    // Gun
    ctx.save(); ctx.translate(px+player.w/2, py+player.h/2); ctx.rotate(angle);
    ctx.fillStyle=WEAPONS[currentWeaponIdx].color;
    ctx.fillRect(8,-3,20,6); ctx.restore();
    // Shadow
    ctx.save(); ctx.globalAlpha=0.3; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(px+player.w/2,py+player.h+4,player.w*0.5,6,0,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
}

function drawZombie(z){
  const zx=z.x+z.w/2, zy=z.y+z.h/2;
  const r=z.w/2;
  // Shadow
  ctx.save(); ctx.globalAlpha=0.25; ctx.fillStyle='#000';
  ctx.beginPath(); ctx.ellipse(zx,zy+r,r*0.8,5,0,0,Math.PI*2); ctx.fill(); ctx.restore();

  // Body
  ctx.fillStyle=z.hurtTimer>0?'#fff':z.color;
  ctx.beginPath(); ctx.arc(zx,zy,r,0,Math.PI*2); ctx.fill();
  // Eyes
  ctx.fillStyle='#fee2e2'; ctx.beginPath(); ctx.arc(zx-r*0.3,zy-r*0.2,r*0.2,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(zx+r*0.3,zy-r*0.2,r*0.2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#dc2626'; ctx.beginPath(); ctx.arc(zx-r*0.3,zy-r*0.2,r*0.1,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(zx+r*0.3,zy-r*0.2,r*0.1,0,Math.PI*2); ctx.fill();
  // Arms (outstretched)
  ctx.strokeStyle=z.color; ctx.lineWidth=r*0.3;
  const arm=z.angle;
  ctx.beginPath(); ctx.moveTo(zx-Math.cos(arm)*r,zy-Math.sin(arm)*r); ctx.lineTo(zx+Math.cos(arm)*r*1.4,zy+Math.sin(arm)*r*1.4); ctx.stroke();

  // HP bar (only if not full)
  if(z.hp<z.maxHp){
    const bw=z.w+4, bh=5, bx=z.x-2, by=z.y-10;
    ctx.fillStyle='#450a0a'; ctx.fillRect(bx,by,bw,bh);
    ctx.fillStyle='#ef4444'; ctx.fillRect(bx,by,bw*(z.hp/z.maxHp),bh);
  }

  // Type label for tanks
  if(z.w>30){ ctx.fillStyle='#fff'; ctx.font='bold 8px monospace'; ctx.fillText('TANK',zx-12,zy+r+14); }
}

function drawBullets(){
  for(const b of bullets){
    const len=Math.sqrt(b.vx*b.vx+b.vy*b.vy);
    ctx.save();
    ctx.translate(b.x,b.y); ctx.rotate(Math.atan2(b.vy,b.vx));
    ctx.fillStyle='#fbbf24';
    ctx.fillRect(-len*0.6,-b.r*0.5,len*0.6,b.r);
    ctx.restore();
  }
}

function drawDrops(){
  for(const d of drops){
    if(d.type==='none') continue;
    ctx.save(); ctx.globalAlpha=0.7+0.3*Math.abs(Math.sin(d.anim));
    ctx.fillStyle='#10b981';
    ctx.beginPath(); ctx.roundRect(d.x-9,d.y-9,18,18,5); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 12px serif'; ctx.textAlign='center'; ctx.fillText('➕',d.x,d.y+5);
    ctx.textAlign='left'; ctx.restore();
  }
}

function drawHUD(){
  // HP bar
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(10,10,200,18,6); ctx.fill();
  const hpGrad=ctx.createLinearGradient(10,0,210,0);
  hpGrad.addColorStop(0,'#ef4444'); hpGrad.addColorStop(0.5,'#f97316'); hpGrad.addColorStop(1,'#10b981');
  ctx.fillStyle=hpGrad; ctx.beginPath(); ctx.roundRect(10,10,200*(player.hp/player.maxHp),18,6); ctx.fill();
  ctx.fillStyle='#fff'; ctx.font='bold 10px monospace'; ctx.fillText('HP '+player.hp+'/'+player.maxHp,16,23);

  // XP bar
  ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.roundRect(10,32,200,10,4); ctx.fill();
  ctx.fillStyle='#818cf8'; ctx.beginPath(); ctx.roundRect(10,32,200*(player.exp/player.nextExp),10,4); ctx.fill();
  ctx.fillStyle='#a5b4fc'; ctx.font='bold 8px monospace';
  ctx.fillText('LV '+player.level+' EXP '+player.exp+'/'+player.nextExp+(player.exp>=player.nextExp?' [E] LEVEL UP!':''),14,40);

  // Weapon
  const wp=WEAPONS[currentWeaponIdx];
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(10,H-64,210,54,10); ctx.fill();
  ctx.fillStyle=wp.color; ctx.font='bold 13px monospace'; ctx.fillText(wp.name,18,H-45);
  ctx.fillStyle='#fff'; ctx.font='bold 11px monospace';
  if(weaponState.reloading){ ctx.fillStyle='#f59e0b'; ctx.fillText('RELOADING... '+(Math.ceil(weaponState.reloadTimer/60)*60-weaponState.reloadTimer>0?'':Math.ceil(weaponState.reloadTimer/60*100)/100+'s'),18,H-29); }
  else { ctx.fillText('Ammo: '+weaponState.ammo+' / '+wp.maxAmmo,18,H-29); }
  ctx.fillStyle='#94a3b8'; ctx.font='bold 9px monospace';
  ctx.fillText('🩺 '+player.medkits+' Medkits [M]  |  [R] Reload',18,H-12);

  // Wave / score panel
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(W-190,10,180,70,10); ctx.fill();
  ctx.fillStyle='#fbbf24'; ctx.font='bold 14px monospace'; ctx.fillText('Wave '+wave, W-180, 32);
  ctx.fillStyle='#e2e8f0'; ctx.font='bold 11px monospace';
  ctx.fillText('Score: '+Math.round(score), W-180, 50);
  ctx.fillText('Kills: '+player.kills, W-180, 66);
  ctx.fillStyle='#94a3b8'; ctx.font='bold 9px monospace';
  ctx.fillText('Best Wave: '+bestWave, W-180, 78);

  // Multiplier
  if(multiplier>1){
    ctx.save(); ctx.globalAlpha=multiTimer/240;
    ctx.fillStyle='#fbbf24'; ctx.font='bold '+(14+multiplier*2)+'px monospace';
    ctx.fillText('x'+multiplier.toFixed(1)+' MULTIPLIER', W/2-80, 40);
    ctx.restore();
  }

  // Between wave overlay
  if(betweenWave){
    ctx.save(); ctx.globalAlpha=0.7; ctx.fillStyle='#111827';
    ctx.fillRect(W/2-180,H/2-38,360,76);
    ctx.globalAlpha=1; ctx.fillStyle='#10b981'; ctx.font='bold 20px monospace'; ctx.textAlign='center';
    ctx.fillText('Wave '+wave+' Cleared! ✓',W/2,H/2-5);
    ctx.fillStyle='#94a3b8'; ctx.font='bold 12px monospace';
    ctx.fillText('Wave '+(wave+1)+' incoming...',W/2,H/2+22);
    ctx.textAlign='left'; ctx.restore();
  }

  // Unlocked weapons bar
  if(weaponsUnlocked.length>1){
    ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.roundRect(W/2-weaponsUnlocked.length*35,H-52,weaponsUnlocked.length*70,44,10); ctx.fill();
    ctx.textAlign='center';
    for(let i=0;i<weaponsUnlocked.length;i++){
      const wi=weaponsUnlocked[i]; const bx=W/2-weaponsUnlocked.length*35+i*70+35;
      ctx.fillStyle=currentWeaponIdx===wi?'rgba(99,102,241,0.5)':'rgba(255,255,255,0.05)';
      ctx.fillRect(bx-30,H-50,60,40);
      ctx.fillStyle=WEAPONS[wi].color; ctx.font='bold 9px monospace';
      ctx.fillText((i+1)+':'+WEAPONS[wi].name,bx,H-28);
    }
    ctx.textAlign='left';
  }
}

let lastTime=0;
function loop(ts){
  const dt=Math.min((ts-lastTime)/16.67,3); lastTime=ts;
  ctx.clearRect(0,0,W,H);
  if(screenShake>0){ ctx.save(); ctx.translate((Math.random()-0.5)*screenShake,(Math.random()-0.5)*screenShake); }
  drawRoom();
  drawDrops();
  drawParticles();
  drawBullets();
  for(const z of zombies) drawZombie(z);
  drawPlayer();
  if(screenShake>0) ctx.restore();
  drawHUD();
  if(phase==='playing') update();
  requestAnimationFrame(loop);
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
document.addEventListener('keydown',e=>{ keys[e.code]=true; keys[e.key?.toLowerCase()]=true; if(e.code==='KeyP'||e.key==='p') togglePause(); if(e.code==='KeyR'&&phase!=='playing') restartGame(); e.preventDefault(); });
document.addEventListener('keyup',e=>{ keys[e.code]=false; keys[e.key?.toLowerCase()]=false; });
canvas.addEventListener('mousedown',e=>{ keys['mouse']=true; keys['MouseButton0']=true; resumeAC(); if(phase==='playing') shoot(); });
canvas.addEventListener('mouseup',e=>{ keys['mouse']=false; keys['MouseButton0']=false; });

// ── OVERLAY ───────────────────────────────────────────────────────────────────
function startGame(){ resumeAC(); document.getElementById('start-screen').classList.remove('active'); phase='playing'; }
function restartGame(){
  player={x:W/2-16,y:H/2-16,w:28,h:28,hp:100,maxHp:100,speed:3.2,exp:0,level:1,nextExp:100,kills:0,hurtTimer:0,medkits:3};
  zombies=[]; bullets=[]; particles=[]; drops=[]; screenShake=0;
  wave=0; waveTimer=0; waveActive=false; betweenWave=false; betweenTimer=0;
  currentWeaponIdx=0; weaponState={ammo:WEAPONS[0].maxAmmo,cooldown:0,reloading:false,reloadTimer:0};
  weaponsUnlocked=[0]; score=0; multiplier=1; multiTimer=0;
  document.getElementById('gameover-screen').classList.remove('active');
  phase='playing';
}
function togglePause(){
  if(phase==='playing'){ phase='paused'; document.getElementById('pause-screen').classList.add('active'); }
  else if(phase==='paused'){ phase='playing'; document.getElementById('pause-screen').classList.remove('active'); }
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
      <div class="logo-icon">🧟</div>
      <h1>${title}</h1>
      <p>Wave-based survival • 3 Zombie types • Weapon upgrades • Blood particles</p>
      <div class="key-grid">
        <div class="key-item"><kbd>WASD</kbd> Move</div>
        <div class="key-item"><kbd>Mouse</kbd> Aim & Fire</div>
        <div class="key-item"><kbd>R</kbd> Reload</div>
        <div class="key-item"><kbd>M</kbd> Medkit</div>
        <div class="key-item"><kbd>E</kbd> Level Up</div>
        <div class="key-item"><kbd>1-5</kbd> Weapons</div>
      </div>
      <button id="btn-start" class="glow-btn">🔫 START SURVIVAL</button>
    </div>
  </div>

  <div id="gameover-screen" class="overlay">
    <div class="overlay-card danger">
      <div class="logo-icon">💀</div>
      <h2>YOU DIED</h2>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">Wave</span><span id="go-wave" class="stat-val">0</span></div>
        <div class="stat-item"><span class="stat-label">Kills</span><span id="go-kills" class="stat-val">0</span></div>
        <div class="stat-item"><span class="stat-label">Score</span><span id="go-score" class="stat-val">0</span></div>
        <div class="stat-item"><span class="stat-label">Best Wave</span><span id="go-best" class="stat-val">0</span></div>
      </div>
      <button id="btn-restart-go" class="glow-btn">🔄 TRY AGAIN</button>
    </div>
  </div>

  <div id="pause-screen" class="overlay">
    <div class="overlay-card">
      <h2>⏸ PAUSED</h2>
      <button id="btn-resume" class="glow-btn" style="margin-top:14px">▶ RESUME</button>
      <br><button id="btn-restart" class="glow-btn ghost" style="margin-top:10px">🔄 RESTART</button>
    </div>
  </div>
</div>
`;

  const css = `
* { box-sizing:border-box; margin:0; padding:0; }
body,html { width:100%; height:100%; overflow:hidden; background:#000; font-family:'Segoe UI',sans-serif; }
.game-wrapper { position:relative; width:100%; height:100vh; display:flex; align-items:center; justify-content:center; }
#gameCanvas { display:block; max-width:100%; max-height:100vh; cursor:crosshair; }
.overlay { display:none; position:absolute; inset:0; background:rgba(0,0,0,0.88); backdrop-filter:blur(6px); align-items:center; justify-content:center; z-index:20; }
.overlay.active { display:flex; }
.overlay-card { background:linear-gradient(135deg,#0d1117,#161b22); border:1px solid rgba(239,68,68,0.35); border-radius:22px; padding:36px 44px; text-align:center; max-width:460px; box-shadow:0 20px 60px rgba(239,68,68,0.15); }
.overlay-card.danger { border-color:rgba(239,68,68,0.6); box-shadow:0 20px 60px rgba(239,68,68,0.3); }
.logo-icon { font-size:52px; margin-bottom:10px; }
h1 { font-size:20px; font-weight:800; color:#fff; margin-bottom:8px; }
h2 { font-size:22px; font-weight:800; color:#fff; margin-bottom:12px; }
p { color:#94a3b8; font-size:13px; }
.key-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin:18px 0 24px; text-align:left; }
.key-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#cbd5e1; }
kbd { background:#21262d; color:#e6edf3; padding:2px 7px; border-radius:5px; font-size:11px; border:1px solid #30363d; }
.stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin:16px 0 22px; }
.stat-item { background:rgba(255,255,255,0.04); border-radius:10px; padding:10px 8px; }
.stat-label { display:block; font-size:10px; color:#8b949e; text-transform:uppercase; margin-bottom:4px; }
.stat-val { display:block; font-size:26px; font-weight:800; color:#fff; }
.glow-btn { background:linear-gradient(135deg,#dc2626,#991b1b); color:#fff; border:none; padding:13px 30px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; box-shadow:0 6px 20px rgba(220,38,38,0.35); }
.glow-btn.ghost { background:transparent; border:2px solid rgba(220,38,38,0.4); }
.glow-btn:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(220,38,38,0.5); }
`;

  return { title, description, controls, html, css, js };
}
