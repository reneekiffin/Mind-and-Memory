// games/scrabble.js — Word Builder (Scrabble-style)

// ── Letter tile values (classic Scrabble) ──────────────────────
const TILE_VALUES = {
  A:1,B:3,C:3,D:2,E:1,F:4,G:2,H:4,I:1,J:8,K:5,L:1,
  M:3,N:1,O:1,P:3,Q:10,R:1,S:1,T:1,U:1,V:4,W:4,X:8,Y:4,Z:10
};

// ── Frequency bag (like real Scrabble) ─────────────────────────
const LETTER_BAG = (
  'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLL' +
  'MMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ'
).split('');

// ── Valid English words (common, 3-8 letters, senior-friendly) ─
const VALID_WORDS = new Set([
  // 3-letter
  'ACE','ACT','ADD','AGE','AGO','AID','AIM','AIR','ALL','AND','ANT','APE','APT',
  'ARC','ARE','ARK','ARM','ART','ASH','ASK','ATE','AWE','AXE','BAD','BAG','BAN',
  'BAR','BAT','BAY','BED','BEG','BET','BIG','BIT','BOW','BOX','BOY','BUD','BUG',
  'BUN','BUS','BUT','BUY','CAN','CAP','CAR','CAT','COP','COT','COW','CRY','CUB',
  'CUP','CUT','DAD','DAM','DAY','DEN','DEW','DID','DIG','DIM','DIP','DOC','DOE',
  'DOG','DOT','DRY','DUE','DUG','DUO','DYE','EAR','EAT','EEL','EGG','ELM','EMU',
  'END','ERA','EVE','EWE','EYE','FAD','FAN','FAR','FAT','FAX','FED','FEW','FIG',
  'FIN','FIT','FLY','FOB','FOE','FOG','FOR','FUN','FUR','GAP','GAS','GAY','GEL',
  'GEM','GET','GOD','GOT','GUM','GUN','GUT','GUY','GYM','HAD','HAM','HAS','HAT',
  'HAY','HEM','HEN','HER','HEW','HID','HIM','HIP','HIS','HIT','HOB','HOG','HOP',
  'HOT','HOW','HUB','HUG','HUM','HUT','ICE','ILL','INN','ION','IRE','JAB','JAM',
  'JAR','JAW','JAY','JET','JOB','JOG','JOT','JOY','JUG','JUT','KEG','KEY','KID',
  'KIT','LAB','LAD','LAG','LAP','LAW','LAX','LAY','LEA','LED','LEG','LET','LID',
  'LIE','LIT','LOG','LOT','LOW','MAP','MAR','MAT','MAW','MAY','MEN','MET','MEW',
  'MID','MIX','MOB','MOD','MOM','MOP','MOW','MUD','MUG','NAB','NAG','NAP','NET',
  'NEW','NIB','NIP','NIT','NOB','NOD','NOR','NOT','NOW','NUB','NUN','NUT','OAK',
  'OAR','OAT','ODD','ODE','OFF','OFT','OHM','OIL','OLD','OPT','ORB','ORE','OUR',
  'OUT','OWE','OWL','OWN','PAD','PAL','PAN','PAP','PAR','PAT','PAW','PAY','PEA',
  'PEG','PEN','PEP','PET','PIE','PIG','PIN','PIT','PLY','POD','POP','POT','POW',
  'PRY','PUB','PUG','PUN','PUP','PUS','PUT','RAG','RAM','RAN','RAP','RAT','RAW',
  'RAY','RED','REF','RIB','RID','RIG','RIM','RIP','ROB','ROD','ROE','ROT','ROW',
  'RUB','RUG','RUM','RUN','RUT','RYE','SAC','SAD','SAP','SAT','SAW','SAY','SEA',
  'SET','SEW','SHY','SIN','SIP','SIT','SIX','SKI','SKY','SLY','SOB','SOD','SON',
  'SOP','SOT','SOW','SOY','SPA','SPY','STY','SUB','SUM','SUN','SUP','TAB','TAD',
  'TAN','TAP','TAR','TAT','TAX','TEA','TEN','THE','TIE','TIN','TIP','TOE','TON',
  'TOO','TOP','TOW','TOY','TUB','TUG','TUN','TWO','URN','USE','VAN','VAT','VIA',
  'VIM','VOW','WAD','WAR','WAS','WAX','WAY','WEB','WED','WEE','WET','WHO','WHY',
  'WIG','WIN','WIT','WOE','WOK','WON','WOO','WOW','YAK','YAM','YAP','YAW','YEA',
  'YES','YET','YEW','YOU','ZAP','ZEN','ZIP','ZIT',
  // 4-letter
  'ABLE','ACHE','ACID','AGED','ALSO','ANTE','ARCH','AREA','ARMY','AUNT',
  'BAKE','BALD','BALL','BAND','BANE','BANK','BARE','BARK','BARN','BASE',
  'BATH','BEAK','BEAM','BEAN','BEAR','BEAT','BEEF','BEEN','BEER','BELL',
  'BELT','BEND','BEST','BIKE','BILL','BIRD','BITE','BLOW','BLUE','BLUR',
  'BOAR','BOAT','BODY','BOLD','BOLT','BOND','BONE','BOOK','BOOM','BOOT',
  'BORE','BORN','BOTH','BOWL','BUCK','BULK','BULL','BUMP','BURN','BURP',
  'CAFE','CAGE','CAKE','CALF','CALL','CALM','CAME','CAMP','CANE','CAPE',
  'CARD','CARE','CART','CASE','CASH','CAST','CAVE','CELL','CHAT','CHIP',
  'CHOP','CITE','CITY','CLAM','CLAP','CLAW','CLAY','CLIP','CLUB','CLUE',
  'COAL','COAT','CODE','COIL','COIN','COLD','COME','COOK','COOL','COPE',
  'COPY','CORD','CORE','CORN','COST','COUP','CRAB','CROP','CROW','CURE',
  'CURL','CUTE','DAME','DARK','DART','DATA','DATE','DAWN','DAYS','DEAD',
  'DEAF','DEAL','DEAR','DEBT','DECK','DEED','DEEP','DEEM','DEER','DENT',
  'DESK','DIAL','DICE','DIET','DIRT','DISC','DISH','DISK','DIVE','DOCK',
  'DOES','DOME','DONE','DOOM','DOOR','DOPE','DOSE','DOVE','DOWN','DRAG',
  'DRAW','DREW','DROP','DRUM','DUAL','DULL','DUMB','DUMP','DUNE','DUSK',
  'DUST','EACH','EARL','EARN','EASE','EAST','EASY','EDGE','EMIT','EPIC',
  'EVEN','EVER','EVIL','EXAM','FACE','FACT','FADE','FAIL','FAIR','FALL',
  'FAME','FARM','FAST','FATE','FAWN','FEAR','FEAT','FEED','FEEL','FEET',
  'FELL','FELT','FILE','FILL','FILM','FIND','FINE','FIRE','FIRM','FISH',
  'FIST','FLAG','FLAT','FLAW','FLEE','FLEW','FLIP','FLIT','FLOG','FLOW',
  'FOAM','FOLD','FOLK','FOND','FONT','FOOD','FOOL','FOOT','FORD','FORE',
  'FORK','FORM','FORT','FOUL','FOUR','FREE','FROM','FUEL','FULL','FUME',
  'FUND','FUSE','FUSS','GALE','GAME','GANG','GATE','GAVE','GAZE','GEAR',
  'GENE','GIFT','GIRL','GIVE','GLAD','GLEE','GLEN','GLOW','GLUE','GOAL',
  'GOAT','GOES','GOLD','GOLF','GONE','GOOD','GOWN','GRAB','GRAM','GRIN',
  'GRIP','GROW','GULF','GULL','GULP','GURU','GUST','HACK','HAIL','HAIR',
  'HALF','HALL','HALT','HAND','HANG','HARD','HARE','HARM','HARP','HART',
  'HATE','HAVE','HAWK','HEAD','HEAL','HEAP','HEAR','HEAT','HEEL','HEED',
    'HEIR','HELD','HELM','HELP','HERB','HERO','HIDE','HIGH','HIKE','HILL',
  'HIRE','HOLD','HOLE','HOME','HOOD','HOOK','HOOP','HOPE','HORN','HOSE',
  'HOST','HOUR','HUGE','HULK','HULL','HUNG','HUNT','HURT','HYMN','IDEA',
  'IDLE','INCH','INFO','INTO','IRON','ISLE','ITEM','JADE','JAIL','JEST',
  'JOIN','JOKE','JUMP','JUNE','JUST','KEEN','KEPT','KIND','KING','KNEE',
  'KNEW','KNIT','KNOW','LACK','LAID','LAKE','LAMB','LAMP','LAND','LANE',
  'LAST','LATE','LEAD','LEAF','LEAN','LEAP','LEND','LESS','LICK','LIFE',
  'LIFT','LIKE','LIME','LINE','LINK','LION','LIST','LIVE','LOAD','LOAF',
  'LOAN','LOCK','LOFT','LONE','LONG','LOOK','LOOP','LORE','LOSE','LOSS',
  'LOST','LOUD','LOVE','LUCK','LUMP','LUNG','LURE','LUST','MADE','MAIL',
  'MAIN','MAKE','MALE','MANE','MANY','MARK','MARS','MAST','MATE','MATH',
  'MAZE','MEAL','MEAN','MEAT','MEET','MELT','MENU','MERE','MILD','MILE',
  'MILK','MILL','MIME','MIND','MINE','MINT','MISS','MIST','MOAN','MODE',
  'MOOD','MOON','MOOR','MORE','MOSS','MOST','MOVE','MUCH','MULE','MUST',
  'MYTH','NAIL','NAME','NAVY','NEAR','NEAT','NECK','NEED','NEWS','NEXT',
  'NICE','NINE','NODE','NONE','NOON','NORM','NOSE','NOTE','NOUN','NUDE',
  'NUMB','OBEY','OKAY','ONCE','ONLY','OPEN','OVAL','OVEN','OVER','OWES',
  'PACE','PACK','PAGE','PAID','PAIN','PAIR','PALE','PALM','PARK','PART',
  'PASS','PAST','PATH','PEAK','PEEL','PEER','PICK','PIER','PILE','PILL',
  'PINE','PINK','PIPE','PLAN','PLAY','PLEA','PLOT','PLOW','PLUG','PLUM',
  'POEM','POET','POLE','POLL','POND','POOL','POOR','PORE','PORK','PORT',
  'POSE','POST','POUR','PRAY','PREY','PROD','PROP','PULL','PUMP','PURE',
  'PUSH','QUIZ','RACE','RACK','RAGE','RAID','RAIL','RAIN','RAKE','RAMP',
  'RANG','RANK','RARE','RASH','RATE','RAVE','READ','REAL','REAP','REAR',
  'REED','REEF','REEL','RELY','RENT','REEK','REST','RICE','RICH','RIDE',
  'RING','RIOT','RISE','RISK','ROAM','ROAR','ROBE','ROCK','ROLE','ROLL',
  'ROOF','ROOM','ROOT','ROPE','ROSE','ROUT','RUDE','RUIN','RULE','RUSH',
  'RUST','SAFE','SAGE','SAIL','SAKE','SALE','SALT','SAME','SAND','SANE',
  'SANG','SANK','SASH','SAVE','SCAN','SCAR','SEAL','SEAM','SEAT','SEED',
  'SEEK','SEEM','SEEN','SELF','SELL','SEND','SENT','SHED','SHIN','SHIP',
  'SHOE','SHOP','SHOT','SHOW','SHUT','SICK','SIDE','SIGH','SIGN','SILK',
  'SING','SINK','SIZE','SKIN','SKIP','SLAM','SLAP','SLIM','SLIP','SLOT',
  'SLOW','SLUG','SNAP','SNOW','SOAK','SOAP','SOAR','SOCK','SOFT','SOIL',
  'SOLD','SOLE','SOME','SONG','SOON','SORE','SORT','SOUL','SOUP','SOUR',
  'SPAN','SPAR','SPIN','SPIT','SPOT','SPUN','STAB','STAR','STAY','STEM',
  'STEP','STEW','STIR','STOP','STUB','STUN','SUCH','SUIT','SUNG','SUNK',
  'SURE','SURF','SWAN','SWAP','SWAY','SWIM','TAIL','TALE','TALK','TALL',
  'TAME','TANK','TAPE','TASK','TEAM','TEAR','TELL','TEND','TENT','TERM',
  'TEST','THAN','THAT','THEM','THEN','THEY','THICK','THIN','THIS','TIDE',
  'TIED','TILL','TILE','TIME','TINY','TIRE','TOAD','TOLD','TOLL','TOMB',
  'TONE','TONG','TOOK','TOOL','TORN','TOSS','TOUR','TOWN','TRAP','TRAY',
  'TREE','TRIM','TRIO','TRIP','TRUE','TUBE','TUCK','TUNA','TUNE','TURF',
  'TURN','TUSK','TYPE','UGLY','UNDO','UNIT','UPON','URGE','USED','VAIN',
  'VALE','VANE','VARY','VAST','VEIL','VERY','VEST','VIEW','VILE','VINE',
  'VISE','VOID','VOLT','VOTE','WADE','WAGE','WAKE','WALK','WALL','WAND',
  'WANT','WARD','WARM','WARN','WARP','WART','WASH','WASP','WAVE','WEAK',
  'WEAL','WEAN','WEED','WEEK','WELD','WELL','WENT','WERE','WEST','WHAT',
  'WHEN','WHET','WHIP','WHOM','WIDE','WIFE','WILD','WILL','WILT','WIND',
  'WINE','WING','WINK','WIRE','WISE','WISH','WITH','WOKE','WOLF','WOOD',
  'WOOL','WORD','WORE','WORK','WORM','WORN','WRAP','WREN','WRIT','YARD',
  'YARN','YAWN','YEAR','YELL','YOUR','ZEAL','ZERO','ZONE','ZOOM',
  // 5+ letters (bonus words)
  'ABOUT','ABOVE','ABUSE','ACTOR','ACUTE','AFTER','AGAIN','AGREE','AHEAD',
  'ALARM','ALBUM','ALERT','ALIVE','ALLOW','ALONE','ALONG','ALTER','ANGEL',
  'ANGER','ANGLE','ANKLE','APART','APPLE','APPLY','ARENA','ARISE','ARMOR',
  'ARROW','ATLAS','AUDIO','AVOID','AWAKE','AWARD','AWARE','AWFUL','BAKER',
  'BASIC','BEACH','BEARD','BEAST','BEGIN','BELOW','BENCH','BERRY','BLACK',
  'BLADE','BLAME','BLANK','BLAST','BLEND','BLIND','BLOCK','BLOOD','BLOOM',
  'BOARD','BOOST','BOUND','BRAVE','BREAD','BREAK','BRING','BROAD','BROOK',
  'BROWN','BUILD','BUILT','BUNCH','BURST','CANDY','CARRY','CATCH','CAUSE',
  'CHAIN','CHAIR','CHARM','CHASE','CHEAP','CHECK','CHEER','CHEST','CHIEF',
  'CHILD','CLAIM','CLASS','CLEAN','CLEAR','CLICK','CLIFF','CLIMB','CLOCK',
  'CLOSE','CLOUD','COACH','COAST','CORAL','COUNT','COURT','COVER','CRACK',
  'CRAFT','CRANE','CRASH','CREAM','CREEK','CRIME','CRISP','CROSS','CROWD',
  'CROWN','CRUEL','CRUSH','CURVE','CYCLE','DAILY','DANCE','DEATH','DENSE',
  'DEPTH','DIRTY','DOUBT','DRAFT','DRAIN','DRAMA','DREAM','DRESS','DRILL',
  'DRINK','DRIVE','DRONE','DUSTY','EAGLE','EARLY','EARTH','EIGHT','ELECT',
  'ELITE','EMPTY','EQUAL','EVOKE','EXACT','EXILE','EXTRA','FAINT','FAIRY',
  'FAITH','FALSE','FANCY','FEAST','FENCE','FEVER','FIBER','FIELD','FIFTH',
  'FIGHT','FINAL','FIRST','FIXED','FLAME','FLARE','FLASH','FLEET','FLESH',
  'FLOAT','FLOCK','FLOOR','FLOUR','FLUTE','FOCUS','FORCE','FORGE','FORTH',
  'FOUND','FRAME','FRANK','FRESH','FRONT','FROST','FRUIT','FULLY','FUNNY',
  'GHOST','GIANT','GIVEN','GLASS','GLEAM','GLIDE','GLOBE','GLOOM','GRACE',
  'GRADE','GRAIN','GRAND','GRANT','GRAPH','GRASP','GRASS','GREAT','GREED',
  'GREEN','GRIEF','GRIND','GROAN','GROOM','GROVE','GUARD','GUESS','GUEST',
  'GUIDE','HABIT','HAPPY','HARSH','HAVEN','HEART','HEAVY','HEDGE','HERBS',
  'HOLLY','HONEY','HONOR','HORSE','HOTEL','HOUSE','HUMAN','HUMID','HUMOR',
  'HURRY','IMAGE','INNER','ISSUE','IVORY','JELLY','JEWEL','JOKER','JOLLY',
  'JUDGE','JUICE','JUICY','LABEL','LARGE','LASER','LATER','LAUGH','LAYER',
  'LEARN','LEASE','LEGAL','LEMON','LEVEL','LIGHT','LINEN','LOCAL','LODGE',
  'LOGIC','LOOSE','LOVER','LOWER','LUCKY','LUNAR','LUNCH','MAGIC','MAJOR',
  'MAPLE','MARCH','MATCH','MAYOR','MEDIA','MERIT','METAL','MINOR','MIXED',
  'MODEL','MONEY','MONTH','MORAL','MOTTO','MOUNT','MOUSE','MUSIC','NAVAL',
  'NERVE','NIGHT','NOBLE','NOISE','NORTH','NOTED','NOVEL','NURSE','OCCUR',
  'OCEAN','OFFER','OFTEN','OLIVE','OPERA','ORBIT','ORDER','OUTER','OWNER',
  'PAINT','PANEL','PAPER','PARTY','PASTA','PATCH','PAUSE','PEACE','PEACH',
  'PEARL','PERCH','PHASE','PHONE','PIANO','PILOT','PINCH','PLACE','PLAIN',
  'PLANE','PLANT','PLATE','PLAZA','PLUCK','POINT','POLAR','PORCH','POUND',
  'POWER','PRESS','PRICE','PRIDE','PRIME','PRINT','PRIZE','PROOF','PROUD',
  'PULSE','PUPIL','PURSE','QUEEN','QUERY','QUEST','QUICK','QUIET','QUOTA',
  'RADAR','RAINY','RALLY','RANCH','RANGE','RAPID','RATIO','REACH','READY',
  'REALM','REBEL','REFER','REIGN','RELAX','REPLY','RIDER','RIDGE','RISKY',
  'RIVER','RIVAL','ROBOT','ROCKY','ROUGH','ROUND','ROUTE','ROYAL','RUGBY',
  'RULER','RUSTY','SALAD','SAUCE','SCALE','SCENE','SCORE','SCOUT','SENSE',
  'SERVE','SEVEN','SHADE','SHAKE','SHALL','SHAME','SHAPE','SHARE','SHARK',
  'SHARP','SHELF','SHELL','SHIFT','SHINE','SHIRT','SHOCK','SHOOT','SHORT',
  'SHOUT','SIGHT','SILLY','SINCE','SIXTH','SIXTY','SKILL','SKULL','SLATE',
  'SLEEP','SLICE','SLIDE','SLOPE','SMART','SMILE','SMOKE','SNAKE','SOLAR',
  'SOLID','SOLVE','SOUTH','SPACE','SPARE','SPARK','SPEAK','SPEED','SPEND',
  'SPINE','SPOKE','SPOON','SPORT','SPRAY','STACK','STAFF','STAGE','STAIN',
  'STALE','STAND','STARK','START','STATE','STEAM','STEEL','STEEP','STEER',
  'STERN','STICK','STIFF','STILL','STOCK','STONE','STORE','STORM','STORY',
  'STOVE','STRAP','STRAW','STRIP','STUCK','STUDY','STYLE','SUGAR','SUITE',
  'SUNNY','SUPER','SURGE','SWAMP','SWEAR','SWEET','SWIFT','SWORD','TABLE',
  'TASTE','TEACH','TENSE','TERMS','THANK','THEME','THERE','THICK','THING',
  'THINK','THIRD','THREE','TIGER','TIGHT','TIMER','TIRED','TITLE','TOKEN',
  'TOTAL','TOUCH','TOUGH','TOWER','TOXIC','TRACE','TRACK','TRADE','TRAIL',
  'TRAIN','TRASH','TREAT','TREND','TRIAL','TRIBE','TRICK','TROOP','TRUCK',
  'TRULY','TRUNK','TRUST','TRUTH','TUTOR','TWICE','ULTRA','UNION','UNITY',
  'UNTIL','UPPER','UPSET','URBAN','USUAL','UTTER','VALID','VALUE','VAULT',
  'VERSE','VITAL','VIVID','VOCAL','VOICE','VOTER','WATER','WEAVE','WEDGE',
  'WEIRD','WHALE','WHEAT','WHEEL','WHERE','WHICH','WHILE','WHITE','WHOLE',
  'WIDER','WITTY','WORLD','WORRY','WORSE','WORTH','WOULD','WOUND','WRATH',
  'WRIST','WROTE','YACHT','YEARN','YIELD','YOUNG','YOURS','YOUTH','ZEBRA',
]);

// ── State ─────────────────────────────────────────────────────
let rack = [];          // player's 7 tiles [{letter,value,id}]
let selected = [];      // selected tile ids in order
let totalScore = 0;
let wordsFound = [];
let roundNum = 0;

function rnd(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function shuffle(a){ const r=[...a]; for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];} return r; }

// ── Draw tiles from bag ───────────────────────────────────────
function drawTiles(n) {
  const bag = shuffle([...LETTER_BAG]);
  const tiles = [];
  for (let i = 0; i < n; i++) {
    const letter = bag[i];
    tiles.push({ letter, value: TILE_VALUES[letter], id: Date.now() + i + Math.random() });
  }
  return tiles;
}

// Ensure rack has playable vowels
function guaranteeVowels(tiles) {
  const vowels = 'AEIOU'.split('');
  const hasVowel = tiles.some(t => vowels.includes(t.letter));
  if (!hasVowel) {
    const vowel = vowels[rnd(0, vowels.length - 1)];
    tiles[rnd(0, tiles.length - 1)] = { letter: vowel, value: TILE_VALUES[vowel], id: Date.now() + Math.random() };
  }
  return tiles;
}

// ── New round ─────────────────────────────────────────────────
function newRound() {
  roundNum++;
  selected = [];
  wordsFound = [];
  rack = guaranteeVowels(drawTiles(7));
  setStatus('Tap letters to spell a word, then tap SUBMIT!');
  renderRack();
  renderSelected();
  renderFound();
  document.getElementById('scrab-round').textContent = roundNum;
}

// ── Render rack ───────────────────────────────────────────────
function renderRack() {
  const div = document.getElementById('scrab-rack');
  div.innerHTML = '';
  rack.forEach(tile => {
    const btn = document.createElement('div');
    btn.className = 'scrab-tile' + (selected.includes(tile.id) ? ' used' : '');
    btn.innerHTML = `<span class="tile-letter">${tile.letter}</span><span class="tile-val">${tile.value}</span>`;
    btn.onclick = () => selectTile(tile.id);
    div.appendChild(btn);
  });
}

// ── Render selected word ──────────────────────────────────────
function renderSelected() {
  const div = document.getElementById('scrab-word');
  div.innerHTML = '';
  selected.forEach(id => {
    const tile = rack.find(t => t.id === id);
    if (!tile) return;
    const t = document.createElement('div');
    t.className = 'scrab-tile selected-tile';
    t.innerHTML = `<span class="tile-letter">${tile.letter}</span><span class="tile-val">${tile.value}</span>`;
    t.onclick = () => deselectTile(id);
    div.appendChild(t);
  });
  // show current word score
  const wordScore = calcScore();
  document.getElementById('scrab-word-score').textContent =
    selected.length > 0 ? `Word score: ${wordScore} pts` : '';
}

// ── Render found words ────────────────────────────────────────
function renderFound() {
  const div = document.getElementById('scrab-found');
  div.innerHTML = '';
  wordsFound.forEach(w => {
    const chip = document.createElement('div');
    chip.className = 'found-chip';
    chip.textContent = `${w.word} +${w.score}`;
    div.appendChild(chip);
  });
}

// ── Tile selection ────────────────────────────────────────────
function selectTile(id) {
  if (selected.includes(id)) { deselectTile(id); return; }
  selected.push(id);
  renderRack();
  renderSelected();
}

function deselectTile(id) {
  selected = selected.filter(s => s !== id);
  renderRack();
  renderSelected();
}

function clearWord() {
  selected = [];
  renderRack();
  renderSelected();
  document.getElementById('scrab-word-score').textContent = '';
}

// ── Score calculation ─────────────────────────────────────────
function calcScore() {
  let s = selected.reduce((sum, id) => {
    const t = rack.find(t => t.id === id);
    return sum + (t ? t.value : 0);
  }, 0);
  // Bonus for longer words
  const len = selected.length;
  if (len >= 7) s *= 3;       // 3× for using all 7 tiles
  else if (len >= 5) s *= 2;  // 2× for 5+ letters
  else if (len >= 4) s = Math.round(s * 1.5); // 1.5× for 4 letters
  return s;
}

// ── Submit word ───────────────────────────────────────────────
function submitWord() {
  if (selected.length < 3) {
    setStatus('❌ Words must be at least 3 letters!'); return;
  }
  const word = selected.map(id => rack.find(t => t.id === id).letter).join('');

  if (!VALID_WORDS.has(word)) {
    setStatus(`❌ "${word}" is not a valid word — try again!`);
    return;
  }
  if (wordsFound.find(w => w.word === word)) {
    setStatus(`⚠️ You already found "${word}"!`);
    return;
  }

  const s = calcScore();
  totalScore += s;
  wordsFound.push({ word, score: s });
  document.getElementById('scrab-score').textContent = totalScore;

  const len = selected.length;
  let msg = `✅ "${word}" — +${s} points!`;
  if (len >= 7) msg += ' 🎉 BINGO! Used all 7 tiles!';
  else if (len >= 5) msg += ' 🌟 Bonus for long word!';
  setStatus(msg);

  selected = [];
  renderRack();
  renderSelected();
  renderFound();
}

// ── New tiles ─────────────────────────────────────────────────
function shuffleRack() {
  rack = shuffle(rack);
  selected = [];
  renderRack();
  renderSelected();
  setStatus('Tiles shuffled! 🔀');
}

function newTiles() {
  selected = [];
  rack = guaranteeVowels(drawTiles(7));
  setStatus('New tiles drawn! Make a word!');
  renderRack();
  renderSelected();
}

function setStatus(msg) {
  document.getElementById('scrab-status').textContent = msg;
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  totalScore = 0;
  roundNum = 0;
  document.getElementById('scrab-score').textContent = 0;
  newRound();
});
