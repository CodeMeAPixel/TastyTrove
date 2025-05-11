import { recipes } from '@/db/schema'
import { z } from 'zod'

import { Units } from '@/types/recipes'

export const recipesSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    message: 'Difficulty is required',
  }),
  category: z.enum(recipes.category.enumValues, {
    required_error: 'Must be a valid category',
  }),
  prepTime: z.number().min(0, 'Prep time must be a positive number'),
  cookTime: z.number().min(0, 'Cook time must be a positive number'),
  totalTime: z.number().min(0, 'Total time must be a positive number'),
  servings: z.number().min(1, 'At least one serving is required'),
  steps: z
    .array(z.string().min(1, 'Step cannot be empty'))
    .min(1, 'At least one step is required'),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(1, 'Ingredient is required'),
        units: z.nativeEnum(Units),
        quantity: z.number(),
        notes: z.string().optional(),
        isOptional: z.boolean().optional(),
      }),
    )
    .min(1, 'At least one ingredient is required'),
  images: z.any().optional(),
  tags: z.array(z.string()).optional(),
  cuisine: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  isPublished: z.boolean().optional().default(true),
  nutritionInfo: z
    .object({
      calories: z.number().optional(),
      protein: z.number().optional(),
      carbs: z.number().optional(),
      fat: z.number().optional(),
      fiber: z.number().optional(),
      sugar: z.number().optional(),
    })
    .optional(),
})

export const getRecipeSchema = z.object({
  id: z.number(),
})

export const getRecipesSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  categories: z.string().regex(/^\d+.\d+$/).optional().nullable(),
  category: z.string().optional().nullable(),
  sort: z.string().regex(/^\w+.(asc|desc)$/).optional().nullable(),
  author: z.string().optional().nullable(),
  prepTime: z.string().regex(/^\d+.\d+$/).optional().nullable(),
  cookTime: z.string().regex(/^\d+.\d+$/).optional().nullable(),
  difficulty: z.string().optional().nullable(),
  cuisine: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  query: z.string().optional().nullable(),
})
