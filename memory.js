// games/memory.js
const memEmojis = ['🍎','🌸','🐶','⭐','🎵','🌈','🐱','🦋'];
let memFlipped = [], memMatched = 0, memLocked = false;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initMemory() {
  memFlipped = []; memMatched = 0; memLocked = false;
  document.getElementById('mem-pairs').textContent = '0';
  document.getElementById('mem-instruction').textContent = 'Tap two cards to find a match!';
  const cards = shuffle([...memEmojis, ...memEmojis]);
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  cards.forEach(e => {
    const c = document.createElement('div');
    c.className = 'mem-card';
    c.dataset.e = e;
    c.innerHTML = '❓';
    c.onclick = () => flipCard(c);
    grid.appendChild(c);
  });
}

function flipCard(card) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.innerHTML = card.dataset.e;
  memFlipped.push(card);
  if (memFlipped.length === 2) {
    memLocked = true;
    const [a, b] = memFlipped;
    if (a.dataset.e === b.dataset.e) {
      a.classList.add('matched'); b.classList.add('matched');
      memMatched++;
      document.getElementById('mem-pairs').textContent = memMatched;
      document.getElementById('mem-instruction').textContent =
        memMatched === 8 ? '🎉 All matched! Amazing!' : `Great match! Keep going! (${memMatched}/8)`;
      memFlipped = []; memLocked = false;
      if (memMatched === 8) {
        setTimeout(() => {
          document.getElementById('res-emoji').textContent = '🏆';
          document.getElementById('res-title').textContent = 'You Did It!';
          document.getElementById('res-score').textContent = 'You matched all 8 pairs!';
          document.getElementById('result-overlay').classList.add('show');
        }, 700);
      }
    } else {
      document.getElementById('mem-instruction').textContent = 'Not a match — try again!';
      setTimeout(() => {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        a.innerHTML = '❓'; b.innerHTML = '❓';
        memFlipped = []; memLocked = false;
        document.getElementById('mem-instruction').textContent = 'Tap two cards to find a match!';
      }, 1100);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMemory();
  document.getElementById('res-play-again').onclick = () => {
    document.getElementById('result-overlay').classList.remove('show');
    initMemory();
  };
});
