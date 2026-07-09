import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import EasterEggs from '#/components/EasterEggs'
import CrtOverlay from '#/components/CrtOverlay'
import { ThemeProvider } from '#/lib/theme-context'
import { THEME_INIT_SCRIPT } from '#/lib/themes'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'
import appCss from '#/styles.css?url'

const TITLE = 'gitswitch — Git Account Switcher & Identity Manager'
const DESC =
  'A terminal UI to switch git identities, SSH keys, GPG signing, and GitHub profiles instantly. The easiest way to manage multiple git accounts.'

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
          'git account switcher, gitswitch, git config easy switching, git identity manager, multiple git accounts, switch git user, git ssh key management, git profile switcher, git commit identity, github account switcher, git gpg signing',
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
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESC },
      { name: 'twitter:image', content: 'https://gitswitch.dev/og-image.png' },
    ],
    links: [
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
        {/* RootProvider powers Fumadocs search dialog + theme on /docs pages */}
        <RootProvider>
          {/* ThemeProvider drives the terminal palette on the marketing site */}
          <ThemeProvider>
            <Header />
            <Outlet />
            <Footer />
            <EasterEggs />
            <CrtOverlay />
          </ThemeProvider>
        </RootProvider>
        <Scripts />
      </body>
    </html>
  )
}
