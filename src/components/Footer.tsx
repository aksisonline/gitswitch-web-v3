'use client'
import { Link } from '@tanstack/react-router'
import { VERSION } from '../generated/meta'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="prompt">$</span> gitswitch <span className="star">✦</span>
          </div>
          <p className="footer-tag">
            Git identity manager. Switch name, email, SSH key, GPG signing, and
            GitHub account — instantly.
          </p>
          <p className="footer-meta">
            <span>{VERSION}</span> · Apache-2.0 · made by{' '}
            <a href="https://abhiramkanna.com" target="_blank" rel="noreferrer">
              Abhiram Kanna
            </a>
          </p>
          <a
            href="https://nicklaunches.com/products/gitswitch/?utm_source=gitswitch.dev&utm_medium=badge&utm_campaign=featured"
            target="_blank"
            rel="noopener"
            className="footer-badge"
          >
            <img
              src="https://nicklaunches.com/badges/featured-dark.png"
              alt="gitswitch on Nick Launches"
              width={244}
              height={56}
            />
          </a>
        </div>
        <div className="footer-links">
          <div>
            <h4>docs</h4>
            <Link to="/docs/$" params={{ _splat: 'intro' }}>
              introduction
            </Link>
            <Link to="/docs/$" params={{ _splat: 'installation' }}>
              installation
            </Link>
            <Link to="/docs/$" params={{ _splat: 'cli/commands' }}>
              cli reference
            </Link>
          </div>
          <div>
            <h4>project</h4>
            <a
              href="https://github.com/aksisonline/gitswitch"
              target="_blank"
              rel="noreferrer"
            >
              github
            </a>
            <a
              href="https://github.com/aksisonline/gitswitch/releases"
              target="_blank"
              rel="noreferrer"
            >
              releases
            </a>
            <Link to="/privacy">privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}