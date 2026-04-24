// sw.js — Service Worker for Mind & Memory PWA
// Uses build timestamp — auto-busts cache on every deploy

const CACHE = 'mind-memory-' + '2026-04-24-001';

const FILES = [
  '/Mind-and-Memory/index.html',
  '/Mind-and-Memory/style.css',
  '/Mind-and-Memory/math.html',
  '/Mind-and-Memory/memory.html',
  '/Mind-and-Memory/wordplay.html',
  '/Mind-and-Memory/patterns.html',
  '/Mind-and-Memory/sudoku.html',
  '/Mind-and-Memory/wordle.html',
  '/Mind-and-Memory/proverbs.html',
  '/Mind-and-Memory/scrabble.html',
  '/Mind-and-Memory/manifest.json',
  '/Mind-and-Memory/icon-192.png',
  '/Mind-and-Memory/icon-512.png',
  '/Mind-and-Memory/games/math.js',
  '/Mind-and-Memory/games/memory.js',
  '/Mind-and-Memory/games/wordplay.js',
  '/Mind-and-Memory/games/patterns.js',
  '/Mind-and-Memory/games/sudoku.js',
  '/Mind-and-Memory/games/wordle.js',
  '/Mind-and-Memory/games/proverbs.js',
  '/Mind-and-Memory/games/scrabble.js'
];

// Install — cache all files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

// Activate — delete ALL old caches, take control immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // take control of all tabs now
  );
});

// Fetch — always try network first for HTML so updates show immediately
// Cache first for JS/CSS/images for fast loading
self.addEventListener('fetch', e => {
  const isHTML = e.request.destination === 'document';
  if (isHTML) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request))
    );
  }
});
