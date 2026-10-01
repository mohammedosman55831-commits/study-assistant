/* ============================================
   PROCEDURAL MAZE / LABYRINTH GAME
   Features: Depth-First Search maze generation,
   Fog of war, Gem scavenging, Glowing exit portal,
   Timer countdown, Sound FX, Mobile/Keyboard.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createMazeGame(config = {}) {
  const title = config.title || 'Labyrinth of Echoes: Maze Runner';
  const description = 'Navigate through a procedurally generated ancient stone maze. Collect shiny gems and locate the portal!';
  const controls = 'Keyboard: [W/A/S/D or Arrows] Navigate, [P] Pause, [R] New Maze | Mobile: D-Pad Controls';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">💎 GEMS: <span id="hud-gems">0/5</span></div>
        <div class="hud-item">⏱️ TIME: <span id="hud-timer">60</span>s</div>
      </div>
      <div class="hud-right">
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="New Maze">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="620" height="620"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🧭 ${title}</h1>
        <p>Find your way through the winding procedural corridors, pick up all 5 magical gems, and reach the glowing cyan portal before time expires!</p>
        <button id="btn-start" class="glow-btn">ENTER LABYRINTH</button>
      </div>
    </div>

    <div id="win-screen" class="overlay">
      <div class="overlay-card win">
        <h2>🎉 ESCAPE SUCCESSFUL!</h2>
        <p class="final-stat">You reached the portal in time!</p>
        <button id="btn-win-restart" class="glow-btn">NEW LABYRINTH</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💀 TIME EXPIRED!</h2>
        <p>The labyrinth walls sealed forever...</p>
        <button id="btn-restart" class="glow-btn">TRY AGAIN</button>
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
    max-width: 620px;
    max-height: 620px;
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

  const hudGems = document.getElementById('hud-gems');
  const hudTimer = document.getElementById('hud-timer');
  const startScreen = document.getElementById('start-screen');
  const winScreen = document.getElementById('win-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');

  let gameState = 'START';
  let timeLeft = 60;
  let timerInterval = null;
  let gemsCollected = 0;

  // Maze size: 15x15 grid
  const COLS = 15;
  const ROWS = 15;
  const CELL_SIZE = 40;
  let grid = [];

  class Cell {
    constructor(c, r) {
      this.c = c;
      this.r = r;
      // top, right, bottom, left walls
      this.walls = [true, true, true, true];
      this.visited = false;
    }
  }

  function generateMaze() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        grid.push(new Cell(c, r));
      }
    }

    // DFS Maze Generation
    const stack = [];
    let current = grid[0];
    current.visited = true;

    function getIndex(c, r) {
      if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return -1;
      return c + r * COLS;
    }

    function checkNeighbors(cell) {
      const neighbors = [];
      const top = grid[getIndex(cell.c, cell.r - 1)];
      const right = grid[getIndex(cell.c + 1, cell.r)];
      const bottom = grid[getIndex(cell.c, cell.r + 1)];
      const left = grid[getIndex(cell.c - 1, cell.r)];

      if (top && !top.visited) neighbors.push({ cell: top, dir: 0 });
      if (right && !right.visited) neighbors.push({ cell: right, dir: 1 });
      if (bottom && !bottom.visited) neighbors.push({ cell: bottom, dir: 2 });
      if (left && !left.visited) neighbors.push({ cell: left, dir: 3 });

      if (neighbors.length > 0) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
      }
      return null;
    }

    let unvisitedCount = COLS * ROWS - 1;
    while (unvisitedCount > 0) {
      const nextObj = checkNeighbors(current);
      if (nextObj) {
        const next = nextObj.cell;
        // remove walls
        if (nextObj.dir === 0) { current.walls[0] = false; next.walls[2] = false; }
        else if (nextObj.dir === 1) { current.walls[1] = false; next.walls[3] = false; }
        else if (nextObj.dir === 2) { current.walls[2] = false; next.walls[0] = false; }
        else if (nextObj.dir === 3) { current.walls[3] = false; next.walls[1] = false; }

        next.visited = true;
        stack.push(current);
        current = next;
        unvisitedCount--;
      } else if (stack.length > 0) {
        current = stack.pop();
      }
    }
  }

  // Player position in grid
  let playerPos = { c: 0, r: 0 };
  let exitPos = { c: COLS - 1, r: ROWS - 1 };
  let gems = [];

  function spawnGems() {
    gems = [];
    while (gems.length < 5) {
      const gc = Math.floor(Math.random() * COLS);
      const gr = Math.floor(Math.random() * ROWS);
      if ((gc !== 0 || gr !== 0) && (gc !== exitPos.c || gr !== exitPos.r)) {
        if (!gems.some(g => g.c === gc && g.r === gr)) {
          gems.push({ c: gc, r: gr, collected: false });
        }
      }
    }
  }

  function movePlayer(dc, dr) {
    if (gameState !== 'PLAYING') return;
    const currentCell = grid[playerPos.c + playerPos.r * COLS];
    if (!currentCell) return;

    // Check walls
    if (dr === -1 && currentCell.walls[0]) return; // Top wall
    if (dc === 1 && currentCell.walls[1]) return;  // Right wall
    if (dr === 1 && currentCell.walls[2]) return;  // Bottom wall
    if (dc === -1 && currentCell.walls[3]) return; // Left wall

    playerPos.c += dc;
    playerPos.r += dr;

    // Check gems
    for (const g of gems) {
      if (!g.collected && g.c === playerPos.c && g.r === playerPos.r) {
        g.collected = true;
        gemsCollected++;
        hudGems.textContent = gemsCollected + '/5';
        SoundFX.play('coin');
      }
    }

    // Check exit
    if (playerPos.c === exitPos.c && playerPos.r === exitPos.r) {
      gameState = 'WIN';
      clearInterval(timerInterval);
      SoundFX.play('win');
      winScreen.classList.add('active');
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' || e.code === 'KeyW') movePlayer(0, -1);
    if (e.code === 'ArrowDown' || e.code === 'KeyS') movePlayer(0, 1);
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') movePlayer(-1, 0);
    if (e.code === 'ArrowRight' || e.code === 'KeyD') movePlayer(1, 0);
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyR' && (gameState === 'GAMEOVER' || gameState === 'WIN')) restartGame();
  });

  window.handleVirtualKey = function(key, isPressed) {
    if (!isPressed) return;
    if (key === 'ArrowUp') movePlayer(0, -1);
    if (key === 'ArrowDown') movePlayer(0, 1);
    if (key === 'ArrowLeft') movePlayer(-1, 0);
    if (key === 'ArrowRight') movePlayer(1, 0);
  };

  function restartGame() {
    generateMaze();
    playerPos = { c: 0, r: 0 };
    gemsCollected = 0;
    timeLeft = 60;
    spawnGems();

    hudGems.textContent = '0/5';
    hudTimer.textContent = '60';

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (gameState === 'PLAYING') {
        timeLeft--;
        hudTimer.textContent = timeLeft;
        if (timeLeft <= 0) {
          gameState = 'GAMEOVER';
          clearInterval(timerInterval);
          SoundFX.play('gameover');
          gameoverScreen.classList.add('active');
        }
      }
    }, 1000);

    gameState = 'PLAYING';
    startScreen.classList.remove('active');
    winScreen.classList.remove('active');
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
  document.getElementById('btn-win-restart').addEventListener('click', restartGame);
  document.getElementById('btn-restart').addEventListener('click', restartGame);
  document.getElementById('btn-resume').addEventListener('click', togglePause);
  document.getElementById('btn-pause-hud').addEventListener('click', togglePause);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(10, 10);

    // Draw Maze Walls
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;

    for (const cell of grid) {
      const x = cell.c * CELL_SIZE;
      const y = cell.r * CELL_SIZE;

      ctx.beginPath();
      if (cell.walls[0]) { ctx.moveTo(x, y); ctx.lineTo(x + CELL_SIZE, y); }
      if (cell.walls[1]) { ctx.moveTo(x + CELL_SIZE, y); ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE); }
      if (cell.walls[2]) { ctx.moveTo(x + CELL_SIZE, y + CELL_SIZE); ctx.lineTo(x, y + CELL_SIZE); }
      if (cell.walls[3]) { ctx.moveTo(x, y + CELL_SIZE); ctx.lineTo(x, y); }
      ctx.stroke();
    }

    // Draw Exit Portal
    const ex = exitPos.c * CELL_SIZE + CELL_SIZE/2;
    const ey = exitPos.r * CELL_SIZE + CELL_SIZE/2;
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(ex, ey, 14, 0, Math.PI * 2);
    ctx.fill();

    // Draw Gems
    for (const g of gems) {
      if (!g.collected) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(g.c * CELL_SIZE + CELL_SIZE/2, g.r * CELL_SIZE + CELL_SIZE/2, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Player
    const px = playerPos.c * CELL_SIZE + CELL_SIZE/2;
    const py = playerPos.r * CELL_SIZE + CELL_SIZE/2;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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
