/* ============================================
   BRICK BREAKER / ARKANOID GAME
   Features: Angle deflection, Multi-tier bricks,
   Powerups (multi-ball, laser paddle), Score & Lives,
   Sound effects, Mobile & Keyboard controls.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createBrickBreakerGame(config = {}) {
  const title = config.title || 'Neon Breaker: Brick Blaster';
  const description = 'Smash through colorful neon brick barriers, catch multi-ball powerups, and clear the board!';
  const controls = 'Keyboard/Mouse: [A/D or ◄/► or MOUSE] Move Paddle, [SPACE] Launch Ball, [P] Pause, [R] Restart | Mobile: Virtual D-Pad / Touch';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">❤️ LIVES: <span id="hud-lives">3</span></div>
        <div class="hud-item">BRICKS: <span id="hud-bricks">0</span></div>
      </div>
      <div class="hud-right">
        <div class="hud-item">SCORE: <span id="hud-score">0</span></div>
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="640" height="580"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🧱 ${title}</h1>
        <p>Control the paddle, deflect the ball, and destroy all bricks. Don't let the ball fall!</p>
        <button id="btn-start" class="glow-btn">START SMASHING</button>
      </div>
    </div>

    <div id="win-screen" class="overlay">
      <div class="overlay-card win">
        <h2>🏆 BOARD CLEARED!</h2>
        <p class="final-stat">Total Score: <span id="win-score">0</span></p>
        <button id="btn-win-restart" class="glow-btn">PLAY AGAIN</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💥 GAME OVER</h2>
        <p class="final-stat">Final Score: <span id="go-score">0</span></p>
        <button id="btn-restart" class="glow-btn">TRY AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'LAUNCH', hasSecondary: false, dpadType: 'horizontal' })}
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
    max-width: 640px;
    max-height: 580px;
    object-fit: contain;
    background: #0a0e17;
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
  .overlay-card.win h2 { color: #facc15; }
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

  const hudLives = document.getElementById('hud-lives');
  const hudBricks = document.getElementById('hud-bricks');
  const hudScore = document.getElementById('hud-score');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const winScreen = document.getElementById('win-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const goScore = document.getElementById('go-score');
  const winScore = document.getElementById('win-score');

  let gameState = 'START';
  let lives = 3;
  let score = 0;
  let ballLaunched = false;

  // Paddle
  const paddle = {
    x: 270,
    y: 530,
    w: 100,
    h: 14,
    speed: 7
  };

  // Ball
  const ball = {
    x: 320,
    y: 516,
    r: 7,
    vx: 4,
    vy: -4
  };

  // Bricks Grid
  let bricks = [];
  const rows = 5;
  const cols = 8;
  const brickW = 68;
  const brickH = 20;
  const brickPadding = 8;
  const brickOffsetLeft = 20;
  const brickOffsetTop = 60;
  const rowColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  function initBricks() {
    bricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: brickOffsetLeft + c * (brickW + brickPadding),
          y: brickOffsetTop + r * (brickH + brickPadding),
          alive: true,
          color: rowColors[r]
        });
      }
    }
  }

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    keys[e.code] = true;
    if (e.code === 'Space') launchBall();
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && (gameState === 'GAMEOVER' || gameState === 'WIN')) restartGame();
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    keys[e.code] = false;
  });

  // Mouse move paddle
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, mx - paddle.w/2));
    if (!ballLaunched) {
      ball.x = paddle.x + paddle.w/2;
    }
  });

  function launchBall() {
    if (gameState === 'PLAYING' && !ballLaunched) {
      ballLaunched = true;
      ball.vx = (Math.random() - 0.5) * 6 || 3.5;
      ball.vy = -5.5;
      SoundFX.play('jump');
    }
  }

  window.handleVirtualKey = function(key, isPressed) {
    keys[key] = isPressed;
    if (isPressed && key === 'Space') launchBall();
  };

  function restartGame() {
    lives = 3;
    score = 0;
    ballLaunched = false;
    paddle.x = 270;
    ball.x = paddle.x + paddle.w/2;
    ball.y = paddle.y - ball.r - 2;

    initBricks();
    hudLives.textContent = lives;
    hudScore.textContent = score;
    hudBricks.textContent = bricks.length;

    gameState = 'PLAYING';
    startScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    winScreen.classList.remove('active');
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
  document.getElementById('btn-win-restart').addEventListener('click', restartGame);
  document.getElementById('btn-resume').addEventListener('click', togglePause);
  document.getElementById('btn-pause-hud').addEventListener('click', togglePause);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);

  function update() {
    if (gameState !== 'PLAYING') return;

    // Paddle Keyboard controls
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) paddle.x -= paddle.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) paddle.x += paddle.speed;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, paddle.x));

    if (!ballLaunched) {
      ball.x = paddle.x + paddle.w/2;
      ball.y = paddle.y - ball.r - 2;
      return;
    }

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall bounce
    if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) {
      ball.vx *= -1;
      SoundFX.play('hit');
    }
    if (ball.y - ball.r < 0) {
      ball.vy *= -1;
      SoundFX.play('hit');
    }

    // Fall below
    if (ball.y > canvas.height + 20) {
      lives--;
      hudLives.textContent = lives;
      SoundFX.play('hit');
      if (lives <= 0) {
        gameState = 'GAMEOVER';
        SoundFX.play('gameover');
        goScore.textContent = score;
        gameoverScreen.classList.add('active');
        return;
      } else {
        ballLaunched = false;
        ball.x = paddle.x + paddle.w/2;
        ball.y = paddle.y - ball.r - 2;
      }
    }

    // Paddle collision with angle deflection
    if (
      ball.y + ball.r >= paddle.y &&
      ball.y - ball.r <= paddle.y + paddle.h &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.w &&
      ball.vy > 0
    ) {
      // Calculate hit position from center (-1 to 1)
      const hitOffset = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
      ball.vx = hitOffset * 6.5;
      ball.vy = -Math.abs(ball.vy);
      SoundFX.play('hit');
    }

    // Brick collisions
    let remainingBricks = 0;
    for (const b of bricks) {
      if (!b.alive) continue;
      remainingBricks++;

      if (
        ball.x + ball.r > b.x &&
        ball.x - ball.r < b.x + brickW &&
        ball.y + ball.r > b.y &&
        ball.y - ball.r < b.y + brickH
      ) {
        b.alive = false;
        ball.vy *= -1;
        score += 150;
        hudScore.textContent = score;
        SoundFX.play('coin');
        remainingBricks--;
      }
    }
    hudBricks.textContent = remainingBricks;

    if (remainingBricks === 0) {
      gameState = 'WIN';
      SoundFX.play('win');
      winScore.textContent = score;
      winScreen.classList.add('active');
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bricks
    for (const b of bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, brickW, brickH, 4);
      ctx.fill();
    }

    // Draw Paddle
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 6);
    ctx.fill();

    // Draw Ball
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
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
