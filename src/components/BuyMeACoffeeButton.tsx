'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    bmcBtnWidget?: (
      text: string,
      slug: string,
      bgColor: string,
      emoji: string,
      font: string,
      fontColor?: string,
      outlineColor?: string,
      coffeeColor?: string,
    ) => string
  }
}

// Colors are passed as CSS custom properties (var(--accent) etc.) rather than
// hex values — the widget bakes them into a literal <style> block, so this is
// what makes the button repaint automatically when the theme cycles.
export default function BuyMeACoffeeButton() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const render = () => {
      if (!ref.current || !window.bmcBtnWidget) return
      ref.current.innerHTML = window.bmcBtnWidget(
        'Buy me a coffee',
        'aksisonline',
        'var(--accent)',
        '',
        'Cookie',
        'var(--bg)',
        'var(--border)',
        'var(--bg)',
      )
    }
    if (window.bmcBtnWidget) {
      render()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'
    script.onload = render
    document.body.appendChild(script)
  }, [])

  return <div ref={ref} className="bmc-button-slot" />
}
