import { createResolver } from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['layers/admin'],
  modules: ['@nuxt/ui', 'nuxt-server-fn'],
  ui: {
    global: true,
    icons: ['mdi'],
  },
  runtimeConfig: {
    dbDir: resolve('./server/db'),
  },
})
