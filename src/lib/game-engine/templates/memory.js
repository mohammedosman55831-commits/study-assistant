/* ============================================
   MEMORY CARD MATCHING GAME
   Features: 4x4 Card Grid, Emoji symbols,
   Flip animations, Moves counter, Timer,
   Sound effects, Full Mobile & Click controls.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';
import { MOBILE_CONTROLS_CSS } from '../mobile-controls';

export function createMemoryGame(config = {}) {
  const title = config.title || 'Mind Match: Memory Matrix';
  const description = 'Flip cards to reveal hidden emoji pairs. Match all cards in the fewest moves!';
  const controls = 'Mouse/Tap: Click on any card to flip and match pairs, [R] Restart';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">MOVES: <span id="hud-moves">0</span></div>
        <div class="hud-item">PAIRS: <span id="hud-pairs">0/8</span></div>
      </div>
      <div class="hud-right">
        <div class="hud-item">⏱️ TIME: <span id="hud-timer">0</span>s</div>
        <button id="btn-restart-hud" class="hud-btn" title="Restart Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="540" height="540"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>🃏 ${title}</h1>
        <p>Test your visual memory! Find all 8 matching pairs with the fewest moves and quickest time.</p>
        <button id="btn-start" class="glow-btn">START MATCHING</button>
      </div>
    </div>

    <div id="win-screen" class="overlay">
      <div class="overlay-card win">
        <h2>🎉 ALL PAIRS MATCHED!</h2>
        <p class="final-stat">Total Moves: <span id="win-moves">0</span></p>
        <p class="final-stat">Time Taken: <span id="win-time">0</span>s</p>
        <button id="btn-win-restart" class="glow-btn">PLAY AGAIN</button>
      </div>
    </div>
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
    max-height: 540px;
    object-fit: contain;
    background: #0f172a;
    border-radius: 16px;
    cursor: pointer;
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
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #facc15; }
  .overlay-card p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
  .final-stat { font-size: 16px; color: #cbd5e1; margin-bottom: 8px !important; }
  .final-stat span { color: #facc15; font-weight: 800; font-family: monospace; font-size: 20px; }
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

  const hudMoves = document.getElementById('hud-moves');
  const hudPairs = document.getElementById('hud-pairs');
  const hudTimer = document.getElementById('hud-timer');
  const startScreen = document.getElementById('start-screen');
  const winScreen = document.getElementById('win-screen');
  const winMoves = document.getElementById('win-moves');
  const winTime = document.getElementById('win-time');

  let gameState = 'START';
  let moves = 0;
  let pairsMatched = 0;
  let seconds = 0;
  let timerInterval = null;

  const ICONS = ['🚀', '🌟', '💎', '🔥', '⚡', '🎮', '👑', '🌈'];
  let cards = [];
  let flipped = [];
  let isChecking = false;

  function initCards() {
    cards = [];
    const deck = [...ICONS, ...ICONS];
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const pad = 12;
    const cardSize = (canvas.width - pad * 5) / 4;

    for (let i = 0; i < 16; i++) {
      const r = Math.floor(i / 4);
      const c = i % 4;
      cards.push({
        id: i,
        icon: deck[i],
        x: pad + c * (cardSize + pad),
        y: pad + r * (cardSize + pad),
        size: cardSize,
        flipped: false,
        matched: false
      });
    }
  }

  canvas.addEventListener('click', (e) => {
    if (gameState !== 'PLAYING' || isChecking) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const cx = (e.clientX - rect.left) * scale;
    const cy = (e.clientY - rect.top) * scale;

    const clicked = cards.find(card =>
      !card.matched && !card.flipped &&
      cx >= card.x && cx <= card.x + card.size &&
      cy >= card.y && cy <= card.y + card.size
    );

    if (clicked) {
      clicked.flipped = true;
      flipped.push(clicked);
      SoundFX.play('jump');

      if (flipped.length === 2) {
        moves++;
        hudMoves.textContent = moves;
        isChecking = true;

        if (flipped[0].icon === flipped[1].icon) {
          // Match!
          flipped[0].matched = true;
          flipped[1].matched = true;
          pairsMatched++;
          hudPairs.textContent = pairsMatched + '/8';
          SoundFX.play('coin');
          flipped = [];
          isChecking = false;

          if (pairsMatched === 8) {
            gameState = 'WIN';
            clearInterval(timerInterval);
            SoundFX.play('win');
            winMoves.textContent = moves;
            winTime.textContent = seconds;
            winScreen.classList.add('active');
          }
        } else {
          // No match
          setTimeout(() => {
            flipped[0].flipped = false;
            flipped[1].flipped = false;
            flipped = [];
            isChecking = false;
          }, 800);
        }
      }
    }
  });

  function restartGame() {
    moves = 0;
    pairsMatched = 0;
    seconds = 0;
    flipped = [];
    isChecking = false;
    initCards();

    hudMoves.textContent = '0';
    hudPairs.textContent = '0/8';
    hudTimer.textContent = '0';

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (gameState === 'PLAYING') {
        seconds++;
        hudTimer.textContent = seconds;
      }
    }, 1000);

    gameState = 'PLAYING';
    startScreen.classList.remove('active');
    winScreen.classList.remove('active');
    SoundFX.play('jump');
  }

  document.getElementById('btn-start').addEventListener('click', () => { SoundFX.init(); restartGame(); });
  document.getElementById('btn-win-restart').addEventListener('click', restartGame);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const card of cards) {
      if (card.matched) {
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.roundRect(card.x, card.y, card.size, card.size, 12);
        ctx.fill();

        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(card.icon, card.x + card.size / 2, card.y + card.size / 2);
      } else if (card.flipped) {
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.roundRect(card.x, card.y, card.size, card.size, 12);
        ctx.fill();

        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(card.icon, card.x + card.size / 2, card.y + card.size / 2);
      } else {
        // Card Back
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(card.x, card.y, card.size, card.size, 12);
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(card.x + card.size / 2, card.y + card.size / 2, 16, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
  `;

  return { title, description, controls, html, css, js };
}
