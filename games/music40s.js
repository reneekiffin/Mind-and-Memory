// games/music40s.js — 1940s Music Trivia: match the song to the artist
// Facts cross-checked against Billboard chart histories and standard music references.

let m4Score = 0;
let m4Q     = 0;
let m4Pool  = null;   // null = pool needs initialising; [] = exhausted

// ── Audio sample (iTunes Search API — 30 s preview, no API key) ──
let m4Audio        = null;
let m4FetchAbort   = null;

async function fetchPreviewUrl(song, artist) {
  if (m4FetchAbort) m4FetchAbort.abort();
  m4FetchAbort = new AbortController();
  // Strip parentheticals and articles to widen match coverage
  const cleanSong = song.replace(/\([^)]*\)/g, '').trim();
  const term = encodeURIComponent(`${cleanSong} ${artist}`);
  const url  = `https://itunes.apple.com/search?term=${term}&limit=1&media=music&entity=song`;
  try {
    const res = await fetch(url, { signal: m4FetchAbort.signal });
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.previewUrl || null;
  } catch (_) {
    return null;
  }
}

function stopAudio() {
  if (m4Audio) {
    m4Audio.pause();
    m4Audio.src = '';
    m4Audio = null;
  }
  const btn = document.getElementById('m4-play');
  if (btn) {
    btn.textContent = '🔊 Play sample';
    btn.disabled = true;
    btn.style.display = 'none';
  }
}

async function setupSample(song, artist) {
  const btn = document.getElementById('m4-play');
  btn.style.display = 'inline-block';
  btn.disabled = true;
  btn.textContent = '⏳ Loading sample…';

  const url = await fetchPreviewUrl(song, artist);
  if (!url) {
    btn.style.display = 'none';   // hide if nothing returned
    return;
  }

  m4Audio = new Audio(url);
  m4Audio.preload = 'auto';
  m4Audio.addEventListener('ended', () => {
    if (btn) btn.textContent = '🔊 Play sample';
  });

  btn.disabled = false;
  btn.textContent = '🔊 Play sample';
  btn.onclick = () => {
    if (!m4Audio) return;
    if (m4Audio.paused) {
      m4Audio.play().catch(() => {});
      btn.textContent = '⏸️ Pause';
    } else {
      m4Audio.pause();
      btn.textContent = '▶️ Resume';
    }
  };
}

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Songs ──────────────────────────────────────────────────
const SONGS = [
  { song:'White Christmas', artist:'Bing Crosby', year:1942,
    fact:'Bing Crosby\'s 1942 recording from "Holiday Inn" sold over 50 million copies — the best-selling single of all time.',
    distractors:['Frank Sinatra','Nat King Cole','Glenn Miller'] },

  { song:'In the Mood', artist:'Glenn Miller', year:1940,
    fact:'Glenn Miller\'s signature swing instrumental topped the charts in 1940 and remains one of the most recognised tunes of the big band era.',
    distractors:['Tommy Dorsey','Benny Goodman','Duke Ellington'] },

  { song:'Boogie Woogie Bugle Boy', artist:'The Andrews Sisters', year:1941,
    fact:'Released in 1941, the song reached No. 6 on Billboard\'s Pop Singles chart and became an anthem of the WWII years.',
    distractors:['The Mills Brothers','The Ink Spots','The McGuire Sisters'] },

  { song:'Don\'t Sit Under the Apple Tree', artist:'The Andrews Sisters', year:1942,
    fact:'A 1942 hit that became a sweetheart\'s pledge during the war — promising a soldier she\'d wait for him.',
    distractors:['Bing Crosby','Doris Day','Judy Garland'] },

  { song:'Chattanooga Choo Choo', artist:'Glenn Miller', year:1941,
    fact:'In 1942 it became the first recording ever to be certified gold, for selling more than 1.2 million copies.',
    distractors:['Tommy Dorsey','Benny Goodman','Bing Crosby'] },

  { song:'Swinging on a Star', artist:'Bing Crosby', year:1944,
    fact:'Won the 1944 Academy Award for Best Original Song — featured in the film "Going My Way".',
    distractors:['Frank Sinatra','Nat King Cole','Perry Como'] },

  { song:'Don\'t Fence Me In', artist:'Bing Crosby & The Andrews Sisters', year:1944,
    fact:'Cole Porter wrote it; the Crosby/Andrews Sisters version was a No. 1 hit for eight weeks in late 1944.',
    distractors:['Roy Rogers','Gene Autry','Frank Sinatra'] },

  { song:'Take the "A" Train', artist:'Duke Ellington', year:1941,
    fact:'Composed by Billy Strayhorn; became the Duke Ellington Orchestra\'s signature theme tune.',
    distractors:['Count Basie','Glenn Miller','Benny Goodman'] },

  { song:'I\'ll Be Seeing You', artist:'Bing Crosby', year:1944,
    fact:'Originally from a 1938 Broadway show, Crosby\'s 1944 recording became one of the most beloved wartime ballads.',
    distractors:['Glenn Miller','Frank Sinatra','Doris Day'] },

  { song:'Sentimental Journey', artist:'Doris Day', year:1945,
    fact:'Recorded with Les Brown\'s orchestra; spent nine weeks at No. 1 in 1945 and became closely linked with the end of WWII.',
    distractors:['Patti Page','Peggy Lee','Rosemary Clooney'] },

  { song:'Stardust', artist:'Artie Shaw', year:1940,
    fact:'Hoagy Carmichael wrote the music. Artie Shaw\'s 1940 recording became the most popular of more than 1,500 versions.',
    distractors:['Glenn Miller','Tommy Dorsey','Benny Goodman'] },

  { song:'Pennsylvania 6-5000', artist:'Glenn Miller', year:1940,
    fact:'The title was the phone number of the Hotel Pennsylvania in New York, where Miller\'s band often played.',
    distractors:['Tommy Dorsey','Bing Crosby','Duke Ellington'] },

  { song:'When You Wish Upon a Star', artist:'Cliff Edwards', year:1940,
    fact:'Sung by Cliff Edwards as Jiminy Cricket in Disney\'s "Pinocchio". Won the 1940 Academy Award for Best Original Song.',
    distractors:['Bing Crosby','Frank Sinatra','Gene Kelly'] },

  { song:'Over the Rainbow', artist:'Judy Garland', year:1939,
    fact:'From "The Wizard of Oz". Won the 1939 Oscar for Best Original Song and remained Garland\'s signature tune throughout the 1940s.',
    distractors:['Doris Day','Ella Fitzgerald','Billie Holiday'] },

  { song:'I\'ll Never Smile Again', artist:'Tommy Dorsey (with Frank Sinatra)', year:1940,
    fact:'Sat at No. 1 for 12 weeks in 1940 and helped make Frank Sinatra a star.',
    distractors:['Glenn Miller','Bing Crosby','Benny Goodman'] },

  { song:'God Bless the Child', artist:'Billie Holiday', year:1941,
    fact:'Holiday co-wrote the song with Arthur Herzog Jr. — recorded for OKeh Records in May 1941.',
    distractors:['Ella Fitzgerald','Sarah Vaughan','Lena Horne'] },

  { song:'Stormy Weather', artist:'Lena Horne', year:1943,
    fact:'Horne\'s signature performance came in the 1943 film of the same name, in which she also starred.',
    distractors:['Billie Holiday','Ella Fitzgerald','Dinah Shore'] },

  { song:'Nature Boy', artist:'Nat King Cole', year:1948,
    fact:'A No. 1 hit for eight weeks in 1948. The enigmatic lyrics were written by an itinerant beat poet named Eden Ahbez.',
    distractors:['Frank Sinatra','Perry Como','Bing Crosby'] },

  { song:'Some Enchanted Evening', artist:'Perry Como', year:1949,
    fact:'From the Broadway musical "South Pacific". Como\'s 1949 recording was the biggest pop hit version.',
    distractors:['Frank Sinatra','Bing Crosby','Nat King Cole'] },

  { song:'Rudolph the Red-Nosed Reindeer', artist:'Gene Autry', year:1949,
    fact:'Autry\'s 1949 recording sold over 25 million copies and remains a Christmas standard.',
    distractors:['Bing Crosby','Burl Ives','Roy Rogers'] },

  { song:'Buttons and Bows', artist:'Dinah Shore', year:1948,
    fact:'Won the 1948 Academy Award for Best Original Song; Shore\'s recording was No. 1 for 10 weeks.',
    distractors:['Doris Day','Patti Page','Rosemary Clooney'] },

  { song:'(Ghost) Riders in the Sky', artist:'Vaughn Monroe', year:1949,
    fact:'A No. 1 hit in 1949 — a haunting cowboy tale that has been covered hundreds of times since.',
    distractors:['Gene Autry','Roy Rogers','Eddy Arnold'] },

  { song:'Paper Doll', artist:'The Mills Brothers', year:1943,
    fact:'Sold over 6 million copies and held No. 1 for 12 weeks in 1943.',
    distractors:['The Ink Spots','The Andrews Sisters','The Ames Brothers'] },

  { song:'Tuxedo Junction', artist:'Glenn Miller', year:1940,
    fact:'Erskine Hawkins wrote and first recorded it; Glenn Miller\'s 1940 cover was the bigger chart hit.',
    distractors:['Erskine Hawkins','Tommy Dorsey','Benny Goodman'] },

  { song:'You Are My Sunshine', artist:'Jimmie Davis', year:1940,
    fact:'Jimmie Davis recorded it in 1940 and later served two terms as Governor of Louisiana.',
    distractors:['Hank Williams','Gene Autry','Bing Crosby'] },

  { song:'A String of Pearls', artist:'Glenn Miller', year:1941,
    fact:'Recorded by Miller and his orchestra in 1941 — reached No. 1 on the Billboard Best Sellers chart in 1942.',
    distractors:['Benny Goodman','Tommy Dorsey','Artie Shaw'] },

  { song:'Don\'t Get Around Much Anymore', artist:'The Ink Spots', year:1943,
    fact:'Originally an Ellington instrumental ("Never No Lament", 1940), it became a hit when The Ink Spots recorded the vocal version in 1942 with lyrics by Bob Russell.',
    distractors:['Duke Ellington','The Mills Brothers','Nat King Cole'] },

  { song:'Mairzy Doats', artist:'The Merry Macs', year:1944,
    fact:'A nonsense-word novelty hit that reached No. 1 in 1944 — the lyrics actually mean "mares eat oats and does eat oats".',
    distractors:['The Andrews Sisters','The Mills Brothers','The Ink Spots'] },

  { song:'Rum and Coca-Cola', artist:'The Andrews Sisters', year:1945,
    fact:'No. 1 for 10 weeks in 1945. The melody is based on a Trinidadian calypso by Lord Invader.',
    distractors:['Carmen Miranda','Doris Day','Peggy Lee'] },

  { song:'(I\'ve Got a Gal in) Kalamazoo', artist:'Glenn Miller', year:1942,
    fact:'A No. 1 hit in 1942; featured in the film "Orchestra Wives".',
    distractors:['Tommy Dorsey','Bing Crosby','Frank Sinatra'] }
];

// ── Render ──────────────────────────────────────────────────
function pickQuestion() {
  if (m4Pool === null) m4Pool = shuffle(SONGS);
  if (m4Pool.length === 0) return null;
  return m4Pool.pop();
}

function showM4Complete() {
  stopAudio();
  document.querySelector('.m4-q-label').textContent = 'Quiz complete';
  document.getElementById('m4-question').textContent = `🎉 You scored ${m4Score} out of ${m4Q}!`;
  document.getElementById('m4-feedback').textContent = '';
  document.getElementById('m4-feedback').className = 'm4-feedback';
  document.getElementById('m4-fact-box').style.display = 'none';

  const grid = document.getElementById('m4-options');
  grid.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'm4-btn correct';
  btn.textContent = '🔄 Start Over';
  btn.onclick = restartM4;
  grid.appendChild(btn);
}

function restartM4() {
  m4Score = 0;
  m4Q    = 0;
  m4Pool = null;
  document.querySelector('.m4-q-label').textContent = 'Who recorded this song?';
  renderQ();
}

function renderQ() {
  stopAudio();

  const q = pickQuestion();
  if (!q) { showM4Complete(); return; }

  m4Q++;
  document.getElementById('m4-score').textContent = m4Score;
  document.getElementById('m4-qnum').textContent  = m4Q;
  document.getElementById('m4-feedback').textContent = '';
  document.getElementById('m4-feedback').className   = 'm4-feedback';
  document.getElementById('m4-fact-box').style.display = 'none';

  document.getElementById('m4-question').textContent = `"${q.song}"`;
  setupSample(q.song, q.artist);

  const choices = shuffle([q.artist, ...q.distractors]);
  const grid = document.getElementById('m4-options');
  grid.innerHTML = '';
  choices.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'm4-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn, q.artist, q.fact);
    grid.appendChild(btn);
  });
}

function handleAnswer(chosen, btn, correct, fact) {
  document.querySelectorAll('.m4-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('m4-feedback');

  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Correct!';
    fb.className   = 'm4-feedback good';
    m4Score++;
    document.getElementById('m4-score').textContent = m4Score;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.m4-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    fb.textContent = '❌ Not quite';
    fb.className   = 'm4-feedback bad';
  }

  document.getElementById('m4-fact-text').textContent = fact;
  document.getElementById('m4-fact-box').style.display = 'block';

  setTimeout(renderQ, 9000);
}

document.addEventListener('DOMContentLoaded', () => {
  m4Score = 0;
  m4Q     = 0;
  m4Pool  = null;
  renderQ();
});
