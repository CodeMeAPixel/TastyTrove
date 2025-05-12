import { type FileWithPath } from 'react-dropzone'
import { type CategoryEnum } from '@/db/schema'

export type Option = {
  label: string
  value: string
}

export interface RecipesType {
  id?: number
  name: string
  author: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: CategoryEnum
  prepTime: number
  cookTime: number
  totalTime: number
  servings: number
  ingredients: IngredientsType[]
  steps: string[]
  images?: FileUpload[] | null
  tags?: string[]
  cuisine?: string
  source?: string
  notes?: string
  isPublished?: boolean
  nutritionInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
    sugar?: number
  } | null
  likes?: number
  dislikes?: number
  rating?: number
}

export enum Units {
  gram = 'g',
  milligram = 'mg',
  kilogram = 'kg',
  package = 'package',
  piece = 'piece',
  pound = 'pound(s)',
  pieces = 'pieces',
  millilitre = 'ml',
  litre = 'l',
  onz = 'oz',
  teaspoon = 'tsp',
  tablespoon = 'tbsp',
  cup = 'cup',
  pinch = 'pinch',
  unit = 'unit',
  drop = 'drop',
}

export interface IngredientsType {
  ingredient: string
  quantity: number
  units: Units
  notes?: string
  isOptional?: boolean
}

export interface StepType {
  instruction: string
  image?: FileUpload
}

export interface FileUpload {
  name: string
  id: string
  url: string
}

export type FileWithPreview = FileWithPath & { preview: string }

export interface NutritionInfoType {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
}

export interface RecipeReviewType {
  id?: number
  userId: string
  recipeId: number
  rating: number
  title?: string
  content?: string
  images?: FileUpload[] | null
  helpfulVotes?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface MealPlanType {
  id?: number
  userId: string
  name: string
  startDate: Date
  endDate: Date
  items?: MealPlanItemType[]
}

export interface MealPlanItemType {
  id?: number
  mealPlanId: number
  recipeId: number
  scheduledFor: Date
  mealType: string
  servings: number
  notes?: string
}

export interface ShoppingListType {
  id?: number
  userId: string
  name: string
  mealPlanId?: number
  items?: ShoppingListItemType[]
}

export interface ShoppingListItemType {
  id?: number
  shoppingListId: number
  name: string
  quantity?: string
  unit?: string
  category?: string
  isPurchased?: boolean
  recipeId?: number
}

export interface CookbookType {
  id?: number
  userId: string
  name: string
  description?: string
  coverImage?: string
  isPublic: boolean
  recipes?: RecipeInCookbookType[]
  createdAt?: Date
  updatedAt?: Date
}

export interface RecipeInCookbookType {
  id?: number
  cookbookId: number
  recipeId: number
  recipe?: RecipesType
  notes?: string
  addedAt?: Date
}

export interface TagType {
  id?: number
  name: string
  recipes?: RecipesType[]
}

export interface UserType {
  id: string
  displayName?: string
  bio?: string
  profileImage?: string
  preferences?: {
    favoriteCuisines?: string[]
    dietaryRestrictions?: string[]
  } | null
  isChef?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface CommentType {
  id?: number
  userId: string
  user?: UserType
  recipeId: number
  content: string
  createdAt?: Date
  updatedAt?: Date
}

export interface FollowType {
  id?: number
  followerId: string
  follower?: UserType
  followedId: string
  followed?: UserType
  createdAt?: Date
}

export interface SavedRecipeType {
  id?: number
  userId: string
  recipeId: number
  recipe?: RecipesType
  closed: boolean
  createdAt?: Date
}

// Filtering and search types
export interface RecipeFilters {
  category?: CategoryEnum
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine?: string
  prepTimeMax?: number
  cookTimeMax?: number
  tags?: string[]
  ingredients?: string[]
  authorId?: string
  query?: string
  sortBy?: 'newest' | 'popular' | 'rating' | 'prepTime'
  page?: number
  limit?: number
}
