'use client'
import { useEffect, useRef, useState } from 'react'
import { THEMES, applyTheme } from '../lib/themes'

// Konami code → matrix cascade + neon (Synthwave) palette. Discoverable, never
// intrusive, fully dismissible (Esc). Mirrors the planned TUI `:konami` moment.
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export default function EasterEggs() {
  const [active, setActive] = useState(false)
  const seq = useRef<Array<string>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActive(false)
        return
      }
      seq.current.push(e.key)
      if (seq.current.length > KONAMI.length) seq.current.shift()
      if (
        seq.current.length === KONAMI.length &&
        seq.current.every((k, i) => k.toLowerCase() === KONAMI[i].toLowerCase())
      ) {
        seq.current = []
        const synth = THEMES.findIndex((t) => t.name === 'Synthwave')
        if (synth >= 0) applyTheme(THEMES[synth])
        setActive(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Matrix rain.
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const glyphs = 'gitswitch✦01アイウエオ$❯◖'
    const fontSize = 16
    let cols = Math.floor(canvas.width / fontSize)
    let drops = new Array(cols).fill(1)
    let raf = 0
    function draw() {
      if (!ctx) return
      ctx.fillStyle = 'rgba(10,10,18,0.08)'
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)
      ctx.fillStyle = '#ff7edb'
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
      cols = Math.floor(canvas!.width / fontSize)
      if (drops.length !== cols) drops = new Array(cols).fill(1)
      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[(glyphs.length * Math.random()) | 0]
        ctx.fillStyle = Math.random() > 0.92 ? '#36f9f6' : '#ff7edb'
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const auto = window.setTimeout(() => setActive(false), 9000)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.clearTimeout(auto)
    }
  }, [active])

  if (!active) return null
  return (
    <div
      onClick={() => setActive(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10,10,18,0.55)',
        cursor: 'pointer',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          textAlign: 'center',
          color: '#36f9f6',
          fontFamily: "'JetBrains Mono', monospace",
          textShadow: '0 0 12px #ff7edb',
          userSelect: 'none',
        }}
      >
        <div style={{ fontSize: '2rem', fontWeight: 700 }}>✦ neon unlocked</div>
        <div style={{ fontSize: '.8rem', marginTop: '.5rem', opacity: 0.8 }}>
          you found the konami code · press esc / click to dismiss
        </div>
      </div>
    </div>
  )
}