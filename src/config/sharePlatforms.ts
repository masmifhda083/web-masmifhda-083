// src/config/sharePlatforms.ts
export const SHARE_PLATFORMS = {
  twitter: {
    buildUrl: ({ title, url }: SharePayload) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  },
  facebook: {
    buildUrl: ({ url }: SharePayload) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  whatsapp: {
    buildUrl: ({ title, url, excerpt }: SharePayload) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} ${excerpt} ${url}`
      )}`
  },
  telegram: {
    buildUrl: ({ title, url }: SharePayload) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  },
  linkedin: {
    buildUrl: ({ title, url }: SharePayload) =>
      `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
  },
  threads: {
    buildUrl: ({ url, title, excerpt }: SharePayload) =>
      `https://www.threads.net/intent/post?text=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&text=${encodeURIComponent(excerpt)}`
  }
}

export type SharePayload = {
  title: string
  url: string
  excerpt: string
}
