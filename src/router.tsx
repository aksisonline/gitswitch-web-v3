import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// A deploy replaces the hashed chunks, so a tab opened before it 404s on lazy
// routes ("Failed to fetch dynamically imported module"). Reload once to pick
// up the new build; the guard stops a loop if the chunk is genuinely missing.
if (typeof window !== 'undefined') {
  setTimeout(() => {
    try {
      sessionStorage.removeItem('chunk-reload')
    } catch {}
  }, 10_000)
  window.addEventListener('vite:preloadError', (e) => {
    try {
      if (sessionStorage.getItem('chunk-reload')) return
      sessionStorage.setItem('chunk-reload', '1')
    } catch {
      return
    }
    e.preventDefault()
    window.location.reload()
  })
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
