import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
  },
  // Lets `bun run dev` be hit with `Host: get.gitswitch.dev` to test the gateway in src/start.ts.
  server: {
    allowedHosts: ['get.gitswitch.dev'],
  },
  plugins: [
    mdx(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      sitemap: {
        enabled: true,
        host: 'https://gitswitch.dev',
      },
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: false,
      },
    }),
    viteReact(),
  ],
})

export default config
