// games/math.js — unlimited auto-generated math questions
let mathScore = 0, mathQ = 0;

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function genMath() {
  const level = Math.min(Math.floor(mathQ / 5), 3); // gets harder every 5 questions
  const ops = level < 2 ? ['+', '-'] : ['+', '-', '×'];
  const op = ops[rnd(0, ops.length - 1)];
  let a, b, ans;
  if (op === '+') { a = rnd(1, 30 + level * 20); b = rnd(1, 30 + level * 20); ans = a + b; }
  else if (op === '-') { a = rnd(10, 60 + level * 20); b = rnd(1, a); ans = a - b; }
  else { a = rnd(2, 12); b = rnd(2, 12); ans = a * b; }
  return { text: `${a} ${op} ${b} = ?`, ans };
}

function uniq(val, n, gen) {
  const s = new Set([val]);
  let tries = 0;
  while (s.size < n && tries < 50) { const v = gen(); if (v > 0 && v !== val) s.add(v); tries++; }
  return shuffle([...s]);
}

function renderMathQ() {
  const { text, ans } = genMath();
  document.getElementById('math-question').textContent = text;
  document.getElementById('math-feedback').textContent = '';
  document.getElementById('math-feedback').className = 'feedback-area';
  document.getElementById('math-progress').style.width = Math.min(mathQ * 5, 100) + '%';
  const grid = document.getElementById('math-answers');
  grid.innerHTML = '';
  const choices = uniq(ans, 4, () => ans + rnd(-15, 15));
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = c;
    btn.onclick = () => handleMathA(c, btn, ans);
    grid.appendChild(btn);
  });
}

function handleMathA(chosen, btn, ans) {
  document.querySelectorAll('.answer-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('math-feedback');
  if (chosen === ans) {
    btn.classList.add('correct');
    fb.textContent = ['✅ Correct!', '✅ Well done!', '✅ Brilliant!', '✅ Perfect!'][rnd(0,3)];
    fb.className = 'feedback-area good';
    mathScore++; mathQ++;
    document.getElementById('math-score').textContent = mathScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.answer-btn').forEach(b => { if (+b.textContent === ans) b.classList.add('correct'); });
    fb.textContent = `❌ The answer was ${ans}`;
    fb.className = 'feedback-area bad';
  }
  setTimeout(renderMathQ, 1800);
}

document.addEventListener('DOMContentLoaded', () => {
  mathScore = 0; mathQ = 0;
  document.getElementById('math-score').textContent = 0;
  renderMathQ();
});
