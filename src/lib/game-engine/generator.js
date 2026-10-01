/* ============================================
   AI GAME SYNTHESIS GENERATOR
   Orchestrates prompt detection and builds
   high-fidelity, self-contained offline games.
   ============================================ */

import { detectGameConfig, isGamePrompt } from './detector';
import { createRacingGame } from './templates/racing';
import { createFlappyGame } from './templates/flappy';
import { createPlatformerGame } from './templates/platformer';
import { createZombieGame } from './templates/zombie';
import { createMinecraftGame } from './templates/minecraft';
import { createSnakeGame } from './templates/snake';
import { createSpaceShooterGame } from './templates/space-shooter';
import { createEndlessRunnerGame } from './templates/endless-runner';
import { createHorrorGame } from './templates/horror';
import { createMazeGame } from './templates/maze';
import { createTowerDefenseGame } from './templates/tower-defense';
import { createRpgGame } from './templates/rpg';
import { createPuzzleGame } from './templates/puzzle';
import { createMemoryGame } from './templates/memory';
import { createBrickBreakerGame } from './templates/brick-breaker';
import { createPongGame } from './templates/pong';
import { createChessGame } from './templates/chess';
import { createTicTacToeGame } from './templates/tic-tac-toe';
import { createCustomGame } from './templates/custom';

export { isGamePrompt, detectGameConfig };

export function generateGame(prompt) {
  const config = detectGameConfig(prompt);
  let gameData;

  switch (config.type) {
    case 'racing':
      gameData = createRacingGame(config);
      break;
    case 'flappy':
      gameData = createFlappyGame(config);
      break;
    case 'platformer':
      gameData = createPlatformerGame(config);
      break;
    case 'zombie':
      gameData = createZombieGame(config);
      break;
    case 'minecraft':
      gameData = createMinecraftGame(config);
      break;
    case 'snake':
      gameData = createSnakeGame(config);
      break;
    case 'space_shooter':
      gameData = createSpaceShooterGame(config);
      break;
    case 'endless_runner':
      gameData = createEndlessRunnerGame(config);
      break;
    case 'horror':
      gameData = createHorrorGame(config);
      break;
    case 'maze':
      gameData = createMazeGame(config);
      break;
    case 'tower_defense':
      gameData = createTowerDefenseGame(config);
      break;
    case 'rpg':
      gameData = createRpgGame(config);
      break;
    case 'puzzle':
      gameData = createPuzzleGame(config);
      break;
    case 'memory':
      gameData = createMemoryGame(config);
      break;
    case 'brick_breaker':
      gameData = createBrickBreakerGame(config);
      break;
    case 'pong':
      gameData = createPongGame(config);
      break;
    case 'chess':
      gameData = createChessGame(config);
      break;
    case 'tic_tac_toe':
      gameData = createTicTacToeGame(config);
      break;
    default:
      gameData = createCustomGame(config);
      break;
  }

  // Generate self-contained standalone HTML document
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${gameData.title}</title>
  <style>
    ${gameData.css}
  </style>
</head>
<body>
  ${gameData.html}
  <script>
    ${gameData.js}
  </script>
</body>
</html>`;

  return {
    id: 'game_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: gameData.title,
    type: config.type,
    description: gameData.description,
    controls: gameData.controls,
    html: gameData.html,
    css: gameData.css,
    js: gameData.js,
    fullHtml,
    prompt,
    createdAt: new Date().toISOString()
  };
}
