import { currentUser } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Recipe images upload
  recipeUpload: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const user = await currentUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Recipe image upload complete for userId:', metadata.userId)
      console.log('file url', file.url)
      return { uploadedBy: metadata.userId, url: file.url }
    }),

  // Profile image upload
  profileImage: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await currentUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Profile image upload complete for userId:', metadata.userId)
      console.log('file url', file.url)
      return { uploadedBy: metadata.userId, url: file.url }
    }),

  // Cookbook cover image
  cookbookCover: f({
    image: {
      maxFileSize: '3MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await currentUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Cookbook cover upload complete for userId:', metadata.userId)
      console.log('file url', file.url)
      return { uploadedBy: metadata.userId, url: file.url }
    }),

  // Review images
  reviewImages: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 3,
    },
  })
    .middleware(async () => {
      const user = await currentUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Review image upload complete for userId:', metadata.userId)
      console.log('file url', file.url)
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
