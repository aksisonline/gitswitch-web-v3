import { type ReactNode } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import TuiWidget from '../components/TuiWidget'
import InstallTabs from '../components/InstallTabs'
import InstallList from '../components/InstallList'
import { VERSION } from '../generated/meta'

const FAQ: Array<[string, string]> = [
  [
    'Do I need multiple GitHub accounts to use gitswitch?',
    "No. gitswitch setup checks for git and the GitHub CLI, offers to install whichever's missing, and gitswitch login configures your identity, SSH key, and signing — useful from your very first commit, not just once you have a second account to juggle.",
  ],
  [
    'Is gitswitch beginner-friendly?',
    "Yes — it's the fastest way to set up git for the first time. No SSH keys to generate by hand, nothing to paste into a settings page.",
  ],
  [
    'Does gitswitch install git and the GitHub CLI for me?',
    "It checks whether they're installed and, if not, shows you the exact command and asks to run it for you (brew/apt/dnf/winget depending on your platform). On macOS, git itself comes from Apple's Xcode Command Line Tools — that's a GUI dialog gitswitch can't drive for you, so it shows the command instead of running it; the GitHub CLI still installs automatically there.",
  ],
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: 'https://gitswitch.dev' }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(faqSchema) }],
  }),
  component: Home,
})

const LOGO = String.raw`  ___  _  _      ___        _  _      _
 / __|(_)| |_   / __| __ __ __(_)| |_  __ | |_
| (_ || ||  _|  \__ \ \ V  V /| ||  _|/ _|| ' \
 \___||_| \__|  |___/  \_/\_/ |_| \__|\__||_||_|`

const FEATURES: Array<[string, ReactNode]> = [
  ['one-login setup', <><code>gitswitch login</code> — GitHub device flow creates your profile automatically: name, email, GitHub account, token. No manual config.</>],
  ['commit identity switching', <>Instantly change <code>user.name</code> and <code>user.email</code> in your global git config. No more wrong-email commits.</>],
  ['ssh key management', <>Sets <code>core.sshCommand</code> to force a specific key with <code>IdentitiesOnly=yes</code>, preventing agent fallback.</>],
  ['gpg signing', <>Per-profile GPG — or SSH — signing key. Switch and your verified-commit badge follows the right identity automatically.</>],
  ['session isolation', <>Two terminals, two GitHub accounts, no fighting. Every <code>gh</code> command resolves the right account for its repo on its own — on by default for new installs.</>],
  ['ai coding agent setup', <><code>gitswitch claude</code> installs a Claude Code skill; <code>gitswitch reauthor</code> fixes commits an agent already made under the wrong identity.</>],
]

const ALTERNATIVES: Array<[string, string, ReactNode]> = [
  ['if', 'already using includeIf?', <>Git's <code>includeIf</code> switches <code>user.name</code>/<code>user.email</code> per directory tree — if you keep repos in a strict folder structure and hand-author each conditional block. <Link to="/docs/$" params={{ _splat: 'features/identity-awareness' }}>Identity awareness</Link> does the same job automatically, per repo instead of per folder, then goes further: SSH keys, GPG/SSH signing, <code>gh</code> account, and session isolation across terminals, switched together.</>],
  ['ssh', 'already using SSH host aliases?', <>Hand-maintaining <code>~/.ssh/config</code> host aliases and rewriting remotes per account works, but it's manual and per-machine. gitswitch sets <code>core.sshCommand</code> with <code>IdentitiesOnly=yes</code> per profile — same isolation, switched with the rest of your identity in one command.</>],
  ['cli', 'already using another switcher?', <>Most git account-switcher CLIs stop at commit identity or <code>gh</code> auth. gitswitch adds session isolation (each terminal resolves its own <code>gh</code> account, no shared global state), a mouse-driven TUI, <code>gitswitch reauthor</code> to fix commits already made under the wrong identity, and a Claude Code skill for AI agents.</>],
  ['gui', 'prefer a GUI or IDE extension?', <>Editor-specific switchers only work inside that one editor. gitswitch is terminal-native — the same behavior in your shell, an editor's integrated terminal, or an AI coding agent's sandbox.</>],
]

const COMPARE: Array<[string, string, string]> = [
  ['github api tokens', '✓', '✓ (optional)'],
  ['commit name + email', '✗', '✓'],
  ['ssh key per identity', '✗', '✓'],
  ['gpg signing key', '✗', '✓'],
  ['per-repo auto-switch', '✗', '✓'],
  ['parallel gh accounts (multi-terminal)', '✗ (one global account)', '✓ (session isolation)'],
  ['interactive TUI (mouse + keyboard)', '✗', '✓'],
  ['no runtime deps', '✗', '✓ (single binary)'],
]

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content rise-in">
          <pre className="hero-logo" aria-hidden="true">{LOGO}</pre>
          <div className="hero-badge">{VERSION} · written in go · insert coin</div>
          <h1>
            Git,
            <br />
            <em>done right.</em>
            <span className="blink" />
          </h1>
          <p className="hero-sub">
            <span className="comment"># No more committing with the wrong account.</span>
            <br />Run multiple GitHub accounts in parallel — or set one up for the first time. One command either way.
          </p>
          <div className="hero-actions">
            <a href="#install" className="btn-primary">
              install now
            </a>
            <a
              href="https://github.com/aksisonline/gitswitch"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              view source
            </a>
          </div>
          <InstallTabs />
        </div>
        <TuiWidget />
      </section>

      {/* Start here */}
      <section className="section">
        <div className="section-label">new to git?</div>
        <h2 className="section-title">
          you're one login <em>away</em> from done.
        </h2>
        <p className="section-sub">
          Git is the tool that saves every version of your code as you write it — almost every
          developer uses it, and setting it up usually means a tutorial full of confusing steps.
          Install gitswitch, run <code>gitswitch setup</code> then <code>gitswitch login</code>, and
          you're already set up correctly. No configuration files to edit, no second account required.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="section-label">capabilities</div>
        <h2 className="section-title">
          everything <em>gh auth switch</em>
          <br />
          can't do.
        </h2>
        <p className="section-sub">
          GitHub CLI only manages API tokens. Your commit identity — the name and email
          baked into every commit — is completely separate. gitswitch handles both.
        </p>
        <div className="features-grid">
          {FEATURES.map(([title, desc], i) => (
            <div className="feature-card" key={title}>
              <div className="feature-marker">[{String(i + 1).padStart(2, '0')}]</div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare */}
      <section className="section">
        <div className="section-label">comparison</div>
        <h2 className="section-title">
          vs <em>gh auth switch</em>
        </h2>
        <p className="section-sub">
          Two tools, two different problems. gitswitch handles what the GitHub CLI
          intentionally ignores.
        </p>
        <div className="compare-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>capability</th>
                <th>
                  <code>gh auth switch</code>
                </th>
                <th className="col-gitswitch">
                  <code>gitswitch</code>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([cap, gh, gs]) => (
                <tr key={cap}>
                  <td>{cap}</td>
                  <td className={gh.startsWith('✗') ? 'no' : 'check'}>{gh}</td>
                  <td className="col-gitswitch check">{gs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Alternatives */}
      <section className="section">
        <div className="section-label">already got a setup?</div>
        <h2 className="section-title">
          gitswitch <em>plays well</em> with what you have.
        </h2>
        <p className="section-sub">
          You don't have to be starting from zero. Here's how it fits in.
        </p>
        <div className="features-grid">
          {ALTERNATIVES.map(([marker, title, desc]) => (
            <div className="feature-card" key={title}>
              <div className="feature-marker">[{marker}]</div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Install */}
      <section id="install" className="section">
        <div className="section-label">install</div>
        <h2 className="section-title">up in 30 seconds.</h2>
        <InstallList />
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="section">
        <div className="section-label">looking ahead</div>
        <h2 className="section-title">
          what's <em>next</em>
        </h2>
        <p className="section-sub">gitswitch is Go all the way. Here's what's shipping.</p>
        <div className="roadmap-grid">
          <div className="tui-frame">
            <div className="frame-title">shipped · stable</div>
            <div className="frame-body">
              <p><strong>Session isolation</strong> — two terminals, two GitHub accounts, no fighting over <code>gh</code>'s single global account.</p>
              <p><strong>Pins write into the repo</strong> — <code>gitswitch pin work</code> sticks for good, without touching your global identity.</p>
              <p><strong>GitHub OAuth login</strong> — <code>gitswitch login</code> authenticates via device flow, no manual config.</p>
              <p><strong><code>gitswitch reauthor</code></strong> — rewrites author/committer identity on commits already made under the wrong profile.</p>
              <p><a href="https://github.com/aksisonline/gitswitch/releases" target="_blank" rel="noreferrer">full changelog ↗</a></p>
            </div>
          </div>
          <div className="tui-frame">
            <div className="frame-title">coming up</div>
            <div className="frame-body">
              <p><strong>Multi-host profiles</strong> — one profile, multiple GitHub hosts (github.com + github.corp.com), each with its own key and token.</p>
            </div>
          </div>
          <div className="tui-frame">
            <div className="frame-title">on the horizon</div>
            <div className="frame-body">
              <p><strong>Team presets</strong> — <code>gitswitch apply &lt;url&gt;</code> bootstraps all profiles from a shared signed config.</p>
              <p><strong>In-repo config</strong> — <code>.gitswitch.yaml</code> declares required profiles and identity policies.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
