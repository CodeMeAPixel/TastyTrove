import { z } from 'zod'

export const cookbookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  coverImage: z.any().optional(),
  isPublic: z.boolean().default(true),
})

export const getCookbooksSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  userId: z.string().optional(),
})

export const getCookbookSchema = z.object({
  id: z.number().positive().int(),
})

export const addRecipeToCookbookSchema = z.object({
  cookbookId: z.number().positive().int(),
  recipeId: z.number().positive().int(),
  notes: z.string().optional(),
})

export const removeRecipeFromCookbookSchema = z.object({
  cookbookId: z.number().positive().int(),
  recipeId: z.number().positive().int(),
})
