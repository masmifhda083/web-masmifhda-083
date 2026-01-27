// file src/content/config.ts

import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.{md,mdx}",
    ignore: ["**/gitkeep.md"]
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().transform((val) => {
      if (!val) return val;
      if (val.includes('/authors/')) {
        const parts = val.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.md', '');
      }
      return val;
    }).optional(),
    pubdate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    bgImage: z.string().optional(),

    // PERBAIKAN: Handle category dan customCategory
    category: z.string().transform(val => {
      if (!val) return val;
      return val.toLowerCase().trim();
    }).optional(),

    // Tambahkan customCategory untuk category "other"
    customCategory: z.string().optional(),
  }),
});

const aboutCollection = defineCollection({
  type: "data",
  schema: z.object({
    facilities: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          image: z.string()
        })
      )
    }),
    gallery: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          image: z.string()
        })
      )
    }),
    kepegawaian: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          image: z.string(),
          body: z.string()
        })
      )
    }),
    profil: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          image: z.string(),
          body: z.string()
        })
      )
    }),
    sambutan: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          image: z.string(),
          body: z.string()
        })
      )
    }),
    visimisi: z.object({
      items: z.array(
        z.object({
          title: z.string(),
          image: z.string(),
          body: z.string()
        })
      )
    })
  })
})

const staff = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      teachers: z.array(
        z.object({
          name: z.string(),
          avatar: z.string(),
          role: z.string(),
        })
      ).default([]),
    }),
});


const extracurricular = defineCollection({
  loader: glob({
    base: "./src/content/extracurricular",
    pattern: "**/*.{md,mdx}"
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    shortName: z.string().optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
    schedule: z.object({
      day: z.string().optional(),
      time: z.string().optional(),
      location: z.string().optional(),
    }).optional(),
    instructor: z.object({
      name: z.string().optional(),
      position: z.string().optional(),
    }).optional(),
    gallery: z.array(
      z.object({
        image: z.string(),
        caption: z.string().optional(),
        date: z.coerce.date().optional(),
      })
    ).optional(),
    achievements: z.array(
      z.object({
        title: z.string(),
        level: z.string().optional(),
        year: z.number().optional(),
        description: z.string().optional(),
      })
    ).optional(),
  }),
});

const authorsCollection = defineCollection({
  loader: glob({
    base: "./src/content/authors",
    pattern: "**/*.{md,mdx}"
  }),
  schema: z.object({
    name: z.string(),
    username: z.string(),
    avatar: z.string(),
    role: z.string().optional(),
  }),
});
const pamflate = defineCollection({
  type: 'data',
  schema: z.object({
    heroImage: z.string().optional(),
  }),
});

// PPDB Settings Collection
const ppdbSettings = defineCollection({
  type: 'data', // menggunakan JSON/data
  schema: z.object({
    // Data utama PPDB (grouping)
    datappdb: z.object({
      // Branding
      schoolName: z.string().default('SMP Xaverius 2'),
      ppdbAlias: z.string().optional(),
      logoUrl: z.string().default('/images/logo-school.png'),
      coverImageUrl: z.string().default('/images/cover-school.jpg'),
      primaryColor: z.string().default('#2563eb'),
      secondaryColor: z.string().default('#10b981'),

      // Registration Info
      academicYear: z.string().default('2026/2027'),
      registrationOpen: z.boolean().default(true),
      registrationPeriod: z.string().default('1 Oktober - 30 November 2025'),

      // Test Information
      testDate: z.string().default('11 November 2025'),
      testTime: z.string().default('08:00 - 12:00 WIB'),
      testLocation: z.string().default('Aula Utama SMAN Indosia'),

      // Requirements (array of objects)
      requirements: z.array(
        z.object({
          requirement: z.string()
        })
      ).default([
        { requirement: 'Foto copy Kartu Keluarga' },
        { requirement: 'Foto copy Akta Kelahiran' },
        { requirement: 'Foto copy rapor' },
        { requirement: 'Pas Foto 3x4 (2 lembar)' },
        { requirement: 'Surat keterangan katolik (bagi yang beragama katolik)' },
        { requirement: 'Dokumen dalam map merah (P) / biru (L)' },
      ]),

      // Contact Info
      contactPhone: z.string().default('(0271) 123-456'),
      contactEmail: z.string().default('ppdb@sekolah.example.com'),
      contactAddress: z.string().default('Jl. Pendidikan No. 123, Bandar Lampung'),

    }).default({}),

    // Highlight pamflet untuk halaman utama
    highlightPamflet: z.object({
      enabled: z.boolean().default(true),
      pamflet: z.string().optional(),
      customImage: z.string().optional(),
    }).optional(),
  }),
});

const websiteSettingsCollection = defineCollection({
  type: "data",
  schema: z.object({
    header: z.object({
      items: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          isActive: z.boolean().optional()
        })
      ).optional(),
      style: z.object({
        bgColor: z.string().optional(),
        textColor: z.string().optional(),
        hoverColor: z.string().optional(),
        borderColor: z.string().optional(),
        bgTransparent: z.enum(["transparent", "solid"]).optional()
      }).optional(),
      schoolInfo: z.object({
        name: z.string(),
        logo: z.string(),
        logoAlt: z.string().optional(),
        logoWidthDesktop: z.number().optional(),
        logoWidthMobile: z.number().optional(),
        showName: z.boolean().optional().default(true)
      }).optional()
    }),
    seo: z.object({
      siteInfo: z.object({
        siteName: z.string(),
        siteUrl: z.string(),
        siteDescription: z.string().optional(),
        siteLogo: z.string().optional(),
        favicon: z.string().optional()
      }),
      globalMeta: z.object({
        titleTemplate: z.string(),
        defaultTitle: z.string().optional(),
        defaultDescription: z.string().optional(),
        defaultKeywords: z.string().optional(),
        author: z.string().optional()
      }).optional(),
      openGraph: z.object({
        type: z.string().optional(),
        locale: z.string().optional(),
        image: z.string().optional()
      }).optional(),
      analytics: z.object({
        gaId: z.string().optional()
      }).optional()
    }).optional(),
    slider: z.object({
      // 3 images untuk slider
      images: z.array(
        z.object({
          url: z.string(),
          alt: z.string().optional(),
          caption: z.string().optional()
        })
      ).length(3).optional(),
      overlay: z.object({
        color: z.string().optional().default('#000000'),
        opacity: z.string().optional().default('0.7')
      }).optional(),

      // School information
      schoolInfo: z.object({
        name: z.string().optional().default("SMA NEGERI 1"),
        city: z.string().optional().default("Semarang"),
        motto: z.string().optional().default("sekolah maju untuk dunia akhirat"),
        accreditation: z.string().optional().default("TERAKREDITASI A"),
        welcomeMessage: z.string().optional().default("Selamat Datang di Website Kami"),
        // Text settings di dalam schoolInfo
        textSettings: z.object({
          color: z.string().optional().default("#FFFFFF"),
          fontSize: z.object({
            welcome: z.string().optional().default("text-3xl"),
            schoolName: z.string().optional().default("text-5xl"),
            city: z.string().optional().default("text-5xl"),
            motto: z.string().optional().default("text-base")
          }).optional(),
          fontFamily: z.object({
            welcome: z.string().optional().default("font-dafoe"),
            main: z.string().optional().default("font-bold")
          }).optional()
        }).optional()
      }).optional(),

      // Animation settings
      animation: z.object({
        autoSlide: z.boolean().optional().default(true),
        slideInterval: z.number().optional().default(3000),
        marqueeSpeed: z.number().optional().default(15)
      }).optional()
    }).optional(),
    footer: z.object({
      schoolName: z.string().optional()
    }).optional(),
    // Tambahkan di schema websiteSettingsCollection
    themeColors: z.object({
      background: z.string(),
      surface: z.string(),
      primary: z.string(),
      secondary: z.string(),
      textBase: z.string(),
      textHeading: z.string(),
      textMuted: z.string(),
      link: z.string(),
      linkHover: z.string(),
      border: z.string(),
    }).optional(),
  })
});

const contactCollection = defineCollection({
  type: "data",
  schema: z.object({
    hero: z.object({
      title: z.string(),
      description: z.string(),
      backgroundImage: z.string(),
    }),
    contactInfo: z.object({
      details: z.array(
        z.object({
          type: z.enum(["phone", "email", "address"]),
          label: z.string(),
          value: z.string(),
        })
      ),
    }),
    hours: z.object({
      days: z.array(
        z.object({
          day: z.string(),
          time: z.string(),
        })
      ),
    }),
    socialMedia: z.object({
      links: z.array(
        z.object({
          iconKey: z.string(),
          url: z.string(),
        })
      ),
    }),
    mapEmbedUrl: z.string(),
  }),
});

//  export collections
export const collections = {
  posts,
  about: aboutCollection,
  staff,
  pamflate,
  extracurricular,
  ppdb: ppdbSettings,
  settings: websiteSettingsCollection,
  authors: authorsCollection,
  contact: contactCollection
};
