import { z } from 'zod'

export const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profileImage: z.any().optional(),
  preferences: z.object({
    favoriteCuisines: z.array(z.string()).optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
  }).optional(),
  isChef: z.boolean().optional(),
})

export const getUserSchema = z.object({
  id: z.string(),
})

export const followUserSchema = z.object({
  followedId: z.string(),
})
