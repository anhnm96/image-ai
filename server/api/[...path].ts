import { unsplash } from '~~/lib/unsplash'
import { createRouter, useBase } from 'h3'

const router = createRouter()

const DEFAULT_COUNT = 50
const DEFAULT_COLLECTION_IDS = ['317099']

router.get('/images', defineEventHandler(async () => {
  const images = await unsplash.photos.getRandom({
    collectionIds: DEFAULT_COLLECTION_IDS,
    count: DEFAULT_COUNT,
  })

  if (images.errors) {
    throw createError({ statusCode: 400, message: 'Something went wrong' })
  }

  let response = images.response

  if (!Array.isArray(response)) {
    response = [response]
  }

  return { images: response }
}))

export default useBase('/api', router.handler)
