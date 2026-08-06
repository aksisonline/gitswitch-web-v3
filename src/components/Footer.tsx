'use client'
import { Link } from '@tanstack/react-router'
import { VERSION } from '../generated/meta'
import BuyMeACoffeeButton from './BuyMeACoffeeButton'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="prompt">$</span> gitswitch <span className="star">✦</span>
          </div>
          <p className="footer-tag">
            Run multiple GitHub accounts in parallel on the same machine — plus name,
            email, SSH key, and GPG signing, switched instantly.
          </p>
          <p className="footer-meta">
            <span>{VERSION}</span> · Apache-2.0 · made by{' '}
            <a href="https://abhiramkanna.com" target="_blank" rel="noreferrer">
              Abhiram Kanna
            </a>
          </p>
          <div className="footer-badges">
            <a
              href="https://nicklaunches.com/products/gitswitch/?utm_source=gitswitch.dev&utm_medium=badge&utm_campaign=featured"
              target="_blank"
              rel="noopener"
              className="footer-badge"
            >
              <img
                src="https://nicklaunches.com/badges/featured-dark.png"
                alt="gitswitch on Nick Launches"
                width={150}
                height={34}
              />
            </a>
            <BuyMeACoffeeButton />
          </div>
        </div>
        <div className="footer-links">
          <div>
            <h4>docs</h4>
            <Link to="/docs/$" params={{ _splat: 'get-started/intro' }}>
              introduction
            </Link>
            <Link to="/docs/$" params={{ _splat: 'get-started/installation' }}>
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