// games/patterns.js
let patLevel = 1, patScore = 0, patStreak = 0;

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function setPatLevel(n) {
  patLevel = n;
  document.querySelectorAll('.pat-level-pill').forEach((p, i) => p.classList.toggle('active', i === n - 1));
  patStreak = 0; updStreak(); renderPatQ();
}

function updStreak() {
  document.getElementById('streak-badge').textContent = '🔥 Streak: ' + patStreak;
}

function genPattern(lv) {
  if (lv === 1) {
    const step = rnd(1, 10);
    const dir  = Math.random() < .5 ? 1 : -1;
    // For decreasing sequences, start high enough to keep the answer positive
    const st   = dir > 0 ? rnd(1, 30) : rnd(step * 5 + 5, step * 5 + 35);
    const seq = Array.from({length: 5}, (_, i) => st + dir * step * i);
    return { seq, answer: st + dir * step * 5, type: 'Arithmetic', hint: `Each number ${dir > 0 ? 'increases' : 'decreases'} by ${step}` };
  }
  if (lv === 2) {
    const t = rnd(0, 3);
    if (t === 0) { const m = rnd(2, 3), st = rnd(1, 6); const seq = Array.from({length:5}, (_, i) => st * Math.pow(m, i)); return { seq, answer: st * Math.pow(m, 5), type: 'Geometric', hint: `Multiply by ${m} each time` }; }
    if (t === 1) { const a = rnd(2,8), b = rnd(2,8), st = rnd(5,20); const seq = [st]; for (let i=1;i<5;i++) seq.push(seq[i-1]+(i%2===1?a:b)); const ans = seq[4]+(5%2===1?a:b); return { seq, answer:ans, type:'Alternating', hint:`Alternately add ${a} then ${b}` }; }
    if (t === 2) { const st = rnd(1,10); const seq = [st]; for (let i=1;i<5;i++) seq.push(seq[i-1]+i); return { seq, answer:seq[4]+5, type:'Growing Steps', hint:'Each gap increases by 1 more' }; }
    const m=2, s=rnd(1,2), st=rnd(3,8); const seq=[]; let c=st; for(let i=0;i<5;i++){seq.push(c);c=c*m-s;} return { seq, answer:c, type:'Multiply-Subtract', hint:`×${m} then −${s} each time` };
  }
  if (lv === 3) {
    const t = rnd(0, 3);
    if (t === 0) { const c=rnd(0,10); const seq=Array.from({length:5},(_,i)=>(i+1)*(i+1)+c); return {seq,answer:36+c,type:'Square Numbers',hint:`Perfect squares (1,4,9,16,25…) + ${c}`}; }
    if (t === 1) { const a=rnd(1,5),b=rnd(1,5); const seq=[a,b]; for(let i=2;i<5;i++) seq.push(seq[i-1]+seq[i-2]); return {seq,answer:seq[4]+seq[3],type:'Fibonacci-Style',hint:'Add the two previous numbers together'}; }
    if (t === 2) { const st=rnd(1,8),s=rnd(1,3); const seq=[st]; let d=s; for(let i=1;i<5;i++){seq.push(seq[i-1]+d);d*=2;} return {seq,answer:seq[4]+d,type:'Doubling Gaps',hint:'Each gap between numbers doubles'}; }
    const off=rnd(0,8); const seq=Array.from({length:5},(_,i)=>{const n=i+1;return n*(n+1)/2+off;}); return {seq,answer:21+off,type:'Triangular Numbers',hint:`Triangular numbers (1,3,6,10,15…) + ${off}`};
  }
  if (lv === 4) {
    const t = rnd(0, 3);
    if (t === 0) { const a=rnd(1,3),b=rnd(0,4),c=rnd(0,5); const seq=Array.from({length:5},(_,i)=>a*(i+1)*(i+1)+b*(i+1)+c); return {seq,answer:a*36+b*6+c,type:'Quadratic',hint:"Look at differences of differences — they're equal!"}; }
    if (t === 1) { const s1=rnd(2,10),d1=rnd(2,5),s2=rnd(1,8),d2=rnd(2,5); const seq=[]; for(let i=0;i<5;i++) seq.push(i%2===0?s1+(i/2)*d1:s2+Math.floor(i/2)*d2); return {seq,answer:s2+2*d2,type:'Two Interleaved',hint:'TWO patterns in one — look at every other number separately!'}; }
    if (t === 2) { const sub=rnd(1,4); const seq=Array.from({length:5},(_,i)=>Math.pow(2,i+1)-sub); return {seq,answer:Math.pow(2,6)-sub,type:'Powers of 2',hint:`Powers of 2 (2,4,8,16,32…) minus ${sub}`}; }
    const st=rnd(2,6),step=rnd(1,4); const seq=[]; let v=st; for(let i=0;i<5;i++){seq.push(v);v=v+step*(i+1);} return {seq,answer:v,type:'Accelerating',hint:'Each step adds more than the last!'};
  }
  // Level 5
  const t = rnd(0, 3);
  if (t === 0) { const a=rnd(1,2),b=rnd(1,3); const seq=Array.from({length:5},(_,i)=>a*(i+1)*(i+1)*(i+1)-b*(i+1)); return {seq,answer:a*216-b*6,type:'Cubic Pattern',hint:'Differences of differences of differences are equal!'}; }
  if (t === 1) { const primes=[2,3,5,7,11,13]; const base=rnd(1,4); const seq=Array.from({length:5},(_,i)=>base*(i+1)*(i+1)+primes[i]); return {seq,answer:base*36+primes[5],type:'Squares + Primes',hint:`${base}×square numbers + prime numbers (2,3,5,7,11,13…)`}; }
  if (t === 2) { const st=rnd(5,12); const seq=[st]; let gap=rnd(1,3); for(let i=1;i<5;i++){seq.push(seq[i-1]+gap);gap*=2;} return {seq,answer:seq[4]+gap,type:'Geometric Gaps',hint:'The gaps between numbers are doubling each time!'}; }
  const mlt=rnd(2,3),add=rnd(3,8),st=rnd(2,5); const seq=[]; let cur=st; for(let i=0;i<5;i++){seq.push(cur);cur=i%2===0?cur*mlt:cur+add;} const ans=4%2===0?cur*mlt:cur+add; return {seq,answer:ans,type:'Multiply & Add',hint:`Alternately multiply by ${mlt} then add ${add}`};
}

function renderPatQ() {
  const { seq, answer, type, hint } = genPattern(patLevel);
  document.getElementById('pat-feedback').textContent = '';
  document.getElementById('pat-feedback').className = 'feedback-area';
  document.getElementById('pat-type-tag').textContent = type;
  document.getElementById('pattern-seq-display').innerHTML = seq.join('  ,  ') + ' ,  <span class="pattern-q">?</span>';
  document.getElementById('pattern-hint').textContent = '💡 ' + hint;

  const wrong = new Set();
  const diffs = [1,2,3,5,7,10,15,20];
  let attempts = 0;
  while (wrong.size < 3 && attempts < 60) {
    const d = diffs[rnd(0, diffs.length-1)] * (Math.random() < .5 ? 1 : -1);
    const w = answer + d;
    if (w !== answer && !wrong.has(w)) wrong.add(w);
    attempts++;
  }
  // Safety fallback: ensure we always have 3 distractors
  let fillStep = 1;
  while (wrong.size < 3) {
    const w = answer + fillStep * 11;
    if (w !== answer && !wrong.has(w)) wrong.add(w);
    fillStep++;
  }
  const opts = shuffle([answer, ...wrong]);
  const div = document.getElementById('pattern-options');
  div.innerHTML = '';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'pattern-btn'; b.textContent = o;
    b.onclick = () => handlePatA(o, b, answer);
    div.appendChild(b);
  });
}

function handlePatA(chosen, btn, correct) {
  document.querySelectorAll('.pattern-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('pat-feedback');
  if (chosen === correct) {
    btn.classList.add('correct'); patScore++; patStreak++;
    document.getElementById('pat-score').textContent = patScore;
    updStreak();
    if (patStreak % 3 === 0 && patLevel < 5) {
      patLevel++;
      document.querySelectorAll('.pat-level-pill').forEach((p, i) => p.classList.toggle('active', i === patLevel - 1));
      fb.textContent = `✅ Level up → Level ${patLevel}! 🎉`;
    } else {
      fb.textContent = '✅ Brilliant!';
    }
    fb.className = 'feedback-area good';
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.pattern-btn').forEach(b => { if (+b.textContent === correct) b.classList.add('correct'); });
    fb.textContent = `❌ Answer was ${correct}`;
    fb.className = 'feedback-area bad';
    patStreak = 0; updStreak();
  }
  setTimeout(renderPatQ, 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  patScore = 0; patStreak = 0; patLevel = 1;
  document.getElementById('pat-score').textContent = 0;
  updStreak(); renderPatQ();
});
