import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { Suspense } from 'react'
import { slugsToMarkdownPath, source } from '#/lib/source'
import { baseOptions } from '#/lib/layout.shared'
import { gitConfig } from '#/lib/shared'
import { useMDXComponents } from '#/components/mdx'
import browserCollections from 'collections/browser'

export const Route = createFileRoute('/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? []
    const data = await serverLoader({ data: slugs })
    await clientLoader.preload(data.path)
    return data
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { title, description, url } = loaderData
    const pageTitle = `${title} — gitswitch docs`
    const canonicalUrl = `https://gitswitch.dev${url}`
    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: description },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: description },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  notFoundComponent: () => (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Not found</h1>
      <p>That doc page doesn't exist.</p>
    </div>
  ),
})

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)
    if (!page) throw notFound()
    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      markdownUrl: slugsToMarkdownPath(page.slugs).url,
      pageTree: await source.serializePageTree(source.getPageTree()),
    }
  })

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    { markdownUrl, path }: { markdownUrl: string; path: string },
  ) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    )
  },
})

function Page() {
  const { path, pageTree, markdownUrl } = useFumadocsLoader(Route.useLoaderData())
  return (
    // Fumadocs' inline/block code (Shiki) picks --shiki-light vs --shiki-dark
    // purely off next-themes' `.dark` class, which defaults to following each
    // device's OS color-scheme — so a phone in light mode rendered
    // GitHub-light code colors against our always-dark background while a
    // desktop in dark mode didn't. The site has no light variant (see
    // `color-scheme: dark` in styles.css), so force dark unconditionally.
    <RootProvider theme={{ forcedTheme: 'dark', enableSystem: false }}>
      <DocsLayout {...baseOptions()} tree={pageTree}>
        <Suspense>{clientLoader.useContent(path, { markdownUrl, path })}</Suspense>
      </DocsLayout>
    </RootProvider>
  )
}
