const CACHE_NAME = 'englishmate-v1'
const urlsToCache = [
  '/',
  '/affixes',
  '/reading',
  '/listening',
  '/writing',
  '/grammar',
  '/mistakes',
  '/milestones',
  '/profile',
  '/daily',
  '/diary',
  '/tutor',
  '/couple',
]

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 命中缓存则返回缓存
        if (response) {
          return response
        }
        // 否则发起网络请求
        return fetch(event.request)
      })
  )
})

// 更新 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
