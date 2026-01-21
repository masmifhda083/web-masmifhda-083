// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare"
import alpinejs from "@astrojs/alpinejs";
import { onRequest } from './src/middleware/auth';
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// Membaca siteUrl dari website.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const websiteConfigPath = join(__dirname, 'src/content/settings/website.json');
const websiteConfig = JSON.parse(readFileSync(websiteConfigPath, 'utf-8'));
// Mengambil siteUrl dari seo.siteInfo.siteUrl, dengan fallback jika tidak ada
const siteUrl = websiteConfig?.seo?.siteInfo?.siteUrl || 'https://example.com';
// Pastikan URL berakhir dengan /
const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
// https://astro.build/config
export default defineConfig({
  site: normalizedSiteUrl,
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
      `${normalizedSiteUrl}sitemap.xml`
    ],
  })],
});