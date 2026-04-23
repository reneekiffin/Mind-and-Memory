// games/wordplay.js
let wordLevel = 'easy', wordScore = 0, wordQNum = 0;

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const wordPools = {
  easy: [
    {word:'BREAD',clue:'You eat this at breakfast 🍞'},
    {word:'CHAIR',clue:'You sit on this 🪑'},
    {word:'CLOCK',clue:'It tells the time ⏰'},
    {word:'DANCE',clue:'Move to music 💃'},
    {word:'EAGLE',clue:'A large bird 🦅'},
    {word:'FLAME',clue:'Fire makes this 🔥'},
    {word:'GRAPE',clue:'A small purple fruit 🍇'},
    {word:'HEART',clue:'It pumps your blood ❤️'},
    {word:'JUICE',clue:'A fruity drink 🥤'},
    {word:'LEMON',clue:'A sour yellow fruit 🍋'},
    {word:'MOUSE',clue:'A small furry animal 🐭'},
    {word:'NIGHT',clue:'The opposite of day 🌙'},
    {word:'OCEAN',clue:'A huge body of water 🌊'},
    {word:'PIANO',clue:'A musical instrument 🎹'},
    {word:'QUEEN',clue:'A female ruler 👑'},
    {word:'RIVER',clue:'Water flows through it 🏞️'},
    {word:'STORM',clue:'Thunder and lightning ⛈️'},
    {word:'TIGER',clue:'A striped wild cat 🐯'},
    {word:'WATER',clue:'We drink this 💧'},
    {word:'HONEY',clue:'Bees make this sweet treat 🍯'},
    {word:'LIGHT',clue:'A lamp gives off this 💡'},
    {word:'CABIN',clue:'A small house in the woods 🌲'},
    {word:'DAISY',clue:'A white and yellow flower 🌼'},
    {word:'FENCE',clue:'It surrounds a yard or garden'},
    {word:'GLOBE',clue:'A round model of the Earth 🌍'},
  ],
  medium: [
    {word:'BENIGN',clue:'Harmless and gentle in nature',opts:['BENIGN','MALIGN','DEFIANT','SERENE']},
    {word:'CANDID',clue:'Truthful and straightforward',opts:['CANDID','CRAFTY','HUMBLE','PLACID']},
    {word:'DOCILE',clue:'Easy to manage or control',opts:['DOCILE','FICKLE','SAVAGE','ORNATE']},
    {word:'FEEBLE',clue:'Very weak in strength',opts:['FEEBLE','NIMBLE','STABLE','VIABLE']},
    {word:'HARBOR',clue:'A sheltered port for ships',opts:['HARBOR','RAVINE','CANYON','SUMMIT']},
    {word:'JAUNTY',clue:'Cheerful and confident in manner',opts:['JAUNTY','GLOOMY','PALLID','SULLEN']},
    {word:'LAVISH',clue:'Very generous or extravagant',opts:['LAVISH','MEAGER','SCANTY','SPARSE']},
    {word:'MURKY', clue:'Dark and hard to see through',opts:['MURKY','VIVID','LUCID','CRISP']},
    {word:'NIMBLE',clue:'Quick and light in movement',opts:['NIMBLE','CLUMSY','LEADEN','STOLID']},
    {word:'PLACID',clue:'Calm and peaceful like a still lake',opts:['PLACID','STORMY','FIERCE','RAGING']},
    {word:'SERENE',clue:'Calm, peaceful and untroubled',opts:['SERENE','FRANTIC','TURBID','HECTIC']},
    {word:'UNRULY',clue:'Difficult to control or manage',opts:['UNRULY','DOCILE','TAME','MEEK']},
    {word:'GALLOP',clue:'How a horse runs at full speed',opts:['GALLOP','CANTER','STRIDE','TOTTER']},
    {word:'IGNITE',clue:'To set something on fire',opts:['IGNITE','DAMPEN','MELLOW','QUENCH']},
    {word:'OPAQUE',clue:'Not able to see through it',opts:['OPAQUE','SHEER','GLASSY','LIMPID']},
    {word:'QUAINT',clue:'Attractively old-fashioned',opts:['QUAINT','MODERN','SLEEK','BLUNT']},
    {word:'ROBUST',clue:'Strong and full of energy',opts:['ROBUST','FRAIL','FRAGILE','FLIMSY']},
    {word:'SOMBER',clue:'Dark and gloomy in mood',opts:['SOMBER','CHEERY','BRIGHT','VIVID']},
  ],
  hard: [
    {word:'EPHEMERAL',clue:'Lasting only a very short time\n(Think of a mayfly\'s life)',opts:['EPHEMERAL','PERPETUAL','ENDURING','TIMELESS']},
    {word:'LOQUACIOUS',clue:'Tends to talk a great deal\n(Synonym: garrulous)',opts:['LOQUACIOUS','RETICENT','TACITURN','RESERVED']},
    {word:'MAGNANIMOUS',clue:'Generous and forgiving — opposite of petty',opts:['MAGNANIMOUS','VINDICTIVE','MISERLY','SPITEFUL']},
    {word:'NONCHALANT',clue:'Relaxed and unconcerned in manner',opts:['NONCHALANT','AGITATED','FLUSTERED','ANXIOUS']},
    {word:'OBLIVIOUS',clue:'Completely unaware of what is happening',opts:['OBLIVIOUS','VIGILANT','PERCEPTIVE','COGNIZANT']},
    {word:'QUERULOUS',clue:'Complaining in a petulant, whiny manner',opts:['QUERULOUS','SANGUINE','PLACID','CONTENT']},
    {word:'TENACIOUS',clue:'Refuses to give up — holds on firmly\n(Synonym: persistent)',opts:['TENACIOUS','WAVERING','YIELDING','VACILLATING']},
    {word:'UBIQUITOUS',clue:'Seems to be everywhere at the same time',opts:['UBIQUITOUS','SCARCE','RARE','ELUSIVE']},
    {word:'WISTFUL',clue:'A gentle sadness for something in the past',opts:['WISTFUL','CHEERFUL','ELATED','CONTENT']},
    {word:'ACRIMONY',clue:'Bitterness or ill feeling toward another',opts:['ACRIMONY','GOODWILL','AMITY','HARMONY']},
    {word:'BELLICOSE',clue:'Eager to argue or pick a fight',opts:['BELLICOSE','PACIFIC','AMICABLE','GENTLE']},
    {word:'COGENT',clue:'Clear, logical and convincing argument',opts:['COGENT','MUDDLED','VAGUE','INCOHERENT']},
    {word:'DILATORY',clue:'Slow to act; causing unnecessary delay',opts:['DILATORY','PROMPT','SWIFT','EXPEDIENT']},
    {word:'SYCOPHANT',clue:'Flatters powerful people to gain favor',opts:['SYCOPHANT','ADVERSARY','DETRACTOR','CRITIC']},
    {word:'VACILLATE',clue:'To waver back and forth between opinions',opts:['VACILLATE','RESOLVE','COMMIT','PERSIST']},
    {word:'PERFIDIOUS',clue:'Deceitful and untrustworthy\n(Synonym: treacherous)',opts:['PERFIDIOUS','FAITHFUL','LOYAL','STEADFAST']},
    {word:'RECONDITE',clue:'Not known by many people; obscure',opts:['RECONDITE','OBVIOUS','FAMILIAR','COMMON']},
    {word:'IMPETUOUS',clue:'Acting quickly without thinking first',opts:['IMPETUOUS','CAUTIOUS','DELIBERATE','CAREFUL']},
  ]
};

function setWordLevel(lvl) {
  wordLevel = lvl;
  document.querySelectorAll('.word-level-pill').forEach(p => {
    p.classList.remove('active');
    if (p.classList.contains(lvl)) p.classList.add('active');
  });
  renderWordQ();
}

function renderWordQ() {
  const pool = wordPools[wordLevel];
  const q = pool[rnd(0, pool.length - 1)];
  wordQNum++;
  document.getElementById('word-score').textContent = wordScore;
  document.getElementById('word-qnum').textContent = wordQNum;
  document.getElementById('word-feedback').textContent = '';
  document.getElementById('word-feedback').className = 'feedback-area';

  const banner = document.getElementById('word-banner');
  banner.className = 'word-banner ' + wordLevel;

  if (wordLevel === 'easy') {
    banner.textContent = 'Unscramble the letters to find the word!';
    document.getElementById('word-clue-box').style.display = 'block';
    document.getElementById('word-clue-text').textContent = q.clue;
    const letters = shuffle(q.word.split(''));
    const blanks = document.getElementById('word-blanks');
    blanks.innerHTML = '';
    letters.forEach(l => {
      const t = document.createElement('div');
      t.className = 'word-blank'; t.textContent = l;
      blanks.appendChild(t);
    });
    const opts = [q.word];
    const others = pool.filter(p => p.word !== q.word);
    shuffle(others);
    for (const o of others) { if (opts.length >= 4) break; opts.push(o.word); }
    renderWordOpts(shuffle(opts), q.word);
  } else {
    banner.textContent = wordLevel === 'medium'
      ? 'Read the clue — pick the correct word!'
      : 'Advanced vocabulary — read carefully!';
    document.getElementById('word-clue-box').style.display = 'block';
    document.getElementById('word-clue-text').textContent = q.clue;
    document.getElementById('word-blanks').innerHTML = '';
    renderWordOpts(shuffle([...q.opts]), q.word);
  }
}

function renderWordOpts(opts, correct) {
  const div = document.getElementById('word-options');
  div.innerHTML = '';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'word-btn'; b.textContent = o;
    b.onclick = () => handleWordA(o, b, correct);
    div.appendChild(b);
  });
}

function handleWordA(chosen, btn, correct) {
  document.querySelectorAll('.word-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('word-feedback');
  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Excellent!';
    fb.className = 'feedback-area good';
    wordScore++;
    document.getElementById('word-score').textContent = wordScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.word-btn').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    fb.textContent = `❌ It was: ${correct}`;
    fb.className = 'feedback-area bad';
  }
  setTimeout(renderWordQ, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  wordScore = 0; wordQNum = 0; wordLevel = 'easy';
  document.getElementById('word-score').textContent = 0;
  document.getElementById('word-qnum').textContent = 1;
  renderWordQ();
});
