// games/wordle.js
const WORDS = ['ABOUT','ABOVE','ABUSE','ACTOR','ACUTE','ADMIT','ADOPT','ADULT','AFTER','AGAIN','AGENT','AGREE','AHEAD','ALARM','ALBUM','ALERT','ALIKE','ALIVE','ALLOW','ALONE','ALONG','ALTER','ANGEL','ANGER','ANGLE','ANKLE','APART','APPLE','APPLY','APRON','ARENA','ARGUE','ARISE','ARMOR','ARROW','ASIDE','ATLAS','ATTIC','AUDIO','AVOID','AWAKE','AWARD','AWARE','AWFUL','AZURE','BADGE','BAKER','BASIC','BASIN','BATCH','BEACH','BEARD','BEAST','BEGIN','BEING','BELOW','BENCH','BERRY','BIRCH','BLACK','BLADE','BLAME','BLANK','BLAST','BLAZE','BLEND','BLESS','BLIND','BLOCK','BLOOD','BLOOM','BOARD','BONUS','BOOST','BOOTH','BOUND','BRACE','BRAND','BRAVE','BREAD','BREAK','BRIDE','BRING','BROAD','BROOK','BROWN','BRUSH','BUILD','BUILT','BUNCH','BURST','BUYER','CABIN','CANDY','CARRY','CATCH','CAUSE','CHAIN','CHAIR','CHARM','CHASE','CHEAP','CHECK','CHEEK','CHEER','CHESS','CHEST','CHIEF','CHILD','CHOIR','CLAIM','CLASS','CLEAN','CLEAR','CLERK','CLICK','CLIFF','CLIMB','CLOCK','CLOSE','CLOUD','COACH','COAST','CORAL','COUNT','COURT','COVER','CRACK','CRAFT','CRANE','CRASH','CRAZY','CREAM','CREEK','CRIME','CRISP','CROSS','CROWD','CROWN','CRUEL','CRUSH','CURLY','CURVE','CYCLE','DAILY','DANCE','DEATH','DECOR','DENSE','DEPTH','DIRTY','DITCH','DODGE','DOUBT','DOUGH','DRAFT','DRAIN','DRAMA','DRAPE','DREAM','DRESS','DRILL','DRINK','DRIVE','DRONE','DRYER','DUSTY','EAGLE','EARLY','EARTH','EIGHT','ELECT','ELITE','EMPTY','ENTER','EQUAL','ESSAY','EVOKE','EXACT','EXILE','EXTRA','FABLE','FAINT','FAIRY','FAITH','FALSE','FANCY','FEAST','FENCE','FEVER','FIBER','FIELD','FIFTH','FIGHT','FINAL','FIRST','FIXED','FLAME','FLARE','FLASH','FLEET','FLESH','FLOAT','FLOCK','FLOOR','FLOUR','FLUTE','FOCUS','FORCE','FORGE','FORTH','FOUND','FRAME','FRANK','FRESH','FRONT','FROST','FRUIT','FULLY','FUNNY','GHOST','GIANT','GIVEN','GLASS','GLEAM','GLIDE','GLOBE','GLOOM','GRACE','GRADE','GRAIN','GRAND','GRANT','GRAPH','GRASP','GRASS','GRAZE','GREAT','GREED','GREEN','GREET','GRIEF','GRIND','GROAN','GROOM','GROVE','GUARD','GUESS','GUEST','GUIDE','HABIT','HAPPY','HARSH','HASTE','HAVEN','HEART','HEAVY','HEDGE','HERBS','HINGE','HOLLY','HONEY','HONOR','HORSE','HOTEL','HOUSE','HUMAN','HUMID','HUMOR','HURRY','IDEAL','IMAGE','IMPLY','INDEX','INNER','INPUT','INTRO','IRONY','ISSUE','IVORY','JELLY','JEWEL','JOKER','JOLLY','JUDGE','JUICE','JUICY','JUMBO','LABEL','LANCE','LARGE','LASER','LATER','LAUGH','LAYER','LEARN','LEASE','LEGAL','LEMON','LEVEL','LIGHT','LILAC','LINEN','LOCAL','LODGE','LOGIC','LOOSE','LOVER','LOWER','LUCKY','LUNAR','LUNCH','LYRIC','MAGIC','MAJOR','MAPLE','MARCH','MATCH','MAYOR','MEDIA','MERIT','METAL','MINOR','MIXED','MODEL','MONEY','MONTH','MORAL','MOTTO','MOUNT','MOUSE','MOVIE','MUSIC','NAVAL','NERVE','NEVER','NIGHT','NOBLE','NOISE','NORTH','NOTED','NOVEL','NURSE','OCCUR','OCEAN','OFFER','OFTEN','OLIVE','OPERA','ORBIT','ORDER','OUTER','OWNER','PAINT','PANEL','PAPER','PARTY','PASTA','PATCH','PAUSE','PEACE','PEACH','PEARL','PERCH','PHASE','PHONE','PIANO','PILOT','PINCH','PLACE','PLAIN','PLANE','PLANT','PLATE','PLAZA','PLUCK','POINT','POLAR','PORCH','POUND','POWER','PRESS','PRICE','PRIDE','PRIME','PRINT','PRISM','PRIZE','PROBE','PROOF','PROUD','PROVE','PULSE','PUPIL','PURSE','QUEEN','QUERY','QUEST','QUICK','QUIET','QUOTA','QUOTE','RADAR','RAINY','RALLY','RANCH','RANGE','RAPID','RATIO','REACH','READY','REALM','REBEL','REFER','REIGN','RELAX','REPAY','REPLY','RIDER','RIDGE','RISKY','RIVER','RIVAL','ROBOT','ROCKY','ROUGH','ROUND','ROUTE','ROYAL','RUGBY','RULER','RUSTY','SALAD','SAUCE','SCALE','SCENE','SCORE','SCOUT','SENSE','SERVE','SEVEN','SHADE','SHAKE','SHALL','SHAME','SHAPE','SHARE','SHARK','SHARP','SHELF','SHELL','SHIFT','SHINE','SHIRT','SHOCK','SHOOT','SHORT','SHOUT','SIGHT','SILLY','SINCE','SIXTH','SIXTY','SKILL','SKULL','SLATE','SLEEP','SLICE','SLIDE','SLOPE','SMART','SMILE','SMOKE','SNAKE','SOLAR','SOLID','SOLVE','SOUTH','SPACE','SPARE','SPARK','SPEAK','SPEED','SPEND','SPINE','SPOKE','SPOON','SPORT','SPRAY','STACK','STAFF','STAGE','STAIN','STALE','STAND','STARK','START','STATE','STEAM','STEEL','STEEP','STEER','STERN','STICK','STIFF','STILL','STOCK','STONE','STORE','STORM','STORY','STOVE','STRAP','STRAW','STRIP','STUCK','STUDY','STYLE','SUGAR','SUITE','SUNNY','SUPER','SURGE','SWAMP','SWEAR','SWEET','SWIFT','SWORD','TABLE','TASTE','TEACH','TENSE','TERMS','THANK','THEME','THERE','THICK','THING','THINK','THIRD','THREE','TIGER','TIGHT','TIMER','TIRED','TITLE','TOKEN','TOTAL','TOUCH','TOUGH','TOWER','TOXIC','TRACE','TRACK','TRADE','TRAIL','TRAIN','TRASH','TREAT','TREND','TRIAL','TRIBE','TRICK','TROOP','TRUCK','TRULY','TRUNK','TRUST','TRUTH','TUTOR','TWICE','ULTRA','UNION','UNITY','UNTIL','UPPER','UPSET','URBAN','USUAL','UTTER','VALID','VALUE','VALVE','VAULT','VERSE','VITAL','VIVID','VOCAL','VOICE','VOTER','WATER','WEAVE','WEDGE','WEIRD','WHALE','WHEAT','WHEEL','WHERE','WHICH','WHILE','WHITE','WHOLE','WIDER','WITTY','WORLD','WORRY','WORSE','WORTH','WOULD','WOUND','WRATH','WRIST','WROTE','YACHT','YEARN','YIELD','YOUNG','YOURS','YOUTH','ZEBRA','ZESTY'];

const KB_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['⌫','Z','X','C','V','B','N','M','↵']
];

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

let secret = '', row = 0, col = 0, done = false;
let cells = [], keyMap = {};

function initWordle() {
  secret = WORDS[rnd(0, WORDS.length - 1)];
  row = 0; col = 0; done = false;
  keyMap = {};
  document.getElementById('wordle-try').textContent = '1';
  document.getElementById('wordle-feedback').textContent = '';
  document.getElementById('wordle-feedback').className = 'wordle-feedback';

  // Build grid
  const grid = document.getElementById('wordle-grid');
  grid.innerHTML = ''; cells = [];
  for (let r = 0; r < 6; r++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'wordle-row';
    cells[r] = [];
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement('div');
      cell.className = 'wordle-cell' + (r === 0 ? ' active-row' : '');
      rowEl.appendChild(cell);
      cells[r][c] = cell;
    }
    grid.appendChild(rowEl);
  }

  // Build keyboard
  const kb = document.getElementById('wordle-keyboard');
  kb.innerHTML = '';
  KB_ROWS.forEach(keys => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kb-row';
    keys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'kb-key' + (k === '⌫' || k === '↵' ? ' wide' : '');
      btn.textContent = k;
      btn.onclick = () => handleKey(k);
      rowEl.appendChild(btn);
      if (k !== '⌫' && k !== '↵') keyMap[k] = btn;
    });
    kb.appendChild(rowEl);
  });
}

function handleKey(k) {
  if (done) return;
  if (k === '⌫') {
    if (col > 0) { col--; cells[row][col].textContent = ''; }
  } else if (k === '↵') {
    submit();
  } else {
    if (col < 5) { cells[row][col].textContent = k; col++; }
  }
}

function submit() {
  if (col < 5) {
    showFB('Please fill in all 5 letters 😊', 'hint'); return;
  }
  const guess = cells[row].map(c => c.textContent).join('');
  const result = score(guess, secret);
  colorRow(row, result, guess);
  const won = result.every(r => r === 'correct');
  row++;
  document.getElementById('wordle-try').textContent = Math.min(row + 1, 6);

  if (won) {
    done = true;
    const msgs = ['🎉 Amazing! You got it!', '🏆 Brilliant!', '⭐ Wonderful!', '🌟 Superb!'];
    showFB(msgs[rnd(0, msgs.length - 1)], 'good');
    setTimeout(() => showResult(true), 1700);
  } else if (row === 6) {
    done = true;
    showFB(`The word was: ${secret} 💪`, 'bad');
    setTimeout(() => showResult(false), 1900);
  } else {
    col = 0;
    cells[row].forEach(c => c.classList.add('active-row'));
    showFB('', '');
  }
}

function score(guess, secret) {
  const res = Array(5).fill('absent');
  const sArr = secret.split(''), gArr = guess.split(''), used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) if (gArr[i] === sArr[i]) { res[i] = 'correct'; used[i] = true; }
  for (let i = 0; i < 5; i++) {
    if (res[i] === 'correct') continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && gArr[i] === sArr[j]) { res[i] = 'present'; used[j] = true; break; }
    }
  }
  return res;
}

function colorRow(r, result, guess) {
  result.forEach((res, i) => {
    setTimeout(() => {
      const cell = cells[r][i];
      cell.classList.remove('active-row');
      cell.classList.add(res);
      const btn = keyMap[guess[i]];
      if (btn) {
        if (res === 'correct') btn.className = 'kb-key correct';
        else if (res === 'present' && !btn.classList.contains('correct')) btn.className = 'kb-key present';
        else if (res === 'absent' && !btn.classList.contains('correct') && !btn.classList.contains('present')) btn.className = 'kb-key absent';
      }
    }, i * 160);
  });
}

function showFB(msg, type) {
  const el = document.getElementById('wordle-feedback');
  el.textContent = msg;
  el.className = 'wordle-feedback' + (type ? ' ' + type : '');
}

function showResult(won) {
  const r = row;
  document.getElementById('res-emoji').textContent = won ? (r <= 2 ? '🏆' : '🎉') : '💪';
  document.getElementById('res-title').textContent = won ? (r <= 2 ? 'Amazing!' : 'Well Done!') : 'Keep Practicing!';
  document.getElementById('res-score').textContent = won
    ? `You guessed it in ${r} ${r === 1 ? 'try' : 'tries'}!`
    : `The word was: ${secret}. Try again!`;
  document.getElementById('result-overlay').classList.add('show');
}

document.addEventListener('DOMContentLoaded', () => {
  initWordle();
  document.getElementById('res-play-again').onclick = () => {
    document.getElementById('result-overlay').classList.remove('show');
    initWordle();
  };
});
