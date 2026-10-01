/* ============================================
   TOWER DEFENSE GAME TEMPLATE
   Features: Path grid, Enemy waves, Tower placement
   (Archer, Cannon, Frost), Range indicators,
   Gold economy, Base HP, Sound FX, Mobile/Mouse.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createTowerDefenseGame(config = {}) {
  const title = config.title || 'Citadel Guard: Tower Defense';
  const description = 'Strategically build archer ballistas, explosive cannons, and frost turrets to defend the kingdom from marching monsters!';
  const controls = 'Mouse/Tap: Click grid slot to place selected Tower, [1-3] Select Tower, [SPACE] Next Wave, [P] Pause, [R] Restart';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">❤️ BASE: <span id="hud-hp">20</span></div>
        <div class="hud-item">💰 GOLD: <span id="hud-gold">150</span></div>
        <div class="hud-item">WAVE: <span id="hud-wave">1</span></div>
      </div>
      <div class="hud-right">
        <div class="tower-selector">
          <button class="t-btn active" data-type="archer">🏹 Archer (50g)</button>
          <button class="t-btn" data-type="cannon">💣 Cannon (90g)</button>
          <button class="t-btn" data-type="frost">❄️ Frost (75g)</button>
        </div>
        <button id="btn-next-wave" class="hud-action-btn">🌊 NEXT WAVE</button>
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="800" height="520"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🏰 ${title}</h1>
        <p>Monsters are marching along the path to invade the citadel. Place defensive turrets along the road to defeat them!</p>
        <button id="btn-start" class="glow-btn">DEPLOY DEFENSES</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💀 CITADEL BREACHED!</h2>
        <p class="final-stat">Waves Defended: <span id="go-wave">1</span></p>
        <p class="final-stat">Total Score: <span id="go-score">0</span></p>
        <button id="btn-restart" class="glow-btn">DEFEND AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>
  </div>
  `;

  const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, html {
    width: 100%; height: 100%;
    overflow: hidden;
    background: #090b10;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #ffffff;
    user-select: none;
    -webkit-user-select: none;
  }
  .game-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  canvas {
    width: 100%;
    height: 100%;
    max-width: 960px;
    max-height: 624px;
    object-fit: contain;
    background: #0f172a;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 10px 40px rgba(0,0,0,0.85);
  }
  .hud {
    position: absolute;
    top: 14px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
    z-index: 40;
  }
  .hud-left, .hud-right {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(13, 17, 26, 0.85);
    backdrop-filter: blur(8px);
    padding: 8px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .hud-item {
    font-size: 13px;
    font-weight: 800;
  }
  .hud-item span {
    color: #facc15;
    font-family: monospace;
    font-size: 17px;
  }
  .tower-selector {
    display: flex;
    gap: 6px;
    pointer-events: auto;
  }
  .t-btn {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.1);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
  .t-btn.active {
    background: #3b82f6;
    border-color: #60a5fa;
  }
  .hud-action-btn {
    pointer-events: auto;
    background: #10b981;
    border: none;
    color: #fff;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }
  .hud-btn {
    pointer-events: auto;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(9, 11, 16, 0.88);
    backdrop-filter: blur(10px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 60;
  }
  .overlay.active { display: flex; }
  .overlay-card {
    background: #151924;
    border: 1px solid rgba(255,255,255,0.15);
    padding: 32px 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 440px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  }
  .overlay-card h1 { font-size: 24px; margin-bottom: 12px; color: #38bdf8; }
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #ef4444; }
  .overlay-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
  .final-stat { font-size: 16px; color: #cbd5e1; margin-bottom: 8px !important; }
  .final-stat span { color: #facc15; font-weight: 800; font-family: monospace; font-size: 20px; }
  .glow-btn {
    background: linear-gradient(135deg, #10b981, #059669);
    border: none;
    color: white;
    padding: 12px 30px;
    font-size: 15px;
    font-weight: 800;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(16,185,129,0.5);
  }

  ${MOBILE_CONTROLS_CSS}
  `;

  const js = `
  ${AUDIO_SYNTH_CODE}

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const hudHp = document.getElementById('hud-hp');
  const hudGold = document.getElementById('hud-gold');
  const hudWave = document.getElementById('hud-wave');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const goWave = document.getElementById('go-wave');
  const goScore = document.getElementById('go-score');

  let gameState = 'START';
  let baseHp = 20;
  let gold = 150;
  let wave = 1;
  let score = 0;
  let selectedTowerType = 'archer';

  // Tower Costs & Attributes
  const towerDefs = {
    archer: { cost: 50, range: 120, rate: 25, damage: 1, color: '#38bdf8' },
    cannon: { cost: 90, range: 140, rate: 60, damage: 3, color: '#ef4444' },
    frost: { cost: 75, range: 110, rate: 40, damage: 0.8, color: '#06b6d4', slows: true }
  };

  // Waypoints for enemy path
  const waypoints = [
    { x: 0, y: 160 },
    { x: 260, y: 160 },
    { x: 260, y: 380 },
    { x: 560, y: 380 },
    { x: 560, y: 160 },
    { x: 800, y: 160 }
  ];

  let towers = [];
  let enemies = [];
  let projectiles = [];

  // Tower Selection buttons
  document.querySelectorAll('.t-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTowerType = btn.dataset.type;
    });
  });

  // Canvas Click: Place Tower
  canvas.addEventListener('click', (e) => {
    if (gameState !== 'PLAYING') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    // Check cost
    const def = towerDefs[selectedTowerType];
    if (gold < def.cost) return;

    // Check not placed too close to path
    for (let i = 0; i < waypoints.length - 1; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i+1];
      const dist = distToSegment({ x: cx, y: cy }, p1, p2);
      if (dist < 32) return; // Too close to road
    }

    // Check not too close to other towers
    if (towers.some(t => Math.hypot(t.x - cx, t.y - cy) < 32)) return;

    // Place tower
    gold -= def.cost;
    hudGold.textContent = gold;
    towers.push({
      x: cx,
      y: cy,
      type: selectedTowerType,
      range: def.range,
      rate: def.rate,
      damage: def.damage,
      color: def.color,
      slows: def.slows || false,
      cooldown: 0
    });
    SoundFX.play('jump');
  });

  function distToSegment(p, v, w) {
    const l2 = Math.hypot(v.x - w.x, v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  function spawnWave() {
    const enemyCount = 8 + wave * 4;
    for (let i = 0; i < enemyCount; i++) {
      enemies.push({
        x: -i * 35,
        y: 160,
        r: 12,
        wpIndex: 0,
        speed: 1.6 + Math.random() * 0.4,
        maxHp: 3 + wave * 2,
        hp: 3 + wave * 2,
        goldReward: 12 + wave * 2,
        color: wave % 3 === 0 ? '#a855f7' : '#ef4444'
      });
    }
  }

  function restartGame() {
    baseHp = 20;
    gold = 150;
    wave = 1;
    score = 0;
    towers = [];
    enemies = [];
    projectiles = [];

    hudHp.textContent = baseHp;
    hudGold.textContent = gold;
    hudWave.textContent = wave;

    spawnWave();

    gameState = 'PLAYING';
    startScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    pauseScreen.classList.remove('active');
    SoundFX.play('jump');
  }

  function togglePause() {
    if (gameState === 'PLAYING') {
      gameState = 'PAUSED';
      pauseScreen.classList.add('active');
    } else if (gameState === 'PAUSED') {
      gameState = 'PLAYING';
      pauseScreen.classList.remove('active');
    }
  }

  document.getElementById('btn-start').addEventListener('click', () => { SoundFX.init(); restartGame(); });
  document.getElementById('btn-restart').addEventListener('click', restartGame);
  document.getElementById('btn-resume').addEventListener('click', togglePause);
  document.getElementById('btn-pause-hud').addEventListener('click', togglePause);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);
  document.getElementById('btn-next-wave').addEventListener('click', () => {
    wave++;
    hudWave.textContent = wave;
    spawnWave();
  });

  function update() {
    if (gameState !== 'PLAYING') return;

    // Update Enemies along path
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.x < 0) {
        e.x += e.speed;
        continue;
      }

      const targetWp = waypoints[e.wpIndex + 1];
      if (!targetWp) {
        // Reached end base!
        baseHp--;
        hudHp.textContent = baseHp;
        SoundFX.play('hit');
        enemies.splice(i, 1);
        if (baseHp <= 0) {
          gameState = 'GAMEOVER';
          SoundFX.play('gameover');
          goWave.textContent = wave;
          goScore.textContent = score;
          gameoverScreen.classList.add('active');
          return;
        }
        continue;
      }

      const dist = Math.hypot(targetWp.x - e.x, targetWp.y - e.y);
      if (dist < 4) {
        e.wpIndex++;
      } else {
        const angle = Math.atan2(targetWp.y - e.y, targetWp.x - e.x);
        e.x += Math.cos(angle) * e.speed;
        e.y += Math.sin(angle) * e.speed;
      }
    }

    // Towers AI & Firing
    for (const t of towers) {
      if (t.cooldown > 0) t.cooldown--;

      if (t.cooldown <= 0) {
        // Find closest enemy in range
        const target = enemies.find(e => e.x > 0 && Math.hypot(e.x - t.x, e.y - t.y) <= t.range);
        if (target) {
          projectiles.push({
            x: t.x,
            y: t.y,
            target: target,
            damage: t.damage,
            slows: t.slows,
            speed: 8,
            color: t.color
          });
          t.cooldown = t.rate;
          SoundFX.play('shoot');
        }
      }
    }

    // Update Projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      const dist = Math.hypot(p.target.x - p.x, p.target.y - p.y);

      if (dist < 8 || !enemies.includes(p.target)) {
        if (enemies.includes(p.target)) {
          p.target.hp -= p.damage;
          if (p.slows) p.target.speed = Math.max(0.8, p.target.speed * 0.7);
          SoundFX.play('hit');

          if (p.target.hp <= 0) {
            gold += p.target.goldReward;
            score += 100;
            hudGold.textContent = gold;
            enemies.splice(enemies.indexOf(p.target), 1);
            SoundFX.play('coin');
          }
        }
        projectiles.splice(i, 1);
      } else {
        const angle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;
      }
    }

    // Auto next wave if all cleared
    if (enemies.length === 0) {
      wave++;
      hudWave.textContent = wave;
      SoundFX.play('win');
      spawnWave();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Map Grass Surface
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Dirt Path
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 44;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();

    // Base citadel icon
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(canvas.width - 40, 138, 40, 44);

    // Draw Towers
    for (const t of towers) {
      // Range indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
      ctx.stroke();

      // Tower base
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Enemies
    for (const e of enemies) {
      if (e.x < 0) continue;
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();

      // Health bar
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(e.x - 12, e.y - 18, 24, 4);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(e.x - 12, e.y - 18, (Math.max(0, e.hp) / e.maxHp) * 24, 4);
    }

    // Draw Projectiles
    for (const p of projectiles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  ${MOBILE_CONTROLS_JS}
  `;

  return { title, description, controls, html, css, js };
}
