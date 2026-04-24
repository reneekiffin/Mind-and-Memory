// games/proverbs.js — Jamaican Proverbs — clean rewrite

let provScore = 0;
let provQ     = 0;
let provMode  = 'complete';

function rnd(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── All proverbs ──────────────────────────────────────────────
const PROVERBS = [
  { proverb:"Every mickle mek a muckle.", meaning:"Many small things add up to something big. Save a little at a time.", blank:"Every mickle mek a ___.", answer:"muckle", choices:["muckle","buckle","trouble","puzzle"] },
  { proverb:"Tek sleep an mark death.", meaning:"Don't ignore warning signs. Pay attention to things that seem harmless.", blank:"Tek sleep an mark ___.", answer:"death", choices:["death","breath","health","wealth"] },
  { proverb:"Chicken merry, hawk deh near.", meaning:"When you are too carefree, danger may be close.", blank:"Chicken merry, ___ deh near.", answer:"hawk", choices:["hawk","dog","cat","fox"] },
  { proverb:"Rain a fall but dutty tough.", meaning:"Help is available but the situation is still difficult.", blank:"Rain a fall but dutty ___.", answer:"tough", choices:["tough","rough","enough","cough"] },
  { proverb:"Rockstone a river bottom nuh know sun hot.", meaning:"Those who are sheltered do not understand the struggles of others.", blank:"Rockstone a river bottom nuh know sun ___.", answer:"hot", choices:["hot","not","lot","got"] },
  { proverb:"Sweet nanny goat a go run him belly.", meaning:"What seems pleasant now may cause problems later.", blank:"Sweet nanny goat a go run him ___.", answer:"belly", choices:["belly","jelly","smelly","telly"] },
  { proverb:"Ole fire stick easy fi ketch.", meaning:"Old feelings or habits are easy to revive.", blank:"Ole fire stick easy fi ___.", answer:"ketch", choices:["ketch","fetch","stretch","sketch"] },
  { proverb:"Every hoe have dem stick a bush.", meaning:"There is someone out there for everyone.", blank:"Every hoe have dem stick a ___.", answer:"bush", choices:["bush","rush","hush","mush"] },
  { proverb:"Yuh shake man han, yuh nuh shake him heart.", meaning:"A handshake does not mean someone is truly your friend.", blank:"Yuh shake man han, yuh nuh shake him ___.", answer:"heart", choices:["heart","part","art","start"] },
  { proverb:"Nuh trouble trouble till trouble trouble yuh.", meaning:"Don't look for problems — leave things alone.", blank:"Nuh ___ trouble till trouble trouble yuh.", answer:"trouble", choices:["trouble","bubble","double","rubble"] },
  { proverb:"Cunny better than strong.", meaning:"Being clever is better than being forceful.", blank:"Cunny better than ___.", answer:"strong", choices:["strong","wrong","long","song"] },
  { proverb:"One one cocoa full basket.", meaning:"Little by little, things accumulate. Be patient.", blank:"One one cocoa full ___.", answer:"basket", choices:["basket","casket","gasket","packet"] },
  { proverb:"Duppy know who fi frighten.", meaning:"Bullies only target those they know will not fight back.", blank:"Duppy know who fi ___.", answer:"frighten", choices:["frighten","enlighten","brighten","tighten"] },
  { proverb:"When man dead, cuss-cuss done.", meaning:"Quarrels end when someone passes. Forgive before it is too late.", blank:"When man dead, cuss-cuss ___.", answer:"done", choices:["done","run","sun","fun"] },
  { proverb:"Play wid puppy, puppy lick yuh mout.", meaning:"Familiarity breeds disrespect.", blank:"Play wid puppy, puppy lick yuh ___.", answer:"mout", choices:["mout","bout","out","shout"] },
  { proverb:"Handsome face never fill basket.", meaning:"Good looks do not pay the bills.", blank:"Handsome face never fill ___.", answer:"basket", choices:["basket","casket","jacket","racket"] },
  { proverb:"If yuh cyaan hear, yuh will feel.", meaning:"If you do not listen to advice, you will suffer.", blank:"If yuh cyaan hear, yuh will ___.", answer:"feel", choices:["feel","deal","heal","real"] },
  { proverb:"Cow nuh know di use of him tail till fly tek him.", meaning:"You don't know the value of something until you lose it.", blank:"Cow nuh know di use of him tail till fly tek ___.", answer:"him", choices:["him","them","some","come"] },
  { proverb:"New broom sweep clean, but ole broom know di corners.", meaning:"Experience matters — wisdom comes with time.", blank:"New broom sweep clean, but ole broom know di ___.", answer:"corners", choices:["corners","borders","orders","horrors"] },
  { proverb:"De higher de monkey climb, de more him expose.", meaning:"The more visible you become, the more scrutiny you face.", blank:"De higher de monkey climb, de more him ___.", answer:"expose", choices:["expose","compose","suppose","propose"] },
  { proverb:"Nuh put all yuh egg in one basket.", meaning:"Don't rely on only one plan — spread your risk.", blank:"Nuh put all yuh egg in one ___.", answer:"basket", choices:["basket","bucket","pocket","jacket"] },
  { proverb:"Mouth mek fi talk.", meaning:"Speak up — your voice is meant to be used.", blank:"Mouth mek fi ___.", answer:"talk", choices:["talk","walk","chalk","stalk"] },
  { proverb:"Yuh deh pon top, nuh look down pon nobody.", meaning:"When you are successful, do not disrespect others.", blank:"Yuh deh pon top, nuh look down pon ___.", answer:"nobody", choices:["nobody","somebody","everybody","anybody"] },
  { proverb:"Patience is a virtue.", meaning:"Good things come to those who wait.", blank:"Patience is a ___.", answer:"virtue", choices:["virtue","fortune","nature","culture"] },
  { proverb:"Ebry day bucket go a well, one day di bottom must drop out.", meaning:"Keep pushing your luck and eventually things will go wrong.", blank:"Ebry day bucket go a well, one day di bottom must drop ___.", answer:"out", choices:["out","about","shout","doubt"] },
  { proverb:"Who feels it knows it.", meaning:"Only those who experience something truly understand it.", blank:"Who feels it ___ it.", answer:"knows", choices:["knows","shows","blows","grows"] },
  { proverb:"Empty bag cyaan stand up.", meaning:"A hungry person cannot function properly.", blank:"Empty bag cyaan stand ___.", answer:"up", choices:["up","down","still","straight"] },
  { proverb:"Fish start rotten from di head.", meaning:"Problems in an organisation start from leadership.", blank:"Fish start rotten from di ___.", answer:"head", choices:["head","bed","red","fed"] },
  { proverb:"When puss gone, rat tek over.", meaning:"When authority is absent, disorder takes hold.", blank:"When puss gone, rat tek ___.", answer:"over", choices:["over","cover","hover","lover"] },
  { proverb:"Hungry belly have no ears.", meaning:"A person in desperate need cannot focus on advice.", blank:"Hungry belly have no ___.", answer:"ears", choices:["ears","fears","tears","years"] },
  { proverb:"Every John crow tink him pickney white.", meaning:"Everyone thinks their own children are the best.", blank:"Every John crow tink him pickney ___.", answer:"white", choices:["white","right","bright","night"] },
  { proverb:"Talk and taste yuh tongue.", meaning:"Think carefully before you speak.", blank:"Talk and taste yuh ___.", answer:"tongue", choices:["tongue","young","lung","rung"] },
  { proverb:"Time longer than rope.", meaning:"Be patient — given enough time, karma will prevail.", blank:"Time longer than ___.", answer:"rope", choices:["rope","hope","cope","mope"] },
  { proverb:"Still water run deep.", meaning:"Quiet people are often the most thoughtful.", blank:"Still water run ___.", answer:"deep", choices:["deep","sleep","keep","sweep"] },
  { proverb:"Every dog have him day.", meaning:"Everyone gets their moment of success eventually.", blank:"Every dog have him ___.", answer:"day", choices:["day","way","say","play"] },
  { proverb:"Sleep wid dawg, wake up wid flea.", meaning:"The company you keep reflects on who you are.", blank:"Sleep wid dawg, wake up wid ___.", answer:"flea", choices:["flea","sea","tea","key"] },
  { proverb:"Yuh must crawl before yuh walk.", meaning:"Master the basics before moving to advanced things.", blank:"Yuh must crawl before yuh ___.", answer:"walk", choices:["walk","talk","chalk","stalk"] },
  { proverb:"Hard ears pickney nyam rockstone.", meaning:"A stubborn child who won't listen suffers the consequences.", blank:"Hard ears pickney nyam ___.", answer:"rockstone", choices:["rockstone","milestone","cornerstone","limestone"] },
  { proverb:"Blood thicker than water.", meaning:"Family bonds are stronger than any other relationship.", blank:"Blood thicker than ___.", answer:"water", choices:["water","matter","batter","latter"] },
  { proverb:"One bad apple spoil di barrel.", meaning:"One troublemaker can corrupt an entire group.", blank:"One bad apple spoil di ___.", answer:"barrel", choices:["barrel","carol","apparel","quarrel"] },
  { proverb:"Di blacker di berry, di sweeter di juice.", meaning:"A celebration of dark-skinned beauty.", blank:"Di blacker di berry, di sweeter di ___.", answer:"juice", choices:["juice","goose","moose","loose"] },
  { proverb:"Nuh watch di pot — it will boil.", meaning:"If you are too anxious waiting, time feels slower. Be patient.", blank:"Nuh watch di pot — it will ___.", answer:"boil", choices:["boil","toil","foil","coil"] },
  { proverb:"Di tongue has no bone but it can break a bone.", meaning:"Words can cause serious damage — be careful what you say.", blank:"Di tongue has no bone but it can break a ___.", answer:"bone", choices:["bone","stone","tone","zone"] },
  { proverb:"Dog wha bring bone will carry bone.", meaning:"A gossip who brings you stories will spread your stories too.", blank:"Dog wha bring bone will carry ___.", answer:"bone", choices:["bone","stone","phone","tone"] },
  { proverb:"Better fi bend than fi break.", meaning:"It is better to be flexible than to be rigid and break.", blank:"Better fi bend than fi ___.", answer:"break", choices:["break","make","take","fake"] },
  { proverb:"Yuh reap what yuh sow.", meaning:"The consequences of your actions will come back to you.", blank:"Yuh reap what yuh ___.", answer:"sow", choices:["sow","know","show","grow"] },
  { proverb:"Unity is strength.", meaning:"People are stronger when they work together.", blank:"Unity is ___.", answer:"strength", choices:["strength","length","health","wealth"] },
  { proverb:"Nuh count yuh chicken before dem hatch.", meaning:"Don't celebrate outcomes that haven't happened yet.", blank:"Nuh count yuh chicken before dem ___.", answer:"hatch", choices:["hatch","catch","match","scratch"] },
  { proverb:"Dem who laugh last, laugh longest.", meaning:"The final victory is the sweetest — be patient.", blank:"Dem who laugh last, laugh ___.", answer:"longest", choices:["longest","strongest","youngest","hardest"] },
  { proverb:"What is fi yuh will come to yuh.", meaning:"What is meant for you will eventually find its way to you.", blank:"What is fi yuh will come to ___.", answer:"yuh", choices:["yuh","dem","him","us"] },
];

// ── Render ────────────────────────────────────────────────────
function renderProvQ() {
  provQ++;
  document.getElementById('prov-score').textContent = provScore;
  document.getElementById('prov-qnum').textContent  = provQ;
  document.getElementById('prov-feedback').textContent = '';
  document.getElementById('prov-feedback').className   = 'prov-feedback';
  document.getElementById('prov-meaning-box').style.display = 'none';

  const q = PROVERBS[rnd(0, PROVERBS.length - 1)];

  if (provMode === 'meaning') {
    renderMeaning(q);
  } else {
    renderComplete(q);
  }
}

// Mode A: fill in the blank
function renderComplete(q) {
  document.getElementById('prov-proverb').textContent = q.blank;

  const grid = document.getElementById('prov-options');
  grid.className = 'prov-options';
  grid.innerHTML = '';

  shuffle(q.choices).forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'prov-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn, q.answer, q.meaning);
    grid.appendChild(btn);
  });
}

// Mode B: what does it mean?
function renderMeaning(q) {
  document.getElementById('prov-proverb').textContent = q.proverb;

  const others      = PROVERBS.filter(p => p.proverb !== q.proverb);
  const distractors = shuffle(others).slice(0, 3).map(p => p.meaning);
  const opts        = shuffle([q.meaning, ...distractors]);

  const grid = document.getElementById('prov-options');
  grid.className = 'prov-options meaning-mode';
  grid.innerHTML = '';

  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'prov-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn, q.meaning, null);
    grid.appendChild(btn);
  });
}

// ── Handle answer ─────────────────────────────────────────────
function handleAnswer(chosen, btn, correct, meaning) {
  // Disable all buttons
  document.querySelectorAll('.prov-btn').forEach(b => b.onclick = null);

  const fb = document.getElementById('prov-feedback');

  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Well done!';
    fb.className   = 'prov-feedback good';
    provScore++;
    document.getElementById('prov-score').textContent = provScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.prov-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    fb.textContent = '❌ Not quite!';
    fb.className   = 'prov-feedback bad';
  }

  // Always show meaning after answer
  if (meaning) {
    document.getElementById('prov-meaning-text').textContent = '💡 ' + meaning;
    document.getElementById('prov-meaning-box').style.display = 'block';
  }

  setTimeout(renderProvQ, 3000);
}

// ── Mode switch ───────────────────────────────────────────────
function setProvMode(mode) {
  provMode = mode;
  document.getElementById('mode-complete').className =
    'prov-mode-btn ' + (mode === 'complete' ? 'on' : 'off');
  document.getElementById('mode-meaning').className =
    'prov-mode-btn ' + (mode === 'meaning' ? 'on' : 'off');
  renderProvQ();
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  provScore = 0;
  provQ     = 0;
  provMode  = 'complete';
  renderProvQ();
});
