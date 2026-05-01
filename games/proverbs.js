// games/proverbs.js — Jamaican Proverbs — clean rewrite

let provScore = 0;
let provQ     = 0;
let provMode  = 'complete';
let provPool  = null;   // null = pool needs initialising; [] = exhausted

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
  { proverb:"Wanti wanti cyaan getti, getti getti nuh wanti.", meaning:"Those who want something can't get it, while those who already have it take it for granted.", blank:"Wanti wanti cyaan getti, getti getti nuh ___.", answer:"wanti", choices:["wanti","getti","plenti","empti"] },
  { proverb:"Cockroach nuh business inna fowl fight.", meaning:"Stay out of disputes that don't concern you.", blank:"Cockroach nuh business inna fowl ___.", answer:"fight", choices:["fight","sight","might","light"] },
  { proverb:"If yuh nuh have horse, ride cow.", meaning:"Make do with what you have.", blank:"If yuh nuh have horse, ride ___.", answer:"cow", choices:["cow","dog","goat","sow"] },
  { proverb:"Empty barrel mek di most noise.", meaning:"Those who know the least often talk the most.", blank:"Empty barrel mek di most ___.", answer:"noise", choices:["noise","poise","voice","choice"] },
  { proverb:"Two bull cyaan rule one pen.", meaning:"Two strong leaders cannot share the same authority.", blank:"Two bull cyaan rule one ___.", answer:"pen", choices:["pen","den","ten","yard"] },
  { proverb:"Hand wash hand mek hand come clean.", meaning:"Working together benefits everyone.", blank:"Hand wash hand mek hand come ___.", answer:"clean", choices:["clean","mean","seen","green"] },
  { proverb:"Howdy and tenky nuh bruk no square.", meaning:"Politeness costs nothing — always be courteous.", blank:"Howdy and tenky nuh bruk no ___.", answer:"square", choices:["square","share","spare","stair"] },
  { proverb:"Likkle but tallawah.", meaning:"Small but mighty — don't underestimate the small ones.", blank:"Likkle but ___.", answer:"tallawah", choices:["tallawah","famous","clever","silly"] },
  { proverb:"Coward man keep sound bone.", meaning:"Being cautious helps you avoid harm.", blank:"Coward man keep sound ___.", answer:"bone", choices:["bone","stone","tone","zone"] },
  { proverb:"Where smoke deh, fire deh.", meaning:"There's usually some truth behind every rumour.", blank:"Where smoke deh, ___ deh.", answer:"fire", choices:["fire","wire","tyre","liar"] },
  { proverb:"Mango when him ripe, him mus drop.", meaning:"Things happen in their natural time.", blank:"Mango when him ripe, him mus ___.", answer:"drop", choices:["drop","stop","pop","hop"] },
  { proverb:"Eye nuh see, mout nuh tell.", meaning:"What you don't witness, you can't gossip about.", blank:"Eye nuh see, mout nuh ___.", answer:"tell", choices:["tell","yell","fell","sell"] },
  { proverb:"Bad ting nuh have owner.", meaning:"Trouble has no master — it can come to anyone.", blank:"Bad ting nuh have ___.", answer:"owner", choices:["owner","opener","loaner","corner"] },
  { proverb:"Yuh cyaan plant corn an reap peas.", meaning:"You won't get a different result from the same actions.", blank:"Yuh cyaan plant corn an reap ___.", answer:"peas", choices:["peas","seas","keys","trees"] },
  { proverb:"Marry yuh like, lib wid yuh love.", meaning:"You marry the one you like, and love grows from living together.", blank:"Marry yuh like, lib wid yuh ___.", answer:"love", choices:["love","glove","dove","above"] },
  { proverb:"Goat seh wha left a fence a fi him.", meaning:"People claim what others have set aside or discarded.", blank:"Goat seh wha left a fence a fi ___.", answer:"him", choices:["him","them","you","us"] },
  { proverb:"Crab walk too much him lose him claw.", meaning:"Wandering or being nosey too often leads to trouble.", blank:"Crab walk too much him lose him ___.", answer:"claw", choices:["claw","jaw","paw","saw"] },
  { proverb:"Donkey seh world nuh level.", meaning:"Life isn't fair — there are always inequalities.", blank:"Donkey seh world nuh ___.", answer:"level", choices:["level","clever","sever","ever"] },
  { proverb:"Old time people fool but dem nuh stupid.", meaning:"Older folks may seem simple, but they are deeply wise.", blank:"Old time people fool but dem nuh ___.", answer:"stupid", choices:["stupid","cupid","timid","rapid"] },
  { proverb:"If yuh waan fi know yuh fren, lend him yuh donkey.", meaning:"You discover who's truly reliable when you trust them with something valuable.", blank:"If yuh waan fi know yuh fren, lend him yuh ___.", answer:"donkey", choices:["donkey","monkey","money","story"] },
  { proverb:"Yuh cyaan suck cane and blow whistle.", meaning:"You cannot do two opposing things at the same time.", blank:"Yuh cyaan suck cane and blow ___.", answer:"whistle", choices:["whistle","thistle","castle","kettle"] },
  { proverb:"Wha gone bad a morning cyaan come good a evening.", meaning:"What starts off wrong rarely turns out right later.", blank:"Wha gone bad a morning cyaan come good a ___.", answer:"evening", choices:["evening","morning","mid-day","night"] },
  { proverb:"Wanga gut pickney always cry.", meaning:"Greedy people are never satisfied.", blank:"Wanga gut pickney always ___.", answer:"cry", choices:["cry","try","fly","sigh"] },
];

// Pull a proverb that hasn't been shown yet this session. Returns null
// when the player has worked through every proverb at least once — the
// caller then shows a "Start over" prompt instead of looping.
function pickProverb() {
  if (provPool === null) provPool = shuffle(PROVERBS);
  if (provPool.length === 0) return null;
  return provPool.pop();
}

function showProvComplete() {
  document.getElementById('prov-proverb').textContent = '🎉 All proverbs completed!';
  const meaningBox = document.getElementById('prov-meaning-box');
  meaningBox.style.display = 'block';
  document.getElementById('prov-meaning-text').textContent =
    `You answered ${provScore} out of ${provQ} correctly!`;
  document.getElementById('prov-feedback').textContent = '';
  document.getElementById('prov-feedback').className = 'prov-feedback';

  const grid = document.getElementById('prov-options');
  grid.className = 'prov-options meaning-mode';
  grid.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'prov-btn correct';
  btn.textContent = '🔄 Start Over';
  btn.onclick = restartProv;
  grid.appendChild(btn);
}

function restartProv() {
  provScore = 0;
  provQ    = 0;
  provPool = null;
  renderProvQ();
}

// ── Render ────────────────────────────────────────────────────
function renderProvQ() {
  const q = pickProverb();
  if (!q) { showProvComplete(); return; }

  provQ++;
  document.getElementById('prov-score').textContent = provScore;
  document.getElementById('prov-qnum').textContent  = provQ;
  document.getElementById('prov-feedback').textContent = '';
  document.getElementById('prov-feedback').className   = 'prov-feedback';
  document.getElementById('prov-meaning-box').style.display = 'none';

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

  setTimeout(renderProvQ, 7000);
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
  provPool  = null;
  renderProvQ();
});
