'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  STORAGE_KEY,
  THEMES,
  applyTheme,
  getStoredThemeIdx,
  setStoredThemeIdx,
} from './themes'

type ThemeCtx = {
  idx: number
  name: string
  setIdx: (i: number) => void
  cycle: () => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [idx, setIdxState] = useState(0)

  const setIdx = useCallback((i: number) => {
    const next = ((i % THEMES.length) + THEMES.length) % THEMES.length
    setIdxState(next)
    applyTheme(THEMES[next])
    setStoredThemeIdx(next)
  }, [])

  const cycle = useCallback(() => setIdx(getStoredThemeIdx() + 1), [setIdx])

  // Hydrate from storage (theme vars were already applied by the head script).
  useEffect(() => {
    setIdxState(getStoredThemeIdx())
  }, [])

  // Global `c` cycles theme (ignore inputs / modifier combos).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key !== 'c' && e.key !== 'C') return
      const tag = (e.target as HTMLElement | null)?.tagName ?? ''
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.target as HTMLElement | null)?.isContentEditable) return
      cycle()
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cycle])

  // Cross-tab sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || e.newValue === null) return
      const n = parseInt(e.newValue, 10)
      if (!isNaN(n) && n >= 0 && n < THEMES.length) {
        setIdxState(n)
        applyTheme(THEMES[n])
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <Ctx.Provider value={{ idx, name: THEMES[idx].name, setIdx, cycle }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}