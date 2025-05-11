import { z } from 'zod'

export const reviewSchema = z.object({
  recipeId: z.number().positive().int(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  content: z.string().optional(),
  images: z.any().optional(),
})

export const getReviewsSchema = z.object({
  recipeId: z.number().positive().int(),
  limit: z.number().default(10),
  offset: z.number().default(0),
})

export const voteReviewSchema = z.object({
  reviewId: z.number().positive().int(),
  helpful: z.boolean(),
})
