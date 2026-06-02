'use client'
import { Link } from '@tanstack/react-router'
import { useTheme } from '../lib/theme-context'

export default function Header() {
  const { name, cycle } = useTheme()
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="prompt">$</span>
        <span>gitswitch</span>
        <span className="star">✦</span>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/" hash="features">
            features
          </Link>
        </li>
        <li>
          <Link to="/" hash="install">
            install
          </Link>
        </li>
        <li>
          <Link to="/docs/$" params={{ _splat: 'intro' }}>
            docs
          </Link>
        </li>
        <li>
          <Link to="/" hash="roadmap">
            roadmap
          </Link>
        </li>
      </ul>
      <div className="nav-right">
<button
          className="theme-tag"
          onClick={cycle}
          title="Cycle theme (press c)"
          aria-label="Cycle color theme"
        >
          theme · <b>{name}</b>
        </button>
        <a
          className="nav-btn"
          href="https://github.com/aksisonline/gitswitch"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </nav>
  )
}