//file: tina/config.ts
import { defineConfig } from "tinacms"
import { SOCIAL_ICON_REGISTRY } from "../src/config/socialIcons"

const socialIconOptions = Object.entries(SOCIAL_ICON_REGISTRY ?? {}).map(
  ([key, value]) => ({
    label: value.label,
    value: key,
  })
)

export default defineConfig({
  clientId: "800eef9c-45ae-4afc-b092-2f080255fd84",
  token: "b14f2679594a1ecfd64fac53bea2c64ba277c24e",
  branch: 'main',

  local: {
    enabled: false,
    apiUrl: "http://localhost:4321/api/tina",
  },

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [

      // Posts
      {
        name: "post",
        label: "Posts",
        path: "src/content/posts",
        ui: {
          filename: {
            slugify: (values) => {
              return values?.title
                ?.toLowerCase()
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "-") || "untitled";
            },
          },

          beforeSubmit: async ({ values }) => {
            if (values.category && values.title) {
              return {
                ...values,
              };
            }
            return values;
          },
        },
        defaultItem: () => ({
          pubdate: new Date().toISOString().split("T")[0],
          author: "Admin",
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "reference",
            name: "author",
            label: "Author",
            collections: ["authors"], // Reference ke koleksi authors
            required: true
          },
          {
            type: "datetime",
            name: "pubdate",
            label: "Publish Date",
            ui: {
              dateFormat: "DD MMMM YYYY",
            },
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            description: "Gunakan huruf kecil, tanpa spasi. Contoh: akademik, kurikulum, event",
            required: true,
          },
          {
            type: "image",
            name: "heroImage",
            label: "Featured Image",
            description: "Ukuran gambar maksimal 1MB",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,
          },
        ],
      },
      // ABOUT
      {
        name: "about",
        label: "About",
        path: "src/content/about",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          defaultItem: () => ({
            gallery: {
              items: [
                {
                  title: "Kegiatan Upacara",
                  image: ""
                }
              ]
            },
            facilities: {
              items: [
                {
                  title: "Laboratorium Komputer",
                  image: "",
                }
              ]
            },
            kepegawaian: {
              items: [
                { title: "Tenaga Pendidik", image: "", body: "" }
              ]
            },
            profil: {
              items: [
                { title: "Profil Sekolah", image: "", body: "" }
              ]
            },
            sambutan: {
              items: [
                { title: "Sambutan Kepala Sekolah", image: "", body: "" }
              ]
            },
            visimisi: {
              items: [
                { title: "Visi Misi Sekolah", image: "", body: "" }
              ]
            },
          })
        },
        fields: [
          {
            type: "object",
            name: "gallery",
            label: "Galeri Kegiatan Sekolah",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Daftar Foto",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || "Foto Baru"
                  }),
                  defaultItem: () => ({
                    title: "",
                    image: ""
                  })
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Judul",
                    required: true
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Foto",
                    required: true
                  }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "facilities",
            label: "Fasilitas Sekolah",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Daftar Fasilitas",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || "Fasilitas Baru"
                  }),
                  defaultItem: () => ({
                    title: "",
                    image: ""
                  })
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Judul",
                    required: true
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Gambar",
                    required: true
                  },
                ]
              }
            ]
          },
          {
            type: "object",
            name: "kepegawaian",
            label: "Tenaga Pendidik",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Daftar Guru",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || "Daftar Guru"
                  }),
                  defaultItem: () => ({
                    title: "",
                    image: ""
                  })
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Judul",
                    required: true
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Foto",
                    required: true
                  },
                  { type: "rich-text", name: "body", label: "Body", isBody: true }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "profil",
            label: "Profil Sekolah",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Profil Sekolah",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || "Profil Sekolah"
                  }),
                  defaultItem: () => ({
                    title: "",
                    image: ""
                  })
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Judul",
                    required: true
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Foto",
                    required: true
                  },
                  { type: "rich-text", name: "body", label: "Body", isBody: true }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "sambutan",
            label: "Sambutan Kepala Sekolah",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Sambutan Kepala Sekolah",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || "Sambutan Kepala Sekolah"
                  }),
                  defaultItem: () => ({
                    title: "",
                    image: ""
                  })
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Judul",
                    required: true
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Foto",
                    required: true
                  },
                  { type: "rich-text", name: "body", label: "Body", isBody: true }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "visimisi",
            label: "Visi Misi Sekolah",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Visi Misi Sekolah",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || "Visi Misi Sekolah"
                  }),
                  defaultItem: () => ({
                    title: "",
                    image: ""
                  })
                },
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Judul",
                    required: true
                  },
                  {
                    type: "image",
                    name: "image",
                    label: "Foto",
                    required: true
                  },
                  { type: "rich-text", name: "body", label: "Body", isBody: true }
                ]
              }
            ]
          },
        ]
      },
      //   staff
      {
        label: 'Staff Sekolah',
        name: 'staff',
        path: 'src/content/staff',
        format: 'json',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          defaultItem: () => ({
            teachers: [],
          }),
        },
        fields: [
          // ============ GURU ============
          {
            type: 'object',
            label: 'Guru',
            name: 'teachers',
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || 'Guru Baru',
              }),
              defaultItem: () => ({
                name: 'Nama Guru',
                avatar: '',
                role: 'guru-mapel',
              }),
            },
            fields: [
              {
                type: 'string',
                label: 'Nama Lengkap',
                name: 'name',
                required: true,
              },
              {
                type: 'image',
                label: 'Foto',
                name: 'avatar',
                description: 'Upload foto guru',
                required: true,
              },
              {
                type: 'string',
                label: 'Jabatan',
                name: 'role',
                description: 'Pilih satu jabatan',
                ui: {
                  component: 'select',
                  creatable: true,
                  searchable: true,
                },
                options: [
                  { label: 'Guru Mapel', value: 'guru-mapel' },
                  { label: 'Wali Kelas', value: 'wali-kelas' },
                  { label: 'Guru BK', value: 'guru-bk' },
                  { label: 'Kepala Sekolah', value: 'kepala-sekolah' },
                  { label: 'Wakil Kepala', value: 'wakil-kepala' },
                  { label: 'Pendidikan Agama Islam', value: 'wakil-kepala' },
                  { label: "Pendidikan Matematika", value: "pend.-matematika" },
                  { label: "Pendidikan B. Indonesia", value: "pend.-b-indonesia" },
                  { label: "Pendidikan Bahasa Inggris", value: "pend.-bahasa-inggris" },
                  { label: "Pendidikan Fisika", value: "pend.-fisika" },
                  { label: "Pendidikan Kimia", value: "pend.-kimia" },
                  { label: "Pendidikan Biologi", value: "pend.-biologi" },
                  { label: "Pendidikan Sejarah", value: "pend.-sejarah" },
                  { label: "Pendidikan Geografi", value: "pend.-geografi" },
                  { label: "Pendidikan Ekonomi", value: "pend.-ekonomi" },
                  { label: "Pendidikan Agama Islam", value: "pend.-agama-islam" },
                  { label: "Pendidikan Agama Kristen", value: "pend.-agama-kristen" },
                  { label: "Pendidikan Agama Hindu", value: "pend.-agama-hindu" },
                  { label: "Pendidikan Jasmani Olahraga dan Kesehatan", value: "penjaskes" },
                  { label: "Pendidikan Kewarganegaraan", value: "pend.-pkn" },
                  { label: "Staf Tata Usaha", value: "staf-tata-usaha" }
                ],
                required: true,
              },
            ],
          },
        ],
      },
      // Ekstrakurikuler
      {
        name: "extracurricular",
        label: "Ekstrakurikuler",
        path: "src/content/extracurricular",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Nama Ekstrakurikuler",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "shortName",
            label: "Singkatan/Nama Pendek",
            description: "Contoh: PMR, Pramuka, Basket, dll"
          },
          {
            type: "image",
            name: "thumbnail",
            label: "Thumbnail",
            description: "Gambar utama untuk ekstrakurikuler"
          },
          {
            type: "string",
            name: "description",
            label: "Deskripsi Singkat",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "schedule",
            label: "Jadwal",
            fields: [
              {
                type: "string",
                name: "day",
                label: "Hari",
                options: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
              },
              {
                type: "string",
                name: "time",
                label: "Waktu",
                description: "Contoh: 15.00 - 17.00"
              },
              {
                type: "string",
                name: "location",
                label: "Lokasi",
                description: "Tempat pelaksanaan"
              }
            ]
          },
          {
            type: "object",
            name: "instructor",
            label: "Pembina/Pelatih",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Nama"
              },
              {
                type: "string",
                name: "position",
                label: "Jabatan"
              }
            ]
          },
          {
            type: "object",
            name: "gallery",
            label: "Galeri Foto",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.caption || "Foto Baru" };
              },
            },
            fields: [
              {
                type: "image",
                name: "image",
                label: "Foto",
              },
              {
                type: "string",
                name: "caption",
                label: "Keterangan Foto",
              },
              {
                type: "datetime",
                name: "date",
                label: "Tanggal Foto",
              }
            ],
          },
          {
            type: "object",
            name: "achievements",
            label: "Prestasi",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.title || "Prestasi Baru" };
              },
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Nama Prestasi",
              },
              {
                type: "string",
                name: "level",
                label: "Tingkat",
                options: ["Sekolah", "Kecamatan", "Kabupaten", "Provinsi", "Nasional", "Internasional"]
              },
              {
                type: "number",
                name: "year",
                label: "Tahun",
              },
              {
                type: "string",
                name: "description",
                label: "Keterangan",
                ui: {
                  component: "textarea"
                }
              }
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Konten Lengkap",
            isBody: true,
            templates: [
              {
                name: "imageGallery",
                label: "Galeri Gambar",
                fields: [
                  {
                    name: "images",
                    label: "Gambar",
                    type: "object",
                    list: true,
                    fields: [
                      {
                        type: "image",
                        name: "src",
                        label: "Gambar"
                      },
                      {
                        type: "string",
                        name: "alt",
                        label: "Deskripsi Gambar"
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ],
      },
      // pamflate
      // {
      //   name: 'pamflate',
      //   label: 'Pamflet',
      //   path: 'src/content/pamflate',
      //   format: 'json',
      //   ui: {

      //     global: false, // Tidak tampil di sidebar
      //     router: ({ document }) => {
      //       // Tampilkan hanya jika diakses langsung via URL
      //       return `/admin/pamflate/${document._sys.filename}`;
      //     }
      //   },
      //   fields: [
      //     {
      //       type: 'image',
      //       name: 'heroImage',
      //       label: 'Gambar Pamflet'
      //     }
      //   ]
      // },

      // collection ppdb
      {
        name: "ppdbSettings",
        label: "PPDB",
        path: "src/content/ppdb",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "datappdb",
            label: "Data PPDB",
            fields: [
              { type: "string", name: "schoolName", label: "Nama Sekolah", required: true },
              { type: "string", name: "ppdbAlias", label: "Nama Pendaftaran" },
              { type: "image", name: "logoUrl", label: "Logo Sekolah" },
              { type: "image", name: "coverImageUrl", label: "Cover Image" },
              {
                type: "string",
                name: "primaryColor",
                label: "Warna Utama",
                ui: { component: "color" }
              },
              {
                type: "string",
                name: "secondaryColor",
                label: "Warna Sekunder",
                ui: { component: "color" }
              },
              { type: "string", name: "academicYear", label: "Tahun Ajaran", required: true },
              { type: "boolean", name: "registrationOpen", label: "Pendaftaran Dibuka?" },
              { type: "string", name: "registrationPeriod", label: "Periode Pendaftaran" },
              { type: "string", name: "testDate", label: "Tanggal Tes" },
              { type: "string", name: "testTime", label: "Waktu Tes" },
              { type: "string", name: "testLocation", label: "Lokasi Tes" },
              {
                type: "object",
                name: "requirements",
                label: "Persyaratan",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item && item.requirement ? item.requirement : "Persyaratan Baru"
                  })
                },
                fields: [
                  { type: "string", name: "requirement", label: "Persyaratan" }
                ]
              },
              { type: "string", name: "contactPhone", label: "Telepon Kontak" },
              { type: "string", name: "contactEmail", label: "Email Kontak" },
              { type: "string", name: "contactAddress", label: "Alamat Sekolah" },
            ]
          },
          {
            type: "object",
            name: "highlightPamflet",
            label: "Pamflet PPDB",
            fields: [

              { type: "image", name: "customImage", label: "Gambar Pamflet (Custom)" },

            ]
          }
        ]
      },
      // Authors
      {
        name: "authors",
        label: "Authors",
        path: "src/content/authors",
        format: "md",
        ui: {
          filename: {
            slugify: (values) => {
              return values?.username?.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-') || 'author'
            }
          },
          // Router untuk edit author
          router: ({ document }) => {
            return `/authors/${document._sys.breadcrumbs.join('/')}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Full Name",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "username",
            label: "Username",
            description: "Untuk URL, contoh: nisa → /author/nisa",
            required: true
          },
          {
            type: "image",
            name: "avatar",
            label: "Profile Picture",
            required: true
          },
          {
            type: "string",
            name: "role",
            label: "Role/Position",
            options: [
              { label: "Guru", value: "Guru" },
              { label: "Staff", value: "Staff" },
              { label: "Admin", value: "Admin" },
              { label: "Siswa", value: "Siswa" },
              { label: "Alumni", value: "Alumni" }
            ],
            required: true
          },
        ]
      },
      // contact
      {
        name: "contact",
        label: "Contact",
        path: "src/content/contact",
        format: "json",
        ui: {
          allowedActions: {
            create: false, // Supaya hanya ada satu file contact
            delete: false,
          },
          defaultItem: () => ({
            hero: {
              title: "Tertarik Bergabung?",
              description: "Bersama kami, Anda akan mendapatkan pendidikan berkualitas dan pengalaman belajar yang inspiratif.",
              backgroundImage: "https://images.unsplash.com/photo-1494949649109-ecfc3b8c35df?q=80&w=1032"
            },
            contactInfo: {
              details: [
                {
                  type: "phone",
                  label: "Telepon",
                  value: "+1-316-555-1258"
                },
                {
                  type: "email",
                  label: "Email",
                  value: "google@gmail.com"
                },
                {
                  type: "address",
                  label: "Alamat",
                  value: "802 Pension Rd, Maine 96812, USA"
                }
              ]
            },
            hours: {
              days: [
                {
                  day: "Monday - Friday",
                  time: "9:00 AM - 6:00 PM"
                },
                {
                  day: "Saturday",
                  time: "10:00 AM - 4:00 PM"
                }
              ]
            },
            socialMedia: {
              links: [
                {
                  platform: "facebook",
                  url: "#"
                },
                {
                  platform: "twitter",
                  url: "#"
                },
                {
                  platform: "instagram",
                  url: "#"
                },
                {
                  platform: "youtube",
                  url: "#"
                }
              ]
            },
            contactForm: {
              title: "Hubungi Kami"
            },

          }),
        },
        fields: [
          // ============ HERO SECTION ============
          {
            type: "object",
            label: "Hero Section",
            name: "hero",
            fields: [
              {
                type: "string",
                label: "Judul",
                name: "title",
                required: true,
              },
              {
                type: "string",
                label: "Deskripsi",
                name: "description",
                ui: {
                  component: "textarea",
                },
                required: true,
              },
              {
                type: "image",
                label: "Background Image",
                name: "backgroundImage",
                required: true,
              },
            ],
          },
          // ============ CONTACT INFORMATION ============
          {
            type: "object",
            label: "Informasi Kontak",
            name: "contactInfo",
            fields: [
              {
                type: "object",
                label: "Detail Kontak",
                name: "details",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: `${item?.label} - ${item?.value || 'Detail Baru'}`,
                  }),
                  defaultItem: () => ({
                    type: "phone",
                    label: "Telepon",
                    value: ""
                  }),
                },
                fields: [
                  {
                    type: "string",
                    label: "Jenis Kontak",
                    name: "type",
                    options: [
                      { label: "Telepon", value: "phone" },
                      { label: "Email", value: "email" },
                      { label: "Alamat", value: "address" },
                    ],
                    required: true,
                  },
                  {
                    type: "string",
                    label: "Label",
                    name: "label",
                    required: true,
                  },
                  {
                    type: "string",
                    label: "Nilai",
                    name: "value",
                    required: true,
                  },
                ],
              },
            ],
          },
          // ============ JAM OPERASIONAL ============
          {
            type: "object",
            label: "Jam Operasional",
            name: "hours",
            fields: [
              {
                type: "object",
                label: "Jam Operasional",
                name: "days",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: `${item?.day || 'Hari Baru'} - ${item?.time || ''}`,
                  }),
                  defaultItem: () => ({
                    day: "Senin - Jumat",
                    time: "08:00 - 16:00"
                  }),
                },
                fields: [
                  {
                    type: "string",
                    label: "Hari",
                    name: "day",
                    required: true,
                  },
                  {
                    type: "string",
                    label: "Jam",
                    name: "time",
                    required: true,
                  },
                ],
              },
            ],
          },
          // ============ SOCIAL MEDIA ============
          {
            type: "object",
            label: "Social Media",
            name: "socialMedia",
            fields: [
              {
                type: "object",
                label: "Link Sosial Media",
                name: "links",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: `${item?.iconKey || "Icon"} - ${item?.url || ""}`,
                  }),
                  defaultItem: () => ({
                    iconKey: "facebook",
                    url: "#",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "iconKey",
                    label: "Icon",
                    options: socialIconOptions,
                    required: true,
                  },
                  {
                    type: "string",
                    name: "url",
                    label: "URL",
                    required: true,
                  },
                ],
              },
            ],
          },
          // ============ MAPS ============
          {
            type: "string",
            label: "Google Maps Embed URL",
            name: "mapEmbedUrl",
            required: true,
            ui: {
              description: "Paste URL dari menu Share > Embed > Copy bagian https"
            }
          }

        ],
      },

      //websiteSettings
      {
        label: 'Settings',
        name: 'websiteSettings',
        path: 'src/content/settings',
        format: 'json',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          defaultItem: {
            siteInfo: {
              siteName: 'SMA Negeri 1 Indonesia',
              siteUrl: 'https://masmifhda.sch.id'
            }
          }
        },
        fields: [
          // ============ BAGIAN 1: HEADER & NAVBAR ============
          {
            type: 'object',
            label: 'Header & Navigasi',
            name: 'header',
            fields: [
              // 1A. MENU ITEMS
              {
                type: 'object',
                label: 'Item Menu',
                name: 'items',
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item.label }),
                },
                fields: [
                  {
                    type: 'string',
                    label: 'Label Menu',
                    name: 'label',
                    required: true,
                  },
                  {
                    type: 'string',
                    label: 'URL Tujuan',
                    name: 'href',
                    required: true,
                  },
                  {
                    type: 'boolean',
                    label: 'Menu Aktif?',
                    name: 'isActive',
                  },
                ],
              },

              // 1B. STYLE NAVBAR
              {
                type: 'object',
                label: 'Tampilan Navbar',
                name: 'style',
                fields: [
                  {
                    type: 'string',
                    label: 'Warna Background',
                    name: 'bgColor',
                    ui: { component: 'color' },
                  },
                  {
                    type: 'string',
                    label: 'Warna Text',
                    name: 'textColor',
                    ui: { component: 'color' },
                  },
                  {
                    type: 'string',
                    label: 'Warna Hover',
                    name: 'hoverColor',
                    ui: { component: 'color' },
                  },
                  {
                    type: 'string',
                    label: 'Warna Border',
                    name: 'borderColor',
                    ui: { component: 'color' },
                  },
                  {
                    type: 'string',
                    label: 'Background Transparan?',
                    name: 'bgTransparent',
                    options: ['transparent', 'solid'],
                  },
                ],
              },

              // 1C. LOGO & NAMA SEKOLAH
              {
                type: 'object',
                label: 'Logo & Nama Sekolah',
                name: 'schoolInfo',
                fields: [
                  {
                    type: 'string',
                    label: 'Nama Sekolah',
                    name: 'name',
                  },
                  {
                    type: 'image',
                    label: 'Logo Sekolah',
                    name: 'logo',
                    required: true,
                  },
                  {
                    type: 'string',
                    label: 'Alt Text Logo',
                    name: 'logoAlt',
                  },
                  {
                    type: 'number',
                    label: 'Lebar Logo (Desktop)',
                    name: 'logoWidthDesktop',
                    defaultValue: 48,
                  },
                  {
                    type: 'number',
                    label: 'Lebar Logo (Mobile)',
                    name: 'logoWidthMobile',
                    defaultValue: 40,
                  },
                  // TAMBAHKAN FIELD INI
                  {
                    type: 'boolean',
                    label: 'Tampilkan Nama Sekolah',
                    name: 'showName',
                    description: 'Centang untuk menampilkan nama sekolah di sebelah logo',
                    defaultValue: true,
                  },
                ],
              },
            ],
          },
          // BAGIAN 2: HERO SETTINGS
          {
            type: 'object',
            label: 'Hero Settings',
            name: 'slider',
            fields: [
              // 1. IMAGES SECTION
              {
                type: 'object',
                label: 'Slider Images',
                name: 'images',
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item.alt || `Image ${item.url ? '✓' : '✗'}`
                  }),
                  defaultItem: () => ({
                    url: '',
                    alt: 'Slider Image',
                    caption: ''
                  })
                },
                fields: [
                  {
                    type: 'image',
                    label: 'Image',
                    name: 'url',
                    required: true,
                  },
                  {
                    type: 'string',
                    label: 'Alt Text',
                    name: 'alt',
                  },
                  {
                    type: 'string',
                    label: 'Caption (Optional)',
                    name: 'caption',
                  },
                ],
              },
              // 2. SCHOOL INFORMATION
              {
                type: 'object',
                label: 'School Information',
                name: 'schoolInfo',
                fields: [
                  {
                    type: 'string',
                    label: 'School Name',
                    name: 'name',
                    required: true,
                  },
                  {
                    type: 'string',
                    label: 'City',
                    name: 'city',
                    required: true,
                  },
                  {
                    type: 'string',
                    label: 'Motto',
                    name: 'motto',
                    ui: { component: 'textarea' },
                  },
                  {
                    type: 'string',
                    label: 'Welcome Message',
                    name: 'welcomeMessage',
                    ui: { component: 'textarea' },
                  },
                  {
                    type: 'object',
                    label: 'Text Settings',
                    name: 'textSettings',
                    fields: [
                      {
                        type: 'string',
                        label: 'Text Color',
                        name: 'color',
                        ui: { component: 'color' },
                      },
                      {
                        type: 'object',
                        label: 'Font Sizes',
                        name: 'fontSize',
                        fields: [
                          {
                            type: 'string',
                            label: 'Welcome Message Size',
                            name: 'welcome',
                            options: [
                              { label: 'Small', value: 'text-sm' },
                              { label: 'Base', value: 'text-base' },
                              { label: 'Large', value: 'text-lg' },
                              { label: 'XL', value: 'text-xl' },
                              { label: '2XL', value: 'text-2xl' },
                              { label: '3XL', value: 'text-3xl' },
                              { label: '4XL', value: 'text-4xl' },
                              { label: '5XL', value: 'text-5xl' },
                            ],
                          },
                          {
                            type: 'string',
                            label: 'School Name Size',
                            name: 'schoolName',
                            options: [
                              { label: '3XL', value: 'text-3xl' },
                              { label: '4XL', value: 'text-4xl' },
                              { label: '5XL', value: 'text-5xl' },
                              { label: '6XL', value: 'text-6xl' },
                              { label: '7XL', value: 'text-7xl' },
                              { label: '8XL', value: 'text-8xl' },
                            ],
                          },
                          {
                            type: 'string',
                            label: 'City Size',
                            name: 'city',
                            options: [
                              { label: '3XL', value: 'text-3xl' },
                              { label: '4XL', value: 'text-4xl' },
                              { label: '5XL', value: 'text-5xl' },
                              { label: '6XL', value: 'text-6xl' },
                              { label: '7XL', value: 'text-7xl' },
                              { label: '8XL', value: 'text-8xl' },
                            ],
                          },
                          {
                            type: 'string',
                            label: 'Motto Size',
                            name: 'motto',
                            options: [
                              { label: 'Small', value: 'text-sm' },
                              { label: 'Base', value: 'text-base' },
                              { label: 'Large', value: 'text-lg' },
                              { label: 'XL', value: 'text-xl' },
                              { label: '2XL', value: 'text-2xl' },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'object',
                        label: 'Font Family',
                        name: 'fontFamily',
                        fields: [
                          {
                            type: 'string',
                            label: 'Welcome Message Font',
                            name: 'welcome',
                            options: [
                              { label: 'Dafoe', value: 'font-dafoe' },
                              { label: 'Serif', value: 'font-serif' },
                              { label: 'Sans', value: 'font-sans' },
                              { label: 'Mono', value: 'font-mono' },
                            ],
                          },
                          {
                            type: 'string',
                            label: 'Main Text Font',
                            name: 'main',
                            options: [
                              { label: 'Bold', value: 'font-bold' },
                              { label: 'Normal', value: 'font-normal' },
                              { label: 'Semibold', value: 'font-semibold' },
                              { label: 'Light', value: 'font-light' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              // 3. Background Overlay
              {
                type: 'object',
                label: 'Background Overlay',
                name: 'overlay',
                fields: [
                  {
                    type: 'string',
                    label: 'Overlay Color',
                    name: 'color',
                    ui: { component: 'color' },
                    description: 'Warna overlay (format hex, rgb, atau rgba)',
                    required: false,
                  },
                  {
                    type: 'string',
                    label: 'Opacity',
                    name: 'opacity',
                    options: [
                      { label: '10%', value: '0.1' },
                      { label: '20%', value: '0.2' },
                      { label: '30%', value: '0.3' },
                      { label: '40%', value: '0.4' },
                      { label: '50%', value: '0.5' },
                      { label: '60%', value: '0.6' },
                      { label: '70%', value: '0.7' },
                      { label: '80%', value: '0.8' },
                      { label: '90%', value: '0.9' },
                    ],
                    description: 'Tingkat transparansi overlay',
                  },
                ],
              },

              // 4. ANIMATION SETTINGS
              {
                type: 'object',
                label: 'Animation Settings',
                name: 'animation',
                fields: [
                  {
                    type: 'boolean',
                    label: 'Auto Slide',
                    name: 'autoSlide',
                  },
                  {
                    type: 'number',
                    label: 'Slide Interval (ms)',
                    name: 'slideInterval',
                  },
                  {
                    type: 'number',
                    label: 'Marquee Speed',
                    name: 'marqueeSpeed',
                    min: 1,
                    max: 30,
                  },
                ],
              },
            ],
          },
          // ============ BAGIAN 3: SEO SETTINGS ============
          {
            type: 'object',
            label: 'Pengaturan SEO',
            name: 'seo',
            fields: [
              // 2A. INFORMASI SITUS
              {
                type: 'object',
                label: 'Informasi Situs',
                name: 'siteInfo',
                fields: [
                  {
                    type: 'string',
                    label: 'Nama Situs',
                    name: 'siteName',
                    required: true,
                  },
                  {
                    type: 'string',
                    label: 'URL Situs',
                    name: 'siteUrl',
                    required: true,
                  },
                  {
                    type: 'string',
                    label: 'Deskripsi Situs',
                    name: 'siteDescription',
                    ui: { component: 'textarea' },
                  },
                  {
                    type: 'image',
                    label: 'Logo Situs (SEO)',
                    name: 'siteLogo',
                  },
                  {
                    type: 'image',
                    label: 'Favicon',
                    name: 'favicon',
                  },
                ],
              },

              // 2B. META GLOBAL
              {
                type: 'object',
                label: 'Meta Tags Global',
                name: 'globalMeta',
                fields: [
                  {
                    type: 'string',
                    label: 'Title Template',
                    name: 'titleTemplate',
                    defaultValue: '%s | Nama Sekolah',
                  },
                  {
                    type: 'string',
                    label: 'Default Title',
                    name: 'defaultTitle',
                  },
                  {
                    type: 'string',
                    label: 'Default Description',
                    name: 'defaultDescription',
                    ui: { component: 'textarea' },
                  },
                  {
                    type: 'string',
                    label: 'Default Keywords',
                    name: 'defaultKeywords',
                  },
                  {
                    type: 'string',
                    label: 'Author',
                    name: 'author',
                  },
                ],
              },

              // 2C. OPEN GRAPH
              {
                type: 'object',
                label: 'Open Graph',
                name: 'openGraph',
                fields: [
                  {
                    type: 'string',
                    label: 'OG:Type',
                    name: 'type',
                    options: ['website', 'article'],
                    defaultValue: 'website',
                  },
                  {
                    type: 'string',
                    label: 'OG:Locale',
                    name: 'locale',
                    defaultValue: 'id_ID',
                  },
                  {
                    type: 'image',
                    label: 'OG:Image Default',
                    name: 'image',
                  },
                ],
              },

              // 2D. ANALYTICS (sederhana)
              {
                type: 'object',
                label: 'Analytics',
                name: 'analytics',
                fields: [
                  {
                    type: 'string',
                    label: 'Google Analytics ID',
                    name: 'gaId',
                  },
                ],
              },
            ],
          },
          // ============ BAGIAN 4: FOOTER SETTINGS ============
          {
            type: 'object',
            label: 'Footer Settings',
            name: 'footer',
            fields: [
              {
                type: 'string',
                label: 'Nama Sekolah di Footer',
                name: 'schoolName',
                description: 'Nama yang akan muncul di bagian copyright footer',
              },
            ],
          },
          // ============ BAGIAN 5: Theme Colors ============
          {
            type: "object",
            label: "Theme Colors",
            name: "themeColors",
            fields: [
              { type: "string", name: "background", label: "Background Body", ui: { component: "color" } },
              { type: "string", name: "primary", label: "Background Primary", ui: { component: "color" } },
              { type: "string", name: "secondary", label: "Background Secondary / Hover", ui: { component: "color" } },
              { type: "string", name: "surface", label: "Background Surface / Card", ui: { component: "color" } },
              { type: "string", name: "textBase", label: "Text Base", ui: { component: "color" } },
              { type: "string", name: "textHeading", label: "Heading Text", ui: { component: "color" } },
              { type: "string", name: "textMuted", label: "Muted Text", ui: { component: "color" } },
              { type: "string", name: "link", label: "Link", ui: { component: "color" } },
              { type: "string", name: "linkHover", label: "Link Hover", ui: { component: "color" } },
              { type: "string", name: "border", label: "Border", ui: { component: "color" } },
            ],
          },

        ],
      },


    ],
  },
})

