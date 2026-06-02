'use client'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { THEMES, type Theme } from '../lib/themes'
import { useTheme } from '../lib/theme-context'

type Profile = { nick: string; name: string; email: string; active: boolean }
type Mode = 'list' | 'add' | 'help' | 'switched'

type State = {
  cursor: number
  mode: Mode
  switchedTo: string
  addForm: { nick: string; name: string; email: string }
  addField: number
  profiles: Array<Profile>
}

const INITIAL: State = {
  cursor: 1,
  mode: 'list',
  switchedTo: '',
  addForm: { nick: '', name: '', email: '' },
  addField: 0,
  profiles: [
    { nick: 'default', name: 'User', email: 'user@default.com', active: false },
    { nick: 'aksisonline', name: 'AKS', email: 'user@gmail.com', active: true },
    { nick: 'work', name: 'AKS Work', email: 'user@company.com', active: false },
  ],
}

function pad(s: string, n: number) {
  return s.length >= n ? s : s + ' '.repeat(n - s.length)
}

function renderList(s: State, t: Theme) {
  const rows = s.profiles
    .map((p, i) => {
      const isCursor = i === s.cursor
      const pointer = isCursor ? `<span style="color:${t.cursor}">❯</span>` : ' '
      const mark = p.active
        ? `<span style="color:${t.check}">✓</span>`
        : `<span style="color:${t.muted}">·</span>`
      const nameC = isCursor ? t.accent : p.active ? t.check : t.text
      const bold = isCursor ? 'font-weight:700' : ''
      return `  <div style="${bold}">${pointer} ${mark} <span style="color:${nameC}">${pad(
        p.nick,
        14,
      )}</span> <span style="color:${t.muted}">${p.email}</span></div>`
    })
    .join('\n')
  const current = s.profiles.find((p) => p.active)
  return `
<div style="color:${t.muted};margin-bottom:.6rem">
  <span style="color:${t.accent};font-weight:700">  ✦  Git-Switcher</span><br>
     identity manager for git<br><br>
  <span style="color:${t.text}">  Current</span>  <span style="color:${t.muted}">${
    current ? current.nick : '?'
  }</span>  ·  <span style="color:${t.accent}">${current ? current.email : ''}</span>
</div>
<div style="border-top:1px solid ${t.border};margin:.5rem 0"></div>
${rows}
<div style="border-top:1px solid ${t.border};margin:.65rem 0"></div>
<div style="color:${t.muted};font-size:.7rem;line-height:1.8">
  <span style="color:${t.text}">↑↓</span> navigate  ·  <span style="color:${t.text}">enter</span> switch  ·  <span style="color:${t.text}">a</span> add<br>
  <span style="color:${t.text}">e</span> edit  ·  <span style="color:${t.text}">?</span> cli tips  ·  <span style="color:${t.text}">c</span> theme  ·  <span style="color:${t.text}">q</span> quit
</div>`
}

function renderSwitched(s: State, t: Theme) {
  const p = s.profiles.find((pr) => pr.nick === s.switchedTo)
  return `
<div style="text-align:center;padding:1.25rem .5rem">
  <div style="color:${t.check};font-size:1.4rem;margin-bottom:.6rem">✓</div>
  <div style="color:${t.title};font-weight:700;font-size:.92rem">Switched to <span style="color:${t.accent}">${s.switchedTo}</span></div><br>
  <div style="color:${t.muted};font-size:.78rem;line-height:2">
    user.name  → <span style="color:${t.text}">${p ? p.name : ''}</span><br>
    user.email → <span style="color:${t.text}">${p ? p.email : ''}</span>
  </div><br>
  <div style="color:${t.muted};font-size:.7rem">press any key to continue</div>
</div>`
}

function renderAdd(s: State, t: Theme) {
  const fields = [
    { label: 'Nickname', key: 'nick' as const },
    { label: 'Full name', key: 'name' as const },
    { label: 'Email', key: 'email' as const },
  ]
  const rows = fields
    .map((f, i) => {
      const isFocus = i === s.addField
      const val = s.addForm[f.key]
      const cursor = isFocus
        ? `<span style="color:${t.cursor};animation:blink 1s step-end infinite">▋</span>`
        : ''
      const labelC = isFocus ? t.accent : t.muted
      const lineC = isFocus ? t.accent : t.border
      return `<div style="margin:.55rem 0">
    <div style="color:${labelC};font-size:.7rem;margin-bottom:.15rem">${f.label}</div>
    <div style="border-bottom:1px solid ${lineC};padding-bottom:.15rem;color:${t.text}">${val}${cursor}</div>
  </div>`
    })
    .join('')
  return `
<div style="color:${t.accent};font-weight:700;margin-bottom:.6rem">  ✦  Add Profile</div>
${rows}
<div style="border-top:1px solid ${t.border};margin:.9rem 0"></div>
<div style="color:${t.muted};font-size:.7rem">
  <span style="color:${t.text}">Tab</span> next  ·  <span style="color:${t.text}">Enter</span> save  ·  <span style="color:${t.text}">Esc</span> cancel
</div>`
}

function renderHelp(t: Theme) {
  const rows = [
    ['gitswitch', 'Open interactive TUI'],
    ['gitswitch work', 'Quick switch to profile'],
    ['gitswitch current', 'Show active identity'],
    ['gitswitch list', 'List all profiles'],
    ['gitswitch add work "Name" e@x.com', 'Add new profile'],
    ['gitswitch install', 'Set up shell integration'],
    ['gitswitch pin work', 'Pin identity to this repo'],
    ['gitswitch version', 'Show version & check updates'],
  ]
    .map(
      ([cmd, desc]) =>
        `<div style="margin:.25rem 0"><span style="color:${t.accent}">${cmd}</span><br>  <span style="color:${t.muted};font-size:.7rem">${desc}</span></div>`,
    )
    .join('')
  return `
<div style="color:${t.accent};font-weight:700;margin-bottom:.6rem">  ✦  CLI Reference</div>
${rows}
<div style="border-top:1px solid ${t.border};margin:.65rem 0"></div>
<div style="color:${t.muted};font-size:.7rem"><span style="color:${t.text}">Esc / q</span> back to list</div>`
}

type Action =
  | { type: 'nav'; delta: number }
  | { type: 'cursor'; value: number }
  | { type: 'switch' }
  | { type: 'mode'; mode: Mode }
  | { type: 'add-set'; field: number; form: { nick: string; name: string; email: string } }
  | { type: 'add-key'; key: string }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'nav':
      return { ...s, cursor: (s.cursor + a.delta + s.profiles.length) % s.profiles.length }
    case 'cursor':
      return { ...s, cursor: a.value }
    case 'switch': {
      const profiles = s.profiles.map((p, i) => ({ ...p, active: i === s.cursor }))
      return { ...s, profiles, switchedTo: s.profiles[s.cursor].nick, mode: 'switched' }
    }
    case 'mode':
      if (a.mode === 'add')
        return { ...s, mode: 'add', addForm: { nick: '', name: '', email: '' }, addField: 0 }
      return { ...s, mode: a.mode }
    case 'add-set':
      return { ...s, addField: a.field, addForm: a.form }
    case 'add-key': {
      const fields = ['nick', 'name', 'email'] as const
      const key = fields[s.addField]
      if (a.key === 'Escape') return { ...s, mode: 'list' }
      if (a.key === 'Tab') return { ...s, addField: (s.addField + 1) % 3 }
      if (a.key === 'Enter') {
        if (s.addField < 2) return { ...s, addField: s.addField + 1 }
        const n = s.addForm
        if (n.nick && n.name && n.email) {
          const profiles = [...s.profiles, { ...n, active: false }]
          return { ...s, profiles, mode: 'list', cursor: profiles.length - 1 }
        }
        return { ...s, mode: 'list' }
      }
      if (a.key === 'Backspace')
        return { ...s, addForm: { ...s.addForm, [key]: s.addForm[key].slice(0, -1) } }
      if (a.key.length === 1 && s.addForm[key].length < 28)
        return { ...s, addForm: { ...s.addForm, [key]: s.addForm[key] + a.key } }
      return s
    }
    default:
      return s
  }
}

export default function TuiWidget() {
  const { idx, cycle } = useTheme()
  const t = THEMES[idx]
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const [focused, setFocused] = useState(false)
  const winRef = useRef<HTMLDivElement>(null)

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      const win = winRef.current
      if (!win || document.activeElement !== win) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (state.mode === 'add') {
        dispatch({ type: 'add-key', key: e.key })
        e.preventDefault()
        return
      }
      if (state.mode === 'switched') {
        dispatch({ type: 'mode', mode: 'list' })
        e.preventDefault()
        return
      }
      if (state.mode === 'help') {
        if (e.key === 'Escape' || e.key === 'q' || e.key === '?')
          dispatch({ type: 'mode', mode: 'list' })
        e.preventDefault()
        return
      }
      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          dispatch({ type: 'nav', delta: -1 })
          e.preventDefault()
          break
        case 'ArrowDown':
        case 'j':
          dispatch({ type: 'nav', delta: 1 })
          e.preventDefault()
          break
        case 'Enter':
          dispatch({ type: 'switch' })
          e.preventDefault()
          break
        case 'c':
          cycle()
          e.preventDefault()
          break
        case 'a':
          dispatch({ type: 'mode', mode: 'add' })
          e.preventDefault()
          break
        case '?':
          dispatch({ type: 'mode', mode: 'help' })
          e.preventDefault()
          break
        case 'q':
        case 'Escape':
          win.blur()
          break
      }
    },
    [state.mode, cycle],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  let html = ''
  if (state.mode === 'help') html = renderHelp(t)
  else if (state.mode === 'add') html = renderAdd(state, t)
  else if (state.mode === 'switched') html = renderSwitched(state, t)
  else html = renderList(state, t)

  return (
    <div className="tui-wrapper">
      <div
        className={`tui-window${focused ? ' focused' : ''}`}
        id="tui"
        ref={winRef}
        tabIndex={0}
        onClick={() => winRef.current?.focus()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div className="tui-titlebar">
          <span className="tui-dot red" />
          <span className="tui-dot yellow" />
          <span className="tui-dot green" />
          <span className="tui-title-text">gitswitch — identity manager</span>
        </div>
        <div className="tui-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className={`tui-hint${focused ? ' tui-hint--active' : ''}`}>
        {focused
          ? <>active · <kbd>↑↓</kbd> nav · <kbd>↵</kbd> switch · <kbd>a</kbd> add · <kbd>c</kbd> theme · <kbd>?</kbd> help · <kbd>esc</kbd> exit</>
          : <>click or tab to interact · try <kbd>↑↓</kbd> <kbd>↵</kbd> <kbd>?</kbd></>
        }
      </div>
    </div>
  )
}