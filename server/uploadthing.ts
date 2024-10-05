import type { H3Event } from 'h3'
import type { FileRouter } from 'uploadthing/h3'
import { createUploadthing } from 'uploadthing/h3'

const f = createUploadthing()
/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */

const auth = (_ev: H3Event) => ({ id: 'fakeId' }) // Fake auth function
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ event }) => {
      // This code runs on your server before upload
      const user = await auth(event)

      // If you throw, the user will not be able to upload
      if (!user) throw new Error('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
