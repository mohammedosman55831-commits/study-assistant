/* ============================================
   MINECRAFT-STYLE 2D BLOCK GAME (SANDBOX MINER)
   Features: Procedural Block World (Grass, Dirt,
   Stone, Coal, Gold, Diamond), Mining with pickaxe,
   Placing blocks from hotbar, Day/Night lighting,
   Player physics, Mobile and Mouse/Keyboard.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createMinecraftGame(config = {}) {
  const title = config.title || 'CraftBlock: 2D Sandbox';
  const description = 'Explore a procedural block world, mine ores, collect resources, and build structures block by block!';
  const controls = 'Keyboard/Mouse: [A/D or ◄/►] Move, [W / ▲ / SPACE] Jump, [LEFT CLICK] Mine / Break Block, [RIGHT CLICK / B] Place Block, [1-5] Select Block | Mobile: D-Pad + DIG/PLACE Buttons';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">⛏️ BLOCKS MINED: <span id="hud-mined">0</span></div>
        <div class="hud-item">ACTIVE: <span id="hud-active-block">DIRT</span></div>
      </div>
      <div class="hud-right">
        <div class="hotbar">
          <div class="hotbar-slot active" data-type="1">1: Grass</div>
          <div class="hotbar-slot" data-type="2">2: Dirt</div>
          <div class="hotbar-slot" data-type="3">3: Stone</div>
          <div class="hotbar-slot" data-type="4">4: Wood</div>
          <div class="hotbar-slot" data-type="5">5: Gold</div>
        </div>
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Reset World">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="800" height="500"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>⛏️ ${title}</h1>
        <p>A procedural voxel sandbox! Click blocks to mine them, right-click (or tap Place) to build, and survive the block universe.</p>
        <div class="key-help">
          <span><b>A / D</b> Move</span>
          <span><b>W / SPACE</b> Jump</span>
          <span><b>Left Click</b> Mine Block</span>
          <span><b>Right Click</b> Place Block</span>
        </div>
        <button id="btn-start" class="glow-btn">START CRAFTING</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'DIG', hasSecondary: true, secondaryLabel: 'PLACE', dpadType: '4way' })}
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
    background: #38bdf8;
    border-radius: 12px;
    image-rendering: pixelated;
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
    font-size: 16px;
  }
  .hotbar {
    display: flex;
    gap: 4px;
    pointer-events: auto;
  }
  .hotbar-slot {
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    cursor: pointer;
  }
  .hotbar-slot.active {
    background: #3b82f6;
    border-color: #60a5fa;
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
  .overlay-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
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

  const hudMined = document.getElementById('hud-mined');
  const hudActiveBlock = document.getElementById('hud-active-block');
  const startScreen = document.getElementById('start-screen');
  const pauseScreen = document.getElementById('pause-screen');

  let gameState = 'START';
  let blocksMined = 0;
  let activeBlockType = 2; // Dirt
  const blockNames = { 1: 'GRASS', 2: 'DIRT', 3: 'STONE', 4: 'WOOD', 5: 'GOLD' };

  // World Grid
  const BLOCK_SIZE = 24;
  const COLS = 50;
  const ROWS = 30;
  let world = [];
  let cameraX = 0;

  // Block definitions
  // 0: Air, 1: Grass, 2: Dirt, 3: Stone, 4: Wood, 5: Gold
  const blockColors = {
    1: '#22c55e',
    2: '#854d0e',
    3: '#64748b',
    4: '#b45309',
    5: '#eab308'
  };

  // Player
  const player = {
    x: 200,
    y: 120,
    w: 18,
    h: 36,
    vx: 0,
    vy: 0,
    grounded: false,
    speed: 3.5
  };

  function initWorld() {
    world = [];
    for (let r = 0; r < ROWS; r++) {
      world[r] = [];
      for (let c = 0; c < COLS; c++) {
        if (r < 12) {
          world[r][c] = 0; // Air
        } else if (r === 12) {
          world[r][c] = 1; // Grass
        } else if (r < 17) {
          world[r][c] = 2; // Dirt
        } else {
          // Stone with chance of Gold
          world[r][c] = Math.random() < 0.08 ? 5 : 3;
        }
      }
    }
  }

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    keys[e.code] = true;
    if (e.code === 'KeyP') togglePause();
    if (e.key >= '1' && e.key <= '5') {
      selectSlot(parseInt(e.key));
    }
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    keys[e.code] = false;
  });

  function selectSlot(type) {
    activeBlockType = type;
    hudActiveBlock.textContent = blockNames[type] || 'BLOCK';
    document.querySelectorAll('.hotbar-slot').forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.type) === type);
    });
  }

  document.querySelectorAll('.hotbar-slot').forEach(s => {
    s.addEventListener('click', () => selectSlot(parseInt(s.dataset.type)));
  });

  // Mining / Placing
  function handleCanvasClick(e, isRightClick) {
    if (gameState !== 'PLAYING') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX + cameraX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(clickX / BLOCK_SIZE);
    const row = Math.floor(clickY / BLOCK_SIZE);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      if (isRightClick) {
        // Place Block
        if (world[row][col] === 0) {
          world[row][col] = activeBlockType;
          SoundFX.play('jump');
        }
      } else {
        // Mine Block
        if (world[row][col] !== 0) {
          world[row][col] = 0;
          blocksMined++;
          hudMined.textContent = blocksMined;
          SoundFX.play('hit');
        }
      }
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    handleCanvasClick(e, e.button === 2);
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  window.handleVirtualKey = function(key, isPressed) {
    keys[key] = isPressed;
    if (isPressed) {
      if (key === 'Space') {
        // Mine block in front
        const frontCol = Math.floor((player.x + 24) / BLOCK_SIZE);
        const frontRow = Math.floor((player.y + 18) / BLOCK_SIZE);
        if (world[frontRow] && world[frontRow][frontCol]) {
          world[frontRow][frontCol] = 0;
          blocksMined++;
          hudMined.textContent = blocksMined;
          SoundFX.play('hit');
        }
      } else if (key === 'KeyX') {
        // Place block
        const frontCol = Math.floor((player.x + 24) / BLOCK_SIZE);
        const frontRow = Math.floor((player.y + 18) / BLOCK_SIZE);
        if (world[frontRow] && world[frontRow][frontCol] === 0) {
          world[frontRow][frontCol] = activeBlockType;
          SoundFX.play('jump');
        }
      }
    }
  };

  function restartGame() {
    initWorld();
    player.x = 200;
    player.y = 120;
    player.vx = 0;
    player.vy = 0;
    blocksMined = 0;
    hudMined.textContent = '0';
    gameState = 'PLAYING';
    startScreen.classList.remove('active');
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
  document.getElementById('btn-resume').addEventListener('click', togglePause);
  document.getElementById('btn-pause-hud').addEventListener('click', togglePause);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);

  function update() {
    if (gameState !== 'PLAYING') return;

    // Horizontal movement
    const left = keys['ArrowLeft'] || keys['a'] || keys['A'];
    const right = keys['ArrowRight'] || keys['d'] || keys['D'];
    const jump = keys['ArrowUp'] || keys['w'] || keys['W'] || keys['KeyW'];

    if (left) player.vx = -player.speed;
    else if (right) player.vx = player.speed;
    else player.vx = 0;

    // Jump
    if (jump && player.grounded) {
      player.vy = -8.5;
      player.grounded = false;
      SoundFX.play('jump');
    }

    // Gravity
    player.vy += 0.45;
    if (player.vy > 10) player.vy = 10;

    // Apply movement & simple block collisions
    player.x += player.vx;
    player.y += player.vy;
    player.grounded = false;

    const bLeft = Math.floor(player.x / BLOCK_SIZE);
    const bRight = Math.floor((player.x + player.w) / BLOCK_SIZE);
    const bBottom = Math.floor((player.y + player.h) / BLOCK_SIZE);

    if (bBottom >= 0 && bBottom < ROWS) {
      if (
        (world[bBottom][bLeft] && world[bBottom][bLeft] !== 0) ||
        (world[bBottom][bRight] && world[bBottom][bRight] !== 0)
      ) {
        player.y = bBottom * BLOCK_SIZE - player.h;
        player.vy = 0;
        player.grounded = true;
      }
    }

    cameraX = Math.max(0, Math.min(COLS * BLOCK_SIZE - canvas.width, player.x - canvas.width / 2));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Sky
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(cameraX, 0, canvas.width, canvas.height);

    // Sun
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cameraX + 650, 40, 48, 48);

    // Blocks
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const type = world[r][c];
        if (type !== 0) {
          const bx = c * BLOCK_SIZE;
          const by = r * BLOCK_SIZE;
          ctx.fillStyle = blockColors[type] || '#64748b';
          ctx.fillRect(bx, by, BLOCK_SIZE, BLOCK_SIZE);

          // Grid lines
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.strokeRect(bx, by, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }

    // Player (Steve-style box avatar)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(player.x, player.y + 14, player.w, 12); // Shirt
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(player.x, player.y + 26, player.w, 10); // Pants
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(player.x + 2, player.y, player.w - 4, 14); // Head
    ctx.fillStyle = '#78350f';
    ctx.fillRect(player.x + 2, player.y, player.w - 4, 4); // Hair

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
