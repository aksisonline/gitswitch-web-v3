import { type ReactNode } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import TuiWidget from '../components/TuiWidget'
import InstallTabs from '../components/InstallTabs'
import InstallList from '../components/InstallList'
import { VERSION } from '../generated/meta'

const FAQ: Array<[string, string]> = [
  [
    'Do I need multiple GitHub accounts?',
    'No. gitswitch can also set up Git and GitHub CLI for your first commit.',
  ],
  [
    'Does gitswitch replace GitHub CLI?',
    'No. gitswitch adds repo-aware identity and session management around your existing Git and GitHub CLI workflow.',
  ],
  [
    'Do I need to create SSH keys by hand?',
    'No. Add a key to a profile if you want to use one; you can also start without configuring one.',
  ],
  [
    'Can it fix a commit I already made?',
    'Yes. gitswitch reauthor rewrites the author and committer on existing commits. If the commits are already shared, coordinate before rewriting history.',
  ],
  [
    'Is gitswitch open source?',
    'Yes. It’s written in Go and licensed under Apache-2.0.',
  ],
]

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: 'https://gitswitch.dev' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(([q, a]) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }),
      },
    ],
  }),
  component: Home,
})

const FEATURES: Array<[string, ReactNode]> = [
  [
    'Your identity follows the repo.',
    <>
      <code>gitswitch pin work</code> once. Name and email stay with that repo,
      whatever your global config says.
    </>,
  ],
  [
    'Use multiple GitHub accounts at once.',
    <>
      Each terminal resolves <code>gh</code> for its own repo. No terminal
      changes another’s account.
    </>,
  ],
  [
    'Match the right SSH and signing keys.',
    <>
      Attach SSH and GPG keys to a profile. They switch with it.
    </>,
  ],
  [
    'Fix a commit made under the wrong identity.',
    <>
      <code>gitswitch reauthor</code> rewrites author and committer on existing
      commits. Careful with shared history.
    </>,
  ],
  [
    'Works in your terminal—and agent-launched shells.',
    <>
      Same behavior in your shell, editor, or coding agent.{' '}
      <code>gitswitch claude</code> installs the Claude Code skill.
    </>,
  ],
]

const ALTERNATIVES: Array<[string, string, ReactNode]> = [
  [
    'if',
    'Using includeIf?',
    <>
      Keep it, or pin repos one by one instead of hand-maintaining directory
      rules.
    </>,
  ],
  [
    'ssh',
    'Using SSH host aliases?',
    <>
      gitswitch can select a profile’s SSH key with <code>core.sshCommand</code>{' '}
      and <code>IdentitiesOnly=yes</code>, alongside the rest of that profile.
    </>,
  ],
  [
    'cli',
    'Already using another switcher?',
    <>
      Start with one repo. Add other profiles and session isolation when you
      need them.
    </>,
  ],
]

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content rise-in">
          <div className="hero-badge">{VERSION} · written in go</div>
          <h1>
            Every repo gets the <em>right GitHub identity.</em>
            <span className="blink" />
          </h1>
          <p className="hero-sub">
            Commit author, <code>gh</code> account, SSH key, and signing key,
            matched to the repo you’re in. Run work and personal side by side.
          </p>
          <div className="hero-actions">
            <a href="#install" className="btn-primary">
              Install gitswitch
            </a>
            <a href="#how-it-works" className="btn-ghost">
              See how it works
            </a>
          </div>
          <InstallTabs />
          <p className="hero-meta">
            macOS, Linux, Windows · New to Git?{' '}
            <Link to="/docs/$" params={{ _splat: 'guides/beginners' }}>
              Get set up from scratch →
            </Link>
          </p>
        </div>
        <TuiWidget />
      </section>

      <section className="section">
        <div className="section-label">the problem</div>
        <h2 className="section-title">
          Git and GitHub don’t share <em>one identity setting.</em>
        </h2>
        <p className="section-sub">
          <code>gh auth switch</code> only changes the GitHub CLI account. Your
          commit name, email, SSH key, and signing key live elsewhere. gitswitch
          bundles them into one profile per repo.
        </p>
      </section>

      <section className="section" aria-labelledby="parallel-title">
        <div className="section-label">two terminals · two identities</div>
        <h2 id="parallel-title" className="section-title">
          Side by side. <em>Still yours.</em>
        </h2>
        <p className="section-sub">
          Pin each repo once. Each terminal’s <code>gh</code> commands use that
          repo’s account.
        </p>
        <div className="parallel-demo">
          {[
            ['work · ~/work/api', 'work', 'work-account'],
            ['personal · ~/personal/site', 'personal', 'personal-account'],
          ].map(([title, profile, account]) => (
            <div className="tui-frame" key={profile}>
              <div className="frame-title">{title}</div>
              <pre className="demo-commands">
                <code>
                  <span className="prompt">$</span> gitswitch pin {profile}
                  {'\n'}
                  <span className="prompt">$</span> git config user.email{'\n'}
                  <span className="demo-result">
                    {profile === 'work'
                      ? 'you@company.com'
                      : 'you@personal.dev'}
                  </span>
                  {'\n\n'}
                  <span className="prompt">$</span> gh api user --jq .login
                  {'\n'}
                  <span className="demo-result">{account}</span>
                </code>
              </pre>
            </div>
          ))}
        </div>
        <p className="section-sub trust-note">
          A router, not a credential vault. Keys stay in <code>~/.ssh/</code>,
          tokens in your OS keychain.{' '}
          <Link to="/docs/$" params={{ _splat: 'get-started/intro' }}>
            Read how it works →
          </Link>
        </p>
      </section>

      <section id="features" className="section">
        <div className="section-label">features</div>
        <h2 className="section-title">
          Your identity <em>follows the repo.</em>
        </h2>
        <div className="features-grid reveal-group">
          {FEATURES.map(([title, desc], i) => (
            <div
              className={`feature-card reveal${i === 0 ? ' feature-card--lead' : ''}`}
              key={title}
            >
              <div className="feature-marker">
                [{String(i + 1).padStart(2, '0')}]
              </div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="section-label">how it works</div>
        <h2 className="section-title">
          Log in. Pin a repo. <em>Keep working.</em>
        </h2>
        <ol className="setup-steps">
          <li>
            <strong>Log in once.</strong> <code>gitswitch login</code> hands off
            to
            <code>gh auth login</code> and creates your profile—no token to copy
            into another tool.
          </li>
          <li>
            <strong>Add your identities.</strong> Set the name and email for
            each profile; attach SSH or signing keys if you use them.
          </li>
          <li>
            <strong>Pin a repo.</strong> Run <code>gitswitch pin work</code> in
            a repo. Then keep using <code>git</code> and <code>gh</code> as
            usual.
          </li>
        </ol>
      </section>

      <section className="section">
        <div className="section-label">already have a Git setup?</div>
        <h2 className="section-title">
          Start with <em>one repo.</em>
        </h2>
        <div className="alt-list reveal-group">
          {ALTERNATIVES.map(([marker, title, desc]) => (
            <div className="alt-row reveal" key={title}>
              <div className="alt-row-marker">[{marker}]</div>
              <div className="alt-row-body">
                <div className="alt-row-title">{title}</div>
                <div className="alt-row-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="install" className="section">
        <div className="section-label">install</div>
        <h2 className="section-title">
          Get <em>gitswitch.</em>
        </h2>
        <InstallList />
      </section>

      <section className="section">
        <div className="section-label">faq</div>
        <h2 className="section-title">
          Questions, <em>answered.</em>
        </h2>
        <div className="faq-list reveal-group">
          {FAQ.map(([q, a]) => (
            <div className="faq-item reveal" key={q}>
              <div className="faq-q">
                <span className="prompt">$</span> {q}
              </div>
              <div className="faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
