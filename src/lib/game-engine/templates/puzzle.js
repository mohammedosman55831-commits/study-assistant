/* ============================================
   2048 / TILE MERGE PUZZLE GAME
   Features: 4x4 Grid, Slide Animations, Tile Merge,
   Score & Best Score, Undo, Win Banner,
   Mobile Swipe & Keyboard controls.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createPuzzleGame(config = {}) {
  const title = config.title || 'Neon 2048: Tile Fusion';
  const description = 'Slide matching number tiles together to merge them! Join identical numbers to reach the legendary 2048 tile!';
  const controls = 'Keyboard: [W/A/S/D or Arrows] Slide Tiles, [U] Undo, [R] Restart | Mobile: On-Screen D-Pad / Swipe';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">SCORE: <span id="hud-score">0</span></div>
      </div>
      <div class="hud-right">
        <div class="hud-item">BEST: <span id="hud-best">0</span></div>
        <button id="btn-undo" class="hud-btn" title="Undo Move">↩️</button>
        <button id="btn-restart-hud" class="hud-btn" title="New Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="500" height="500"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🔢 ${title}</h1>
        <p>Use arrow keys to slide tiles in 4 directions. When two identical numbers touch, they merge into one!</p>
        <button id="btn-start" class="glow-btn">PLAY 2048</button>
      </div>
    </div>

    <div id="win-screen" class="overlay">
      <div class="overlay-card win">
        <h2>🎉 2048 REACHED!</h2>
        <p class="final-stat">You formed the 2048 tile!</p>
        <button id="btn-continue" class="glow-btn">KEEP PLAYING</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💀 NO MOVES LEFT!</h2>
        <p class="final-stat">Final Score: <span id="go-score">0</span></p>
        <button id="btn-restart" class="glow-btn">TRY AGAIN</button>
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
    max-width: 500px;
    max-height: 500px;
    object-fit: contain;
    background: #0f172a;
    border-radius: 16px;
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
    background: rgba(13, 17, 26, 0.85);
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
  const hudBest = document.getElementById('hud-best');
  const startScreen = document.getElementById('start-screen');
  const winScreen = document.getElementById('win-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const goScore = document.getElementById('go-score');

  let gameState = 'START';
  let score = 0;
  let bestScore = 0;
  let hasWon = false;

  const SIZE = 4;
  let board = [];
  let previousBoard = null;
  let previousScore = 0;

  const tileColors = {
    2: { bg: '#1e293b', fg: '#f8fafc' },
    4: { bg: '#334155', fg: '#f8fafc' },
    8: { bg: '#f97316', fg: '#ffffff' },
    16: { bg: '#ea580c', fg: '#ffffff' },
    32: { bg: '#ef4444', fg: '#ffffff' },
    64: { bg: '#dc2626', fg: '#ffffff' },
    128: { bg: '#eab308', fg: '#ffffff' },
    256: { bg: '#ca8a04', fg: '#ffffff' },
    512: { bg: '#22c55e', fg: '#ffffff' },
    1024: { bg: '#16a34a', fg: '#ffffff' },
    2048: { bg: '#3b82f6', fg: '#ffffff' }
  };

  function initBoard() {
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    addRandomTile();
    addRandomTile();
  }

  function addRandomTile() {
    const empty = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length > 0) {
      const spot = empty[Math.floor(Math.random() * empty.length)];
      board[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function slide(row) {
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        if (arr[i] === 2048 && !hasWon) {
          hasWon = true;
          winScreen.classList.add('active');
          SoundFX.play('win');
        }
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(val => val !== 0);
    while (arr.length < SIZE) arr.push(0);
    return arr;
  }

  function move(direction) {
    if (gameState !== 'PLAYING') return;

    // Save previous state for undo
    previousBoard = board.map(row => [...row]);
    previousScore = score;

    let moved = false;
    let newBoard = board.map(row => [...row]);

    if (direction === 'LEFT') {
      for (let r = 0; r < SIZE; r++) {
        const next = slide(newBoard[r]);
        if (next.some((val, idx) => val !== newBoard[r][idx])) moved = true;
        newBoard[r] = next;
      }
    } else if (direction === 'RIGHT') {
      for (let r = 0; r < SIZE; r++) {
        const reversed = [...newBoard[r]].reverse();
        const next = slide(reversed).reverse();
        if (next.some((val, idx) => val !== newBoard[r][idx])) moved = true;
        newBoard[r] = next;
      }
    } else if (direction === 'UP') {
      for (let c = 0; c < SIZE; c++) {
        let col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
        let next = slide(col);
        for (let r = 0; r < SIZE; r++) {
          if (newBoard[r][c] !== next[r]) moved = true;
          newBoard[r][c] = next[r];
        }
      }
    } else if (direction === 'DOWN') {
      for (let c = 0; c < SIZE; c++) {
        let col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
        let next = slide(col);
        for (let r = 0; r < SIZE; r++) {
          if (newBoard[3 - r][c] !== next[r]) moved = true;
          newBoard[3 - r][c] = next[r];
        }
      }
    }

    if (moved) {
      board = newBoard;
      addRandomTile();
      hudScore.textContent = score;
      if (score > bestScore) bestScore = score;
      hudBest.textContent = bestScore;
      SoundFX.play('jump');

      // Check if moves still exist
      if (isGameOver()) {
        gameState = 'GAMEOVER';
        SoundFX.play('gameover');
        goScore.textContent = score;
        gameoverScreen.classList.add('active');
      }
    }
  }

  function isGameOver() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) return false;
        if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
        if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
      }
    }
    return true;
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') move('LEFT');
    if (e.code === 'ArrowRight' || e.code === 'KeyD') move('RIGHT');
    if (e.code === 'ArrowUp' || e.code === 'KeyW') move('UP');
    if (e.code === 'ArrowDown' || e.code === 'KeyS') move('DOWN');
    if (e.code === 'KeyU') undoMove();
    if (e.code === 'KeyR' && gameState === 'GAMEOVER') restartGame();
  });

  window.handleVirtualKey = function(key, isPressed) {
    if (!isPressed) return;
    if (key === 'ArrowLeft') move('LEFT');
    if (key === 'ArrowRight') move('RIGHT');
    if (key === 'ArrowUp') move('UP');
    if (key === 'ArrowDown') move('DOWN');
  };

  function undoMove() {
    if (previousBoard) {
      board = previousBoard.map(row => [...row]);
      score = previousScore;
      hudScore.textContent = score;
      previousBoard = null;
      SoundFX.play('coin');
    }
  }

  function restartGame() {
    score = 0;
    hasWon = false;
    initBoard();
    hudScore.textContent = '0';
    gameState = 'PLAYING';
    startScreen.classList.remove('active');
    winScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    SoundFX.play('jump');
  }

  document.getElementById('btn-start').addEventListener('click', () => { SoundFX.init(); restartGame(); });
  document.getElementById('btn-restart').addEventListener('click', restartGame);
  document.getElementById('btn-continue').addEventListener('click', () => winScreen.classList.remove('active'));
  document.getElementById('btn-undo').addEventListener('click', undoMove);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pad = 12;
    const tileW = (canvas.width - pad * 5) / SIZE;

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = board[r][c];
        const x = pad + c * (tileW + pad);
        const y = pad + r * (tileW + pad);

        const colors = tileColors[val] || { bg: '#0284c7', fg: '#ffffff' };
        ctx.fillStyle = val === 0 ? '#1e293b' : colors.bg;
        ctx.beginPath();
        ctx.roundRect(x, y, tileW, tileW, 10);
        ctx.fill();

        if (val !== 0) {
          ctx.fillStyle = colors.fg;
          ctx.font = 'bold ' + (val > 512 ? '26px' : '32px') + ' sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, x + tileW / 2, y + tileW / 2);
        }
      }
    }
  }

  function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  ${MOBILE_CONTROLS_JS}
  `;

  return { title, description, controls, html, css, js };
}
