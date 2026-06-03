'use client'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'gitswitch:crt'

// Theme-aware CRT layer: scanlines + vignette + subtle flicker. Pure arcade-
// cabinet dressing — toggleable (press `v`), persisted, off by default so it
// never surprises. Sits above content via fixed overlay, pointer-events:none.
export default function CrtOverlay() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    try {
      setOn(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      /* ignore */
    }
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const el = document.activeElement
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || el?.id === 'tui') return
      if (e.key === 'v') {
        setOn((p) => {
          const next = !p
          try {
            localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
          } catch {
            /* ignore */
          }
          return next
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('crt', on)
    return () => document.documentElement.classList.remove('crt')
  }, [on])

  if (!on) return null
  return (
    <div className="crt-overlay" aria-hidden="true">
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="crt-flicker" />
    </div>
  )
}
