/* ============================================
   SNAKE / MULTIPLAYER SNAKE GAME
   Features: Classic & 2-Player local mode,
   Smooth grid motion, Golden apples, Speed scaling,
   Sound effects, Full Mobile & Keyboard controls.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createSnakeGame(config = {}) {
  const isMulti = config.isMultiplayer || false;
  const title = config.title || (isMulti ? 'Snake Duel: 2-Player Battle' : 'Neon Viper: Classic Snake');
  const description = isMulti
    ? 'Two-player local battle! Player 1 uses [W/A/S/D], Player 2 uses [Arrow Keys]. Outmaneuver your opponent!'
    : 'Eat glowing apples, grow your serpent, and dodge walls and your own tail for high scores!';
  const controls = isMulti
    ? 'P1: [W/A/S/D], P2: [▲/◄/▼/►] | [P] Pause, [R] Restart'
    : 'Keyboard: [W/A/S/D or Arrows] Slither, [P] Pause, [R] Restart | Mobile: On-Screen D-Pad';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">${isMulti ? 'P1' : ''} SCORE: <span id="hud-score">0</span></div>
        ${isMulti ? '<div class="hud-item">P2 SCORE: <span id="hud-p2-score">0</span></div>' : ''}
      </div>
      <div class="hud-right">
        <div class="hud-item">BEST: <span id="hud-best">0</span></div>
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="600" height="600"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🐍 ${title}</h1>
        <p>${description}</p>
        <button id="btn-start" class="glow-btn">START SLITHERING</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💥 CRASHED!</h2>
        <p class="final-stat" id="go-winner-msg">Game Over!</p>
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

    ${getMobileControlsHtml({ hasAction: false, dpadType: '4way' })}
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
    max-width: 600px;
    max-height: 600px;
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
    color: #22c55e;
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
  .overlay-card h1 { font-size: 24px; margin-bottom: 12px; color: #22c55e; }
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #ef4444; }
  .overlay-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
  .final-stat { font-size: 16px; color: #cbd5e1; margin-bottom: 8px !important; }
  .final-stat span { color: #22c55e; font-weight: 800; font-family: monospace; font-size: 20px; }
  .glow-btn {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border: none;
    color: white;
    padding: 12px 30px;
    font-size: 15px;
    font-weight: 800;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(34,197,94,0.5);
  }

  ${MOBILE_CONTROLS_CSS}
  `;

  const js = `
  ${AUDIO_SYNTH_CODE}

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const hudScore = document.getElementById('hud-score');
  const hudP2Score = document.getElementById('hud-p2-score');
  const hudBest = document.getElementById('hud-best');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');
  const goScore = document.getElementById('go-score');
  const goWinnerMsg = document.getElementById('go-winner-msg');

  const isMultiplayer = ${isMulti};
  const GRID_SIZE = 20;
  const TILE_COUNT = 30;

  let gameState = 'START';
  let scoreP1 = 0;
  let scoreP2 = 0;
  let bestScore = 0;
  let speedMs = 100;
  let lastMoveTime = 0;

  // Snake 1
  let snake1 = [];
  let dir1 = { x: 1, y: 0 };
  let nextDir1 = { x: 1, y: 0 };

  // Snake 2 (if multiplayer)
  let snake2 = [];
  let dir2 = { x: -1, y: 0 };
  let nextDir2 = { x: -1, y: 0 };

  // Food
  let food = { x: 15, y: 15, isGold: false };

  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
      isGold: Math.random() < 0.2
    };
  }

  window.addEventListener('keydown', (e) => {
    // P1 Controls: WASD (or Arrow keys if single player)
    if ((e.code === 'KeyW' || (!isMultiplayer && e.code === 'ArrowUp')) && dir1.y === 0) nextDir1 = { x: 0, y: -1 };
    if ((e.code === 'KeyS' || (!isMultiplayer && e.code === 'ArrowDown')) && dir1.y === 0) nextDir1 = { x: 0, y: 1 };
    if ((e.code === 'KeyA' || (!isMultiplayer && e.code === 'ArrowLeft')) && dir1.x === 0) nextDir1 = { x: -1, y: 0 };
    if ((e.code === 'KeyD' || (!isMultiplayer && e.code === 'ArrowRight')) && dir1.x === 0) nextDir1 = { x: 1, y: 0 };

    // P2 Controls: Arrow keys in multiplayer
    if (isMultiplayer) {
      if (e.code === 'ArrowUp' && dir2.y === 0) nextDir2 = { x: 0, y: -1 };
      if (e.code === 'ArrowDown' && dir2.y === 0) nextDir2 = { x: 0, y: 1 };
      if (e.code === 'ArrowLeft' && dir2.x === 0) nextDir2 = { x: -1, y: 0 };
      if (e.code === 'ArrowRight' && dir2.x === 0) nextDir2 = { x: 1, y: 0 };
    }

    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && gameState === 'GAMEOVER') restartGame();
  });

  window.handleVirtualKey = function(key, isPressed) {
    if (!isPressed) return;
    if (key === 'ArrowUp' && dir1.y === 0) nextDir1 = { x: 0, y: -1 };
    if (key === 'ArrowDown' && dir1.y === 0) nextDir1 = { x: 0, y: 1 };
    if (key === 'ArrowLeft' && dir1.x === 0) nextDir1 = { x: -1, y: 0 };
    if (key === 'ArrowRight' && dir1.x === 0) nextDir1 = { x: 1, y: 0 };
  };

  function restartGame() {
    snake1 = [
      { x: 8, y: 15 },
      { x: 7, y: 15 },
      { x: 6, y: 15 }
    ];
    dir1 = { x: 1, y: 0 };
    nextDir1 = { x: 1, y: 0 };
    scoreP1 = 0;

    if (isMultiplayer) {
      snake2 = [
        { x: 22, y: 15 },
        { x: 23, y: 15 },
        { x: 24, y: 15 }
      ];
      dir2 = { x: -1, y: 0 };
      nextDir2 = { x: -1, y: 0 };
      scoreP2 = 0;
      hudP2Score.textContent = '0';
    }

    spawnFood();
    hudScore.textContent = '0';
    speedMs = 100;
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

  function triggerGameOver(winner) {
    gameState = 'GAMEOVER';
    SoundFX.play('hit');
    SoundFX.play('gameover');
    if (scoreP1 > bestScore) bestScore = scoreP1;
    hudBest.textContent = bestScore;
    goScore.textContent = scoreP1;

    if (isMultiplayer) {
      goWinnerMsg.textContent = winner ? winner + ' Wins!' : 'Both crashed!';
    } else {
      goWinnerMsg.textContent = 'You hit an obstacle!';
    }

    gameoverScreen.classList.add('active');
  }

  function update() {
    dir1 = nextDir1;
    const head1 = { x: snake1[0].x + dir1.x, y: snake1[0].y + dir1.y };

    // Wall collision (wrap-around or solid: solid walls)
    if (head1.x < 0 || head1.x >= TILE_COUNT || head1.y < 0 || head1.y >= TILE_COUNT) {
      triggerGameOver(isMultiplayer ? 'Player 2 (Blue)' : null);
      return;
    }

    // Self collision
    if (snake1.some(seg => seg.x === head1.x && seg.y === head1.y)) {
      triggerGameOver(isMultiplayer ? 'Player 2 (Blue)' : null);
      return;
    }

    snake1.unshift(head1);

    // Food collision
    if (head1.x === food.x && head1.y === food.y) {
      scoreP1 += food.isGold ? 300 : 100;
      hudScore.textContent = scoreP1;
      SoundFX.play('coin');
      spawnFood();
      speedMs = Math.max(50, speedMs - 1.5);
    } else {
      snake1.pop();
    }

    // Multiplayer Snake 2 update
    if (isMultiplayer) {
      dir2 = nextDir2;
      const head2 = { x: snake2[0].x + dir2.x, y: snake2[0].y + dir2.y };

      if (head2.x < 0 || head2.x >= TILE_COUNT || head2.y < 0 || head2.y >= TILE_COUNT) {
        triggerGameOver('Player 1 (Green)');
        return;
      }

      if (snake2.some(seg => seg.x === head2.x && seg.y === head2.y)) {
        triggerGameOver('Player 1 (Green)');
        return;
      }

      // Check collision between snakes
      if (snake1.some(seg => seg.x === head2.x && seg.y === head2.y)) {
        triggerGameOver('Player 1 (Green)');
        return;
      }
      if (snake2.some(seg => seg.x === head1.x && seg.y === head1.y)) {
        triggerGameOver('Player 2 (Blue)');
        return;
      }

      snake2.unshift(head2);

      if (head2.x === food.x && head2.y === food.y) {
        scoreP2 += food.isGold ? 300 : 100;
        hudP2Score.textContent = scoreP2;
        SoundFX.play('coin');
        spawnFood();
      } else {
        snake2.pop();
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = food.isGold ? '#eab308' : '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x * GRID_SIZE + GRID_SIZE/2, food.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake 1 (Green)
    snake1.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? '#4ade80' : '#22c55e';
      ctx.beginPath();
      ctx.roundRect(seg.x * GRID_SIZE + 1, seg.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);
      ctx.fill();
    });

    // Snake 2 (Blue)
    if (isMultiplayer) {
      snake2.forEach((seg, idx) => {
        ctx.fillStyle = idx === 0 ? '#60a5fa' : '#3b82f6';
        ctx.beginPath();
        ctx.roundRect(seg.x * GRID_SIZE + 1, seg.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);
        ctx.fill();
      });
    }
  }

  function gameLoop(now) {
    if (gameState === 'PLAYING') {
      if (now - lastMoveTime > speedMs) {
        update();
        lastMoveTime = now;
      }
    }
    draw();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  ${MOBILE_CONTROLS_JS}
  `;

  return { title, description, controls, html, css, js };
}
