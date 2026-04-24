// games/sudoku.js — fixed number entry + pencil marks

let sudokuLevel  = 'easy';
let sudokuGrid   = [];   // current player grid (0 = empty)
let sudokuSol    = [];   // full solution
let sudokuGiven  = [];   // true = pre-filled, cannot change
let sudokuPencil = [];   // 9x9 of Set — tiny candidate numbers
let sudokuSel    = null; // [r,c] currently selected cell
let pencilMode   = false;
let sudokuTimer  = 0, timerRef = null;

const REMOVE = { easy: 35, medium: 45, hard: 55 };

// ── Utils ────────────────────────────────────────────────────
function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Puzzle Generation ─────────────────────────────────────────
function makePuzzle() {
  const sol = Array.from({length:9}, () => Array(9).fill(0));
  fill(sol);
  return sol;
}
function fill(g) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (g[r][c] !== 0) continue;
      for (const n of shuffle([1,2,3,4,5,6,7,8,9])) {
        if (ok(g, r, c, n)) {
          g[r][c] = n;
          if (fill(g)) return true;
          g[r][c] = 0;
        }
      }
      return false;
    }
  }
  return true;
}
function ok(g, row, col, n) {
  for (let i = 0; i < 9; i++)
    if (g[row][i] === n || g[i][col] === n) return false;
  const br = Math.floor(row/3)*3, bc = Math.floor(col/3)*3;
  for (let r = br; r < br+3; r++)
    for (let c = bc; c < bc+3; c++)
      if (g[r][c] === n) return false;
  return true;
}

// ── New Game ──────────────────────────────────────────────────
function newSudokuGame() {
  clearInterval(timerRef);
  sudokuTimer = 0; sudokuSel = null; pencilMode = false;

  sudokuSol   = makePuzzle();
  sudokuGrid  = sudokuSol.map(r => [...r]);          // copy
  sudokuGiven = sudokuGrid.map(r => r.map(v => v !== 0));
  sudokuPencil= Array.from({length:9}, () =>
                  Array.from({length:9}, () => new Set()));

  // punch holes
  const pos = shuffle([...Array(81).keys()]);
  for (let i = 0; i < REMOVE[sudokuLevel]; i++) {
    const p = pos[i];
    sudokuGrid[Math.floor(p/9)][p%9] = 0;
    sudokuGiven[Math.floor(p/9)][p%9] = false;
  }

  setStatus('Tap a cell, then tap a number below');
  setPencilBtn();
  buildNumpad();
  drawBoard();
  startTimer();
  sudokuSave();
}

// ── Level selector ────────────────────────────────────────────
function setSudokuLevel(lvl) {
  sudokuLevel = lvl;
  document.querySelectorAll('.sudoku-level-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.lvl === lvl);
  });
  newSudokuGame();
}

// ── Board drawing ─────────────────────────────────────────────
function drawBoard() {
  const board = document.getElementById('sudoku-board');
  board.innerHTML = '';

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.className = 'sudoku-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      // 3×3 box borders
      if (c === 2 || c === 5) cell.style.borderRight  = '2.5px solid #777';
      if (r === 2 || r === 5) cell.style.borderBottom = '2.5px solid #777';

      if (sudokuGiven[r][c]) {
        // pre-filled — dark, cannot be changed
        cell.classList.add('given');
        cell.textContent = sudokuGrid[r][c];
      } else if (sudokuGrid[r][c] !== 0) {
        // player-filled number
        cell.textContent = sudokuGrid[r][c];
        const correct = sudokuGrid[r][c] === sudokuSol[r][c];
        cell.classList.add(correct ? 'correct-fill' : 'error');
      } else if (sudokuPencil[r][c].size > 0) {
        // pencil marks — tiny 3×3 grid
        cell.appendChild(makePencilGrid(r, c));
      }

      // selection highlight
      if (sudokuSel) {
        const [sr, sc] = sudokuSel;
        if (r === sr && c === sc) {
          cell.classList.add('selected');
        } else if (
          r === sr || c === sc ||
          (Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3))
        ) {
          cell.classList.add('highlight');
        }
        // same number highlight
        if (sudokuGrid[sr][sc] !== 0 && sudokuGrid[r][c] === sudokuGrid[sr][sc]) {
          cell.classList.add('same-num');
        }
      }

      cell.addEventListener('click', () => selectCell(r, c));
      board.appendChild(cell);
    }
  }
}

function makePencilGrid(r, c) {
  const wrap = document.createElement('div');
  wrap.className = 'pencil-grid';
  for (let n = 1; n <= 9; n++) {
    const s = document.createElement('span');
    s.className = 'pencil-num';
    s.textContent = sudokuPencil[r][c].has(n) ? n : '';
    wrap.appendChild(s);
  }
  return wrap;
}

// ── Cell selection ────────────────────────────────────────────
function selectCell(r, c) {
  sudokuSel = [r, c];
  drawBoard(); // redraw so highlights update
}

// ── Number entry ──────────────────────────────────────────────
function enterNum(n) {
  if (!sudokuSel) {
    setStatus('👆 Tap a cell first, then tap a number!');
    return;
  }
  const [r, c] = sudokuSel;

  // BLOCK given cells
  if (sudokuGiven[r][c]) {
    setStatus('🚫 That number is part of the puzzle — pick an empty cell!');
    return;
  }

  if (n === 0) {
    // Erase everything in this cell
    sudokuGrid[r][c] = 0;
    sudokuPencil[r][c].clear();
    setStatus('Erased ✓');
  } else if (pencilMode) {
    // Pencil mark — toggle on/off
    sudokuGrid[r][c] = 0; // clear any filled number
    if (sudokuPencil[r][c].has(n)) {
      sudokuPencil[r][c].delete(n);
      setStatus(`Pencil mark ${n} removed`);
    } else {
      sudokuPencil[r][c].add(n);
      setStatus(`✏️ ${n} added as a maybe number`);
    }
  } else {
    // Normal fill
    sudokuPencil[r][c].clear();
    sudokuGrid[r][c] = n;
    // auto-erase that number from pencil marks in same row/col/box
    erasePencil(r, c, n);
    if (n === sudokuSol[r][c]) {
      setStatus('✅ Correct!');
    } else {
      setStatus('❌ Not quite — keep trying!');
    }
  }

  drawBoard();
  sudokuSave();
  checkDone();
}

function erasePencil(row, col, num) {
  const br = Math.floor(row/3)*3, bc = Math.floor(col/3)*3;
  for (let i = 0; i < 9; i++) {
    sudokuPencil[row][i].delete(num);
    sudokuPencil[i][col].delete(num);
  }
  for (let r = br; r < br+3; r++)
    for (let c = bc; c < bc+3; c++)
      sudokuPencil[r][c].delete(num);
}

// ── Pencil mode toggle ────────────────────────────────────────
function togglePencil() {
  pencilMode = !pencilMode;
  setPencilBtn();
}

function setPencilBtn() {
  const btn = document.getElementById('pencil-toggle');
  if (!btn) return;
  if (pencilMode) {
    btn.style.background = '#9B6DD9';
    btn.style.color = '#fff';
    btn.style.borderColor = '#9B6DD9';
    btn.innerHTML = '✏️ Pencil: <strong>ON</strong>';
  } else {
    btn.style.background = '#fff';
    btn.style.color = '#9B6DD9';
    btn.style.borderColor = '#9B6DD9';
    btn.innerHTML = '✏️ Pencil: <strong>OFF</strong>';
  }
}

// ── Numpad ────────────────────────────────────────────────────
function buildNumpad() {
  const pad = document.getElementById('sudoku-numpad');
  pad.innerHTML = '';
  for (let n = 1; n <= 9; n++) {
    const b = document.createElement('div');
    b.className = 'sudoku-num';
    b.textContent = n;
    b.addEventListener('click', () => enterNum(n));
    pad.appendChild(b);
  }
  const erase = document.createElement('div');
  erase.className = 'sudoku-num erase';
  erase.innerHTML = '✕<span style="font-size:14px;display:block">Erase</span>';
  erase.addEventListener('click', () => enterNum(0));
  pad.appendChild(erase);
}

// ── Hint ──────────────────────────────────────────────────────
function sudokuHint() {
  const empty = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!sudokuGiven[r][c] && sudokuGrid[r][c] !== sudokuSol[r][c])
        empty.push([r, c]);
  if (!empty.length) return;
  const [r, c] = empty[rnd(0, empty.length-1)];
  sudokuGrid[r][c] = sudokuSol[r][c];
  sudokuPencil[r][c].clear();
  erasePencil(r, c, sudokuSol[r][c]);
  sudokuSel = [r, c];
  setStatus(`💡 Hint: ${sudokuSol[r][c]} placed! ${empty.length-1} cells remaining`);
  drawBoard();
  sudokuSave();
  checkDone();
}

// ── Completion ────────────────────────────────────────────────
function checkDone() {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (sudokuGrid[r][c] !== sudokuSol[r][c]) return;
  clearInterval(timerRef);
  const m = Math.floor(sudokuTimer/60), s = sudokuTimer % 60;
  sudokuClearSave();
  setTimeout(() => {
    document.getElementById('res-emoji').textContent  = '🏆';
    document.getElementById('res-title').textContent  = 'Puzzle Complete!';
    document.getElementById('res-score').textContent  =
      `Finished in ${m}:${String(s).padStart(2,'0')}! Amazing work! 🎉`;
    document.getElementById('result-overlay').classList.add('show');
  }, 400);
}

// ── Timer ─────────────────────────────────────────────────────
function startTimer() {
  clearInterval(timerRef);
  timerRef = setInterval(() => {
    sudokuTimer++;
    const m = Math.floor(sudokuTimer/60), s = sudokuTimer % 60;
    const el = document.getElementById('sudoku-timer');
    if (el) el.textContent = `⏱ ${m}:${String(s).padStart(2,'0')}`;
    if (sudokuTimer % 30 === 0) sudokuSave();
  }, 1000);
}

// ── Status text ───────────────────────────────────────────────
function setStatus(msg) {
  const el = document.getElementById('sudoku-status');
  if (el) el.innerHTML = msg;
}

// ── Save / Load (localStorage — no account needed) ────────────
function sudokuSave() {
  try {
    localStorage.setItem('mindmemory_sudoku', JSON.stringify({
      grid:    sudokuGrid,
      sol:     sudokuSol,
      given:   sudokuGiven,
      pencil:  sudokuPencil.map(row => row.map(s => [...s])),
      timer:   sudokuTimer,
      level:   sudokuLevel
    }));
    const tag = document.getElementById('sudoku-save-tag');
    if (tag) tag.textContent = '💾 Saved ✓';
  } catch(e) {}
}

function sudokuLoad() {
  try {
    const raw = localStorage.getItem('mindmemory_sudoku');
    if (!raw) return null;
    const d = JSON.parse(raw);
    // restore Sets from plain arrays
    d.pencil = d.pencil.map(row => row.map(arr => new Set(arr)));
    return d;
  } catch(e) { return null; }
}

function sudokuClearSave() {
  try { localStorage.removeItem('mindmemory_sudoku'); } catch(e) {}
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Try to restore a saved game
  const saved = sudokuLoad();
  if (saved) {
    sudokuLevel  = saved.level  || 'easy';
    sudokuGrid   = saved.grid;
    sudokuSol    = saved.sol;
    sudokuGiven  = saved.given;
    sudokuPencil = saved.pencil;
    sudokuTimer  = saved.timer  || 0;
    // update level pills to match saved level
    document.querySelectorAll('.sudoku-level-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.lvl === sudokuLevel);
    });
    setStatus('👋 Welcome back!<br>Your game has been restored.');
    setPencilBtn();
    buildNumpad();
    drawBoard();
    startTimer();
  } else {
    newSudokuGame();
  }

  document.getElementById('res-play-again').addEventListener('click', () => {
    document.getElementById('result-overlay').classList.remove('show');
    newSudokuGame();
  });
});
