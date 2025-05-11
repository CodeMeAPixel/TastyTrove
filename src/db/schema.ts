import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

import type { FileUpload, IngredientsType } from '@/types/recipes'

export const categoryEnum = pgEnum('category', [
  'breakfast',
  'lunch',
  'dinner',
  'meal',
  'dessert',
  'snack',
  'appetizer',
  'drinks',
])

export type CategoryEnum = (typeof categoryEnum.enumValues)[number]

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard'])

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 256 }).primaryKey(),
    displayName: varchar('display_name', { length: 100 }),
    bio: text('bio'),
    profileImage: varchar('profile_image', { length: 512 }),
    preferences: json('preferences').$type<{
      favoriteCuisines?: string[]
      dietaryRestrictions?: string[]
    } | null>(),
    isChef: boolean('is_chef').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [
    // The primary key is already a unique index for userId
  ],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const cookbooks = pgTable(
  'cookbooks',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    coverImage: varchar('cover_image', { length: 512 }),
    isPublic: boolean('is_public').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [index('cookbooks_user_id_idx').on(table.userId)],
)

export type Cookbook = typeof cookbooks.$inferSelect
export type NewCookbook = typeof cookbooks.$inferInsert

export const cookbookRecipes = pgTable(
  'cookbook_recipes',
  {
    id: serial('id').primaryKey(),
    cookbookId: integer('cookbook_id')
      .notNull()
      .references(() => cookbooks.id, { onDelete: 'cascade' }),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    addedAt: timestamp('added_at').defaultNow().notNull(),
    notes: text('notes'),
  },
  (table) => [
    index('cookbook_recipes_cookbook_id_idx').on(table.cookbookId),
    index('cookbook_recipes_recipe_id_idx').on(table.recipeId),
    uniqueIndex('cookbook_recipes_unique_idx').on(table.cookbookId, table.recipeId),
  ],
)

export type CookbookRecipe = typeof cookbookRecipes.$inferSelect
export type NewCookbookRecipe = typeof cookbookRecipes.$inferInsert

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [
    index('comments_user_id_idx').on(table.userId),
    index('comments_recipe_id_idx').on(table.recipeId),
  ],
)

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export const follows = pgTable(
  'follows',
  {
    id: serial('id').primaryKey(),
    followerId: varchar('follower_id', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followedId: varchar('followed_id', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('follows_follower_id_idx').on(table.followerId),
    index('follows_followed_id_idx').on(table.followedId),
    uniqueIndex('follows_unique_idx').on(table.followerId, table.followedId),
  ],
)

export type Follow = typeof follows.$inferSelect
export type NewFollow = typeof follows.$inferInsert

export const recipes = pgTable(
  'recipes',
  {
    id: serial('id').primaryKey(),
    userId: varchar('userId', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 256 }).notNull(),
    author: varchar('author', { length: 256 }).notNull(),
    description: varchar('description', { length: 1024 }).notNull(),
    difficulty: difficultyEnum().notNull().default('easy'),
    rating: integer('rating').default(0),
    ingredients: json().$type<IngredientsType[]>().notNull(),
    steps: json('steps').$type<string[]>().notNull(),
    prepTime: integer('prepTime').notNull().default(0),
    cookTime: integer('cookTime').notNull().default(0),
    totalTime: integer('totalTime').notNull().default(0),
    servings: integer('servings').notNull().default(1),
    nutritionInfo: json('nutrition_info').$type<{
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
      sugar?: number;
    } | null>(),
    cuisine: varchar('cuisine', { length: 100 }),
    source: varchar('source', { length: 256 }),
    notes: text('notes'),
    isPublished: boolean('is_published').notNull().default(true),
    category: categoryEnum().notNull().default('breakfast'),
    images: json('images').$type<FileUpload[] | null>(),
    likes: integer('likes').default(0),
    dislikes: integer('dislikes').default(0),
    updatedAt: timestamp('updatedAt'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => [
    index('recipes_category_idx').on(table.category),
    index('recipes_rating_idx').on(table.rating),
    index('recipes_user_id_idx').on(table.userId),
    index('recipes_cuisine_idx').on(table.cuisine),
    index('recipes_is_published_idx').on(table.isPublished),
  ],
)

export type Recipe = typeof recipes.$inferSelect
export type NewRecipe = typeof recipes.$inferInsert

export const savedRecipes = pgTable(
  'saved_recipes',
  {
    id: serial('id').primaryKey(),
    userId: varchar('userId', { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer('recipeId')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    closed: boolean('closed').notNull().default(false),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => [index('saved_recipes_recipeId_idx').on(table.recipeId)],
)

export type SavedRecipe = typeof savedRecipes.$inferSelect
export type NewSavedRecipe = typeof savedRecipes.$inferInsert

export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull().default(0),
    title: varchar('title', { length: 100 }),
    content: text('content'),
    images: json('images').$type<FileUpload[] | null>(),
    isVerifiedPurchase: boolean('is_verified_purchase').default(false),
    helpfulVotes: integer('helpful_votes').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [
    index('reviews_user_id_idx').on(table.userId),
    index('reviews_recipe_id_idx').on(table.recipeId),
    uniqueIndex('reviews_user_recipe_idx').on(table.userId, table.recipeId), // One review per user per recipe
  ],
)

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert

export const tags = pgTable(
  'tags',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('tags_name_idx').on(table.name),
  ],
)

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert

export const recipeTags = pgTable(
  'recipe_tags',
  {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('recipe_tags_recipe_id_idx').on(table.recipeId),
    index('recipe_tags_tag_id_idx').on(table.tagId),
    uniqueIndex('recipe_tags_unique_idx').on(table.recipeId, table.tagId),
  ],
)

export type RecipeTag = typeof recipeTags.$inferSelect
export type NewRecipeTag = typeof recipeTags.$inferInsert

export const mealPlans = pgTable(
  'meal_plans',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [
    index('meal_plans_user_id_idx').on(table.userId),
  ],
)

export type MealPlan = typeof mealPlans.$inferSelect
export type NewMealPlan = typeof mealPlans.$inferInsert

export const mealPlanItems = pgTable(
  'meal_plan_items',
  {
    id: serial('id').primaryKey(),
    mealPlanId: integer('meal_plan_id')
      .notNull()
      .references(() => mealPlans.id, { onDelete: 'cascade' }),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    scheduledFor: timestamp('scheduled_for').notNull(),
    mealType: varchar('meal_type', { length: 50 }).notNull(), // breakfast, lunch, dinner, snack
    servings: integer('servings').default(1),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('meal_plan_items_meal_plan_id_idx').on(table.mealPlanId),
    index('meal_plan_items_recipe_id_idx').on(table.recipeId),
  ],
)

export type MealPlanItem = typeof mealPlanItems.$inferSelect
export type NewMealPlanItem = typeof mealPlanItems.$inferInsert

export const shoppingLists = pgTable(
  'shopping_lists',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    mealPlanId: integer('meal_plan_id')
      .references(() => mealPlans.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [
    index('shopping_lists_user_id_idx').on(table.userId),
  ],
)

export type ShoppingList = typeof shoppingLists.$inferSelect
export type NewShoppingList = typeof shoppingLists.$inferInsert

export const shoppingListItems = pgTable(
  'shopping_list_items',
  {
    id: serial('id').primaryKey(),
    shoppingListId: integer('shopping_list_id')
      .notNull()
      .references(() => shoppingLists.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    quantity: varchar('quantity', { length: 50 }),
    unit: varchar('unit', { length: 50 }),
    category: varchar('category', { length: 50 }),
    isPurchased: boolean('is_purchased').default(false),
    recipeId: integer('recipe_id')
      .references(() => recipes.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('shopping_list_items_shopping_list_id_idx').on(table.shoppingListId),
  ],
)

export type ShoppingListItem = typeof shoppingListItems.$inferSelect
export type NewShoppingListItem = typeof shoppingListItems.$inferInsert

export type SavedRecipe = typeof savedRecipes.$inferSelect
export type NewSavedRecipe = typeof savedRecipes.$inferInsert
