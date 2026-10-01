/* ============================================
   AI GAME PROMPT DETECTOR & FEATURE EXTRACTOR
   Recognizes game generation intent and extracts
   genre, mechanics, camera, weather, enemies,
   multiplayer, difficulty, art style, and UI features.
   ============================================ */

const GAME_TRIGGER_KEYWORDS = [
  'make a game', 'create a game', 'build a game', 'generate a game',
  'code a game', 'design a game', 'make game', 'create game', 'build game',
  'develop a game', 'play a game', 'make me a game', 'create me a game',
  'build me a game', 'racing game', 'car racing', 'platformer', '2d platformer',
  'shooter', 'space shooter', 'zombie', 'zombie survival', 'flappy bird',
  'flappy', 'snake game', 'multiplayer snake', 'chess', 'tic tac toe',
  'endless runner', 'horror game', 'maze', 'tower defense', 'rpg',
  'dungeon crawler', 'puzzle', '2048', 'memory game', 'brick breaker',
  'breakout', 'pong', 'minecraft', 'block game', 'gta', 'gta-style',
  'driving demo', 'sandbox game', 'bullet hell', 'roguelike', 'metroidvania',
];

export function isGamePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') return false;
  const p = prompt.toLowerCase().trim();

  for (const trigger of GAME_TRIGGER_KEYWORDS) {
    if (p.includes(trigger)) return true;
  }

  // "make ... game", "build ... game", "create ... game"
  if (/(make|create|build|generate|code|program)\s+(a\s+|an\s+)?[\w\s-]{1,30}\s+game/i.test(p)) return true;

  // "can you make flappy bird", "want to play pong"
  if (/(can you (make|build|create)|want (a|to play)|i want to play)\s+[\w\s-]{1,30}/i.test(p) &&
      /(racing|flappy|platformer|zombie|snake|pong|brick|runner|shooter|maze|chess|minecraft|horror|rpg)/i.test(p)) {
    return true;
  }

  return false;
}

export function detectGameConfig(prompt) {
  const p = (prompt || '').toLowerCase();

  // ── Weather ──────────────────────────────────────────────────────
  const rain   = p.includes('rain') || p.includes('rainy') || p.includes('storm') || p.includes('thunder');
  const snow   = p.includes('snow') || p.includes('blizzard') || p.includes('winter');
  const fog    = p.includes('fog') || p.includes('foggy') || p.includes('mist');
  const hasWeather = rain || snow || fog || p.includes('weather');
  let weather = 'clear';
  if (rain)  weather = 'rain';
  else if (snow) weather = 'snow';
  else if (fog)  weather = 'fog';
  else if (hasWeather) weather = 'rain';

  // ── Car / Racing Modifiers ───────────────────────────────────────
  const hasNitro    = p.includes('nitro') || p.includes('boost') || p.includes('turbo');
  const hasDrifting = p.includes('drift') || p.includes('drifting') || p.includes('skid');
  const hasTraffic  = p.includes('traffic') || p.includes('civilian cars') || p.includes('highway');
  const hasHeadlights = p.includes('night') || p.includes('dark') || p.includes('headlight') || p.includes('headlights');
  const isGtaStyle  = p.includes('gta') || p.includes('open world') || p.includes('grand theft') || p.includes('driving demo') || p.includes('top down driving');

  // ── Combat / Shooter Modifiers ───────────────────────────────────
  const hasExplosions  = p.includes('explosion') || p.includes('bomb') || p.includes('blast');
  const hasScreenShake = p.includes('screen shake') || p.includes('impact') || hasExplosions;
  const hasBulletParticles = p.includes('bullet') || p.includes('shoot') || p.includes('fire');

  // ── Horror ───────────────────────────────────────────────────────
  const hasFlashlight = p.includes('flashlight') || p.includes('torch') || p.includes('dark');
  const hasMonsterAI  = p.includes('monster') || p.includes('creature') || p.includes('ghost') || p.includes('demon');

  // ── Platformer Modifiers ─────────────────────────────────────────
  const hasParallax    = p.includes('parallax') || p.includes('background') || p.includes('forest') || p.includes('jungle');
  const hasCheckpoints = p.includes('checkpoint') || p.includes('save point') || p.includes('respawn');
  const hasCoins       = p.includes('coin') || p.includes('collectible') || p.includes('gem');
  const hasWater       = p.includes('water') || p.includes('lake') || p.includes('river') || p.includes('swim');

  // ── Enemies & Boss ───────────────────────────────────────────────
  const hasEnemies   = p.includes('enemy') || p.includes('enemies') || p.includes('foe') || p.includes('opponent');
  const hasBoss      = p.includes('boss') || p.includes('boss fight') || p.includes('final boss') || p.includes('big enemy');
  const hasWaves     = p.includes('wave') || p.includes('horde') || p.includes('endless wave') || p.includes('survival');
  const hasPatrol    = p.includes('patrol') || p.includes('guard') || p.includes('patrolling');

  // ── Zombie Modifiers ─────────────────────────────────────────────
  const hasWeapons       = p.includes('weapon') || p.includes('gun') || p.includes('rifle') || p.includes('shotgun') || p.includes('pistol');
  const hasWeaponUpgrades = p.includes('upgrade') || p.includes('level up weapon') || p.includes('weapon upgrade');
  const hasBloodParticles = p.includes('blood') || p.includes('gore') || p.includes('splatter');
  const hasMedkits       = p.includes('medkit') || p.includes('health pack') || p.includes('heal');

  // ── Multiplayer ──────────────────────────────────────────────────
  const isMultiplayer = p.includes('multiplayer') || p.includes('2 player') || p.includes('two player') || p.includes('versus') || p.includes('pvp') || p.includes('co-op');

  // ── Art Style ────────────────────────────────────────────────────
  const isPixelArt  = p.includes('pixel') || p.includes('pixel-art') || p.includes('8-bit') || p.includes('retro') || p.includes('pixelated');
  const isLowPoly   = p.includes('low poly') || p.includes('minimalist') || p.includes('simple');
  const isCyberpunk = p.includes('cyberpunk') || p.includes('neon') || p.includes('futuristic');
  const isRealistic = p.includes('realistic') || p.includes('hd') || p.includes('high quality') || p.includes('professional');

  // ── Difficulty ───────────────────────────────────────────────────
  const difficultyHard   = p.includes('hard') || p.includes('difficult') || p.includes('challenging') || p.includes('extreme');
  const difficultyEasy   = p.includes('easy') || p.includes('simple') || p.includes('beginner') || p.includes('casual');
  const difficulty = difficultyHard ? 'hard' : difficultyEasy ? 'easy' : 'normal';

  // ── Camera ───────────────────────────────────────────────────────
  const isTopDown    = p.includes('top down') || p.includes('top-down') || p.includes('bird eye') || p.includes("bird's eye");
  const isSideScroll = p.includes('side scroll') || p.includes('sidescroll') || p.includes('side-scroll') || p.includes('2d platformer');
  const isFirstPerson = p.includes('first person') || p.includes('fps') || p.includes('first-person');
  const is3D         = p.includes('3d') || p.includes('three dimensional') || p.includes('isometric') || p.includes('2.5d');

  // ── Detect Primary Genre ─────────────────────────────────────────
  let type = 'racing'; // default

  if (p.includes('flappy') || (p.includes('bird') && p.includes('fly'))) {
    type = 'flappy';
  } else if (p.includes('zombie') || (p.includes('survival') && hasEnemies) || p.includes('undead')) {
    type = 'zombie';
  } else if (p.includes('minecraft') || p.includes('block game') || p.includes('voxel') || p.includes('terraria') || p.includes('mining game')) {
    type = 'minecraft';
  } else if (p.includes('platformer') || p.includes('mario') || p.includes('jump and run') || p.includes('2d platform') || (isSideScroll && !p.includes('shooter'))) {
    type = 'platformer';
  } else if (p.includes('racing') || p.includes('car game') || p.includes('race') || p.includes('driving') || isGtaStyle || p.includes('highway')) {
    type = 'racing';
  } else if (p.includes('car') && (p.includes('game') || p.includes('race'))) {
    type = 'racing';
  } else if (p.includes('snake')) {
    type = 'snake';
  } else if (p.includes('space shooter') || (p.includes('space') && p.includes('shoot')) || p.includes('invader') || p.includes('galaga') || p.includes('alien shooter')) {
    type = 'space_shooter';
  } else if (p.includes('runner') || p.includes('endless runner') || p.includes('subway') || p.includes('temple')) {
    type = 'endless_runner';
  } else if (p.includes('horror') || p.includes('scary') || (hasFlashlight && hasMonsterAI)) {
    type = 'horror';
  } else if (p.includes('maze') || p.includes('labyrinth')) {
    type = 'maze';
  } else if (p.includes('tower defense') || p.includes('turret') || p.includes('defense game')) {
    type = 'tower_defense';
  } else if (p.includes('rpg') || p.includes('dungeon') || p.includes('zelda') || p.includes('knight') || p.includes('quest') || p.includes('adventure')) {
    type = 'rpg';
  } else if (p.includes('2048') || p.includes('puzzle') || p.includes('slide puzzle')) {
    type = 'puzzle';
  } else if (p.includes('memory') || p.includes('card match') || p.includes('flip card')) {
    type = 'memory';
  } else if (p.includes('brick') || p.includes('breakout') || p.includes('arkanoid')) {
    type = 'brick_breaker';
  } else if (p.includes('pong') || p.includes('table tennis') || p.includes('air hockey')) {
    type = 'pong';
  } else if (p.includes('chess')) {
    type = 'chess';
  } else if (p.includes('tic tac toe') || p.includes('tictactoe') || p.includes('x and o') || p.includes('noughts')) {
    type = 'tic_tac_toe';
  } else if (p.includes('shooter') || p.includes('shoot')) {
    type = 'space_shooter';
  }

  return {
    type,
    prompt,
    // Weather
    hasWeather: hasWeather || weather !== 'clear',
    weather,
    fog,
    // Racing
    hasNitro: hasNitro || isGtaStyle,
    hasDrifting: hasDrifting || isGtaStyle,
    hasTraffic: hasTraffic || isGtaStyle || type === 'racing',
    hasHeadlights: hasHeadlights || fog,
    isGtaStyle,
    // Combat
    hasExplosions,
    hasScreenShake,
    hasBulletParticles,
    // Horror
    hasFlashlight: hasFlashlight || type === 'horror',
    hasMonsterAI: hasMonsterAI || type === 'horror',
    // Platformer
    hasParallax: hasParallax || isPixelArt,
    hasCheckpoints: hasCheckpoints || difficulty === 'hard',
    hasCoins,
    hasWater,
    // Enemies
    hasEnemies: hasEnemies || hasBoss || hasWaves,
    hasBoss: hasBoss || type === 'rpg',
    hasWaves: hasWaves || type === 'zombie',
    hasPatrol,
    // Zombie
    hasWeapons,
    hasWeaponUpgrades,
    hasBloodParticles,
    hasMedkits,
    // Multiplayer
    isMultiplayer,
    // Art Style
    isPixelArt,
    isLowPoly,
    isCyberpunk,
    isRealistic,
    // Difficulty
    difficulty,
    // Camera
    isTopDown,
    isSideScroll,
    isFirstPerson,
    is3D,
  };
}
