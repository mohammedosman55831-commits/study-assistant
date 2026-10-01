/* ============================================
   PLAYABLE CHESS GAME WITH AI OPPONENT
   Features: Full 8x8 chessboard, Unicode pieces,
   Legal move highlights, AI opponent move generator,
   Captured pieces, Turn indicators, Sound FX.
   ============================================ */

import { AUDIO_SYNTH_CODE } from '../audio-helper';

export function createChessGame(config = {}) {
  const title = config.title || 'Grandmaster AI: Chess Studio';
  const description = 'Play an offline game of chess against an AI engine with move validation and board highlights.';
  const controls = 'Mouse/Tap: Click your piece to view legal moves, click target square to move. [R] Restart Match';

  const html = `
  <div class="game-wrapper">
    <div class="hud">
      <div class="hud-left">
        <div class="hud-item">TURN: <span id="hud-turn">WHITE</span></div>
      </div>
      <div class="hud-right">
        <button id="btn-restart-hud" class="hud-btn" title="New Game">🔄</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="560" height="560"></canvas>

    <div id="start-screen" class="overlay active">
      <div class="overlay-card">
        <h1>♟️ ${title}</h1>
        <p>Challenge the chess AI! You play as White (moving first). Click any piece to see valid destination squares.</p>
        <button id="btn-start" class="glow-btn">START MATCH</button>
      </div>
    </div>

    <div id="gameover-screen" class="overlay">
      <div class="overlay-card win">
        <h2 id="go-title">CHECKMATE!</h2>
        <p id="go-desc">Game over!</p>
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
    max-width: 560px;
    max-height: 560px;
    object-fit: contain;
    background: #1e293b;
    border-radius: 12px;
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

  const hudTurn = document.getElementById('hud-turn');
  const startScreen = document.getElementById('start-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  const goTitle = document.getElementById('go-title');
  const goDesc = document.getElementById('go-desc');

  const TILE_SIZE = 70;
  let board = [];
  let turn = 'w'; // 'w' = white, 'b' = black (AI)
  let selectedSquare = null;
  let validMoves = [];
  let gameState = 'START';

  // Unicode chess symbols
  const PIECE_CHARS = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
  };

  function initBoard() {
    board = [
      ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
      ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
      ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
    ];
  }

  function getMovesForPiece(r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const moves = [];

    const isEnemy = (tr, tc) => board[tr][tc] && board[tr][tc][0] !== color;
    const isEmpty = (tr, tc) => !board[tr][tc];

    if (type === 'P') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      if (r + dir >= 0 && r + dir < 8 && isEmpty(r + dir, c)) {
        moves.push({ r: r + dir, c });
        if (r === startRow && isEmpty(r + 2 * dir, c)) {
          moves.push({ r: r + 2 * dir, c });
        }
      }
      // Diagonal captures
      for (const dc of [-1, 1]) {
        if (r + dir >= 0 && r + dir < 8 && c + dc >= 0 && c + dc < 8 && isEnemy(r + dir, c + dc)) {
          moves.push({ r: r + dir, c: c + dc });
        }
      }
    } else if (type === 'N') {
      const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of offsets) {
        const tr = r + dr;
        const tc = c + dc;
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8 && (isEmpty(tr, tc) || isEnemy(tr, tc))) {
          moves.push({ r: tr, c: tc });
        }
      }
    } else if (type === 'K') {
      const offsets = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      for (const [dr, dc] of offsets) {
        const tr = r + dr;
        const tc = c + dc;
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8 && (isEmpty(tr, tc) || isEnemy(tr, tc))) {
          moves.push({ r: tr, c: tc });
        }
      }
    } else {
      // Sliders: R, B, Q
      const dirs = [];
      if (type === 'R' || type === 'Q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
      if (type === 'B' || type === 'Q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);

      for (const [dr, dc] of dirs) {
        let tr = r + dr;
        let tc = c + dc;
        while (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          if (isEmpty(tr, tc)) {
            moves.push({ r: tr, c: tc });
          } else {
            if (isEnemy(tr, tc)) moves.push({ r: tr, c: tc });
            break;
          }
          tr += dr;
          tc += dc;
        }
      }
    }

    return moves;
  }

  function makeMove(fromR, fromC, toR, toC) {
    const captured = board[toR][toC];
    board[toR][toC] = board[fromR][fromC];
    board[fromR][fromC] = null;

    // Pawn Promotion to Queen
    if (board[toR][toC] === 'wP' && toR === 0) board[toR][toC] = 'wQ';
    if (board[toR][toC] === 'bP' && toR === 7) board[toR][toC] = 'bQ';

    if (captured && captured[1] === 'K') {
      gameState = 'GAMEOVER';
      goTitle.textContent = turn === 'w' ? '🏆 WHITE WINS!' : '💀 BLACK WINS!';
      goDesc.textContent = 'King captured!';
      gameoverScreen.classList.add('active');
      SoundFX.play('win');
      return;
    }

    SoundFX.play(captured ? 'hit' : 'jump');
    turn = turn === 'w' ? 'b' : 'w';
    hudTurn.textContent = turn === 'w' ? 'WHITE' : 'BLACK (AI)';

    if (turn === 'b' && gameState === 'PLAYING') {
      setTimeout(makeAiMove, 500);
    }
  }

  function makeAiMove() {
    if (gameState !== 'PLAYING') return;

    // Collect all black legal moves
    const allMoves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] && board[r][c][0] === 'b') {
          const dests = getMovesForPiece(r, c);
          dests.forEach(d => allMoves.push({ from: { r, c }, to: d }));
        }
      }
    }

    if (allMoves.length === 0) {
      gameState = 'GAMEOVER';
      goTitle.textContent = '🏆 WHITE WINS!';
      goDesc.textContent = 'AI has no moves left!';
      gameoverScreen.classList.add('active');
      return;
    }

    // Heuristic: Prefer captures
    const captureMoves = allMoves.filter(m => board[m.to.r][m.to.c] !== null);
    const chosen = captureMoves.length > 0
      ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
      : allMoves[Math.floor(Math.random() * allMoves.length)];

    makeMove(chosen.from.r, chosen.from.c, chosen.to.r, chosen.to.c);
  }

  canvas.addEventListener('click', (e) => {
    if (gameState !== 'PLAYING' || turn !== 'w') return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const clickX = (e.clientX - rect.left) * scale;
    const clickY = (e.clientY - rect.top) * scale;

    const c = Math.floor(clickX / TILE_SIZE);
    const r = Math.floor(clickY / TILE_SIZE);

    if (selectedSquare) {
      const isTarget = validMoves.some(m => m.r === r && m.c === c);
      if (isTarget) {
        makeMove(selectedSquare.r, selectedSquare.c, r, c);
        selectedSquare = null;
        validMoves = [];
        return;
      }
    }

    // Select piece
    if (board[r][c] && board[r][c][0] === 'w') {
      selectedSquare = { r, c };
      validMoves = getMovesForPiece(r, c);
      SoundFX.play('jump');
    } else {
      selectedSquare = null;
      validMoves = [];
    }
  });

  function restartGame() {
    initBoard();
    turn = 'w';
    selectedSquare = null;
    validMoves = [];
    hudTurn.textContent = 'WHITE';
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

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isDark = (r + c) % 2 === 1;
        ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        // Highlight selected
        if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }

        // Highlight valid moves
        if (validMoves.some(m => m.r === r && m.c === c)) {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.55)';
          ctx.beginPath();
          ctx.arc(c * TILE_SIZE + TILE_SIZE/2, r * TILE_SIZE + TILE_SIZE/2, 12, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Piece
        const piece = board[r][c];
        if (piece) {
          ctx.fillStyle = piece[0] === 'w' ? '#ffffff' : '#0f172a';
          ctx.font = '46px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(PIECE_CHARS[piece] || '', c * TILE_SIZE + TILE_SIZE/2, r * TILE_SIZE + TILE_SIZE/2 + 2);
        }
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
