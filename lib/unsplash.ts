import { createApi } from 'unsplash-js'

const config = useRuntimeConfig()
export const unsplash = createApi({
  accessKey: config.unsplashAccessKey,
  fetch,
})
