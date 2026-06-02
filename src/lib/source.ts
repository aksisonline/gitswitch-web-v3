import { loader } from 'fumadocs-core/source'
import { docs } from 'collections/server'
import { docsRoute } from './shared'

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
})

export function slugsToMarkdownPath(slugs: string[]) {
  const segments = [...slugs]
  if (segments.length === 0) {
    segments.push('index.md')
  } else {
    segments[segments.length - 1] += '.md'
  }
  return {
    segments,
    url: `${docsRoute}/${segments.join('/')}`,
  }
}
