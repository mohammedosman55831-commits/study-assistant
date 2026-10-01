/* ============================================
   FLAPPY BIRD GAME TEMPLATE
   Features: Flap Physics, Pipe Pairs with gaps,
   Parallax Skyline, Score System, Sound FX,
   Mobile Tap / Keyboard support.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createFlappyGame(config = {}) {
  const title = config.title || 'Flappy Wings: Sky Flight';
  const description = 'Flap your wings, dodge the pipe towers, and soar for the highest score in this arcade classic!';
  const controls = 'Keyboard: [SPACE or ▲] Flap / Fly, [P] Pause, [R] Restart | Mobile: Tap Screen / Tap FLAP';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="score-display">SCORE: <span id="hud-score">0</span></div>
      <div class="hud-btns">
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="480" height="640"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🐦 ${title}</h1>
        <p>Press Space or Tap Screen to flap and pass through pipe obstacles!</p>
        <button id="btn-start" class="glow-btn">START FLAPPING</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💥 GAME OVER</h2>
        <p class="final-stat">Final Score: <span id="go-score">0</span></p>
        <p class="final-stat">Best Score: <span id="go-best">0</span></p>
        <button id="btn-restart" class="glow-btn">PLAY AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'FLAP', hasSecondary: false, dpadType: 'none' })}
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
    max-width: 540px;
    max-height: 720px;
    object-fit: contain;
    background: #70c5ce;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
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
  .score-display {
    font-size: 22px;
    font-weight: 900;
    background: rgba(13, 17, 26, 0.7);
    padding: 6px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .hud-btns {
    display: flex;
    gap: 8px;
  }
  .hud-btn {
    pointer-events: auto;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(9, 11, 16, 0.85);
    backdrop-filter: blur(8px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 60;
  }
  .overlay.active { display: flex; }
  .overlay-card {
    background: #151924;
    border: 1px solid rgba(255,255,255,0.15);
    padding: 32px 36px;
    border-radius: 20px;
    text-align: center;
    max-width: 360px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  }
  .overlay-card h1 { font-size: 24px; margin-bottom: 12px; }
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #38bdf8; }
  .overlay-card.danger h2 { color: #ef4444; }
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

  const hudScore = document.getElementById('hud-score');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const goScore = document.getElementById('go-score');
  const goBest = document.getElementById('go-best');

  let gameState = 'START';
  let score = 0;
  let bestScore = 0;

  // Bird
  const bird = {
    x: 80,
    y: 280,
    r: 16,
    vy: 0,
    gravity: 0.38,
    jump: -7.5,
    rotation: 0
  };

  // Pipes
  let pipes = [];
  const pipeGap = 135;
  const pipeWidth = 56;
  let spawnTimer = 0;

  // Ground
  let groundOffset = 0;

  function flap() {
    if (gameState === 'START') {
      restartGame();
      return;
    }
    if (gameState === 'PLAYING') {
      bird.vy = bird.jump;
      SoundFX.play('flap');
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      flap();
    }
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && gameState === 'GAMEOVER') restartGame();
  });

  canvas.addEventListener('click', flap);
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });

  window.handleVirtualKey = function(key, isPressed) {
    if (isPressed && (key === 'Space' || key === 'ArrowUp')) flap();
  };

  function restartGame() {
    bird.y = 260;
    bird.vy = 0;
    bird.rotation = 0;
    pipes = [];
    score = 0;
    spawnTimer = 0;
    hudScore.textContent = '0';
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

    // Bird physics
    bird.vy += bird.gravity;
    bird.y += bird.vy;
    bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.vy * 0.08));

    // Ground collision
    const groundY = canvas.height - 70;
    if (bird.y + bird.r > groundY || bird.y - bird.r < 0) {
      triggerGameOver();
      return;
    }

    // Pipes Spawning
    spawnTimer++;
    if (spawnTimer > 100) {
      spawnTimer = 0;
      const topHeight = Math.floor(Math.random() * (canvas.height - 240 - pipeGap)) + 50;
      pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap,
        passed: false
      });
    }

    // Pipes Movement & Collision
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= 2.6;

      // Score
      if (!p.passed && p.x + pipeWidth < bird.x) {
        p.passed = true;
        score++;
        hudScore.textContent = score;
        SoundFX.play('coin');
      }

      // Collision box test
      if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + pipeWidth) {
        if (bird.y - bird.r < p.top || bird.y + bird.r > p.bottom) {
          triggerGameOver();
          return;
        }
      }

      if (p.x < -pipeWidth) {
        pipes.splice(i, 1);
      }
    }

    groundOffset = (groundOffset + 2.6) % 24;
  }

  function triggerGameOver() {
    gameState = 'GAMEOVER';
    SoundFX.play('hit');
    SoundFX.play('gameover');
    if (score > bestScore) bestScore = score;
    goScore.textContent = score;
    goBest.textContent = bestScore;
    gameoverScreen.classList.add('active');
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#38bdf8');
    sky.addColorStop(0.7, '#bae6fd');
    sky.addColorStop(1, '#fed7aa');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds & City Silhouette
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(100, 160, 40, 0, Math.PI * 2);
    ctx.arc(140, 150, 50, 0, Math.PI * 2);
    ctx.arc(180, 160, 40, 0, Math.PI * 2);
    ctx.arc(360, 200, 45, 0, Math.PI * 2);
    ctx.arc(400, 190, 55, 0, Math.PI * 2);
    ctx.fill();

    // Pipes
    for (const p of pipes) {
      // Top Pipe
      const pGrad = ctx.createLinearGradient(p.x, 0, p.x + pipeWidth, 0);
      pGrad.addColorStop(0, '#22c55e');
      pGrad.addColorStop(0.4, '#4ade80');
      pGrad.addColorStop(1, '#15803d');

      ctx.fillStyle = pGrad;
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      ctx.fillRect(p.x - 4, p.top - 20, pipeWidth + 8, 20);

      // Bottom Pipe
      ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
      ctx.fillRect(p.x - 4, p.bottom, pipeWidth + 8, 20);
    }

    // Ground
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, canvas.height - 70, canvas.width, 16);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, canvas.height - 54, canvas.width, 54);

    // Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);

    // Body
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-4, 2, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(9, -5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(12, -2);
    ctx.lineTo(20, 2);
    ctx.lineTo(12, 6);
    ctx.fill();

    ctx.restore();
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
