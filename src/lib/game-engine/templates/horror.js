/* ============================================
   HORROR GAME WITH DYNAMIC FLASHLIGHT
   Features: Pitch-black darkness with dynamic
   radial flashlight cone, Roaming shadow stalker,
   Key scavenging, Escape vault, Battery meter,
   Heartbeat audio, Mobile & Keyboard controls.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createHorrorGame(config = {}) {
  const title = config.title || 'Shadow Corridor: The Flashlight';
  const description = 'Trapped in an abandoned subterranean asylum in total darkness. Use your flashlight sparingly, collect 3 vault keys, and escape the roaming stalker!';
  const controls = 'Keyboard: [W/A/S/D or Arrows] Move, [MOUSE / AIM] Point Flashlight, [SPACE / F] Toggle Flashlight, [P] Pause, [R] Restart | Mobile: Virtual D-Pad';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">🔑 KEYS: <span id="hud-keys">0/3</span></div>
        <div class="hud-item">🔋 BATTERY: <span id="hud-battery">100</span>%</div>
      </div>
      <div class="hud-right">
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="800" height="560"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card danger">
        <h1>🔦 ${title}</h1>
        <p>You are trapped in the dark. A relentless shadowy stalker lurks in the corridors. Find all 3 Brass Keys and reach the EXIT Vault door before your battery or sanity runs out!</p>
        <div class="key-help">
          <span><b>W A S D</b> Move</span>
          <span><b>Mouse / Aim</b> Flashlight</span>
          <span><b>3 Keys</b> Unlock Exit</span>
          <span><b>Avoid Stalker</b> Stay Alive</span>
        </div>
        <button id="btn-start" class="glow-btn">ENTER THE DARK</button>
      </div>
    </div>

    <div id="win-screen" class="overlay">
      <div class="overlay-card win">
        <h2>🎉 YOU ESCAPED!</h2>
        <p>You unlocked the vault door and survived the terror of the dark!</p>
        <button id="btn-win-restart" class="glow-btn">PLAY AGAIN</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💀 CAUGHT IN THE DARK!</h2>
        <p>The stalker dragged you into the abyss...</p>
        <button id="btn-restart" class="glow-btn">TRY AGAIN</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'TORCH', hasSecondary: false, dpadType: '4way' })}
  </div>
  `;

  const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, html {
    width: 100%; height: 100%;
    overflow: hidden;
    background: #000000;
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
    max-height: 672px;
    object-fit: contain;
    background: #000000;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,1);
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
    background: rgba(10, 10, 10, 0.85);
    backdrop-filter: blur(8px);
    padding: 8px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .hud-item {
    font-size: 13px;
    font-weight: 800;
  }
  .hud-item span {
    color: #facc15;
    font-family: monospace;
    font-size: 17px;
  }
  .hud-btn {
    pointer-events: auto;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(12px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 60;
  }
  .overlay.active { display: flex; }
  .overlay-card {
    background: #0d0f17;
    border: 1px solid rgba(239, 68, 68, 0.3);
    padding: 32px 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 440px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.9);
  }
  .overlay-card h1 { font-size: 24px; margin-bottom: 12px; color: #ef4444; }
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #ef4444; }
  .overlay-card.win h2 { color: #facc15; }
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
    background: linear-gradient(135deg, #b91c1c, #991b1b);
    border: none;
    color: white;
    padding: 12px 30px;
    font-size: 15px;
    font-weight: 800;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(185,28,28,0.6);
  }

  ${MOBILE_CONTROLS_CSS}
  `;

  const js = `
  ${AUDIO_SYNTH_CODE}

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const hudKeys = document.getElementById('hud-keys');
  const hudBattery = document.getElementById('hud-battery');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const winScreen = document.getElementById('win-screen');
  const pauseScreen = document.getElementById('pause-screen');

  let gameState = 'START';
  let keysCollected = 0;
  let battery = 100;
  let flashlightOn = true;

  // Player
  const player = {
    x: 80,
    y: 80,
    r: 14,
    speed: 3.2,
    angle: 0
  };

  // Stalker Monster
  const monster = {
    x: 700,
    y: 450,
    r: 18,
    speed: 1.8,
    angle: 0
  };

  // 3 Keys to find
  let keysItems = [
    { x: 120, y: 460, collected: false },
    { x: 700, y: 120, collected: false },
    { x: 420, y: 300, collected: false }
  ];

  // Battery items
  let batteries = [
    { x: 400, y: 100, collected: false },
    { x: 250, y: 480, collected: false }
  ];

  // Exit Vault Door (at bottom right)
  const exitDoor = { x: 740, y: 500, w: 40, h: 40 };

  // Walls/Pillars
  const pillars = [
    { x: 200, y: 140, w: 60, h: 180 },
    { x: 380, y: 180, w: 180, h: 60 },
    { x: 580, y: 300, w: 60, h: 180 },
    { x: 200, y: 380, w: 180, h: 60 }
  ];

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    keys[e.code] = true;
    if (e.code === 'KeyP') togglePause();
    if (e.code === 'KeyF' || e.code === 'Space') flashlightOn = !flashlightOn;
    if (e.code === 'KeyR' && (gameState === 'GAMEOVER' || gameState === 'WIN')) restartGame();
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    keys[e.code] = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    player.angle = Math.atan2(my - player.y, mx - player.x);
  });

  window.handleVirtualKey = function(key, isPressed) {
    keys[key] = isPressed;
    if (isPressed && (key === 'Space' || key === 'KeyX')) {
      flashlightOn = !flashlightOn;
    }
  };

  function restartGame() {
    player.x = 80;
    player.y = 80;
    monster.x = 700;
    monster.y = 450;
    keysCollected = 0;
    battery = 100;
    flashlightOn = true;

    keysItems = [
      { x: 120, y: 460, collected: false },
      { x: 700, y: 120, collected: false },
      { x: 420, y: 300, collected: false }
    ];

    batteries = [
      { x: 400, y: 100, collected: false },
      { x: 250, y: 480, collected: false }
    ];

    hudKeys.textContent = '0/3';
    hudBattery.textContent = '100';

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

    // Player Movement
    let dx = 0;
    let dy = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx -= 1;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 1;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) dy -= 1;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) dy += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    const nextX = Math.max(player.r, Math.min(canvas.width - player.r, player.x + dx * player.speed));
    const nextY = Math.max(player.r, Math.min(canvas.height - player.r, player.y + dy * player.speed));

    // Collision with pillars
    let collide = false;
    for (const p of pillars) {
      if (nextX + player.r > p.x && nextX - player.r < p.x + p.w &&
          nextY + player.r > p.y && nextY - player.r < p.y + p.h) {
        collide = true;
        break;
      }
    }
    if (!collide) {
      player.x = nextX;
      player.y = nextY;
    }

    if (dx !== 0 || dy !== 0) {
      player.angle = Math.atan2(dy, dx);
    }

    // Battery drain when flashlight is on
    if (flashlightOn) {
      battery = Math.max(0, battery - 0.05);
      hudBattery.textContent = Math.round(battery);
      if (battery <= 0) flashlightOn = false;
    }

    // Collect Keys
    for (const k of keysItems) {
      if (!k.collected && Math.hypot(player.x - k.x, player.y - k.y) < player.r + 14) {
        k.collected = true;
        keysCollected++;
        hudKeys.textContent = keysCollected + '/3';
        SoundFX.play('coin');
      }
    }

    // Collect Batteries
    for (const b of batteries) {
      if (!b.collected && Math.hypot(player.x - b.x, player.y - b.y) < player.r + 14) {
        b.collected = true;
        battery = Math.min(100, battery + 40);
        hudBattery.textContent = Math.round(battery);
        SoundFX.play('jump');
      }
    }

    // Monster AI (Stalking player)
    const distToPlayer = Math.hypot(player.x - monster.x, player.y - monster.y);
    monster.angle = Math.atan2(player.y - monster.y, player.x - monster.x);
    monster.x += Math.cos(monster.angle) * monster.speed;
    monster.y += Math.sin(monster.angle) * monster.speed;

    // Monster catches player
    if (distToPlayer < player.r + monster.r) {
      gameState = 'GAMEOVER';
      SoundFX.play('hit');
      SoundFX.play('gameover');
      gameoverScreen.classList.add('active');
      return;
    }

    // Escape Door
    if (keysCollected >= 3 && Math.hypot(player.x - (exitDoor.x + 20), player.y - (exitDoor.y + 20)) < 35) {
      gameState = 'WIN';
      SoundFX.play('win');
      winScreen.classList.add('active');
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark Room Foundation
    ctx.fillStyle = '#11131a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Pillars
    ctx.fillStyle = '#1e2433';
    for (const p of pillars) {
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    }

    // Draw Keys
    for (const k of keysItems) {
      if (!k.collected) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(k.x, k.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Batteries
    for (const b of batteries) {
      if (!b.collected) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(b.x - 6, b.y - 10, 12, 20);
      }
    }

    // Draw Exit Door
    ctx.fillStyle = keysCollected >= 3 ? '#22c55e' : '#b91c1c';
    ctx.fillRect(exitDoor.x, exitDoor.y, exitDoor.w, exitDoor.h);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.fillText('EXIT', exitDoor.x + 8, exitDoor.y + 24);

    // Draw Stalker Monster (Shadow with red glowing eyes)
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(monster.x, monster.y, monster.r, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Red Eyes
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(monster.x + Math.cos(monster.angle - 0.4) * 8, monster.y + Math.sin(monster.angle - 0.4) * 8, 3, 0, Math.PI * 2);
    ctx.arc(monster.x + Math.cos(monster.angle + 0.4) * 8, monster.y + Math.sin(monster.angle + 0.4) * 8, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw Player
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fill();

    // DYNAMIC FLASHLIGHT DARKNESS MASK
    // Create an off-canvas darkness cover with a cut-out flashlight cone
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.96)';

    // Using destination-out or radial gradient to create darkness
    const mask = document.createElement('canvas');
    mask.width = canvas.width;
    mask.height = canvas.height;
    const mCtx = mask.getContext('2d');

    mCtx.fillStyle = '#000000';
    mCtx.fillRect(0, 0, mask.width, mask.height);

    mCtx.globalCompositeOperation = 'destination-out';

    // Flashlight cone
    if (flashlightOn && battery > 0) {
      mCtx.save();
      mCtx.translate(player.x, player.y);
      mCtx.rotate(player.angle);

      mCtx.beginPath();
      mCtx.moveTo(0, 0);
      mCtx.arc(0, 0, 240, -Math.PI / 5, Math.PI / 5);
      mCtx.closePath();
      mCtx.fill();

      // Soft ambient circle around player
      const pGrad = mCtx.createRadialGradient(0, 0, 10, 0, 0, 60);
      pGrad.addColorStop(0, 'rgba(0,0,0,1)');
      pGrad.addColorStop(1, 'rgba(0,0,0,0)');
      mCtx.fillStyle = pGrad;
      mCtx.beginPath();
      mCtx.arc(0, 0, 60, 0, Math.PI * 2);
      mCtx.fill();

      mCtx.restore();
    } else {
      // Very faint glow around player if light is off
      const pGrad = mCtx.createRadialGradient(player.x, player.y, 5, player.x, player.y, 35);
      pGrad.addColorStop(0, 'rgba(0,0,0,0.8)');
      pGrad.addColorStop(1, 'rgba(0,0,0,0)');
      mCtx.fillStyle = pGrad;
      mCtx.beginPath();
      mCtx.arc(player.x, player.y, 35, 0, Math.PI * 2);
      mCtx.fill();
    }

    ctx.drawImage(mask, 0, 0);
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
