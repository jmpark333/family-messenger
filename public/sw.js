/**
 * Service Worker for PWA
 * 오프라인 지원 및 캐싱 전략
 */

const CACHE_NAME = 'family-messenger-v1';
const STATIC_CACHE = 'family-messenger-static-v1';

// 캐싱할 정적 자원
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        // 개별 요청으로 캐싱하여 실패해도 계속 진행
        for (const asset of STATIC_ASSETS) {
          try {
            await cache.add(asset);
            console.log('[SW] Cached:', asset);
          } catch (err) {
            console.warn('[SW] Failed to cache:', asset, err);
          }
        }
        console.log('[SW] Static assets caching completed');
      } catch (error) {
        console.error('[SW] Install error:', error);
      }
    })()
  );

  // 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    (async () => {
      // 오래된 캐시 클리어
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );

      // 클라이언트 컨트롤러 즉시 컨트롤
      self.clients.claim();
    })()
  );
});

// 페치 이벤트
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // HTTP가 아닌 요청은 무시 (예: chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 같은 오리진 내 요청만 처리
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(handleRequest(request));
});

/**
 * 요청 처리
 */
async function handleRequest(request) {
  const url = new URL(request.url);

  // API 요청은 Network First
  if (url.pathname.startsWith('/api/')) {
    return networkFirst(request);
  }

  // 정적 자원은 Cache First
  if (STATIC_ASSETS.some((path) => url.pathname === path || url.pathname.startsWith(path))) {
    return cacheFirst(request, STATIC_CACHE);
  }

  // Next.js 정적 자원 (.js, .css)는 Cache First
  if (url.pathname.match(/\.(js|css|woff2?|ttf|otf)$/)) {
    return cacheFirst(request, CACHE_NAME);
  }

  // 그 외는 Network First
  return networkFirst(request);
}

/**
 * Cache First 전략
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  console.log('[SW] Cache miss, fetching:', request.url);
  const response = await fetch(request);

  // 유효한 응답만 캐싱
  if (response.status === 200) {
    cache.put(request, response.clone());
  }

  return response;
}

/**
 * Network First 전략
 */
async function networkFirst(request) {
  try {
    console.log('[SW] Fetching:', request.url);
    const response = await fetch(request);

    // 캐시 업데이트 (백그라운드)
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(() => {
        // 쿼터 무시 (quota exceeded 등)
      });
    }

    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // 오프라인 폴백
    return new Response(
      JSON.stringify({ error: '오프라인입니다. 네트워크 연결을 확인하세요.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * 메시지 이벤트 리스너 (오프라인 메시지 큐)
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(event.data.urls))
    );
  }
});
