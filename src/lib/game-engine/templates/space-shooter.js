/* ============================================
   SPACE SHOOTER / GALAXY DEFENDER
   Features: Parallax Starfield, Alien waves,
   Boss battle, Laser blasters, Shield & Triple Shot
   powerups, Explosions, Mobile & Keyboard controls.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createSpaceShooterGame(config = {}) {
  const title = config.title || 'Galactic Vanguard: Space Defender';
  const description = 'Command your starfighter against invading alien fleets and colossal dreadnought bosses in deep space!';
  const controls = 'Keyboard: [A/D or ◄/►] Move, [W/S or ▲/▼] Pitch, [SPACE] Fire Lasers, [P] Pause, [R] Restart | Mobile: D-Pad + FIRE Button';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">❤️ SHIELD: <span id="hud-shield">100</span>%</div>
        <div class="hud-item">WAVE: <span id="hud-wave">1</span></div>
      </div>
      <div class="hud-right">
        <div class="hud-item">SCORE: <span id="hud-score">0</span></div>
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="600" height="700"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🚀 ${title}</h1>
        <p>Defend the galaxy against incoming alien armadas. Collect laser power-ups and defeat the boss!</p>
        <button id="btn-start" class="glow-btn">LAUNCH STARFIGHTER</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💥 SHIP DESTROYED!</h2>
        <p class="final-stat">Final Score: <span id="go-score">0</span></p>
        <p class="final-stat">Wave Reached: <span id="go-wave">1</span></p>
        <button id="btn-restart" class="glow-btn">DEPLOY AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'FIRE', hasSecondary: false, dpadType: '4way' })}
  </div>
  `;

  const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, html {
    width: 100%; height: 100%;
    overflow: hidden;
    background: #05070f;
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
    max-width: 560px;
    max-height: 720px;
    object-fit: contain;
    background: #020617;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.9);
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
    gap: 14px;
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
    color: #38bdf8;
    font-family: monospace;
    font-size: 17px;
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
    background: rgba(5, 7, 15, 0.88);
    backdrop-filter: blur(10px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 60;
  }
  .overlay.active { display: flex; }
  .overlay-card {
    background: #0f172a;
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 32px 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 440px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
  }
  .overlay-card h1 { font-size: 24px; margin-bottom: 12px; color: #38bdf8; }
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #ef4444; }
  .overlay-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
  .final-stat { font-size: 16px; color: #cbd5e1; margin-bottom: 8px !important; }
  .final-stat span { color: #38bdf8; font-weight: 800; font-family: monospace; font-size: 20px; }
  .glow-btn {
    background: linear-gradient(135deg, #0284c7, #2563eb);
    border: none;
    color: white;
    padding: 12px 30px;
    font-size: 15px;
    font-weight: 800;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(37,99,235,0.5);
  }

  ${MOBILE_CONTROLS_CSS}
  `;

  const js = `
  ${AUDIO_SYNTH_CODE}

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const hudShield = document.getElementById('hud-shield');
  const hudWave = document.getElementById('hud-wave');
  const hudScore = document.getElementById('hud-score');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const goScore = document.getElementById('go-score');
  const goWave = document.getElementById('go-wave');

  let gameState = 'START';
  let score = 0;
  let wave = 1;

  // Starfield
  let stars = [];
  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1
    });
  }

  // Player
  const player = {
    x: 300,
    y: 600,
    w: 36,
    h: 44,
    speed: 5.5,
    shield: 100,
    tripleShot: 0
  };

  let playerBullets = [];
  let alienBullets = [];
  let aliens = [];
  let particles = [];
  let boss = null;
  let fireTimer = 0;

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    keys[e.code] = true;
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && gameState === 'GAMEOVER') restartGame();
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    keys[e.code] = false;
  });

  function fireLaser() {
    if (gameState !== 'PLAYING') return;
    if (player.tripleShot > 0) {
      playerBullets.push({ x: player.x, y: player.y - 20, vx: 0, vy: -12 });
      playerBullets.push({ x: player.x - 12, y: player.y - 14, vx: -2.5, vy: -11 });
      playerBullets.push({ x: player.x + 12, y: player.y - 14, vx: 2.5, vy: -11 });
    } else {
      playerBullets.push({ x: player.x - 10, y: player.y - 18, vx: 0, vy: -12 });
      playerBullets.push({ x: player.x + 10, y: player.y - 18, vx: 0, vy: -12 });
    }
    SoundFX.play('shoot');
  }

  window.handleVirtualKey = function(key, isPressed) {
    keys[key] = isPressed;
    if (isPressed && key === 'Space') fireLaser();
  };

  function spawnWave() {
    aliens = [];
    boss = null;

    if (wave % 5 === 0) {
      // Boss battle
      boss = {
        x: canvas.width / 2,
        y: 120,
        w: 90,
        h: 70,
        hp: 30 + wave * 10,
        maxHp: 30 + wave * 10,
        vx: 2.5
      };
      return;
    }

    const rows = 3 + Math.min(3, Math.floor(wave / 2));
    const cols = 7;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        aliens.push({
          x: 70 + c * 70,
          y: 70 + r * 50,
          w: 32,
          h: 26,
          hp: 1,
          color: r === 0 ? '#ef4444' : r === 1 ? '#a855f7' : '#06b6d4',
          shootCooldown: Math.floor(Math.random() * 150 + 60)
        });
      }
    }
  }

  function restartGame() {
    player.x = 300;
    player.y = 600;
    player.shield = 100;
    player.tripleShot = 0;
    score = 0;
    wave = 1;
    playerBullets = [];
    alienBullets = [];
    particles = [];

    hudShield.textContent = '100';
    hudWave.textContent = '1';
    hudScore.textContent = '0';

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

  function createExplosion(x, y, color) {
    for (let i = 0; i < 18; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        r: Math.random() * 3 + 2,
        color: color || '#f97316',
        alpha: 1
      });
    }
  }

  function update() {
    if (gameState !== 'PLAYING') return;

    // Movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;

    player.x = Math.max(player.w/2, Math.min(canvas.width - player.w/2, player.x));
    player.y = Math.max(100, Math.min(canvas.height - player.h/2, player.y));

    // Auto-fire on Space hold
    fireTimer++;
    if ((keys[' '] || keys['Space']) && fireTimer > 12) {
      fireLaser();
      fireTimer = 0;
    }

    if (player.tripleShot > 0) player.tripleShot--;

    // Starfield animation
    for (const star of stars) {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    }

    // Player bullets update
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const b = playerBullets[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.y < -10) {
        playerBullets.splice(i, 1);
        continue;
      }

      // Check hit with aliens
      for (let j = aliens.length - 1; j >= 0; j--) {
        const a = aliens[j];
        if (Math.hypot(b.x - a.x, b.y - a.y) < a.w/2 + 6) {
          createExplosion(a.x, a.y, a.color);
          SoundFX.play('hit');
          aliens.splice(j, 1);
          playerBullets.splice(i, 1);
          score += 120;
          hudScore.textContent = score;

          // Chance for powerup
          if (Math.random() < 0.08) player.tripleShot = 400;
          break;
        }
      }

      // Check hit with boss
      if (boss && Math.hypot(b.x - boss.x, b.y - boss.y) < boss.w/2) {
        boss.hp--;
        createExplosion(b.x, b.y, '#f59e0b');
        playerBullets.splice(i, 1);
        SoundFX.play('hit');

        if (boss.hp <= 0) {
          createExplosion(boss.x, boss.y, '#ef4444');
          SoundFX.play('win');
          score += 2500;
          hudScore.textContent = score;
          boss = null;
          wave++;
          hudWave.textContent = wave;
          spawnWave();
        }
      }
    }

    // Alien bullets update & hit player
    for (let i = alienBullets.length - 1; i >= 0; i--) {
      const ab = alienBullets[i];
      ab.y += ab.vy;

      if (ab.y > canvas.height + 10) {
        alienBullets.splice(i, 1);
        continue;
      }

      if (Math.hypot(ab.x - player.x, ab.y - player.y) < player.w/2 + 4) {
        player.shield -= 15;
        hudShield.textContent = Math.max(0, player.shield);
        createExplosion(player.x, player.y, '#ef4444');
        SoundFX.play('hit');
        alienBullets.splice(i, 1);

        if (player.shield <= 0) {
          triggerGameOver();
          return;
        }
      }
    }

    // Alien AI fire & wave clear
    for (const a of aliens) {
      a.shootCooldown--;
      if (a.shootCooldown <= 0) {
        a.shootCooldown = Math.floor(Math.random() * 160 + 80);
        alienBullets.push({ x: a.x, y: a.y + 12, vy: 4.5 });
      }
    }

    // Boss AI
    if (boss) {
      boss.x += boss.vx;
      if (boss.x < boss.w/2 + 20 || boss.x > canvas.width - boss.w/2 - 20) {
        boss.vx *= -1;
      }
      if (Math.random() < 0.05) {
        alienBullets.push({ x: boss.x - 20, y: boss.y + 30, vy: 5 });
        alienBullets.push({ x: boss.x + 20, y: boss.y + 30, vy: 5 });
      }
    }

    // Next wave when aliens cleared
    if (aliens.length === 0 && !boss) {
      wave++;
      hudWave.textContent = wave;
      SoundFX.play('win');
      spawnWave();
    }

    // Particles update
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      if (p.alpha <= 0) particles.splice(i, 1);
    }
  }

  function triggerGameOver() {
    gameState = 'GAMEOVER';
    SoundFX.play('gameover');
    goScore.textContent = score;
    goWave.textContent = wave;
    gameoverScreen.classList.add('active');
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (const s of stars) {
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }

    // Bullets
    ctx.fillStyle = '#38bdf8';
    for (const b of playerBullets) {
      ctx.fillRect(b.x - 2, b.y - 8, 4, 16);
    }

    ctx.fillStyle = '#ef4444';
    for (const ab of alienBullets) {
      ctx.beginPath();
      ctx.arc(ab.x, ab.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Aliens
    for (const a of aliens) {
      ctx.fillStyle = a.color;
      ctx.beginPath();
      ctx.roundRect(a.x - a.w/2, a.y - a.h/2, a.w, a.h, 6);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(a.x - 8, a.y - 4, 4, 6);
      ctx.fillRect(a.x + 4, a.y - 4, 4, 6);
    }

    // Boss
    if (boss) {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(boss.x - boss.w/2, boss.y - boss.h/2, boss.w, boss.h, 12);
      ctx.fill();
      // Boss health bar
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(boss.x - boss.w/2, boss.y - boss.h/2 - 14, boss.w, 8);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(boss.x - boss.w/2, boss.y - boss.h/2 - 14, (boss.hp / boss.maxHp) * boss.w, 8);
    }

    // Player Starfighter
    ctx.save();
    ctx.translate(player.x, player.y);

    // Thruster Flames
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-6, player.h/2);
    ctx.lineTo(0, player.h/2 + 14 + Math.random() * 8);
    ctx.lineTo(6, player.h/2);
    ctx.fill();

    // Wings & Cockpit
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, -player.h/2);
    ctx.lineTo(player.w/2, player.h/2);
    ctx.lineTo(0, player.h/2 - 8);
    ctx.lineTo(-player.w/2, player.h/2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(0, -4, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Explosions
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
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
