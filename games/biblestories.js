// games/biblestories.js — Bible Stories trivia (Old & New Testament)

let bsScore = 0;
let bsQ     = 0;
let bsPool  = null;

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TRIVIA = [
  // ── Genesis ────────────────────────────────────────────
  { section:'Genesis', q:'On which day did God create man and woman?', a:'The sixth day', choices:['The third day','The fifth day','The sixth day','The seventh day'], fact:'In Genesis 1, God creates humanity on the sixth day, then rests on the seventh.' },
  { section:'Genesis', q:'What did God form Adam from?', a:'The dust of the ground', choices:['The dust of the ground','A rib','A river of water','A garden plant'], fact:'Genesis 2:7 says the Lord formed the man from the dust of the ground and breathed into his nostrils the breath of life.' },
  { section:'Genesis', q:'From what did God create Eve?', a:'A rib taken from Adam', choices:['Clay','A rib taken from Adam','A breath of wind','A drop of water'], fact:'In Genesis 2:21-22, God took one of Adam\'s ribs while he slept and made it into a woman.' },
  { section:'Genesis', q:'What forbidden fruit did Adam and Eve eat?', a:'The fruit of the tree of the knowledge of good and evil', choices:['A fig','The fruit of the tree of the knowledge of good and evil','A pomegranate','A cluster of grapes'], fact:'Genesis 3 names the tree of the knowledge of good and evil — the Bible never specifies which fruit it was.' },
  { section:'Genesis', q:'Who tempted Eve to eat the forbidden fruit?', a:'A serpent', choices:['A lion','An angel','A serpent','A talking tree'], fact:'Genesis 3 describes the serpent as the most cunning of the wild animals; later tradition identified him with Satan.' },
  { section:'Genesis', q:'Who were the first two sons of Adam and Eve?', a:'Cain and Abel', choices:['Seth and Enoch','Cain and Abel','Jacob and Esau','Shem and Ham'], fact:'Cain became a tiller of the ground; Abel was a keeper of sheep (Genesis 4).' },
  { section:'Genesis', q:'Who killed his brother Abel?', a:'Cain', choices:['Cain','Esau','Lamech','Ishmael'], fact:'In Genesis 4, Cain killed Abel out of jealousy when God favoured Abel\'s offering.' },
  { section:'Genesis', q:'Who built an ark to survive a great flood?', a:'Noah', choices:['Abraham','Noah','Methuselah','Enoch'], fact:'Genesis 6-9 — Noah built the ark on God\'s instructions; he was 600 years old when the floodwaters came.' },
  { section:'Genesis', q:'For how many days and nights did the rain fall during the Flood?', a:'40 days and 40 nights', choices:['7 days and 7 nights','12 days and 12 nights','40 days and 40 nights','100 days and 100 nights'], fact:'Genesis 7:12 — the rains fell for forty days and forty nights.' },
  { section:'Genesis', q:'What sign did God give Noah after the Flood?', a:'A rainbow', choices:['A dove','A rainbow','A burning bush','A pillar of fire'], fact:'Genesis 9 — God set a rainbow in the clouds as the sign of the covenant never again to flood the earth.' },
  { section:'Genesis', q:'What was the tower people tried to build that reached toward heaven?', a:'The Tower of Babel', choices:['The Tower of Jericho','The Tower of David','The Tower of Babel','The Tower of Babylon'], fact:'In Genesis 11, God confused their languages so they could not finish the Tower of Babel.' },
  { section:'Genesis', q:'Who was Abraham\'s wife?', a:'Sarah', choices:['Rachel','Hagar','Sarah','Rebekah'], fact:'Sarah was barren until God promised her a son in old age — she gave birth to Isaac at 90 (Genesis 17-21).' },
  { section:'Genesis', q:'Whose son did God ask Abraham to sacrifice on Mount Moriah?', a:'Isaac', choices:['Ishmael','Isaac','Jacob','Esau'], fact:'In Genesis 22, God stopped Abraham at the last moment and provided a ram caught in a thicket.' },
  { section:'Genesis', q:'Who tricked his older brother Esau out of his birthright?', a:'Jacob', choices:['Joseph','Reuben','Jacob','Laban'], fact:'Genesis 25 — Esau sold his birthright for a bowl of stew. Jacob later received the blessing meant for Esau too.' },
  { section:'Genesis', q:'Joseph\'s coat is famously described as what?', a:'A coat of many colours', choices:['A coat of many colours','A purple robe','A linen tunic','A leather cloak'], fact:'Genesis 37 — Jacob made Joseph a richly ornamented robe, traditionally called "the coat of many colours".' },
  { section:'Genesis', q:'Where did Joseph rise to become second-in-command to Pharaoh?', a:'Egypt', choices:['Babylon','Egypt','Canaan','Persia'], fact:'After being sold into slavery and imprisoned, Joseph interpreted Pharaoh\'s dreams and was set over all Egypt (Genesis 41).' },

  // ── Exodus ─────────────────────────────────────────────
  { section:'Exodus', q:'In what was the baby Moses placed to escape Pharaoh\'s decree?', a:'A basket of bulrushes', choices:['A wooden cradle','A basket of bulrushes','A clay jar','A reed mat'], fact:'Exodus 2 — his mother coated the basket with tar and pitch and placed it among the reeds of the Nile.' },
  { section:'Exodus', q:'Who found baby Moses in the river?', a:'Pharaoh\'s daughter', choices:['Pharaoh\'s wife','Pharaoh\'s daughter','Moses\'s sister','An Egyptian priestess'], fact:'Pharaoh\'s daughter took pity on him and raised him as her own son (Exodus 2:5-10).' },
  { section:'Exodus', q:'From what burning object did God speak to Moses?', a:'A burning bush', choices:['A pillar of fire','A burning bush','A blazing altar','A flaming sword'], fact:'In Exodus 3, God called to Moses out of a bush that burned but was not consumed.' },
  { section:'Exodus', q:'Who was Moses\'s brother and spokesman?', a:'Aaron', choices:['Joshua','Caleb','Aaron','Korah'], fact:'God appointed Aaron to speak for the slow-of-tongue Moses (Exodus 4:14-16). He later became the first high priest.' },
  { section:'Exodus', q:'How many plagues did God send on Egypt?', a:'Ten', choices:['Seven','Ten','Twelve','Forty'], fact:'The ten plagues — water-to-blood, frogs, gnats, flies, livestock, boils, hail, locusts, darkness and the death of the firstborn — appear in Exodus 7-12.' },
  { section:'Exodus', q:'What was the first plague God sent on Egypt?', a:'Water turned to blood', choices:['Frogs','Locusts','Water turned to blood','Darkness'], fact:'Exodus 7 — Aaron struck the Nile with his staff and the water turned to blood.' },
  { section:'Exodus', q:'What was the final plague sent on Egypt?', a:'The death of every firstborn', choices:['Hail','Locusts','Darkness','The death of every firstborn'], fact:'Exodus 12 — the angel of death passed over the houses marked with lamb\'s blood, sparing the Israelites.' },
  { section:'Exodus', q:'What feast did God establish to remember Israel\'s deliverance from Egypt?', a:'The Passover', choices:['Pentecost','Tabernacles','Hanukkah','The Passover'], fact:'The Passover commemorates God passing over the homes whose doorposts were marked with blood (Exodus 12).' },
  { section:'Exodus', q:'What body of water did God part for the Israelites to cross?', a:'The Red Sea', choices:['The Jordan River','The Red Sea','The Sea of Galilee','The Mediterranean'], fact:'Exodus 14 — Moses stretched out his hand and the waters divided. The pursuing Egyptian army drowned when the waters returned.' },
  { section:'Exodus', q:'What food did God send from heaven to feed the Israelites in the wilderness?', a:'Manna', choices:['Quail','Manna','Honey','Locusts'], fact:'Each morning the Israelites gathered manna — a flake-like substance described as tasting like wafers made with honey (Exodus 16).' },
  { section:'Exodus', q:'On which mountain did God give Moses the Ten Commandments?', a:'Mount Sinai', choices:['Mount Carmel','Mount Sinai','Mount Zion','Mount Hermon'], fact:'Exodus 19-20 — God descended on Mount Sinai in fire and gave the Law to Israel.' },
  { section:'Exodus', q:'What golden object did the Israelites build and worship while Moses was on the mountain?', a:'A golden calf', choices:['A golden lion','A golden calf','A golden serpent','A golden bull'], fact:'In Exodus 32, Aaron made a golden calf from the people\'s jewellery while Moses was receiving the Law.' },
  { section:'Exodus', q:'On how many stone tablets were the Ten Commandments written?', a:'Two', choices:['One','Two','Three','Ten'], fact:'Exodus 31:18 — the testimony was on two tablets of stone, written with the finger of God.' },
  { section:'Exodus', q:'What sacred chest housed the tablets of the covenant?', a:'The Ark of the Covenant', choices:['The Ark of the Covenant','The Tabernacle','The Mercy Seat','The Bronze Altar'], fact:'The ark was an acacia-wood chest overlaid with gold, with two cherubim on its lid (Exodus 25).' },
  { section:'Exodus', q:'What pillar led the Israelites by night through the wilderness?', a:'A pillar of fire', choices:['A pillar of cloud','A pillar of fire','A pillar of smoke','A pillar of stars'], fact:'Exodus 13 — the Lord went before them by day in a pillar of cloud and by night in a pillar of fire.' },
  { section:'Exodus', q:'For how many years did the Israelites wander in the wilderness?', a:'Forty', choices:['Seven','Twelve','Forty','Seventy'], fact:'Numbers 14 — for their unbelief, the generation that left Egypt wandered forty years until they died in the wilderness.' },
];

function pickQuestion() {
  if (bsPool === null) bsPool = shuffle(TRIVIA);
  if (bsPool.length === 0) return null;
  return bsPool.pop();
}

function showComplete() {
  document.getElementById('bs-section').textContent = 'Quiz complete';
  document.getElementById('bs-question').textContent = `🎉 You answered ${bsScore} out of ${bsQ} correctly!`;
  document.getElementById('bs-feedback').textContent = '';
  document.getElementById('bs-feedback').className = 'bs-feedback';
  document.getElementById('bs-fact-box').style.display = 'none';

  const grid = document.getElementById('bs-options');
  grid.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'bs-btn correct';
  btn.textContent = '🔄 Start Over';
  btn.onclick = restartBS;
  grid.appendChild(btn);
}

function restartBS() {
  bsScore = 0;
  bsQ     = 0;
  bsPool  = null;
  renderQ();
}

function renderQ() {
  const q = pickQuestion();
  if (!q) { showComplete(); return; }

  bsQ++;
  document.getElementById('bs-score').textContent = bsScore;
  document.getElementById('bs-qnum').textContent  = bsQ;
  document.getElementById('bs-feedback').textContent = '';
  document.getElementById('bs-feedback').className   = 'bs-feedback';
  document.getElementById('bs-fact-box').style.display = 'none';

  document.getElementById('bs-section').textContent = q.section;
  document.getElementById('bs-question').textContent = q.q;

  const grid = document.getElementById('bs-options');
  grid.innerHTML = '';
  shuffle(q.choices).forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'bs-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn, q.a, q.fact);
    grid.appendChild(btn);
  });
}

function handleAnswer(chosen, btn, correct, fact) {
  document.querySelectorAll('.bs-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('bs-feedback');

  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Correct!';
    fb.className   = 'bs-feedback good';
    bsScore++;
    document.getElementById('bs-score').textContent = bsScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.bs-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    fb.textContent = '❌ Not quite';
    fb.className   = 'bs-feedback bad';
  }

  document.getElementById('bs-fact-text').textContent = fact;
  document.getElementById('bs-fact-box').style.display = 'block';

  setTimeout(renderQ, 9000);
}

document.addEventListener('DOMContentLoaded', () => {
  bsScore = 0;
  bsQ     = 0;
  bsPool  = null;
  renderQ();
});
