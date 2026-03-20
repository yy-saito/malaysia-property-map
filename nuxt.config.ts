// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  css: ['./app/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'Malaysia Property Map',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || 'local',
    },
  },
  i18n: {
    defaultLocale: 'ja',
    locales: [
      {
        code: 'ja',
        name: '日本語',
        file: 'ja.json',
      },
    ],
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
  future: {
    compatibilityVersion: 4,
  },
})
