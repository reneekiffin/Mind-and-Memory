// games/proverbs.js — Jamaican Proverbs game

let provScore = 0, provQ = 0, provMode = 'complete';

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Proverb data ──────────────────────────────────────────────
const PROVERBS = [
  {
    proverb: "Every mickle mek a muckle.",
    meaning: "Many small things add up to something big. Save a little at a time.",
    complete: { blank: "Every mickle mek a ___.", answer: "muckle", choices: ["muckle","buckle","trouble","puzzle"] }
  },
  {
    proverb: "Tek sleep an mark death.",
    meaning: "Don't ignore warning signs. Pay attention to things that seem harmless.",
    complete: { blank: "Tek sleep an mark ___.", answer: "death", choices: ["death","breath","health","wealth"] }
  },
  {
    proverb: "Chicken merry, hawk deh near.",
    meaning: "When you are too carefree, danger may be close. Be careful when having too much fun.",
    complete: { blank: "Chicken merry, ___ deh near.", answer: "hawk", choices: ["hawk","dog","cat","fox"] }
  },
  {
    proverb: "Rain a fall but dutty tough.",
    meaning: "Help is available but the situation is still difficult.",
    complete: { blank: "Rain a fall but dutty ___.", answer: "tough", choices: ["tough","rough","enough","cough"] }
  },
  {
    proverb: "Rockstone a river bottom nuh know sun hot.",
    meaning: "Those who are sheltered do not understand the struggles of others.",
    complete: { blank: "Rockstone a river bottom nuh know sun ___.", answer: "hot", choices: ["hot","not","lot","got"] }
  },
  {
    proverb: "Sweet nanny goat a go run him belly.",
    meaning: "What seems pleasant now may cause problems later.",
    complete: { blank: "Sweet nanny goat a go run him ___.", answer: "belly", choices: ["belly","jelly","smelly","telly"] }
  },
  {
    proverb: "Ole fire stick easy fi ketch.",
    meaning: "Old feelings or habits are easy to revive.",
    complete: { blank: "Ole fire stick easy fi ___.", answer: "ketch", choices: ["ketch","fetch","stretch","sketch"] }
  },
  {
    proverb: "Every hoe have dem stick a bush.",
    meaning: "There is someone out there for everyone.",
    complete: { blank: "Every hoe have dem stick a ___.", answer: "bush", choices: ["bush","rush","hush","mush"] }
  },
  {
    proverb: "Yuh shake man han, yuh nuh shake him heart.",
    meaning: "A handshake does not mean someone is truly your friend.",
    complete: { blank: "Yuh shake man han, yuh nuh shake him ___.", answer: "heart", choices: ["heart","part","art","start"] }
  },
  {
    proverb: "Nuh trouble trouble till trouble trouble yuh.",
    meaning: "Don't look for problems — leave things alone if they are not bothering you.",
    complete: { blank: "Nuh ___ trouble till trouble trouble yuh.", answer: "trouble", choices: ["trouble","bubble","double","rubble"] }
  },
  {
    proverb: "Wha sweet nanny goat, run him belly.",
    meaning: "What feels good now may hurt you later.",
    complete: { blank: "Wha sweet nanny goat, run him ___.", answer: "belly", choices: ["belly","jelly","telly","smelly"] }
  },
  {
    proverb: "Cunny better than strong.",
    meaning: "Being clever is better than being forceful.",
    complete: { blank: "Cunny better than ___.", answer: "strong", choices: ["strong","wrong","long","song"] }
  },
  {
    proverb: "One one cocoa full basket.",
    meaning: "Little by little, things accumulate. Be patient and persistent.",
    complete: { blank: "One one cocoa full ___.", answer: "basket", choices: ["basket","casket","gasket","packet"] }
  },
  {
    proverb: "Duppy know who fi frighten.",
    meaning: "Bullies and troublemakers only target those they know will not fight back.",
    complete: { blank: "Duppy know who fi ___.", answer: "frighten", choices: ["frighten","enlighten","brighten","tighten"] }
  },
  {
    proverb: "When man dead, cuss-cuss done.",
    meaning: "Quarrels end when someone passes. Forgive before it is too late.",
    complete: { blank: "When man dead, cuss-cuss ___.", answer: "done", choices: ["done","run","sun","fun"] }
  },
  {
    proverb: "Play wid puppy, puppy lick yuh mout.",
    meaning: "Be careful who you are too familiar with — familiarity breeds disrespect.",
    complete: { blank: "Play wid puppy, puppy lick yuh ___.", answer: "mout", choices: ["mout","bout","out","shout"] }
  },
  {
    proverb: "Handsome face never fill basket.",
    meaning: "Good looks do not pay the bills or put food on the table.",
    complete: { blank: "Handsome face never fill ___.", answer: "basket", choices: ["basket","casket","jacket","racket"] }
  },
  {
    proverb: "If yuh cyaan hear, yuh will feel.",
    meaning: "If you do not listen to advice, you will suffer the consequences.",
    complete: { blank: "If yuh cyaan hear, yuh will ___.", answer: "feel", choices: ["feel","deal","heal","real"] }
  },
  {
    proverb: "Cow nuh know di use of him tail till fly tek him.",
    meaning: "You do not know the value of something until you lose it.",
    complete: { blank: "Cow nuh know di use of him tail till fly tek ___.", answer: "him", choices: ["him","them","some","come"] }
  },
  {
    proverb: "New broom sweep clean, but ole broom know di corners.",
    meaning: "Experience matters. New things seem better, but wisdom comes with time.",
    complete: { blank: "New broom sweep clean, but ole broom know di ___.", answer: "corners", choices: ["corners","borders","orders","horrors"] }
  },
  {
    proverb: "Yuh deh pon top, nuh look down pon nobody.",
    meaning: "When you are successful, do not disrespect others — your situation can change.",
    complete: { blank: "Yuh deh pon top, nuh look down pon ___.", answer: "nobody", choices: ["nobody","somebody","everybody","anybody"] }
  },
  {
    proverb: "Mouth mek fi talk.",
    meaning: "Speak up — your voice is meant to be used. Communicate your feelings.",
    complete: { blank: "Mouth mek fi ___.", answer: "talk", choices: ["talk","walk","chalk","stalk"] }
  },
  {
    proverb: "De higher de monkey climb, de more him expose.",
    meaning: "The more powerful or visible you become, the more scrutiny you face.",
    complete: { blank: "De higher de monkey climb, de more him ___.", answer: "expose", choices: ["expose","compose","suppose","propose"] }
  },
  {
    proverb: "Patience is a virtue.",
    meaning: "Good things come to those who wait. Don't rush important things.",
    complete: { blank: "Patience is a ___.", answer: "virtue", choices: ["virtue","fortune","nature","culture"] }
  },
  {
    proverb: "Nuh put all yuh egg in one basket.",
    meaning: "Don't rely on only one plan or resource — spread your risk.",
    complete: { blank: "Nuh put all yuh egg in one ___.", answer: "basket", choices: ["basket","bucket","pocket","jacket"] }
  },
];

// ── Render a question ─────────────────────────────────────────
function renderProvQ() {
  provQ++;
  document.getElementById('prov-score').textContent  = provScore;
  document.getElementById('prov-qnum').textContent   = provQ;
  document.getElementById('prov-feedback').textContent = '';
  document.getElementById('prov-feedback').className = 'feedback-area';

  const q = PROVERBS[rnd(0, PROVERBS.length - 1)];

  if (provMode === 'meaning') {
    renderMeaningQ(q);
  } else {
    renderCompleteQ(q);
  }
}

// Mode A — Complete the proverb
function renderCompleteQ(q) {
  document.getElementById('prov-mode-tag').textContent = '✏️ Complete the Proverb';
  document.getElementById('prov-proverb').textContent  = q.complete.blank;
  document.getElementById('prov-meaning-box').style.display = 'none';

  const opts = shuffle(q.complete.choices);
  const grid = document.getElementById('prov-options');
  grid.innerHTML = '';
  opts.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'prov-btn';
    btn.textContent = o;
    btn.onclick = () => handleProvA(o, btn, q.complete.answer, q.meaning);
    grid.appendChild(btn);
  });
}

// Mode B — What does this proverb mean?
function renderMeaningQ(q) {
  document.getElementById('prov-mode-tag').textContent = '🤔 What does it mean?';
  document.getElementById('prov-proverb').textContent  = q.proverb;
  document.getElementById('prov-meaning-box').style.display = 'none';

  // Build 4 options: correct meaning + 3 random others
  const others = PROVERBS.filter(p => p.proverb !== q.proverb);
  const distractors = shuffle(others).slice(0, 3).map(p => p.meaning);
  const opts = shuffle([q.meaning, ...distractors]);

  const grid = document.getElementById('prov-options');
  grid.innerHTML = '';
  opts.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'prov-btn meaning-btn';
    btn.textContent = o;
    btn.onclick = () => handleProvA(o, btn, q.meaning, null);
    grid.appendChild(btn);
  });
}

// ── Handle answer ─────────────────────────────────────────────
function handleProvA(chosen, btn, correct, meaning) {
  document.querySelectorAll('.prov-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('prov-feedback');

  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Well done!';
    fb.className = 'feedback-area good';
    provScore++;
    document.getElementById('prov-score').textContent = provScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.prov-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    fb.textContent = '❌ Not quite!';
    fb.className = 'feedback-area bad';
  }

  // Always show meaning after answer
  if (meaning) {
    const box = document.getElementById('prov-meaning-box');
    document.getElementById('prov-meaning-text').textContent = '💡 ' + meaning;
    box.style.display = 'block';
  }

  setTimeout(renderProvQ, 3000);
}

// ── Mode toggle ───────────────────────────────────────────────
function setProvMode(mode) {
  provMode = mode;
  document.querySelectorAll('.prov-mode-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.mode === mode);
  });
  renderProvQ();
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  provScore = 0; provQ = 0; provMode = 'complete';
  document.getElementById('prov-score').textContent = 0;
  renderProvQ();
});
