// games/sudoku.js
let sudokuLevel = 'easy';
let sudokuGrid = [], sudokuSolution = [], sudokuGiven = [];
let sudokuPencil = []; // pencil marks: 9x9 array of Sets
let sudokuSelected = null;
let pencilMode = false;
let sudokuTimer = 0, sudokuTimerRef = null;

const REMOVE = { easy: 35, medium: 45, hard: 55 };

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(a) { for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

// ── Puzzle Generation ─────────────────────────────────────
function generateSudoku() {
  const grid = Array.from({length:9}, () => Array(9).fill(0));
  fillSudoku(grid);
  return grid;
}
function fillSudoku(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const nums = shuffle([1,2,3,4,5,6,7,8,9]);
        for (const n of nums) {
          if (isValid(grid, r, c, n)) {
            grid[r][c] = n;
            if (fillSudoku(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const br = Math.floor(row/3)*3, bc = Math.floor(col/3)*3;
  for (let r = br; r < br+3; r++)
    for (let c = bc; c < bc+3; c++)
      if (grid[r][c] === num) return false;
  return true;
}

// ── Init / New Game ───────────────────────────────────────
function setSudokuLevel(lvl) {
  sudokuLevel = lvl;
  document.querySelectorAll('.sudoku-level-pill').forEach(p => {
    p.classList.remove('active');
    if (p.dataset.lvl === lvl) p.classList.add('active');
  });
  newSudokuGame();
}

function initSudoku() {
  const saved = sudokuLoad();
  if (saved && saved.level === sudokuLevel) {
    sudokuGrid     = saved.grid;
    sudokuSolution = saved.solution;
    sudokuGiven    = saved.given;
    sudokuPencil   = saved.pencil.map(row => row.map(s => new Set(s)));
    sudokuTimer    = saved.timer;
    renderBoard(); buildNumpad(); startTimer();
    document.getElementById('sudoku-status').textContent = '👋 Welcome back! Game restored!';
  } else {
    newSudokuGame();
  }
}

function newSudokuGame() {
  clearInterval(sudokuTimerRef);
  sudokuTimer = 0; sudokuSelected = null; pencilMode = false;
  sudokuSolution = generateSudoku();
  sudokuGrid = JSON.parse(JSON.stringify(sudokuSolution));
  const positions = shuffle([...Array(81).keys()]);
  for (let i = 0; i < REMOVE[sudokuLevel]; i++) {
    const pos = positions[i];
    sudokuGrid[Math.floor(pos/9)][pos%9] = 0;
  }
  sudokuGiven  = sudokuGrid.map(row => row.map(v => v !== 0));
  sudokuPencil = Array.from({length:9}, () => Array.from({length:9}, () => new Set()));
  renderBoard(); buildNumpad(); startTimer();
  document.getElementById('sudoku-status').textContent = 'Fill in the missing numbers (1–9)';
  updatePencilBtn();
  sudokuSave();
}

// ── Board Rendering ───────────────────────────────────────
function renderBoard() {
  const board = document.getElementById('sudoku-board');
  board.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.className = 'sudoku-cell';
      cell.dataset.r = r; cell.dataset.c = c;

      // thick borders for 3×3 boxes
      if ((c+1) % 3 === 0 && c !== 8) cell.style.borderRight = '2px solid #888';
      if ((r+1) % 3 === 0 && r !== 8) cell.style.borderBottom = '2px solid #888';

      if (sudokuGiven[r][c]) {
        cell.classList.add('given');
        cell.textContent = sudokuGrid[r][c];
      } else if (sudokuGrid[r][c] !== 0) {
        cell.textContent = sudokuGrid[r][c];
        cell.classList.add(sudokuGrid[r][c] === sudokuSolution[r][c] ? 'correct-fill' : 'error');
      } else {
        // show pencil marks
        renderPencilInCell(cell, r, c);
      }

      cell.onclick = () => selectCell(r, c);
      board.appendChild(cell);
    }
  }
  highlightSelection();
}

function renderPencilInCell(cell, r, c) {
  const marks = sudokuPencil[r][c];
  if (marks.size === 0) { cell.textContent = ''; return; }
  cell.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'pencil-grid';
  for (let n = 1; n <= 9; n++) {
    const s = document.createElement('span');
    s.className = 'pencil-num';
    s.textContent = marks.has(n) ? n : '';
    grid.appendChild(s);
  }
  cell.appendChild(grid);
}

function highlightSelection() {
  document.querySelectorAll('.sudoku-cell').forEach(cell => {
    cell.classList.remove('selected', 'highlight', 'same-num');
    const r = +cell.dataset.r, c = +cell.dataset.c;
    if (!sudokuSelected) return;
    const [sr, sc] = sudokuSelected;
    if (r === sr && c === sc) {
      cell.classList.add('selected');
    } else if (r === sr || c === sc || (Math.floor(r/3)===Math.floor(sr/3) && Math.floor(c/3)===Math.floor(sc/3))) {
      cell.classList.add('highlight');
    }
    // highlight same number
    const selVal = sudokuGrid[sr][sc];
    if (selVal !== 0 && sudokuGrid[r][c] === selVal) cell.classList.add('same-num');
  });
}

// ── Cell Selection & Number Entry ─────────────────────────
function selectCell(r, c) {
  sudokuSelected = [r, c];
  highlightSelection();
}

function enterNum(n) {
  if (!sudokuSelected) return;
  const [r, c] = sudokuSelected;
  if (sudokuGiven[r][c]) return; // can't change given cells

  if (n === 0) {
    // erase
    sudokuGrid[r][c] = 0;
    sudokuPencil[r][c].clear();
  } else if (pencilMode) {
    // toggle pencil mark
    sudokuGrid[r][c] = 0; // clear any filled number first
    if (sudokuPencil[r][c].has(n)) sudokuPencil[r][c].delete(n);
    else sudokuPencil[r][c].add(n);
  } else {
    // fill number
    sudokuPencil[r][c].clear();
    sudokuGrid[r][c] = n;
    // auto-remove pencil marks in same row/col/box
    autoErasePencil(r, c, n);
  }

  renderBoard();
  highlightSelection();
  sudokuSave();
  checkComplete();
}

function autoErasePencil(row, col, num) {
  const br = Math.floor(row/3)*3, bc = Math.floor(col/3)*3;
  for (let i = 0; i < 9; i++) {
    sudokuPencil[row][i].delete(num);
    sudokuPencil[i][col].delete(num);
  }
  for (let r = br; r < br+3; r++)
    for (let c = bc; c < bc+3; c++)
      sudokuPencil[r][c].delete(num);
}

// ── Pencil Mode Toggle ────────────────────────────────────
function togglePencil() {
  pencilMode = !pencilMode;
  updatePencilBtn();
}
function updatePencilBtn() {
  const btn = document.getElementById('pencil-toggle');
  if (pencilMode) {
    btn.textContent = '✏️ Pencil ON';
    btn.style.background = '#9B6DD9';
    btn.style.color = '#fff';
    btn.style.borderColor = '#9B6DD9';
  } else {
    btn.textContent = '✏️ Pencil OFF';
    btn.style.background = '#fff';
    btn.style.color = '#9B6DD9';
    btn.style.borderColor = '#9B6DD9';
  }
}

// ── Numpad ────────────────────────────────────────────────
function buildNumpad() {
  const pad = document.getElementById('sudoku-numpad');
  pad.innerHTML = '';
  for (let n = 1; n <= 9; n++) {
    const b = document.createElement('div');
    b.className = 'sudoku-num';
    b.textContent = n;
    b.onclick = () => enterNum(n);
    pad.appendChild(b);
  }
  const eraseBtn = document.createElement('div');
  eraseBtn.className = 'sudoku-num erase';
  eraseBtn.textContent = '✕ Erase';
  eraseBtn.onclick = () => enterNum(0);
  pad.appendChild(eraseBtn);
}

// ── Hint ─────────────────────────────────────────────────
function sudokuHint() {
  const empties = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (!sudokuGiven[r][c] && sudokuGrid[r][c] !== sudokuSolution[r][c])
        empties.push([r, c]);
  if (empties.length === 0) return;
  const [r, c] = empties[rnd(0, empties.length-1)];
  sudokuGrid[r][c] = sudokuSolution[r][c];
  sudokuPencil[r][c].clear();
  autoErasePencil(r, c, sudokuSolution[r][c]);
  renderBoard(); highlightSelection(); sudokuSave();
  document.getElementById('sudoku-status').textContent = `💡 Hint placed! ${empties.length-1} cells left.`;
  checkComplete();
}

// ── Completion Check ──────────────────────────────────────
function checkComplete() {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (sudokuGrid[r][c] !== sudokuSolution[r][c]) return;
  clearInterval(sudokuTimerRef);
  const m = Math.floor(sudokuTimer/60), s = sudokuTimer % 60;
  sudokuClearSave();
  setTimeout(() => {
    document.getElementById('res-emoji').textContent = '🏆';
    document.getElementById('res-title').textContent = 'Puzzle Complete!';
    document.getElementById('res-score').textContent = `Finished in ${m}:${String(s).padStart(2,'0')}! Amazing! 🎉`;
    document.getElementById('result-overlay').classList.add('show');
  }, 400);
}

// ── Timer ─────────────────────────────────────────────────
function startTimer() {
  clearInterval(sudokuTimerRef);
  sudokuTimerRef = setInterval(() => {
    sudokuTimer++;
    const m = Math.floor(sudokuTimer/60), s = sudokuTimer % 60;
    document.getElementById('sudoku-timer').textContent = `⏱ ${m}:${String(s).padStart(2,'0')}`;
    if (sudokuTimer % 30 === 0) sudokuSave();
  }, 1000);
}

// ── Save / Load ───────────────────────────────────────────
function sudokuSave() {
  try {
    const data = {
      grid: sudokuGrid, solution: sudokuSolution,
      given: sudokuGiven,
      pencil: sudokuPencil.map(row => row.map(s => [...s])),
      timer: sudokuTimer, level: sudokuLevel
    };
    localStorage.setItem('mindmemory_sudoku', JSON.stringify(data));
    const tag = document.getElementById('sudoku-save-tag');
    if (tag) tag.textContent = '💾 Saved ✓';
  } catch(e) {}
}
function sudokuLoad() {
  try {
    const d = localStorage.getItem('mindmemory_sudoku');
    if (!d) return null;
    return JSON.parse(d);
  } catch(e) { return null; }
}
function sudokuClearSave() {
  try { localStorage.removeItem('mindmemory_sudoku'); } catch(e) {}
}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSudoku();
  document.getElementById('res-play-again').onclick = () => {
    document.getElementById('result-overlay').classList.remove('show');
    newSudokuGame();
  };
});
