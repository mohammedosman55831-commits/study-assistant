/* ============================================
   ACTION RPG / DUNGEON CRAWLER GAME
   Features: Knight hero, Sword slash hitboxes,
   Dungeon slimes & skeletons, Health hearts,
   Loot chests, Boss fight, Mobile & Keyboard.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { getMobileControlsHtml, MOBILE_CONTROLS_CSS, MOBILE_CONTROLS_JS } from '../mobile-controls';

export function createRpgGame(config = {}) {
  const title = config.title || 'Dungeon of Valor: Action RPG';
  const description = 'Delve into subterranean catacombs, slash dungeon fiends with your sword, collect potions, and vanquish the Dungeon Lord!';
  const controls = 'Keyboard: [W/A/S/D or Arrows] Move, [SPACE / J] Sword Slash, [P] Pause, [R] Restart | Mobile: D-Pad + SWORD Button';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">❤️ HP: <span id="hud-hp">100</span>/100</div>
        <div class="hud-item">⭐ XP: <span id="hud-xp">0</span></div>
      </div>
      <div class="hud-right">
        <div class="hud-item">💀 FOES: <span id="hud-kills">0</span></div>
        <button id="btn-pause-hud" class="hud-btn" title="Pause Game">⏸</button>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="800" height="520"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>⚔️ ${title}</h1>
        <p>A dark evil stirs beneath the castle. Equip your blade, slash past dungeon skeletons and slimes, and conquer the dungeon!</p>
        <button id="btn-start" class="glow-btn">ENTER CATACOMBS</button>
      </div>
    </div>

    <div id="win-screen" class="overlay">
      <div class="overlay-card win">
        <h2>🏆 DUNGEON CONQUERED!</h2>
        <p class="final-stat">You defeated all dungeon guardians and restored light!</p>
        <button id="btn-win-restart" class="glow-btn">PLAY AGAIN</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card danger">
        <h2>💀 YOU PERISHED</h2>
        <p>Your spirit remains trapped in the catacombs...</p>
        <button id="btn-restart" class="glow-btn">REVIVE</button>
      </div>
    </div>

    <div id="pause-screen" class="overlay">
      <div class="overlay-card">
        <h2>⏸ PAUSED</h2>
        <button id="btn-resume" class="glow-btn">RESUME</button>
      </div>
    </div>

    ${getMobileControlsHtml({ hasAction: true, actionLabel: 'SLASH', hasSecondary: false, dpadType: '4way' })}
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
    max-height: 624px;
    object-fit: contain;
    background: #0c0e14;
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
    color: #facc15;
    font-family: monospace;
    font-size: 17px;
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
  .overlay-card h1 { font-size: 24px; margin-bottom: 12px; color: #facc15; }
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #ef4444; }
  .overlay-card.win h2 { color: #facc15; }
  .overlay-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
  .final-stat { font-size: 16px; color: #cbd5e1; margin-bottom: 8px !important; }
  .glow-btn {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border: none;
    color: white;
    padding: 12px 30px;
    font-size: 15px;
    font-weight: 800;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(245,158,11,0.5);
  }

  ${MOBILE_CONTROLS_CSS}
  `;

  const js = `
  ${AUDIO_SYNTH_CODE}

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const hudHp = document.getElementById('hud-hp');
  const hudXp = document.getElementById('hud-xp');
  const hudKills = document.getElementById('hud-kills');
  const startScreen = document.getElementById('start-screen');
  const winScreen = document.getElementById('win-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const pauseScreen = document.getElementById('pause-screen');

  let gameState = 'START';
  let kills = 0;
  let xp = 0;

  // Knight Player
  const player = {
    x: 400,
    y: 260,
    r: 16,
    speed: 3.6,
    hp: 100,
    angle: 0,
    slashing: false,
    slashTimer: 0
  };

  let monsters = [];
  let potions = [];

  function spawnMonsters() {
    monsters = [
      { x: 140, y: 120, r: 14, hp: 3, maxHp: 3, speed: 1.4, color: '#10b981' },
      { x: 660, y: 120, r: 14, hp: 3, maxHp: 3, speed: 1.4, color: '#10b981' },
      { x: 140, y: 400, r: 16, hp: 4, maxHp: 4, speed: 1.6, color: '#8b5cf6' },
      { x: 660, y: 400, r: 16, hp: 4, maxHp: 4, speed: 1.6, color: '#8b5cf6' },
      // Boss
      { x: 400, y: 80, r: 24, hp: 12, maxHp: 12, speed: 1.2, color: '#ef4444', isBoss: true }
    ];
  }

  function slashSword() {
    if (gameState !== 'PLAYING' || player.slashing) return;
    player.slashing = true;
    player.slashTimer = 16;
    SoundFX.play('jump');

    // Slash hit detection in front arc
    const slashRange = 46;
    for (let i = monsters.length - 1; i >= 0; i--) {
      const m = monsters[i];
      const dist = Math.hypot(m.x - player.x, m.y - player.y);
      if (dist < slashRange + m.r) {
        const angleToM = Math.atan2(m.y - player.y, m.x - player.x);
        let angleDiff = Math.abs(player.angle - angleToM);
        while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - 2 * Math.PI);

        if (angleDiff < Math.PI / 2.2) {
          m.hp -= 2;
          SoundFX.play('hit');

          // Knockback
          m.x += Math.cos(angleToM) * 20;
          m.y += Math.sin(angleToM) * 20;

          if (m.hp <= 0) {
            kills++;
            xp += m.isBoss ? 500 : 100;
            hudKills.textContent = kills;
            hudXp.textContent = xp;
            SoundFX.play('coin');

            if (Math.random() < 0.4) {
              potions.push({ x: m.x, y: m.y });
            }
            monsters.splice(i, 1);
          }
        }
      }
    }

    if (monsters.length === 0) {
      gameState = 'WIN';
      SoundFX.play('win');
      winScreen.classList.add('active');
    }
  }

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    keys[e.code] = true;
    if (e.code === 'Space' || e.code === 'KeyJ') slashSword();
    if (e.code === 'KeyP') togglePause();
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
  canvas.addEventListener('mousedown', slashSword);

  window.handleVirtualKey = function(key, isPressed) {
    keys[key] = isPressed;
    if (isPressed && (key === 'Space' || key === 'KeyX')) slashSword();
  };

  function restartGame() {
    player.x = 400;
    player.y = 380;
    player.hp = 100;
    player.slashing = false;
    kills = 0;
    xp = 0;
    potions = [];

    hudHp.textContent = '100';
    hudXp.textContent = '0';
    hudKills.textContent = '0';

    spawnMonsters();

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

  function update() {
    if (gameState !== 'PLAYING') return;

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

    player.x = Math.max(player.r + 20, Math.min(canvas.width - player.r - 20, player.x + dx * player.speed));
    player.y = Math.max(player.r + 20, Math.min(canvas.height - player.r - 20, player.y + dy * player.speed));

    if (dx !== 0 || dy !== 0) {
      if (!player.slashing) player.angle = Math.atan2(dy, dx);
    }

    if (player.slashing) {
      player.slashTimer--;
      if (player.slashTimer <= 0) player.slashing = false;
    }

    // Health Potions
    for (let i = potions.length - 1; i >= 0; i--) {
      const p = potions[i];
      if (Math.hypot(p.x - player.x, p.y - player.y) < player.r + 14) {
        player.hp = Math.min(100, player.hp + 30);
        hudHp.textContent = player.hp;
        potions.splice(i, 1);
        SoundFX.play('coin');
      }
    }

    // Monster AI
    for (const m of monsters) {
      const angle = Math.atan2(player.y - m.y, player.x - m.x);
      m.x += Math.cos(angle) * m.speed;
      m.y += Math.sin(angle) * m.speed;

      // Bite knight
      if (Math.hypot(player.x - m.x, player.y - m.y) < player.r + m.r) {
        player.hp -= 0.35;
        hudHp.textContent = Math.max(0, Math.round(player.hp));
        if (Math.random() < 0.05) SoundFX.play('hit');

        if (player.hp <= 0) {
          gameState = 'GAMEOVER';
          SoundFX.play('gameover');
          gameoverScreen.classList.add('active');
          return;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stone Dungeon Floor
    ctx.fillStyle = '#141824';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#22293d';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Dungeon Walls
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Potions
    for (const p of potions) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Monsters
    for (const m of monsters) {
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();

      // Health bar
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(m.x - 14, m.y - m.r - 8, 28, 4);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(m.x - 14, m.y - m.r - 8, (m.hp / m.maxHp) * 28, 4);
    }

    // Knight Player
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);

    // Knight Armor
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(0, 0, player.r, 0, Math.PI * 2);
    ctx.fill();

    // Knight Helmet Visor
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(6, -4, 8, 8);

    // Sword
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(10, 8, 26, 4);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, 6, 4, 8);

    // Sword Slash Arc
    if (player.slashing) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 42, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }

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
