/* ============================================
   PONG / NEON AIR HOCKEY GAME
   Features: AI Opponent / 2-Player, Ball acceleration,
   Paddle spin deflection, Score system, Sound FX,
   Mobile & Keyboard controls.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createPongGame(config = {}) {
  const isMulti = config.isMultiplayer || false;
  const title = config.title || (isMulti ? 'Neon Pong: 2-Player Showdown' : 'Cyber Pong: AI Challenge');
  const description = isMulti
    ? 'Fast-paced 2-player table tennis! Player 1 uses [W/S], Player 2 uses [▲/▼]. First to 7 points wins!'
    : 'Defend your goal against the cybernetic AI opponent. First to 7 points wins!';
  const controls = isMulti
    ? 'P1: [W/S], P2: [▲/▼] | [P] Pause, [R] Restart'
    : 'Keyboard: [W/S or ▲/▼ or MOUSE] Move Paddle, [P] Pause, [R] Restart | Mobile: Up/Down D-Pad';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">${isMulti ? 'P1' : 'YOU'}: <span id="hud-p1">0</span></div>
      </div>
      <div class="hud-center">
        <div class="hud-item">${isMulti ? 'P2' : 'AI'}: <span id="hud-p2">0</span></div>
      </div>
      <div class="hud-right">
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="700" height="480"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🏓 ${title}</h1>
        <p>${description}</p>
        <button id="btn-start" class="glow-btn">START MATCH</button>
      </div>
    </div>

    <div id="win-screen" class="overlay">
      <div class="overlay-card win">
        <h2 id="win-title">🏆 VICTORY!</h2>
        <p class="final-stat">Match concluded at 7 points.</p>
        <button id="btn-win-restart" class="glow-btn">PLAY AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: false, dpadType: 'updown' })}
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
    max-width: 800px;
    max-height: 548px;
    object-fit: contain;
    background: #090d16;
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
  .hud-left, .hud-center, .hud-right {
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
    font-size: 14px;
    font-weight: 800;
  }
  .hud-item span {
    color: #38bdf8;
    font-family: monospace;
    font-size: 20px;
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
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #facc15; }
  .overlay-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
  .final-stat { font-size: 16px; color: #cbd5e1; margin-bottom: 8px !important; }
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

  const hudP1 = document.getElementById('hud-p1');
  const hudP2 = document.getElementById('hud-p2');
  const startScreen = document.getElementById('start-screen');
  const winScreen = document.getElementById('win-screen');
  const winTitle = document.getElementById('win-title');
  const pauseScreen = document.getElementById('pause-screen');

  const isMultiplayer = ${isMulti};
  let gameState = 'START';
  let p1Score = 0;
  let p2Score = 0;

  // Paddles
  const paddleW = 12;
  const paddleH = 80;
  const p1 = { x: 20, y: 200, vy: 0, speed: 6.5 };
  const p2 = { x: canvas.width - 32, y: 200, vy: 0, speed: 5.5 };

  // Ball
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 8,
    vx: 5,
    vy: 3,
    speed: 5.5
  };

  function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5.5;
    ball.vx = direction * ball.speed;
    ball.vy = (Math.random() - 0.5) * 5;
  }

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    keys[e.code] = true;
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && (gameState === 'GAMEOVER' || gameState === 'WIN')) restartGame();
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    keys[e.code] = false;
  });

  // Mouse move player 1 paddle
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    const my = (e.clientY - rect.top) * scaleY;
    p1.y = Math.max(0, Math.min(canvas.height - paddleH, my - paddleH/2));
  });

  window.handleVirtualKey = function(key, isPressed) {
    keys[key] = isPressed;
  };

  function restartGame() {
    p1Score = 0;
    p2Score = 0;
    p1.y = canvas.height / 2 - paddleH/2;
    p2.y = canvas.height / 2 - paddleH/2;
    resetBall(1);

    hudP1.textContent = '0';
    hudP2.textContent = '0';

    gameState = 'PLAYING';
    startScreen.classList.remove('active');
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
  document.getElementById('btn-win-restart').addEventListener('click', restartGame);
  document.getElementById('btn-resume').addEventListener('click', togglePause);
  document.getElementById('btn-pause-hud').addEventListener('click', togglePause);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);

  function update() {
    if (gameState !== 'PLAYING') return;

    // Player 1 controls (Keyboard)
    if (keys['w'] || keys['W'] || (!isMultiplayer && keys['ArrowUp'])) p1.y -= p1.speed;
    if (keys['s'] || keys['S'] || (!isMultiplayer && keys['ArrowDown'])) p1.y += p1.speed;
    p1.y = Math.max(0, Math.min(canvas.height - paddleH, p1.y));

    // Player 2 controls / AI
    if (isMultiplayer) {
      if (keys['ArrowUp']) p2.y -= p2.speed;
      if (keys['ArrowDown']) p2.y += p2.speed;
    } else {
      // Smart AI with tracking
      const targetY = ball.y - paddleH/2;
      if (p2.y + paddleH/2 < ball.y - 10) p2.y += p2.speed;
      else if (p2.y + paddleH/2 > ball.y + 10) p2.y -= p2.speed;
    }
    p2.y = Math.max(0, Math.min(canvas.height - paddleH, p2.y));

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top / Bottom bounce
    if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) {
      ball.vy *= -1;
      SoundFX.play('hit');
    }

    // Left Paddle Collision (P1)
    if (
      ball.x - ball.r <= p1.x + paddleW &&
      ball.x + ball.r >= p1.x &&
      ball.y >= p1.y &&
      ball.y <= p1.y + paddleH &&
      ball.vx < 0
    ) {
      const hitOffset = (ball.y - (p1.y + paddleH/2)) / (paddleH/2);
      ball.speed = Math.min(13, ball.speed + 0.3);
      ball.vx = Math.abs(ball.speed);
      ball.vy = hitOffset * 6;
      SoundFX.play('hit');
    }

    // Right Paddle Collision (P2)
    if (
      ball.x + ball.r >= p2.x &&
      ball.x - ball.r <= p2.x + paddleW &&
      ball.y >= p2.y &&
      ball.y <= p2.y + paddleH &&
      ball.vx > 0
    ) {
      const hitOffset = (ball.y - (p2.y + paddleH/2)) / (paddleH/2);
      ball.speed = Math.min(13, ball.speed + 0.3);
      ball.vx = -Math.abs(ball.speed);
      ball.vy = hitOffset * 6;
      SoundFX.play('hit');
    }

    // Score checks
    if (ball.x < -20) {
      p2Score++;
      hudP2.textContent = p2Score;
      SoundFX.play('coin');
      if (p2Score >= 7) {
        gameState = 'WIN';
        winTitle.textContent = isMultiplayer ? '🏆 PLAYER 2 WINS!' : '💀 AI WINS!';
        winScreen.classList.add('active');
        SoundFX.play('gameover');
      } else {
        resetBall(1);
      }
    } else if (ball.x > canvas.width + 20) {
      p1Score++;
      hudP1.textContent = p1Score;
      SoundFX.play('coin');
      if (p1Score >= 7) {
        gameState = 'WIN';
        winTitle.textContent = isMultiplayer ? '🏆 PLAYER 1 WINS!' : '🏆 YOU WIN!';
        winScreen.classList.add('active');
        SoundFX.play('win');
      } else {
        resetBall(-1);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(p1.x, p1.y, paddleW, paddleH, 4);
    ctx.fill();

    ctx.fillStyle = isMultiplayer ? '#a855f7' : '#ef4444';
    ctx.beginPath();
    ctx.roundRect(p2.x, p2.y, paddleW, paddleH, 4);
    ctx.fill();

    // Ball
    ctx.fillStyle = '#ffffff';
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
