// sw.js — Service Worker for Mind & Memory PWA
// Uses build date as cache key so updates are picked up automatically

const CACHE = 'mind-memory-2026-04-30-001';// ← Claude updates this date on each change

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
  '/Mind-and-Memory/moodmatch.html',
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
  '/Mind-and-Memory/games/scrabble.js',
  '/Mind-and-Memory/games/moodmatch.js'
];

// Install — cache all files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete all old caches, take control immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => {
            console.log('Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first for HTML (always fresh),
//         cache first for JS/CSS/images (fast loading)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isHTML = e.request.destination === 'document';

  if (isHTML) {
    // Always try network first for pages so updates show immediately
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Update cache with fresh copy
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request)) // offline fallback
    );
  } else {
    // Cache first for assets (JS, CSS) — fast load
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request))
    );
  }
});
