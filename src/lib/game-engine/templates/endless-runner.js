/* ============================================
   ENDLESS RUNNER GAME
   Features: Rooftop scrolling track, Procedural
   hurdles, Sliding & Jumping, Coin magnet,
   Speed acceleration, Sound FX, Mobile/Keyboard.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createEndlessRunnerGame(config = {}) {
  const title = config.title || 'Cyber Runner: Neon Dash';
  const description = 'Dash along futuristic rooftops! Jump over spikes and hurdles, slide under high barriers, and gather energy orbs!';
  const controls = 'Keyboard: [W / ▲ / SPACE] Jump, [S / ▼] Slide, [P] Pause, [R] Restart | Mobile: JUMP and SLIDE Buttons';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">DISTANCE: <span id="hud-score">0</span>m</div>
        <div class="hud-item">🪙 ORBS: <span id="hud-coins">0</span></div>
      </div>
      <div class="hud-right">
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="800" height="450"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🏃 ${title}</h1>
        <p>Sprint across the neon rooftop! Jump over lower barriers and slide under high overhead lasers.</p>
        <button id="btn-start" class="glow-btn">START SPRINT</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💥 WIPEOUT!</h2>
        <p class="final-stat">Distance Reached: <span id="go-score">0</span>m</p>
        <p class="final-stat">Orbs Gathered: <span id="go-coins">0</span></p>
        <button id="btn-restart" class="glow-btn">RUN AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'JUMP', hasSecondary: true, secondaryLabel: 'SLIDE', dpadType: 'none' })}
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
    max-height: 540px;
    object-fit: contain;
    background: #0f172a;
    border-radius: 12px;
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
    gap: 14px;
    background: rgba(13, 17, 26, 0.8);
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
    font-size: 18px;
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

  const hudScore = document.getElementById('hud-score');
  const hudCoins = document.getElementById('hud-coins');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const goScore = document.getElementById('go-score');
  const goCoins = document.getElementById('go-coins');

  let gameState = 'START';
  let distance = 0;
  let coins = 0;
  let speed = 6;
  const groundY = 360;

  // Player
  const player = {
    x: 120,
    y: groundY - 50,
    w: 28,
    h: 50,
    vy: 0,
    gravity: 0.65,
    jumpPower: -12.5,
    grounded: true,
    isSliding: false
  };

  let obstacles = [];
  let orbs = [];
  let spawnCooldown = 0;

  function jump() {
    if (gameState === 'PLAYING' && player.grounded && !player.isSliding) {
      player.vy = player.jumpPower;
      player.grounded = false;
      SoundFX.play('jump');
    }
  }

  function startSlide() {
    if (gameState === 'PLAYING' && player.grounded && !player.isSliding) {
      player.isSliding = true;
      player.h = 24;
      player.y = groundY - 24;
      setTimeout(() => {
        player.isSliding = false;
        player.h = 50;
        player.y = groundY - 50;
      }, 700);
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') jump();
    if (e.code === 'ArrowDown' || e.code === 'KeyS') startSlide();
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && gameState === 'GAMEOVER') restartGame();
  });

  window.handleVirtualKey = function(key, isPressed) {
    if (!isPressed) return;
    if (key === 'Space') jump();
    if (key === 'KeyX' || key === 'ArrowDown') startSlide();
  };

  function restartGame() {
    distance = 0;
    coins = 0;
    speed = 6;
    player.y = groundY - 50;
    player.vy = 0;
    player.grounded = true;
    player.isSliding = false;
    player.h = 50;
    obstacles = [];
    orbs = [];

    hudScore.textContent = '0';
    hudCoins.textContent = '0';

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

  function update() {
    if (gameState !== 'PLAYING') return;

    speed += 0.001; // subtle acceleration
    distance += Math.round(speed * 0.1);
    hudScore.textContent = distance;

    // Player vertical physics
    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y >= groundY - player.h) {
      player.y = groundY - player.h;
      player.vy = 0;
      player.grounded = true;
    }

    // Spawn Obstacles
    spawnCooldown--;
    if (spawnCooldown <= 0) {
      spawnCooldown = Math.floor(Math.random() * 50 + 60);

      // Low hurdle (jump over) or High laser barrier (slide under)
      const isHigh = Math.random() < 0.35;
      obstacles.push({
        x: canvas.width,
        y: isHigh ? groundY - 65 : groundY - 32,
        w: isHigh ? 36 : 28,
        h: isHigh ? 28 : 32,
        isHigh: isHigh
      });

      // Spawn Coins
      if (Math.random() < 0.6) {
        orbs.push({
          x: canvas.width + 40,
          y: isHigh ? groundY - 14 : groundY - 80,
          collected: false
        });
      }
    }

    // Update Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= speed;

      // Check collision with player (AABB)
      if (
        player.x + player.w > o.x &&
        player.x < o.x + o.w &&
        player.y + player.h > o.y &&
        player.y < o.y + o.h
      ) {
        gameState = 'GAMEOVER';
        SoundFX.play('hit');
        SoundFX.play('gameover');
        goScore.textContent = distance;
        goCoins.textContent = coins;
        gameoverScreen.classList.add('active');
        return;
      }

      if (o.x < -60) obstacles.splice(i, 1);
    }

    // Update Orbs
    for (let i = orbs.length - 1; i >= 0; i--) {
      const orb = orbs[i];
      orb.x -= speed;

      if (!orb.collected && Math.hypot(player.x + player.w/2 - orb.x, player.y + player.h/2 - orb.y) < 28) {
        orb.collected = true;
        coins++;
        hudCoins.textContent = coins;
        SoundFX.play('coin');
      }

      if (orb.x < -40) orbs.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // City Skyline Silhouette
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#131b2e';
    for (let i = 0; i < 12; i++) {
      ctx.fillRect(i * 70, 160 + (i * 23) % 100, 60, canvas.height);
    }

    // Ground / Rooftop track
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, groundY, canvas.width, 3); // Neon edge

    // Obstacles
    for (const o of obstacles) {
      if (o.isHigh) {
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.fillRect(o.x - 4, o.y - 4, o.w + 8, o.h + 8);
      } else {
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(o.x, groundY);
        ctx.lineTo(o.x + o.w/2, o.y);
        ctx.lineTo(o.x + o.w, groundY);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Orbs
    for (const orb of orbs) {
      if (orb.collected) continue;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.w, player.h, 6);
    ctx.fill();

    // Eye visor
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(player.x + player.w - 10, player.y + 6, 8, 5);
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
