// games/jhistory.js — Jamaican History Trivia (1935-2012)

let jhScore = 0;
let jhQ     = 0;
let jhPool  = null;   // null = pool needs initialising; [] = exhausted

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Trivia bank ──────────────────────────────────────────────
// Each entry: era (decade label), question, answer, choices, fact
const TRIVIA = [
  { era:'1930s', q:'What did Alexander Bustamante found in 1938?',
    a:'The Bustamante Industrial Trade Union (BITU)',
    choices:['The Bustamante Industrial Trade Union (BITU)','The Jamaica Labour Party','The People\'s National Party','The University College of the West Indies'],
    fact:'Bustamante founded the BITU in May 1938 during the labour unrest that swept the Caribbean. The trade union became the political base for the JLP, which he founded in 1943.' },

  { era:'1930s', q:'Norman Manley founded which political party in 1938?',
    a:'The People\'s National Party (PNP)',
    choices:['The People\'s National Party (PNP)','The Jamaica Labour Party (JLP)','The National Democratic Movement','The National Workers\' Union'],
    fact:'The PNP was founded on 18 September 1938. It is one of the oldest political parties in the English-speaking Caribbean.' },

  { era:'1940s', q:'In what year did Jamaica hold its first general election under universal adult suffrage?',
    a:'1944',
    choices:['1938','1944','1953','1962'],
    fact:'The 1944 Constitution gave every adult Jamaican the vote regardless of property or income — almost two decades before independence.' },

  { era:'1940s', q:'Who founded the Jamaica Labour Party (JLP) in 1943?',
    a:'Alexander Bustamante',
    choices:['Norman Manley','Alexander Bustamante','Marcus Garvey','Hugh Shearer'],
    fact:'Bustamante built the JLP on the strength of his trade union, the BITU, and led the party to victory in 1944, 1949 and 1962.' },

  { era:'1940s', q:'Who won Jamaica\'s first individual Olympic gold medal?',
    a:'Arthur Wint',
    choices:['Arthur Wint','Herb McKenley','Don Quarrie','Asafa Powell'],
    fact:'Arthur Wint won the men\'s 400m at the 1948 London Olympics — Jamaica\'s very first Olympic gold.' },

  { era:'1950s', q:'Bustamante became Jamaica\'s first Chief Minister in which year?',
    a:'1953',
    choices:['1944','1953','1959','1962'],
    fact:'Following the 1953 election, Bustamante became the first Chief Minister under the new internal self-government arrangements.' },

  { era:'1950s', q:'Which federation did Jamaica join in 1958?',
    a:'The West Indies Federation',
    choices:['CARICOM','The West Indies Federation','The Organisation of Eastern Caribbean States','The Caribbean Free Trade Association'],
    fact:'Ten British Caribbean territories formed the Federation in 1958, but it dissolved in 1962 after Jamaica voted to leave.' },

  { era:'1960s', q:'In what year did Jamaicans vote in the referendum that led the country to leave the West Indies Federation?',
    a:'1961',
    choices:['1958','1960','1961','1962'],
    fact:'In the September 1961 referendum, 54% of Jamaicans voted to leave the Federation. Independence followed less than a year later.' },

  { era:'1960s', q:'On what date did Jamaica become independent?',
    a:'6 August 1962',
    choices:['1 August 1962','6 August 1962','21 October 1962','1 January 1963'],
    fact:'Jamaica gained independence from Britain on 6 August 1962 — now celebrated each year as Independence Day.' },

  { era:'1960s', q:'Who became Jamaica\'s first Prime Minister at independence?',
    a:'Sir Alexander Bustamante',
    choices:['Norman Manley','Sir Alexander Bustamante','Hugh Shearer','Donald Sangster'],
    fact:'Bustamante led the JLP to a narrow victory in the April 1962 election and became Jamaica\'s first PM on 6 August 1962.' },

  { era:'1960s', q:'How were Alexander Bustamante and Norman Manley related?',
    a:'They were first cousins',
    choices:['They were brothers','They were first cousins','They were father and son','They were uncle and nephew'],
    fact:'The two political rivals shared a grandmother — they were first cousins, even as they led the JLP and PNP against each other.' },

  { era:'1960s', q:'In which Kingston neighbourhood did Bob Marley\'s original Wailers form in 1963?',
    a:'Trench Town',
    choices:['Spanish Town','Trench Town','Half Way Tree','Constant Spring'],
    fact:'The Wailing Wailers — Bob Marley, Peter Tosh and Bunny Wailer — formed in Trench Town, the inner-city community Marley would later immortalise in song.' },

  { era:'1960s', q:'Which legendary ska band was formed in Kingston in 1964?',
    a:'The Skatalites',
    choices:['The Skatalites','Toots and the Maytals','The Wailers','Burning Spear'],
    fact:'The Skatalites helped define the ska sound that would evolve into rocksteady and reggae. Tommy McCook, Don Drummond and Roland Alphonso were among the founders.' },

  { era:'1960s', q:'Who succeeded Bustamante as Jamaica\'s second Prime Minister in 1967?',
    a:'Donald Sangster',
    choices:['Hugh Shearer','Donald Sangster','Michael Manley','Edward Seaga'],
    fact:'Donald Sangster became PM in February 1967 and won the general election that March, but died in office on 11 April 1967.' },

  { era:'1960s', q:'Who was the first person ever named a National Hero of Jamaica?',
    a:'Marcus Garvey',
    choices:['Sam Sharpe','Marcus Garvey','Paul Bogle','George William Gordon'],
    fact:'Marcus Mosiah Garvey, founder of the Universal Negro Improvement Association, was honoured as Jamaica\'s first National Hero.' },

  { era:'1960s', q:'Marcus Garvey founded which influential pan-African organisation in 1914?',
    a:'The Universal Negro Improvement Association',
    choices:['The NAACP','The Universal Negro Improvement Association','The Pan-African Congress','The Black Star Line'],
    fact:'The UNIA grew into one of the largest mass movements in African-American history. (The Black Star Line was Garvey\'s shipping company, founded in 1919.)' },

  { era:'1960s', q:'The Rastafari movement, which emerged in 1930s Jamaica, regards which figure as a divine leader?',
    a:'Haile Selassie I of Ethiopia',
    choices:['Marcus Garvey','Haile Selassie I of Ethiopia','Mahatma Gandhi','Kwame Nkrumah'],
    fact:'Rastafarians regard Haile Selassie I (Emperor of Ethiopia, 1930-1974) as a manifestation of God, whom they call Jah.' },

  { era:'1970s', q:'Michael Manley first became Prime Minister in what year?',
    a:'1972',
    choices:['1968','1972','1976','1980'],
    fact:'Michael Manley led the PNP to a landslide win in the February 1972 election. He served two non-consecutive terms (1972-1980 and 1989-1992).' },

  { era:'1970s', q:'Which economic philosophy did Michael Manley\'s government adopt in the mid-1970s?',
    a:'Democratic socialism',
    choices:['Free-market capitalism','Democratic socialism','Communism','Mercantilism'],
    fact:'Manley declared a democratic-socialist programme in 1974, with land reform, free secondary education and ties to non-aligned states.' },

  { era:'1970s', q:'At which 1978 concert did Bob Marley join the hands of rival politicians Michael Manley and Edward Seaga?',
    a:'The One Love Peace Concert',
    choices:['Reggae Sunsplash','The One Love Peace Concert','Sting','The Jamaica Independence Festival'],
    fact:'On 22 April 1978 at the National Stadium, Marley clasped the hands of his political rivals during a performance of "Jamming" — an iconic moment in Jamaican history.' },

  { era:'1970s', q:'Jamaica was a founding member of CARICOM, the Caribbean Community, established in what year?',
    a:'1973',
    choices:['1968','1973','1980','1989'],
    fact:'CARICOM was established by the Treaty of Chaguaramas, signed by Jamaica, Trinidad and Tobago, Barbados and Guyana on 4 July 1973.' },

  { era:'1980s', q:'Edward Seaga became Prime Minister after winning the election of which year?',
    a:'1980',
    choices:['1976','1980','1983','1989'],
    fact:'Seaga\'s JLP won a landslide in the October 1980 election against Michael Manley\'s PNP, ending the first Manley era.' },

  { era:'1980s', q:'Bob Marley died in what year?',
    a:'1981',
    choices:['1979','1981','1983','1985'],
    fact:'Bob Marley died of cancer in Miami on 11 May 1981, aged 36. His state funeral in Kingston was attended by tens of thousands.' },

  { era:'1980s', q:'Hurricane Gilbert devastated Jamaica in what year?',
    a:'1988',
    choices:['1980','1985','1988','1995'],
    fact:'Gilbert struck on 12 September 1988 — the strongest hurricane to hit Jamaica in the 20th century. It damaged or destroyed roughly 80% of homes.' },

  { era:'1990s', q:'P.J. Patterson became Prime Minister in what year?',
    a:'1992',
    choices:['1989','1992','1995','2000'],
    fact:'Patterson took over as PM in March 1992 after Michael Manley resigned for health reasons, and went on to win three general elections.' },

  { era:'1990s', q:'Bob Marley was posthumously inducted into the Rock and Roll Hall of Fame in which year?',
    a:'1994',
    choices:['1984','1990','1994','2001'],
    fact:'Marley was inducted in 1994 — the first reggae artist to receive the honour.' },

  { era:'1990s', q:'In which year did Jamaica\'s "Reggae Boyz" qualify for the FIFA World Cup for the first time?',
    a:'1998',
    choices:['1994','1998','2002','2006'],
    fact:'Jamaica reached the 1998 World Cup in France — the first English-speaking Caribbean nation ever to qualify.' },

  { era:'2000s', q:'Portia Simpson-Miller became Jamaica\'s first female Prime Minister in what year?',
    a:'2006',
    choices:['2000','2006','2010','2012'],
    fact:'Portia Simpson-Miller succeeded P.J. Patterson in March 2006. She returned for a second term from 2012 to 2016.' },

  { era:'2000s', q:'Hurricane Ivan struck Jamaica in what year?',
    a:'2004',
    choices:['1999','2004','2007','2010'],
    fact:'Ivan caused widespread damage on 10-11 September 2004, killing 17 people and leaving hundreds of thousands without power.' },

  { era:'2000s', q:'At which Olympics did Usain Bolt first win Olympic gold?',
    a:'Beijing 2008',
    choices:['Athens 2004','Beijing 2008','London 2012','Sydney 2000'],
    fact:'Bolt won the 100m, 200m and 4x100m relay at Beijing 2008 — all three in world-record times.' },

  { era:'2010s', q:'The Tivoli Gardens incursion took place in which year?',
    a:'2010',
    choices:['2007','2010','2011','2012'],
    fact:'The May 2010 security operation to apprehend Christopher "Dudus" Coke was one of the most controversial events in modern Jamaican history.' },

  { era:'2010s', q:'Andrew Holness first became Prime Minister in which year?',
    a:'2011',
    choices:['2007','2011','2012','2016'],
    fact:'Holness briefly served as PM in October 2011 after Bruce Golding resigned. He returned to office in 2016.' },

  { era:'2010s', q:'What major celebration did Jamaica observe in 2012?',
    a:'The 50th anniversary of independence',
    choices:['25 years of independence','The 50th anniversary of independence','100 years of universal suffrage','75 years of the JLP'],
    fact:'"Jamaica 50" — the golden jubilee of independence — was marked on 6 August 2012, the same year Usain Bolt repeated his sprint sweep at the London Olympics.' },

  { era:'Symbols', q:'What are the colours of the Jamaican national flag?',
    a:'Black, gold and green',
    choices:['Red, green and white','Black, gold and green','Green, white and red','Red, black and yellow'],
    fact:'The flag was designed for independence in 1962. The colours symbolise hardship overcome (black), natural wealth and sunshine (gold) and the lush land (green).' },

  { era:'Symbols', q:'What is Jamaica\'s national flower?',
    a:'Lignum vitae',
    choices:['Hibiscus','Lignum vitae','Bougainvillea','Ackee blossom'],
    fact:'The lignum vitae was named the national flower in 1962. Its hardwood is one of the densest in the world.' }
];

// Pull a question that hasn't been shown yet this session. Returns
// null once every question has been answered — caller then shows the
// "Start over" prompt instead of looping.
function pickQuestion() {
  if (jhPool === null) jhPool = shuffle(TRIVIA);
  if (jhPool.length === 0) return null;
  return jhPool.pop();
}

function showJHComplete() {
  document.getElementById('jh-era').textContent = 'Quiz complete';
  document.getElementById('jh-question').textContent = `🎉 You answered ${jhScore} out of ${jhQ} correctly!`;
  document.getElementById('jh-feedback').textContent = '';
  document.getElementById('jh-feedback').className = 'jh-feedback';
  document.getElementById('jh-fact-box').style.display = 'none';

  const grid = document.getElementById('jh-options');
  grid.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'jh-btn correct';
  btn.textContent = '🔄 Start Over';
  btn.onclick = restartJH;
  grid.appendChild(btn);
}

function restartJH() {
  jhScore = 0;
  jhQ    = 0;
  jhPool = null;
  renderQ();
}

// ── Render ──────────────────────────────────────────────────
function renderQ() {
  const q = pickQuestion();
  if (!q) { showJHComplete(); return; }

  jhQ++;
  document.getElementById('jh-score').textContent = jhScore;
  document.getElementById('jh-qnum').textContent  = jhQ;
  document.getElementById('jh-feedback').textContent = '';
  document.getElementById('jh-feedback').className   = 'jh-feedback';
  document.getElementById('jh-fact-box').style.display = 'none';

  document.getElementById('jh-era').textContent = q.era;
  document.getElementById('jh-question').textContent = q.q;

  const grid = document.getElementById('jh-options');
  grid.innerHTML = '';
  shuffle(q.choices).forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'jh-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn, q.a, q.fact);
    grid.appendChild(btn);
  });
}

function handleAnswer(chosen, btn, correct, fact) {
  document.querySelectorAll('.jh-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('jh-feedback');

  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Correct!';
    fb.className   = 'jh-feedback good';
    jhScore++;
    document.getElementById('jh-score').textContent = jhScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.jh-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    fb.textContent = '❌ Not quite';
    fb.className   = 'jh-feedback bad';
  }

  // Show the fact and pause long enough for the player to read it
  document.getElementById('jh-fact-text').textContent = fact;
  document.getElementById('jh-fact-box').style.display = 'block';

  setTimeout(renderQ, 9000);
}

document.addEventListener('DOMContentLoaded', () => {
  jhScore = 0;
  jhQ     = 0;
  jhPool  = null;
  renderQ();
});
