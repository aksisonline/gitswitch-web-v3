'use client'
import { useEffect, useReducer } from 'react'

// Arcade boot/POST sequence. Types a handful of system-check lines, then a
// READY prompt. Plays once per session (not per nav). Reduced-motion users get
// the final state instantly. Decorative — hidden from a11y tree.
const LINES = [
  { t: 'gitswitch boot', c: 'accent' },
  { t: 'loading identity store ........ OK', c: 'check' },
  { t: 'mounting ssh keyring .......... OK', c: 'check' },
  { t: 'verifying gpg signatures ...... OK', c: 'check' },
  { t: 'syncing github auth ........... OK', c: 'check' },
  { t: 'READY.', c: 'accent' },
]

type State = { line: number; col: number; done: boolean }
type Action = { type: 'tick' } | { type: 'finish' }

function reducer(s: State, a: Action): State {
  if (a.type === 'finish') return { line: LINES.length, col: 0, done: true }
  if (s.done) return s
  const cur = LINES[s.line]
  if (!cur) return { ...s, done: true }
  if (s.col < cur.t.length) return { ...s, col: s.col + 1 }
  if (s.line + 1 >= LINES.length) return { ...s, line: s.line + 1, done: true }
  return { line: s.line + 1, col: 0, done: false }
}

const SESSION_KEY = 'gitswitch:booted'

export default function BootSequence({ onDone }: { onDone?: () => void }) {
  const seen = (() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      return false
    }
  })()
  const [state, dispatch] = useReducer(reducer, { line: 0, col: 0, done: seen })

  useEffect(() => {
    if (seen) {
      onDone?.()
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      dispatch({ type: 'finish' })
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignore */
      }
      onDone?.()
      return
    }
    const id = window.setInterval(() => dispatch({ type: 'tick' }), 18)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state.done) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignore */
      }
      onDone?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.done])

  if (seen) return null

  const rows = LINES.map((l, i) => {
    if (i > state.line) return null
    const txt = i === state.line && !state.done ? l.t.slice(0, state.col) : l.t
    const showCursor = i === state.line && !state.done
    return (
      <div className="boot-line" key={i}>
        <span className="boot-tic">{l.c === 'check' ? '›' : '✦'}</span>{' '}
        <span className={`boot-${l.c}`}>{txt}</span>
        {showCursor && <span className="boot-cursor">▋</span>}
      </div>
    )
  })

  return (
    <div className="boot-seq" aria-hidden="true">
      {rows}
    </div>
  )
}
