'use client'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { THEMES, type Theme } from '../lib/themes'
import { useTheme } from '../lib/theme-context'

type Profile = { nick: string; name: string; email: string; active: boolean }
type Mode = 'list' | 'add' | 'help'

type State = {
  tab: number
  cursor: number
  mode: Mode
  statusMsg: string
  addForm: { nick: string; name: string; email: string }
  addField: number
  profiles: Array<Profile>
  pinnedNick: string | null
  utilFocus: number
  shellEnabled: boolean
  sessionEnabled: boolean
  credEnabled: boolean
  settingsFocus: number
}

const INITIAL: State = {
  tab: 0,
  cursor: 1,
  mode: 'list',
  statusMsg: '',
  addForm: { nick: '', name: '', email: '' },
  addField: 0,
  profiles: [
    { nick: 'default', name: 'User', email: 'user@default.com', active: false },
    { nick: 'aksisonline', name: 'AKS', email: 'user@gmail.com', active: true },
    { nick: 'work', name: 'AKS Work', email: 'user@company.com', active: false },
  ],
  pinnedNick: null,
  utilFocus: 0,
  shellEnabled: true,
  sessionEnabled: true,
  credEnabled: true,
  settingsFocus: 0,
}

function pad(s: string, n: number) {
  return s.length >= n ? s : s + ' '.repeat(n - s.length)
}

function renderTabBar(s: State, t: Theme) {
  const tabs = ['Accounts', 'Utilities', 'Settings']
  const parts = tabs.map(
    (label, i) =>
      `<span data-tab="${i}" style="cursor:pointer;${
        i === s.tab
          ? `background:${t.accent};color:${t.bg};font-weight:700;`
          : `color:${t.muted};`
      }padding:.05rem .5rem">${label}</span>`,
  )
  return `<div style="margin-bottom:.7rem">${parts.join(
    `<span style="color:${t.border}">·</span>`,
  )}</div>`
}

function renderHeader(t: Theme) {
  return `<div style="color:${t.muted};margin-bottom:.5rem">
  <span style="color:${t.accent};font-weight:700">  ✦  Git-Switcher</span><br>
     identity manager for git
</div>`
}

function renderAccounts(s: State, t: Theme) {
  const rows = s.profiles
    .map((p, i) => {
      const isCursor = i === s.cursor
      const pointer = isCursor ? `<span style="color:${t.cursor}">❯</span>` : ' '
      const mark = p.active
        ? `<span style="color:${t.check}">✓</span>`
        : `<span style="color:${t.muted}">·</span>`
      const nameC = isCursor ? t.accent : p.active ? t.check : t.text
      const bold = isCursor ? 'font-weight:700' : ''
      const isPinned = p.nick === s.pinnedNick
      let pin = ''
      if (isPinned) {
        pin = s.sessionEnabled
          ? ` <span style="color:${t.check}">●</span>`
          : ` <span style="color:${t.muted}" title="Session Isolation is off">●</span>`
      }
      return `  <div data-row="${i}" style="cursor:pointer;${bold}">${pointer} ${mark} <span style="color:${nameC}">${pad(
        p.nick,
        14,
      )}</span>${pin} <span style="color:${t.muted}">${p.email}</span></div>`
    })
    .join('\n')
  const current = s.profiles.find((p) => p.active)
  const pinNote =
    s.pinnedNick && !s.sessionEnabled
      ? `<div style="color:${t.muted};font-size:.68rem;margin-top:.35rem">pin on <span style="color:${t.text}">${s.pinnedNick}</span> is inactive — Session Isolation is off (Utilities tab)</div>`
      : ''
  const status = s.statusMsg
    ? `<div style="color:${t.check};font-size:.75rem;margin-top:.35rem">●  ${s.statusMsg}</div>`
    : ''
  return `
${renderHeader(t)}${renderTabBar(s, t)}
<div style="color:${t.muted};margin-bottom:.6rem">
  <span style="color:${t.text}">Current</span>  <span style="color:${t.muted}">${
    current ? current.nick : '?'
  }</span>  ·  <span style="color:${t.accent}">${current ? current.email : ''}</span>
</div>
<div style="border-top:1px solid ${t.border};margin:.5rem 0"></div>
${rows}
${pinNote}
${status}
<div style="border-top:1px solid ${t.border};margin:.65rem 0"></div>
<div style="color:${t.muted};font-size:.7rem;line-height:1.8">
  <span style="color:${t.text}">↑↓</span> navigate  ·  <span style="color:${t.text}">enter</span> switch  ·  <span style="color:${t.text}">p</span> pin  ·  <span style="color:${t.text}">a</span> add<br>
  <span style="color:${t.text}">e</span> edit  ·  <span style="color:${t.text}">?</span> cli tips  ·  <span style="color:${t.text}">1-3</span> tabs / click  ·  <span style="color:${t.text}">q</span> quit
</div>`
}

function renderUtilities(s: State, t: Theme) {
  const items = [
    {
      title: 'Shell Integration',
      desc: 'Auto-switch identity when you cd into a pinned repo.',
      on: s.shellEnabled,
    },
    {
      title: 'Session Isolation',
      desc: "Isolates this repo's git identity + gh account. Required for pins to take effect.",
      on: s.sessionEnabled,
    },
    {
      title: 'HTTPS Credential Helper',
      desc: "Route HTTPS git pushes through the active profile's gh account.",
      on: s.credEnabled,
    },
  ]
  const boxes = items
    .map((item, i) => {
      const focused = i === s.utilFocus
      const border = focused ? t.accent : t.border
      const toggle = item.on
        ? `<span style="color:${t.check}">●  on</span>`
        : `<span style="color:${t.muted}">○  off</span>`
      const titleC = focused ? t.accent : t.text
      return `<div data-util="${i}" style="cursor:pointer;border:1px solid ${border};padding:.5rem .7rem;margin-bottom:.5rem">
  <div style="display:flex;justify-content:space-between;color:${titleC};font-weight:${
    focused ? 700 : 400
  }">${item.title}<span>${toggle}</span></div>
  <div style="color:${t.muted};font-size:.72rem;margin-top:.15rem">${item.desc}</div>
</div>`
    })
    .join('')
  return `
${renderHeader(t)}${renderTabBar(s, t)}
${boxes}
<div style="border-top:1px solid ${t.border};margin:.5rem 0"></div>
<div style="color:${t.muted};font-size:.7rem;line-height:1.8">
  <span style="color:${t.text}">↑↓</span> navigate  ·  <span style="color:${t.text}">enter</span> toggle  ·  <span style="color:${t.text}">1-3</span> tabs / click  ·  <span style="color:${t.text}">q</span> quit
</div>`
}

function renderSettings(s: State, t: Theme, themeIdx: number) {
  const border = (i: number) => (s.settingsFocus === i ? t.accent : t.border)
  const titleC = (i: number) => (s.settingsFocus === i ? t.accent : t.text)
  return `
${renderHeader(t)}${renderTabBar(s, t)}
<div data-settings="0" style="cursor:pointer;border:1px solid ${border(0)};padding:.5rem .7rem;margin-bottom:.5rem">
  <div style="display:flex;justify-content:space-between;color:${titleC(0)};font-weight:${
    s.settingsFocus === 0 ? 700 : 400
  }">Config Location<span style="color:${t.accent}">[✎ edit]</span></div>
  <div style="color:${t.muted};font-size:.72rem;margin-top:.15rem">~/.config/gitswitch/config.yaml</div>
</div>
<div data-settings="1" style="cursor:pointer;border:1px solid ${border(1)};padding:.5rem .7rem;margin-bottom:.5rem">
  <div style="display:flex;justify-content:space-between;color:${titleC(1)};font-weight:${
    s.settingsFocus === 1 ? 700 : 400
  }">Theme<span>← →</span></div>
  <div style="color:${t.text};font-size:.72rem;margin-top:.15rem">${THEMES[themeIdx].name}  (${
    themeIdx + 1
  }/${THEMES.length})</div>
</div>
<div data-settings="2" style="cursor:pointer;border:1px solid ${border(2)};padding:.5rem .7rem;margin-bottom:.5rem">
  <div style="display:flex;justify-content:space-between;color:${titleC(2)};font-weight:${
    s.settingsFocus === 2 ? 700 : 400
  }">Shell Alias<span style="color:${t.accent}">[✎ rename]</span></div>
  <div style="color:${t.check};font-size:.72rem;margin-top:.15rem">●  gs</div>
</div>
<div style="border-top:1px solid ${t.border};margin:.5rem 0"></div>
<div style="color:${t.muted};font-size:.7rem;line-height:1.8">
  <span style="color:${t.text}">↑↓</span> navigate  ·  <span style="color:${t.text}">← →</span> cycle theme  ·  <span style="color:${t.text}">1-3</span> tabs / click  ·  <span style="color:${t.text}">q</span> quit
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
  | { type: 'tab'; tab: number }
  | { type: 'nav'; delta: number }
  | { type: 'cursor'; value: number }
  | { type: 'switch' }
  | { type: 'switch-idx'; value: number }
  | { type: 'toggle-pin' }
  | { type: 'util-nav'; delta: number }
  | { type: 'util-focus'; value: number }
  | { type: 'util-toggle' }
  | { type: 'util-click'; value: number }
  | { type: 'settings-nav'; delta: number }
  | { type: 'settings-focus'; value: number }
  | { type: 'mode'; mode: Mode }
  | { type: 'add-set'; field: number; form: { nick: string; name: string; email: string } }
  | { type: 'add-key'; key: string }

function toggleUtil(s: State, idx: number): State {
  if (idx === 0) return { ...s, shellEnabled: !s.shellEnabled }
  if (idx === 1) return { ...s, sessionEnabled: !s.sessionEnabled }
  return { ...s, credEnabled: !s.credEnabled }
}

function switchTo(s: State, cursor: number): State {
  const profiles = s.profiles.map((p, i) => ({ ...p, active: i === cursor }))
  return { ...s, cursor, profiles, statusMsg: `switched to ${s.profiles[cursor].nick}` }
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'tab':
      return { ...s, tab: a.tab, statusMsg: '' }
    case 'nav':
      return {
        ...s,
        cursor: (s.cursor + a.delta + s.profiles.length) % s.profiles.length,
        statusMsg: '',
      }
    case 'cursor':
      return { ...s, cursor: a.value }
    case 'switch':
      return switchTo(s, s.cursor)
    case 'switch-idx':
      return switchTo(s, a.value)
    case 'toggle-pin': {
      const nick = s.profiles[s.cursor].nick
      const pinnedNick = s.pinnedNick === nick ? null : nick
      // Pinning turns Session Isolation on automatically, same as the real CLI.
      return { ...s, pinnedNick, sessionEnabled: pinnedNick ? true : s.sessionEnabled }
    }
    case 'util-nav':
      return { ...s, utilFocus: (s.utilFocus + a.delta + 3) % 3 }
    case 'util-focus':
      return { ...s, utilFocus: a.value }
    case 'util-toggle':
      return toggleUtil(s, s.utilFocus)
    case 'util-click':
      return toggleUtil({ ...s, utilFocus: a.value }, a.value)
    case 'settings-nav':
      return { ...s, settingsFocus: Math.max(0, Math.min(2, s.settingsFocus + a.delta)) }
    case 'settings-focus':
      return { ...s, settingsFocus: a.value }
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
  const { idx, cycle, setIdx } = useTheme()
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
      if (state.mode === 'help') {
        if (e.key === 'Escape' || e.key === 'q' || e.key === '?')
          dispatch({ type: 'mode', mode: 'list' })
        e.preventDefault()
        return
      }

      if (e.key === '1' || e.key === '2' || e.key === '3') {
        dispatch({ type: 'tab', tab: Number(e.key) - 1 })
        e.preventDefault()
        return
      }
      if (e.key === 'q' || e.key === 'Escape') {
        win.blur()
        return
      }

      if (state.tab === 1) {
        switch (e.key) {
          case 'ArrowUp':
          case 'k':
            dispatch({ type: 'util-nav', delta: -1 })
            e.preventDefault()
            break
          case 'ArrowDown':
          case 'j':
            dispatch({ type: 'util-nav', delta: 1 })
            e.preventDefault()
            break
          case 'Enter':
            dispatch({ type: 'util-toggle' })
            e.preventDefault()
            break
        }
        return
      }
      if (state.tab === 2) {
        switch (e.key) {
          case 'ArrowUp':
          case 'k':
            dispatch({ type: 'settings-nav', delta: -1 })
            e.preventDefault()
            break
          case 'ArrowDown':
          case 'j':
            dispatch({ type: 'settings-nav', delta: 1 })
            e.preventDefault()
            break
          case 'ArrowLeft':
            setIdx((idx - 1 + THEMES.length) % THEMES.length)
            e.preventDefault()
            break
          case 'ArrowRight':
            cycle()
            e.preventDefault()
            break
        }
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
        case 'p':
          dispatch({ type: 'toggle-pin' })
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
      }
    },
    [state.mode, state.tab, idx, cycle, setIdx],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  // Mouse: hover moves focus only (mirrors the real TUI's mouse-motion handling);
  // click performs the action, matching handleMouse in internal/tui/update.go.
  const onBodyOver = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.mode !== 'list') return
      const el = e.target as HTMLElement
      const row = el.closest<HTMLElement>('[data-row]')
      if (row) {
        dispatch({ type: 'cursor', value: Number(row.dataset.row) })
        return
      }
      const util = el.closest<HTMLElement>('[data-util]')
      if (util) {
        dispatch({ type: 'util-focus', value: Number(util.dataset.util) })
        return
      }
      const settings = el.closest<HTMLElement>('[data-settings]')
      if (settings) {
        dispatch({ type: 'settings-focus', value: Number(settings.dataset.settings) })
      }
    },
    [state.mode],
  )

  const onBodyClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      winRef.current?.focus()
      if (state.mode !== 'list') return
      const el = e.target as HTMLElement
      const tabEl = el.closest<HTMLElement>('[data-tab]')
      if (tabEl) {
        dispatch({ type: 'tab', tab: Number(tabEl.dataset.tab) })
        return
      }
      const row = el.closest<HTMLElement>('[data-row]')
      if (row) {
        dispatch({ type: 'switch-idx', value: Number(row.dataset.row) })
        return
      }
      const util = el.closest<HTMLElement>('[data-util]')
      if (util) {
        dispatch({ type: 'util-click', value: Number(util.dataset.util) })
        return
      }
      const settingsEl = el.closest<HTMLElement>('[data-settings]')
      if (settingsEl) {
        const i = Number(settingsEl.dataset.settings)
        dispatch({ type: 'settings-focus', value: i })
        // Click on the Theme box does what arrow-right does: cycle forward.
        if (i === 1) cycle()
      }
    },
    [state.mode, cycle],
  )

  let html = ''
  if (state.mode === 'help') html = renderHelp(t)
  else if (state.mode === 'add') html = renderAdd(state, t)
  else if (state.tab === 1) html = renderUtilities(state, t)
  else if (state.tab === 2) html = renderSettings(state, t, idx)
  else html = renderAccounts(state, t)

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
        <div
          className="tui-body"
          onMouseOver={onBodyOver}
          onClick={onBodyClick}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div className={`tui-hint${focused ? ' tui-hint--active' : ''}`}>
        {focused
          ? <>active · <kbd>1-3</kbd> tabs · <kbd>↑↓</kbd> nav · <kbd>↵</kbd> switch/toggle · click anything · <kbd>esc</kbd> exit</>
          : <>click or tab to interact · try <kbd>1-3</kbd> <kbd>↑↓</kbd> <kbd>↵</kbd></>
        }
      </div>
    </div>
  )
}
