import { createFileRoute } from '@tanstack/react-router'
// Inlined at build time, after scripts/og-image.tsx (prebuild) has re-rendered
// it with the current VERSION — so the bare /og-image URL always matches the
// latest deploy and works as an <img src> in READMEs.
import png from '../../public/og-image.png?inline'

const bytes = Uint8Array.from(atob(png.split(',')[1]), (c) => c.charCodeAt(0))

export const Route = createFileRoute('/og-image')({
  server: {
    handlers: {
      GET: () =>
        new Response(bytes, {
          headers: {
            'content-type': 'image/png',
            'cache-control': 'public, max-age=3600',
          },
        }),
    },
  },
})
