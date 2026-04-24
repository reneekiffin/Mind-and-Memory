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

const PROVERBS = [
  { proverb:"Every mickle mek a muckle.", meaning:"Many small things add up to something big. Save a little at a time.", complete:{blank:"Every mickle mek a ___.",answer:"muckle",choices:["muckle","buckle","trouble","puzzle"]}},
  { proverb:"Tek sleep an mark death.", meaning:"Don't ignore warning signs. Pay attention to things that seem harmless.", complete:{blank:"Tek sleep an mark ___.",answer:"death",choices:["death","breath","health","wealth"]}},
  { proverb:"Chicken merry, hawk deh near.", meaning:"When you are too carefree, danger may be close.", complete:{blank:"Chicken merry, ___ deh near.",answer:"hawk",choices:["hawk","dog","cat","fox"]}},
  { proverb:"Rain a fall but dutty tough.", meaning:"Help is available but the situation is still difficult.", complete:{blank:"Rain a fall but dutty ___.",answer:"tough",choices:["tough","rough","enough","cough"]}},
  { proverb:"Rockstone a river bottom nuh know sun hot.", meaning:"Those who are sheltered do not understand the struggles of others.", complete:{blank:"Rockstone a river bottom nuh know sun ___.",answer:"hot",choices:["hot","not","lot","got"]}},
  { proverb:"Sweet nanny goat a go run him belly.", meaning:"What seems pleasant now may cause problems later.", complete:{blank:"Sweet nanny goat a go run him ___.",answer:"belly",choices:["belly","jelly","smelly","telly"]}},
  { proverb:"Ole fire stick easy fi ketch.", meaning:"Old feelings or habits are easy to revive.", complete:{blank:"Ole fire stick easy fi ___.",answer:"ketch",choices:["ketch","fetch","stretch","sketch"]}},
  { proverb:"Every hoe have dem stick a bush.", meaning:"There is someone out there for everyone.", complete:{blank:"Every hoe have dem stick a ___.",answer:"bush",choices:["bush","rush","hush","mush"]}},
  { proverb:"Yuh shake man han, yuh nuh shake him heart.", meaning:"A handshake does not mean someone is truly your friend.", complete:{blank:"Yuh shake man han, yuh nuh shake him ___.",answer:"heart",choices:["heart","part","art","start"]}},
  { proverb:"Nuh trouble trouble till trouble trouble yuh.", meaning:"Don't look for problems — leave things alone if they are not bothering you.", complete:{blank:"Nuh ___ trouble till trouble trouble yuh.",answer:"trouble",choices:["trouble","bubble","double","rubble"]}},
  { proverb:"Cunny better than strong.", meaning:"Being clever is better than being forceful.", complete:{blank:"Cunny better than ___.",answer:"strong",choices:["strong","wrong","long","song"]}},
  { proverb:"One one cocoa full basket.", meaning:"Little by little, things accumulate. Be patient and persistent.", complete:{blank:"One one cocoa full ___.",answer:"basket",choices:["basket","casket","gasket","packet"]}},
  { proverb:"Duppy know who fi frighten.", meaning:"Bullies only target those they know will not fight back.", complete:{blank:"Duppy know who fi ___.",answer:"frighten",choices:["frighten","enlighten","brighten","tighten"]}},
  { proverb:"When man dead, cuss-cuss done.", meaning:"Quarrels end when someone passes. Forgive before it is too late.", complete:{blank:"When man dead, cuss-cuss ___.",answer:"done",choices:["done","run","sun","fun"]}},
  { proverb:"Play wid puppy, puppy lick yuh mout.", meaning:"Be careful who you are too familiar with — familiarity breeds disrespect.", complete:{blank:"Play wid puppy, puppy lick yuh ___.",answer:"mout",choices:["mout","bout","out","shout"]}},
  { proverb:"Handsome face never fill basket.", meaning:"Good looks do not pay the bills or put food on the table.", complete:{blank:"Handsome face never fill ___.",answer:"basket",choices:["basket","casket","jacket","racket"]}},
  { proverb:"If yuh cyaan hear, yuh will feel.", meaning:"If you do not listen to advice, you will suffer the consequences.", complete:{blank:"If yuh cyaan hear, yuh will ___.",answer:"feel",choices:["feel","deal","heal","real"]}},
  { proverb:"Cow nuh know di use of him tail till fly tek him.", meaning:"You do not know the value of something until you lose it.", complete:{blank:"Cow nuh know di use of him tail till fly tek ___.",answer:"him",choices:["him","them","some","come"]}},
  { proverb:"New broom sweep clean, but ole broom know di corners.", meaning:"Experience matters. New things seem better, but wisdom comes with time.", complete:{blank:"New broom sweep clean, but ole broom know di ___.",answer:"corners",choices:["corners","borders","orders","horrors"]}},
  { proverb:"De higher de monkey climb, de more him expose.", meaning:"The more powerful or visible you become, the more scrutiny you face.", complete:{blank:"De higher de monkey climb, de more him ___.",answer:"expose",choices:["expose","compose","suppose","propose"]}},
  { proverb:"Nuh put all yuh egg in one basket.", meaning:"Don't rely on only one plan — spread your risk.", complete:{blank:"Nuh put all yuh egg in one ___.",answer:"basket",choices:["basket","bucket","pocket","jacket"]}},
  { proverb:"Mouth mek fi talk.", meaning:"Speak up — your voice is meant to be used.", complete:{blank:"Mouth mek fi ___.",answer:"talk",choices:["talk","walk","chalk","stalk"]}},
  { proverb:"Yuh deh pon top, nuh look down pon nobody.", meaning:"When you are successful, do not disrespect others — your situation can change.", complete:{blank:"Yuh deh pon top, nuh look down pon ___.",answer:"nobody",choices:["nobody","somebody","everybody","anybody"]}},
  { proverb:"Patience is a virtue.", meaning:"Good things come to those who wait.", complete:{blank:"Patience is a ___.",answer:"virtue",choices:["virtue","fortune","nature","culture"]}},
  { proverb:"If di river was yuh fren, yuh wouldn't cross it pon a log.", meaning:"True friends don't let you take unnecessary risks.", complete:{blank:"If di river was yuh fren, yuh wouldn't cross it pon a ___.",answer:"log",choices:["log","dog","fog","hog"]}},
  { proverb:"Yuh cyaan wash yuh face wid dry cloth.", meaning:"You cannot do a proper job without the right resources.", complete:{blank:"Yuh cyaan wash yuh face wid dry ___.",answer:"cloth",choices:["cloth","broth","froth","moth"]}},
  { proverb:"Ebry day bucket go a well, one day di bottom must drop out.", meaning:"If you keep pushing your luck, eventually things will go wrong.", complete:{blank:"Ebry day bucket go a well, one day di bottom must drop ___.",answer:"out",choices:["out","about","shout","doubt"]}},
  { proverb:"Who feels it knows it.", meaning:"Only those who experience something truly understand it.", complete:{blank:"Who feels it ___ it.",answer:"knows",choices:["knows","shows","blows","grows"]}},
  { proverb:"Empty bag cyaan stand up.", meaning:"A hungry or broken person cannot function properly. You must take care of your basic needs.", complete:{blank:"Empty bag cyaan stand ___.",answer:"up",choices:["up","down","still","straight"]}},
  { proverb:"God a di biggest man.", meaning:"No matter how powerful someone is, God is greater.", complete:{blank:"God a di biggest ___.",answer:"man",choices:["man","plan","fan","can"]}},
  { proverb:"Fish start rotten from di head.", meaning:"Problems in an organisation start from leadership.", complete:{blank:"Fish start rotten from di ___.",answer:"head",choices:["head","bed","red","fed"]}},
  { proverb:"Nuh care how peacock strut, him cyaan change him tail.", meaning:"No matter how much you pretend, you cannot change your true nature.", complete:{blank:"Nuh care how peacock strut, him cyaan change him ___.",answer:"tail",choices:["tail","mail","rail","sail"]}},
  { proverb:"When puss gone, rat tek over.", meaning:"When the authority figure is absent, disorder takes hold.", complete:{blank:"When puss gone, rat tek ___.",answer:"over",choices:["over","cover","hover","lover"]}},
  { proverb:"Wha drop off yuh head, drop pon yuh shoulder.", meaning:"You cannot escape your responsibilities — they will catch up with you.", complete:{blank:"Wha drop off yuh head, drop pon yuh ___.",answer:"shoulder",choices:["shoulder","boulder","smolder","older"]}},
  { proverb:"Hungry belly have no ears.", meaning:"A person in desperate need cannot focus on advice or reason.", complete:{blank:"Hungry belly have no ___.",answer:"ears",choices:["ears","fears","tears","years"]}},
  { proverb:"Every John crow tink him pickney white.", meaning:"Everyone thinks their own children or creations are the best.", complete:{blank:"Every John crow tink him pickney ___.",answer:"white",choices:["white","right","bright","night"]}},
  { proverb:"Talk and taste yuh tongue.", meaning:"Think carefully before you speak.", complete:{blank:"Talk and taste yuh ___.",answer:"tongue",choices:["tongue","young","lung","rung"]}},
  { proverb:"Nuh judge book by its cover.", meaning:"Do not make assumptions based on outward appearances.", complete:{blank:"Nuh judge book by its ___.",answer:"cover",choices:["cover","lover","hover","over"]}},
  { proverb:"Lazy man work twice.", meaning:"Cutting corners now means doing the job all over again later.", complete:{blank:"Lazy man work ___.",answer:"twice",choices:["twice","nice","rice","price"]}},
  { proverb:"Bad luck worse than obeah.", meaning:"Bad luck can be more destructive than any curse or evil.", complete:{blank:"Bad luck worse than ___.",answer:"obeah",choices:["obeah","fear","here","near"]}},
  { proverb:"Wha gone bad a mornin, cyan come good a evening.", meaning:"A bad start rarely leads to a good end on the same day.", complete:{blank:"Wha gone bad a mornin, cyan come good a ___.",answer:"evening",choices:["evening","leaving","weaving","believing"]}},
  { proverb:"Nuh follow fashion, follow sense.", meaning:"Don't blindly copy what others do — use your own judgement.", complete:{blank:"Nuh follow fashion, follow ___.",answer:"sense",choices:["sense","fence","tense","pence"]}},
  { proverb:"Him wha have no hills to climb have no valleys to fear.", meaning:"A life without challenges is also a life without great rewards.", complete:{blank:"Him wha have no hills to climb have no valleys to ___.",answer:"fear",choices:["fear","hear","near","dear"]}},
  { proverb:"Trouble nuh set like rain.", meaning:"Unlike rain, trouble gives no warning before it arrives.", complete:{blank:"Trouble nuh set like ___.",answer:"rain",choices:["rain","train","pain","gain"]}},
  { proverb:"Wise man listen more dan him talk.", meaning:"Wisdom comes from listening, not from speaking.", complete:{blank:"Wise man listen more dan him ___.",answer:"talk",choices:["talk","walk","chalk","stalk"]}},
  { proverb:"Wha fi yuh cyaan be un-fi yuh.", meaning:"What is destined for you cannot be taken away.", complete:{blank:"Wha fi yuh cyaan be un-fi ___.",answer:"yuh",choices:["yuh","dem","him","her"]}},
  { proverb:"Nuh mek yuh right hand know wha yuh left hand do.", meaning:"Be discreet about your good deeds — don't boast about them.", complete:{blank:"Nuh mek yuh right hand know wha yuh left hand ___.",answer:"do",choices:["do","go","show","know"]}},
  { proverb:"Live and let live.", meaning:"Respect others' right to live as they choose.", complete:{blank:"Live and let ___.",answer:"live",choices:["live","give","drive","strive"]}},
  { proverb:"Pretty face cyaan cook food.", meaning:"Attractiveness alone cannot sustain a relationship or household.", complete:{blank:"Pretty face cyaan cook ___.",answer:"food",choices:["food","good","mood","wood"]}},
  { proverb:"Time longer than rope.", meaning:"Be patient — given enough time, justice or karma will prevail.", complete:{blank:"Time longer than ___.",answer:"rope",choices:["rope","hope","cope","mope"]}},
  { proverb:"Nuh show yuh weakness to yuh enemy.", meaning:"Keep your vulnerabilities private — people can exploit them.", complete:{blank:"Nuh show yuh weakness to yuh ___.",answer:"enemy",choices:["enemy","remedy","melody","memory"]}},
  { proverb:"Goat nuh business wha sheep a do.", meaning:"Mind your own business and focus on yourself.", complete:{blank:"Goat nuh business wha sheep a ___.",answer:"do",choices:["do","go","show","know"]}},
  { proverb:"Sleep wid dawg, wake up wid flea.", meaning:"The company you keep reflects on who you are.", complete:{blank:"Sleep wid dawg, wake up wid ___.",answer:"flea",choices:["flea","sea","tea","key"]}},
  { proverb:"Man wha have boot, cyaan tell man wha barefoot how fi walk.", meaning:"Don't judge others who lack what you have.", complete:{blank:"Man wha have boot, cyaan tell man wha barefoot how fi ___.",answer:"walk",choices:["walk","talk","chalk","stalk"]}},
  { proverb:"Yuh must crawl before yuh walk.", meaning:"You must master the basics before moving to advanced things.", complete:{blank:"Yuh must crawl before yuh ___.",answer:"walk",choices:["walk","talk","chalk","stalk"]}},
  { proverb:"Still water run deep.", meaning:"Quiet people are often the most thoughtful and complex.", complete:{blank:"Still water run ___.",answer:"deep",choices:["deep","sleep","keep","sweep"]}},
  { proverb:"Hard ears pickney nyam rockstone.", meaning:"A stubborn child who won't listen suffers the painful consequences.", complete:{blank:"Hard ears pickney nyam ___.",answer:"rockstone",choices:["rockstone","milestone","cornerstone","limestone"]}},
  { proverb:"Nuh count yuh chicken before dem hatch.", meaning:"Don't celebrate or plan based on outcomes that haven't happened yet.", complete:{blank:"Nuh count yuh chicken before dem ___.",answer:"hatch",choices:["hatch","catch","atch","scratch"]}},
  { proverb:"Tomorrow is not promised.", meaning:"Do not take today for granted — live fully in the present.", complete:{blank:"Tomorrow is not ___.",answer:"promised",choices:["promised","finished","polished","published"]}},
  { proverb:"Dem who laugh last, laugh longest.", meaning:"The final victory is the sweetest — be patient and persistent.", complete:{blank:"Dem who laugh last, laugh ___.",answer:"longest",choices:["longest","strongest","youngest","hardest"]}},
  { proverb:"Nuh bite di hand dat feed yuh.", meaning:"Don't betray or harm those who have helped and supported you.", complete:{blank:"Nuh bite di hand dat feed ___.",answer:"yuh",choices:["yuh","dem","him","them"]}},
  { proverb:"What is fi yuh will come to yuh.", meaning:"What is meant for you in life will eventually find its way to you.", complete:{blank:"What is fi yuh will come to ___.",answer:"yuh",choices:["yuh","dem","him","us"]}},
  { proverb:"Blood thicker than water.", meaning:"Family bonds are stronger than any other relationship.", complete:{blank:"Blood thicker than ___.",answer:"water",choices:["water","matter","batter","latter"]}},
  { proverb:"Yuh cyaan please everybody.", meaning:"No matter what you do, you can't make everyone happy.", complete:{blank:"Yuh cyaan please ___.",answer:"everybody",choices:["everybody","somebody","nobody","anybody"]}},
  { proverb:"Where there is no vision, the people perish.", meaning:"Without purpose and direction, people lose their way.", complete:{blank:"Where there is no vision, the people ___.",answer:"perish",choices:["perish","cherish","flourish","nourish"]}},
  { proverb:"Two bull cyaan reign inna one pen.", meaning:"Two dominant personalities cannot share the same space of authority.", complete:{blank:"Two bull cyaan reign inna one ___.",answer:"pen",choices:["pen","den","hen","ten"]}},
  { proverb:"Nuh dig hole fi rat and fall in yuhself.", meaning:"Don't set traps for others — you may end up falling into them yourself.", complete:{blank:"Nuh dig hole fi rat and fall in ___.",answer:"yuhself",choices:["yuhself","himself","herself","themself"]}},
  { proverb:"Di tongue has no bone but it can break a bone.", meaning:"Words can cause serious damage — be careful what you say.", complete:{blank:"Di tongue has no bone but it can break a ___.",answer:"bone",choices:["bone","stone","tone","zone"]}},
  { proverb:"Nuh run till yuh tired.", meaning:"Don't exhaust yourself trying to escape inevitable things.", complete:{blank:"Nuh run till yuh ___.",answer:"tired",choices:["tired","hired","fired","wired"]}},
  { proverb:"When yuh plant yam, yuh cyaan reap cassava.", meaning:"Your results are directly based on your efforts and choices.", complete:{blank:"When yuh plant yam, yuh cyaan reap ___.",answer:"cassava",choices:["cassava","banana","guava","papaya"]}},
  { proverb:"One bad apple spoil di barrel.", meaning:"One troublemaker can corrupt an entire group.", complete:{blank:"One bad apple spoil di ___.",answer:"barrel",choices:["barrel","carol","apparel","quarrel"]}},
  { proverb:"Grease and water nuh mix.", meaning:"Some people or things are simply incompatible.", complete:{blank:"Grease and water nuh ___.",answer:"mix",choices:["mix","fix","six","tricks"]}},
  { proverb:"Poverty is not a crime.", meaning:"Being poor is not shameful — judge people by their character, not wealth.", complete:{blank:"Poverty is not a ___.",answer:"crime",choices:["crime","time","dime","lime"]}},
  { proverb:"Hard work never kill nobody.", meaning:"Working hard is good for you — don't be afraid of putting in effort.", complete:{blank:"Hard work never kill ___.",answer:"nobody",choices:["nobody","somebody","everybody","anybody"]}},
  { proverb:"Di blacker di berry, di sweeter di juice.", meaning:"A celebration of dark-skinned beauty — the deeper the colour, the more beautiful.", complete:{blank:"Di blacker di berry, di sweeter di ___.",answer:"juice",choices:["juice","goose","moose","loose"]}},
  { proverb:"Yuh haffi respect yuhself before others respect yuh.", meaning:"Self-respect is the foundation of earning respect from others.", complete:{blank:"Yuh haffi respect yuhself before others respect ___.",answer:"yuh",choices:["yuh","dem","him","her"]}},
  { proverb:"Nuh watch di pot — it will boil.", meaning:"If you are too anxious and watch and wait, time feels slower. Be patient.", complete:{blank:"Nuh watch di pot — it will ___.",answer:"boil",choices:["boil","toil","foil","coil"]}},
  { proverb:"Every dog have him day.", meaning:"Everyone gets their moment of success or justice eventually.", complete:{blank:"Every dog have him ___.",answer:"day",choices:["day","way","say","play"]}},
  { proverb:"If yuh cyaan manage donkey, yuh cyaan manage horse.", meaning:"Master small responsibilities before taking on bigger ones.", complete:{blank:"If yuh cyaan manage donkey, yuh cyaan manage ___.",answer:"horse",choices:["horse","course","force","source"]}},
  { proverb:"Nuh mek beauty fool yuh.", meaning:"Don't let attractive appearances distract you from the truth.", complete:{blank:"Nuh mek beauty fool ___.",answer:"yuh",choices:["yuh","dem","him","her"]}},
  { proverb:"Friendship is a plant that must be watered.", meaning:"Relationships require regular attention and care to stay strong.", complete:{blank:"Friendship is a plant that must be ___.",answer:"watered",choices:["watered","battered","scattered","shattered"]}},
  { proverb:"Man plan, God laugh.", meaning:"No matter how carefully we plan, life often takes a different course.", complete:{blank:"Man plan, God ___.",answer:"laugh",choices:["laugh","path","math","bath"]}},
  { proverb:"Nuh carry wha yuh cyaan put down.", meaning:"Don't take on burdens or secrets that are too heavy for you to bear.", complete:{blank:"Nuh carry wha yuh cyaan put ___.",answer:"down",choices:["down","town","crown","gown"]}},
  { proverb:"Dog wha bring bone will carry bone.", meaning:"A gossip who brings you stories about others will spread your stories too.", complete:{blank:"Dog wha bring bone will carry ___.",answer:"bone",choices:["bone","stone","phone","tone"]}},
  { proverb:"Nuh badda wha nuh concern yuh.", meaning:"Don't bother yourself with things that are not your business.", complete:{blank:"Nuh badda wha nuh concern ___.",answer:"yuh",choices:["yuh","dem","him","her"]}},
  { proverb:"Better fi bend than fi break.", meaning:"It is better to be flexible and compromise than to be rigid and break.", complete:{blank:"Better fi bend than fi ___.",answer:"break",choices:["break","make","take","fake"]}},
  { proverb:"Fear is a thief of joy.", meaning:"Living in fear robs you of happiness and stops you from enjoying life.", complete:{blank:"Fear is a thief of ___.",answer:"joy",choices:["joy","boy","toy","ploy"]}},
  { proverb:"Nuh look down pon puss because him walk pon four foot.", meaning:"Don't look down on someone just because they seem different or lowly.", complete:{blank:"Nuh look down pon puss because him walk pon four ___.",answer:"foot",choices:["foot","soot","root","boot"]}},
  { proverb:"Rat nuh know seh puss deh near.", meaning:"Danger can be very close and you may not even know it.", complete:{blank:"Rat nuh know seh puss deh ___.",answer:"near",choices:["near","fear","clear","dear"]}},
  { proverb:"Work before play.", meaning:"Finish your responsibilities before enjoying yourself.", complete:{blank:"Work before ___.",answer:"play",choices:["play","day","way","say"]}},
  { proverb:"Nuh tek setback as failure.", meaning:"A setback is just a setup for a comeback — keep going.", complete:{blank:"Nuh tek setback as ___.",answer:"failure",choices:["failure","sailor","tailor","jailor"]}},
  { proverb:"Smiling face tells lies.", meaning:"A friendly appearance does not always mean honest intentions.", complete:{blank:"Smiling face tells ___.",answer:"lies",choices:["lies","ties","flies","eyes"]}},
  { proverb:"Di tree dat bear di most fruit get di most stone.", meaning:"The most successful people attract the most criticism.", complete:{blank:"Di tree dat bear di most fruit get di most ___.",answer:"stone",choices:["stone","bone","tone","zone"]}},
  { proverb:"Nuh throw stone and hide yuh hand.", meaning:"If you do something wrong, own up to it — don't hide your actions.", complete:{blank:"Nuh throw stone and hide yuh ___.",answer:"hand",choices:["hand","land","sand","band"]}},
  { proverb:"What nuh dead nuh call duppy.", meaning:"Don't count something as gone until it's truly over.", complete:{blank:"What nuh dead nuh call ___.",answer:"duppy",choices:["duppy","puppy","guppy","lucky"]}},
  { proverb:"Nuh trust yuh heart when yuh belly empty.", meaning:"Don't make important decisions when you are hungry or desperate.", complete:{blank:"Nuh trust yuh heart when yuh belly ___.",answer:"empty",choices:["empty","tempt me","plenty","twenty"]}},
  { proverb:"Yuh reap what yuh sow.", meaning:"The consequences of your actions — good or bad — will come back to you.", complete:{blank:"Yuh reap what yuh ___.",answer:"sow",choices:["sow","know","show","grow"]}},
  { proverb:"Love covers a multitude of sins.", meaning:"Genuine love is forgiving and overlooks many faults.", complete:{blank:"Love covers a multitude of ___.",answer:"sins",choices:["sins","fins","bins","pins"]}},
  { proverb:"Clothes don't make the man.", meaning:"What someone wears or owns does not define their true character.", complete:{blank:"Clothes don't make the ___.",answer:"man",choices:["man","plan","fan","can"]}},
  { proverb:"Nuh full up yuh mouth wid wha yuh hand cyaan hold.", meaning:"Don't make promises you are unable to keep.", complete:{blank:"Nuh full up yuh mouth wid wha yuh hand cyaan ___.",answer:"hold",choices:["hold","fold","sold","told"]}},
  { proverb:"Yuh haffi know where yuh come from to know where yuh going.", meaning:"Understanding your past and roots helps guide your future.", complete:{blank:"Yuh haffi know where yuh come from to know where yuh ___.",answer:"going",choices:["going","showing","growing","flowing"]}},
  { proverb:"Unity is strength.", meaning:"People are stronger and more powerful when they work together.", complete:{blank:"Unity is ___.",answer:"strength",choices:["strength","length","health","wealth"]}},
];

// ── Render question ───────────────────────────────────────────
function renderProvQ() {
  provQ++;
  document.getElementById('prov-score').textContent = provScore;
  document.getElementById('prov-qnum').textContent  = provQ;
  document.getElementById('prov-feedback').textContent = '';
  document.getElementById('prov-feedback').className = 'feedback-area';
  document.getElementById('prov-meaning-box').style.display = 'none';

  const q = PROVERBS[rnd(0, PROVERBS.length - 1)];

  if (provMode === 'meaning') {
    renderMeaningQ(q);
  } else {
    renderCompleteQ(q);
  }
}

function renderCompleteQ(q) {
  document.getElementById('prov-mode-tag').textContent = '✏️ Complete the Proverb';
  document.getElementById('prov-proverb').textContent  = q.complete.blank;
  const opts = shuffle(q.complete.choices);
  const grid = document.getElementById('prov-options');
  grid.className = 'prov-options';
  grid.innerHTML = '';
  opts.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'prov-btn';
    btn.textContent = o;
    btn.onclick = () => handleProvA(o, btn, q.complete.answer, q.meaning);
    grid.appendChild(btn);
  });
}

function renderMeaningQ(q) {
  document.getElementById('prov-mode-tag').textContent = '🤔 What does it mean?';
  document.getElementById('prov-proverb').textContent  = q.proverb;
  const others = PROVERBS.filter(p => p.proverb !== q.proverb);
  const distractors = shuffle(others).slice(0, 3).map(p => p.meaning);
  const opts = shuffle([q.meaning, ...distractors]);
  const grid = document.getElementById('prov-options');
  grid.className = 'prov-options meaning-mode';
  grid.innerHTML = '';
  opts.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'prov-btn meaning-btn';
    btn.textContent = o;
    btn.onclick = () => handleProvA(o, btn, q.meaning, null);
    grid.appendChild(btn);
  });
}

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
    fb.textContent = '❌ Not quite — keep trying!';
    fb.className = 'feedback-area bad';
  }
  if (meaning) {
    document.getElementById('prov-meaning-text').textContent = '💡 ' + meaning;
    document.getElementById('prov-meaning-box').style.display = 'block';
  }
  setTimeout(renderProvQ, 3200);
}

function setProvMode(mode) {
  provMode = mode;
  document.querySelectorAll('.prov-mode-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.mode === mode);
  });
  renderProvQ();
}

document.addEventListener('DOMContentLoaded', () => {
  provScore = 0; provQ = 0; provMode = 'complete';
  document.getElementById('prov-score').textContent = 0;
  renderProvQ();
});
