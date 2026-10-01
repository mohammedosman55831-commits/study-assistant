/* ============================================
   PROCEDURAL CUSTOM ARCADE GENERATOR
   Creates dynamic playable games for any creative
   or unclassified user game prompt!
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createCustomGame(config = {}) {
  const prompt = config.prompt || 'Custom Arcade Game';
  const title = config.title || `Arcade Arena: ${prompt.slice(0, 28)}`;
  const description = `An AI-synthesized custom arcade game generated from your prompt: "${prompt}". Dodge incoming hazards and gather energy crystals!`;
  const controls = 'Keyboard: [W/A/S/D or Arrows] Move Player, [SPACE] Dash / Boost, [P] Pause, [R] Restart | Mobile: D-Pad + BOOST';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">❤️ HP: <span id="hud-hp">100</span>%</div>
        <div class="hud-item">CRYSTALS: <span id="hud-crystals">0</span></div>
      </div>
      <div class="hud-right">
        <div class="hud-item">SCORE: <span id="hud-score">0</span></div>
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="800" height="500"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🎮 ${title}</h1>
        <p>${description}</p>
        <div class="key-help">
          <span><b>W A S D</b> Move</span>
          <span><b>SPACE</b> Speed Dash</span>
          <span><b>Gems</b> Score</span>
          <span><b>Spikes</b> Avoid</span>
        </div>
        <button id="btn-start" class="glow-btn">PLAY GAME</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💥 GAME OVER</h2>
        <p class="final-stat">Final Score: <span id="go-score">0</span></p>
        <button id="btn-restart" class="glow-btn">PLAY AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'DASH', hasSecondary: false, dpadType: '4way' })}
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
    max-height: 600px;
    object-fit: contain;
    background: #0a0d18;
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
  .key-help {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 24px;
    background: rgba(255,255,255,0.05);
    padding: 12px;
    border-radius: 10px;
    font-size: 12px;
    color: #cbd5e1;
  }
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

  const hudHp = document.getElementById('hud-hp');
  const hudCrystals = document.getElementById('hud-crystals');
  const hudScore = document.getElementById('hud-score');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const goScore = document.getElementById('go-score');

  let gameState = 'START';
  let score = 0;
  let crystals = 0;
  let hp = 100;

  // Player
  const player = {
    x: 400,
    y: 250,
    r: 16,
    speed: 4.5,
    dashTimer: 0
  };

  let hazards = [];
  let gems = [];
  let particles = [];

  function spawnEntities() {
    hazards = [];
    gems = [];
    for (let i = 0; i < 7; i++) {
      hazards.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        r: 14 + Math.random() * 8,
        color: '#ef4444'
      });
    }

    for (let i = 0; i < 5; i++) {
      gems.push({
        x: 50 + Math.random() * (canvas.width - 100),
        y: 50 + Math.random() * (canvas.height - 100),
        r: 8
      });
    }
  }

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    keys[e.code] = true;
    if (e.code === 'Space') dash();
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && gameState === 'GAMEOVER') restartGame();
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    keys[e.code] = false;
  });

  function dash() {
    if (gameState === 'PLAYING' && player.dashTimer <= 0) {
      player.dashTimer = 20;
      SoundFX.play('jump');
    }
  }

  window.handleVirtualKey = function(key, isPressed) {
    keys[key] = isPressed;
    if (isPressed && key === 'Space') dash();
  };

  function restartGame() {
    hp = 100;
    score = 0;
    crystals = 0;
    player.x = 400;
    player.y = 250;
    player.dashTimer = 0;

    spawnEntities();
    hudHp.textContent = '100';
    hudScore.textContent = '0';
    hudCrystals.textContent = '0';

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

    let dx = 0;
    let dy = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx -= 1;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 1;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) dy -= 1;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) dy += 1;

    let curSpeed = player.speed;
    if (player.dashTimer > 0) {
      curSpeed *= 1.8;
      player.dashTimer--;
    }

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    player.x = Math.max(player.r, Math.min(canvas.width - player.r, player.x + dx * curSpeed));
    player.y = Math.max(player.r, Math.min(canvas.height - player.r, player.y + dy * curSpeed));

    // Update Hazards
    for (const h of hazards) {
      h.x += h.vx;
      h.y += h.vy;

      if (h.x - h.r < 0 || h.x + h.r > canvas.width) h.vx *= -1;
      if (h.y - h.r < 0 || h.y + h.r > canvas.height) h.vy *= -1;

      // Collision with player
      if (Math.hypot(player.x - h.x, player.y - h.y) < player.r + h.r) {
        hp -= 0.6;
        hudHp.textContent = Math.max(0, Math.round(hp));
        if (Math.random() < 0.1) SoundFX.play('hit');

        if (hp <= 0) {
          gameState = 'GAMEOVER';
          SoundFX.play('gameover');
          goScore.textContent = score;
          gameoverScreen.classList.add('active');
          return;
        }
      }
    }

    // Update Gems
    for (let i = gems.length - 1; i >= 0; i--) {
      const g = gems[i];
      if (Math.hypot(player.x - g.x, player.y - g.y) < player.r + g.r + 4) {
        crystals++;
        score += 200;
        hudCrystals.textContent = crystals;
        hudScore.textContent = score;
        SoundFX.play('coin');

        // Respawn gem elsewhere
        g.x = 50 + Math.random() * (canvas.width - 100);
        g.y = 50 + Math.random() * (canvas.height - 100);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Neon grid background
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Gems
    for (const g of gems) {
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hazards
    for (const h of hazards) {
      ctx.fillStyle = h.color;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player
    ctx.fillStyle = player.dashTimer > 0 ? '#38bdf8' : '#6366f1';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fill();
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
