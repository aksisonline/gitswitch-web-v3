import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import EasterEggs from '#/components/EasterEggs'
import CrtOverlay from '#/components/CrtOverlay'
import { ThemeProvider } from '#/lib/theme-context'
import { THEME_INIT_SCRIPT } from '#/lib/themes'
import appCss from '#/styles.css?url'

const TITLE = 'gitswitch: Run Multiple GitHub Accounts in Parallel'
const DESC =
  'Run multiple GitHub accounts in parallel on one machine, for developers and AI coding agents alike. One command handles identity, SSH keys, and GPG signing.'
const OG_IMAGE_ALT =
  'gitswitch terminal UI in the Dracula theme, showing the profile list next to the "Git, done right." hero headline'

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'gitswitch',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Linux',
  description: DESC,
  url: 'https://gitswitch.dev',
  sameAs: 'https://github.com/aksisonline/gitswitch',
  author: { '@type': 'Person', name: 'Abhiram Kanna', url: 'https://abhiramkanna.com' },
  license: 'https://github.com/aksisonline/gitswitch/blob/main/LICENSE',
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: TITLE },
      { name: 'description', content: DESC },
      {
        name: 'keywords',
        content:
          'multiple github accounts, github accounts in parallel, parallel github accounts same machine, session isolation gh cli, gh cli multiple accounts, git account switcher, gitswitch, git config easy switching, git identity manager, multiple git accounts, switch git user, git ssh key management, git profile switcher, git commit identity, github account switcher, git gpg signing, claude code git skill, git setup for ai coding agents, git setup for beginners, first git commit setup, git config automatic setup, gh cli setup no ssh keys',
      },
      { name: 'author', content: 'Abhiram Kanna' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESC },
      { property: 'og:url', content: 'https://gitswitch.dev' },
      { property: 'og:site_name', content: 'gitswitch' },
      { property: 'og:image', content: 'https://gitswitch.dev/og-image.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:alt', content: OG_IMAGE_ALT },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESC },
      { name: 'twitter:image', content: 'https://gitswitch.dev/og-image.png' },
      { name: 'twitter:image:alt', content: OG_IMAGE_ALT },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
    scripts: [
      { children: THEME_INIT_SCRIPT },
      { type: 'application/ld+json', children: JSON.stringify(softwareSchema) },
    ],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* ThemeProvider drives the terminal palette on the marketing site.
            fumadocs-ui's RootProvider (search dialog + Shiki theme) lives in
            docs/$.tsx instead of here, so its JS only ships to /docs pages. */}
        <ThemeProvider>
          <Header />
          <Outlet />
          <Footer />
          <EasterEggs />
          <CrtOverlay />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
