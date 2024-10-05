// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  extends: ['./layers/editor'],
  css: ['~/assets/main.css'],
  modules: ['@vueuse/nuxt', '@nuxt/icon', '@pinia/nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  imports: {
    presets: [
      {
        from: '@tanstack/vue-query',
        imports: ['useQuery', 'useQueries', 'useInfiniteQuery', 'useMutation', 'useQueryClient', 'useIsFetching'],
      },
    ],
  },
  components: {
    dirs: [
      {
        path: '~/components/ui',
        extensions: ['vue'],
        pathPrefix: false,
      },
      {
        path: '~/components',
        extensions: ['vue'],
      },
    ],
  },
  runtimeConfig: {
    unsplashAccessKey: '',
  },
})
