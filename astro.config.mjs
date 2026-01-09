// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare"
import alpinejs from "@astrojs/alpinejs";
import { onRequest } from './src/middleware/auth';
import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: 'https://masmifhda.sch.id/',
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['TURSO_', 'ADMIN_', 'SESSION_'],
  },
  middleware: {
    onRequest
  },
  output: "server",
  adapter: cloudflare(),

  integrations: [alpinejs(), sitemap(), robotsTxt({
    sitemap: [
      'https://masmifhda.sch.id/sitemap.xml'
    ],
  })],
});