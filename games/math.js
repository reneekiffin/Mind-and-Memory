// games/math.js — unlimited auto-generated math questions
let mathScore = 0, mathQ = 0;
let mathMode  = 'all';   // 'all' | '+' | '-' | '×' | 'algebra'
let mathDiff  = 'easy';  // 'easy' | 'medium' | 'hard'
let mathAdvanceTimer = null;
let mathPendingNext  = false;  // true while the walkthrough is on-screen

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const RANGES = {
  easy:   { add:[1,20],  sub:[10,30],  mul:[2,9]   },
  medium: { add:[10,50], sub:[20,60],  mul:[2,12]  },
  hard:   { add:[20,100],sub:[50,150], mul:[5,15]  }
};

function genArithmetic() {
  const r = RANGES[mathDiff];
  const allOps = mathDiff === 'easy' ? ['+', '-'] : ['+', '-', '×'];
  const ops = mathMode === 'all' ? allOps : [mathMode];
  const op = ops[rnd(0, ops.length - 1)];
  let a, b, ans;
  if (op === '+') { a = rnd(r.add[0], r.add[1]); b = rnd(r.add[0], r.add[1]); ans = a + b; }
  else if (op === '-') { a = rnd(r.sub[0], r.sub[1]); b = rnd(1, a); ans = a - b; }
  else { a = rnd(r.mul[0], r.mul[1]); b = rnd(r.mul[0], r.mul[1]); ans = a * b; }
  return { text: `${a} ${op} ${b} = ?`, ans };
}

// ── Algebra: returns { text, ans, steps } ─────────────
function genAlgebra() {
  if (mathDiff === 'easy') {
    // x ± a = b, with positive integers
    const x = rnd(1, 12);
    const a = rnd(1, 15);
    if (rnd(0, 1)) {
      const b = x + a;
      return {
        text: `x + ${a} = ${b}`,
        ans: x,
        steps: [
          `Start: <span class="step-eq">x + ${a} = ${b}</span>`,
          `Subtract ${a} from both sides to get x by itself.`,
          `<span class="step-eq">x = ${b} − ${a}</span>`,
          `<span class="step-eq">x = ${x}</span>`
        ]
      };
    } else {
      const aa = rnd(1, x);   // keep b non-negative
      const b  = x - aa;
      return {
        text: `x − ${aa} = ${b}`,
        ans: x,
        steps: [
          `Start: <span class="step-eq">x − ${aa} = ${b}</span>`,
          `Add ${aa} to both sides to get x by itself.`,
          `<span class="step-eq">x = ${b} + ${aa}</span>`,
          `<span class="step-eq">x = ${x}</span>`
        ]
      };
    }
  }

  if (mathDiff === 'medium') {
    // ax + b = c, a 2-9, x 1-10, b nonzero -10..10
    const a = rnd(2, 9);
    const x = rnd(1, 10);
    let b = rnd(-10, 10);
    if (b === 0) b = 1;
    const c = a * x + b;
    const sign     = b >= 0 ? '+' : '−';
    const absB     = Math.abs(b);
    const cMinusB  = c - b;
    const undoVerb = b >= 0 ? `Subtract ${absB} from` : `Add ${absB} to`;
    return {
      text: `${a}x ${sign} ${absB} = ${c}`,
      ans: x,
      steps: [
        `Start: <span class="step-eq">${a}x ${sign} ${absB} = ${c}</span>`,
        `${undoVerb} both sides to isolate the ${a}x term.`,
        `<span class="step-eq">${a}x = ${cMinusB}</span>`,
        `Divide both sides by ${a}.`,
        `<span class="step-eq">x = ${cMinusB} ÷ ${a}</span>`,
        `<span class="step-eq">x = ${x}</span>`
      ]
    };
  }

  // hard: ax + b = cx + d
  const x = rnd(1, 10);
  let aCoef = rnd(2, 9);
  let cCoef = rnd(2, 9);
  if (aCoef === cCoef) cCoef = aCoef + 1;
  const b = rnd(-10, 10);
  const d = (aCoef - cCoef) * x + b;
  const aSign = b >= 0 ? '+' : '−';
  const dSign = d >= 0 ? '+' : '−';
  const absB  = Math.abs(b);
  const absD  = Math.abs(d);
  const diffCoef = aCoef - cCoef;
  const dMinusB  = d - b;
  return {
    text: `${aCoef}x ${aSign} ${absB} = ${cCoef}x ${dSign} ${absD}`,
    ans: x,
    steps: [
      `Start: <span class="step-eq">${aCoef}x ${aSign} ${absB} = ${cCoef}x ${dSign} ${absD}</span>`,
      `Subtract ${cCoef}x from both sides so x only appears on the left.`,
      `<span class="step-eq">${diffCoef}x ${aSign} ${absB} = ${d}</span>`,
      `${b >= 0 ? `Subtract ${absB} from` : `Add ${absB} to`} both sides.`,
      `<span class="step-eq">${diffCoef}x = ${dMinusB}</span>`,
      `Divide both sides by ${diffCoef}.`,
      `<span class="step-eq">x = ${dMinusB} ÷ ${diffCoef}</span>`,
      `<span class="step-eq">x = ${x}</span>`
    ]
  };
}

function genMath() {
  return mathMode === 'algebra' ? genAlgebra() : genArithmetic();
}

function setMathMode(mode) {
  mathMode = mode;
  document.querySelectorAll('.math-mode-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.op === mode);
  });
  document.getElementById('math-question-box').classList.toggle('algebra', mode === 'algebra');
  document.getElementById('math-answers').style.gridTemplateColumns = mode === 'algebra' ? '1fr 1fr 1fr 1fr' : '1fr 1fr';
  resetRound();
}

function setMathDiff(diff) {
  mathDiff = diff;
  document.querySelectorAll('.math-diff-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.diff === diff);
  });
  resetRound();
}

function resetRound() {
  if (mathAdvanceTimer) { clearTimeout(mathAdvanceTimer); mathAdvanceTimer = null; }
  mathPendingNext = false;
  document.getElementById('math-walkthrough').style.display = 'none';
  mathQ = 0;
  document.getElementById('math-progress').style.width = '0%';
  renderMathQ();
}

function uniq(val, n, gen) {
  const s = new Set([val]);
  let tries = 0;
  while (s.size < n && tries < 50) { const v = gen(); if (v > 0 && v !== val) s.add(v); tries++; }
  return shuffle([...s]);
}

let mathCurrent = null;

function renderMathQ() {
  mathCurrent = genMath();
  document.getElementById('math-question').textContent = mathCurrent.text;
  document.getElementById('math-feedback').textContent = '';
  document.getElementById('math-feedback').className = 'feedback-area';
  document.getElementById('math-walkthrough').style.display = 'none';
  document.getElementById('math-progress').style.width = Math.min(mathQ * 5, 100) + '%';
  const grid = document.getElementById('math-answers');
  grid.innerHTML = '';
  // Algebra answers can be small or even negative; still produce positive distractors near the value
  const choices = uniq(mathCurrent.ans, 4, () => mathCurrent.ans + rnd(-4, 4));
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = c;
    btn.onclick = () => handleMathA(c, btn, mathCurrent.ans);
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
    mathAdvanceTimer = setTimeout(advanceMath, 1800);
    return;
  }

  // Wrong answer
  btn.classList.add('wrong');
  document.querySelectorAll('.answer-btn').forEach(b => { if (+b.textContent === ans) b.classList.add('correct'); });
  fb.textContent = `❌ The answer was ${ans}`;
  fb.className = 'feedback-area bad';

  // For algebra, show the solving steps and wait for "Next →"
  if (mathCurrent && mathCurrent.steps) {
    const stepsEl = document.getElementById('math-walkthrough-steps');
    stepsEl.innerHTML = mathCurrent.steps.map(s => `<div>${s}</div>`).join('');
    document.getElementById('math-walkthrough').style.display = 'block';
    mathPendingNext = true;
    // Safety auto-advance if the player walks away
    mathAdvanceTimer = setTimeout(advanceMath, 25000);
  } else {
    mathAdvanceTimer = setTimeout(advanceMath, 1800);
  }
}

function advanceMath() {
  if (mathAdvanceTimer) { clearTimeout(mathAdvanceTimer); mathAdvanceTimer = null; }
  mathPendingNext = false;
  document.getElementById('math-walkthrough').style.display = 'none';
  renderMathQ();
}

document.addEventListener('DOMContentLoaded', () => {
  mathScore = 0; mathQ = 0;
  document.getElementById('math-score').textContent = 0;
  renderMathQ();
});
