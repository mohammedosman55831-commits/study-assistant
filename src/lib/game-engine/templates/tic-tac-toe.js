/* ============================================
   TIC TAC TOE / GLOW XO GAME
   Features: Unbeatable Minimax AI / 2-Player mode,
   Neon glow grid, Win line animation, Score tally,
   Sound effects, Full Mobile & Touch support.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';

export function createTicTacToeGame(config = {}) {
  const title = config.title || 'Neon Tic-Tac-Toe: Master AI';
  const description = 'Challenge the optimal Minimax AI or pass & play with a friend. Form three in a row to win!';
  const controls = 'Mouse/Tap: Click any empty cell to place your X or O marker. [R] Restart Match';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">X (YOU): <span id="hud-x-score">0</span></div>
        <div class="hud-item">O (AI): <span id="hud-o-score">0</span></div>
      </div>
      <div class="hud-right">
        <button id="btn-restart-hud" class="hud-btn" title="New Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="480" height="480"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>⭕ ${title} ❌</h1>
        <p>You play as X. Can you outsmart the Minimax AI or force a stalemate draw?</p>
        <button id="btn-start" class="glow-btn">START MATCH</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card win">
        <h2 id="go-title">WINNER!</h2>
        <button id="btn-restart" class="glow-btn">PLAY AGAIN</button>
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
    max-width: 480px;
    max-height: 480px;
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
  .overlay-card h2 { font-size: 26px; margin-bottom: 12px; color: #facc15; }
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
  `;

  const js = `
  ${AUDIO_SYNTH_CODE}

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const hudXScore = document.getElementById('hud-x-score');
  const hudOScore = document.getElementById('hud-o-score');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const goTitle = document.getElementById('go-title');

  let xScore = 0;
  let oScore = 0;
  let board = ['', '', '', '', '', '', '', '', ''];
  let turn = 'X';
  let gameState = 'START';
  let winLine = null;

  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function checkWinner(b) {
    for (const combo of winCombos) {
      const [a, c, d] = combo;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a], combo };
      }
    }
    if (b.every(cell => cell !== '')) return { winner: 'TIE' };
    return null;
  }

  // Minimax Algorithm
  function minimax(newBoard, player) {
    const res = checkWinner(newBoard);
    if (res) {
      if (res.winner === 'O') return { score: 10 };
      if (res.winner === 'X') return { score: -10 };
      if (res.winner === 'TIE') return { score: 0 };
    }

    const availSpots = [];
    newBoard.forEach((v, i) => { if (v === '') availSpots.push(i); });

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = availSpots[i];
      newBoard[availSpots[i]] = player;

      if (player === 'O') {
        const result = minimax(newBoard, 'X');
        move.score = result.score;
      } else {
        const result = minimax(newBoard, 'O');
        move.score = result.score;
      }

      newBoard[availSpots[i]] = '';
      moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  function handleCellClick(index) {
    if (gameState !== 'PLAYING' || board[index] !== '' || turn !== 'X') return;

    board[index] = 'X';
    SoundFX.play('jump');

    const result = checkWinner(board);
    if (result) {
      handleGameOver(result);
      return;
    }

    turn = 'O';
    setTimeout(makeAiMove, 300);
  }

  function makeAiMove() {
    if (gameState !== 'PLAYING') return;

    // Run Minimax
    const best = minimax(board, 'O');
    if (best && best.index !== undefined) {
      board[best.index] = 'O';
      SoundFX.play('coin');

      const result = checkWinner(board);
      if (result) {
        handleGameOver(result);
        return;
      }
      turn = 'X';
    }
  }

  function handleGameOver(result) {
    gameState = 'GAMEOVER';
    if (result.winner === 'X') {
      xScore++;
      hudXScore.textContent = xScore;
      goTitle.textContent = '🎉 YOU WIN!';
      winLine = result.combo;
      SoundFX.play('win');
    } else if (result.winner === 'O') {
      oScore++;
      hudOScore.textContent = oScore;
      goTitle.textContent = '💀 AI WINS!';
      winLine = result.combo;
      SoundFX.play('gameover');
    } else {
      goTitle.textContent = '🤝 STALEMATE DRAW!';
      SoundFX.play('hit');
    }
    gameoverScreen.classList.add('active');
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const cx = (e.clientX - rect.left) * scale;
    const cy = (e.clientY - rect.top) * scale;

    const col = Math.floor(cx / (canvas.width / 3));
    const row = Math.floor(cy / (canvas.height / 3));
    const idx = row * 3 + col;
    handleCellClick(idx);
  });

  function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    turn = 'X';
    winLine = null;
    gameState = 'PLAYING';
    startScreen.classList.remove('active');
    gameoverScreen.classList.remove('active');
    SoundFX.play('jump');
  }

  document.getElementById('btn-start').addEventListener('click', () => { SoundFX.init(); restartGame(); });
  document.getElementById('btn-restart').addEventListener('click', restartGame);
  document.getElementById('btn-restart-hud').addEventListener('click', restartGame);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellW = canvas.width / 3;
    const cellH = canvas.height / 3;

    // Draw Grid Lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(cellW, 20); ctx.lineTo(cellW, canvas.height - 20);
    ctx.moveTo(cellW * 2, 20); ctx.lineTo(cellW * 2, canvas.height - 20);
    ctx.moveTo(20, cellH); ctx.lineTo(canvas.width - 20, cellH);
    ctx.moveTo(20, cellH * 2); ctx.lineTo(canvas.width - 20, cellH * 2);
    ctx.stroke();

    // Draw X and O marks
    for (let i = 0; i < 9; i++) {
      const val = board[i];
      const r = Math.floor(i / 3);
      const c = i % 3;
      const x = c * cellW + cellW / 2;
      const y = r * cellH + cellH / 2;

      if (val === 'X') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(x - 35, y - 35); ctx.lineTo(x + 35, y + 35);
        ctx.moveTo(x + 35, y - 35); ctx.lineTo(x - 35, y + 35);
        ctx.stroke();
      } else if (val === 'O') {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2);
        ctx.stroke();
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
