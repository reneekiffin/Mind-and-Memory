// games/moodmatch.js — flip 3D face dice to match the target card

// Each die carries 6 face emojis. Different sets per die so puzzles vary.
const DIE_FACES = [
  ['😀','😂','😍','😎','🤔','😴'],
  ['😢','😡','🤩','🥶','🤒','😱'],
  ['🤠','🤓','😇','🥳','🙃','🤯']
];

// Each cube face needs a transform to show it front-on
const SHOW_TRANSFORM = [
  'rotateY(   0deg)',
  'rotateY( -90deg)',
  'rotateY(-180deg)',
  'rotateY(-270deg)',
  'rotateX( -90deg)',
  'rotateX(  90deg)'
];

let dieIndex   = [0,0,0];   // which face is currently shown on each die
let target     = [0,0,0];   // which face each die needs to show
let taps       = 0;
let rounds     = 0;

document.addEventListener('DOMContentLoaded', () => {
  buildDice();
  loadStats();
  moodNewRound();
  document.getElementById('res-next').addEventListener('click', () => {
    hideOverlay();
    moodNewRound();
  });
});

function buildDice() {
  const row = document.getElementById('dice-row');
  row.innerHTML = '';
  for (let d = 0; d < 3; d++) {
    const cube = document.createElement('div');
    cube.className = 'die';
    cube.dataset.idx = d;
    for (let f = 0; f < 6; f++) {
      const face = document.createElement('div');
      face.className = `face f${f}`;
      face.textContent = DIE_FACES[d][f];
      cube.appendChild(face);
    }
    cube.addEventListener('click', () => flipDie(d));
    row.appendChild(cube);
  }
  applyDieTransforms();
}

function flipDie(d) {
  dieIndex[d] = (dieIndex[d] + 1) % 6;
  taps++;
  document.getElementById('mood-taps').textContent = taps;
  applyDieTransforms();
  checkMatch();
}

function applyDieTransforms() {
  const cubes = document.querySelectorAll('.die');
  // Only highlight dice green once the entire row matches the target —
  // per-die feedback would leak which dice are already correct.
  const allMatch = dieIndex.every((v, i) => v === target[i]);
  cubes.forEach((cube, d) => {
    cube.style.transform = SHOW_TRANSFORM[dieIndex[d]];
    cube.classList.toggle('matched', allMatch);
  });
  renderTarget();
}

function renderTarget() {
  const card = document.getElementById('target-card');
  card.innerHTML = '';
  for (let d = 0; d < 3; d++) {
    const face = document.createElement('div');
    face.className = 'target-face';
    face.textContent = DIE_FACES[d][target[d]];
    card.appendChild(face);
  }
}

function checkMatch() {
  const allMatch = dieIndex.every((v, i) => v === target[i]);
  if (allMatch) {
    rounds++;
    saveStats();
    document.getElementById('mood-rounds').textContent = `🏆 ${rounds}`;
    setStatus('🎉 Matched!');
    // Pause so the player can see the green "matched" highlight on
    // all three dice before the win popup covers the board.
    setTimeout(showWin, 1600);
  }
}

function showWin() {
  const ov = document.getElementById('result-overlay');
  document.getElementById('res-emoji').textContent = '🎉';
  document.getElementById('res-score').textContent = `Solved in ${taps} taps`;
  ov.classList.add('show');
}

function hideOverlay() {
  document.getElementById('result-overlay').classList.remove('show');
}

function moodNewRound() {
  // Pick a target that isn't already matching the current dice
  do {
    target = [randFace(), randFace(), randFace()];
  } while (target.every((v, i) => v === dieIndex[i]));
  taps = 0;
  document.getElementById('mood-taps').textContent = '0';
  hideOverlay();
  applyDieTransforms();
  setStatus('Tap each die to flip it. Match the card above!');
}

function moodShuffle() {
  // Randomize the dice (without auto-completing the puzzle)
  do {
    dieIndex = [randFace(), randFace(), randFace()];
  } while (dieIndex.every((v, i) => v === target[i]));
  applyDieTransforms();
  setStatus('Dice shuffled — keep going!');
}

function randFace() {
  return Math.floor(Math.random() * 6);
}

function setStatus(msg) {
  const el = document.getElementById('mood-status');
  if (el) el.textContent = msg;
}

function saveStats() {
  try { localStorage.setItem('mindmemory_moodmatch', JSON.stringify({rounds})); } catch(e) {}
}

function loadStats() {
  try {
    const raw = localStorage.getItem('mindmemory_moodmatch');
    if (raw) {
      const d = JSON.parse(raw);
      rounds = d.rounds || 0;
      document.getElementById('mood-rounds').textContent = `🏆 ${rounds}`;
    }
  } catch(e) {}
}
