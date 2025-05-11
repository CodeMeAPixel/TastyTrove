import { sql } from 'drizzle-orm'
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

export const category = pgEnum('category', [
  'breakfast',
  'lunch',
  'dinner',
  'meal',
  'dessert',
  'snack',
  'appetizer',
  'drinks',
])
export const difficulty = pgEnum('difficulty', ['easy', 'medium', 'hard'])

export const users = pgTable(
  'users',
  {
    id: varchar({ length: 256 }).primaryKey().notNull(),
    displayName: varchar({ length: 100 }),
    bio: text(),
    profileImage: varchar({ length: 512 }),
    preferences: json(),
    isChef: boolean().default(false),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'string' }),
  },
)

export const recipes = pgTable(
  'recipes',
  {
    id: serial().primaryKey().notNull(),
    userId: varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar({ length: 256 }).notNull(),
    author: varchar({ length: 256 }).notNull(),
    description: varchar({ length: 1024 }).notNull(),
    difficulty: difficulty().default('easy').notNull(),
    rating: integer().default(0),
    ingredients: json().notNull(),
    category: category().default('breakfast').notNull(),
    // Change steps from varchar to json
    steps: json().notNull(),
    // Add new fields
    prepTime: integer().default(0).notNull(),
    cookTime: integer().default(0).notNull(),
    totalTime: integer().default(0).notNull(),
    servings: integer().default(1).notNull(),
    cuisine: varchar({ length: 100 }),
    source: varchar({ length: 256 }),
    notes: text(),
    isPublished: boolean().default(true).notNull(),
    nutritionInfo: json(),
    images: json(),
    likes: integer().default(0),
    dislikes: integer().default(0),
    updatedAt: timestamp({ mode: 'string' }),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    index('recipes_category_idx').using(
      'btree',
      table.category.asc().nullsLast().op('enum_ops'),
    ),
    index('recipes_rating_idx').using(
      'btree',
      table.rating.asc().nullsLast().op('int4_ops'),
    ),
    index('recipes_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
    index('recipes_cuisine_idx').using(
      'btree',
      table.cuisine.asc().nullsLast().op('text_ops'),
    ),
    index('recipes_is_published_idx').using(
      'btree',
      table.isPublished.asc().nullsLast().op('bool_ops'),
    ),
  ],
)

export const savedRecipes = pgTable(
  'saved_recipes',
  {
    id: serial().primaryKey().notNull(),
    userId: varchar({ length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer()
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    closed: boolean().default(false).notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    index('saved_recipes_recipeId_idx').using(
      'btree',
      table.recipeId.asc().nullsLast().op('int4_ops'),
    ),
    index('saved_recipes_userId_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
    ),
  ],
)

export const reviews = pgTable(
  'reviews',
  {
    id: serial().primaryKey().notNull(),
    userId: varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer()
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    rating: integer().default(0).notNull(),
    title: varchar({ length: 100 }),
    content: text(),
    images: json(),
    isVerifiedPurchase: boolean().default(false),
    helpfulVotes: integer().default(0),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'string' }),
  },
  (table) => [
    index('reviews_user_id_idx').using('btree', table.userId.asc().nullsLast().op('text_ops')),
    index('reviews_recipe_id_idx').using('btree', table.recipeId.asc().nullsLast().op('int4_ops')),
    uniqueIndex('reviews_user_recipe_idx').using('btree', [
      table.userId.asc().nullsLast().op('text_ops'),
      table.recipeId.asc().nullsLast().op('int4_ops'),
    ]),
  ],
)

export const cookbooks = pgTable(
  'cookbooks',
  {
    id: serial().primaryKey().notNull(),
    userId: varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar({ length: 100 }).notNull(),
    description: text(),
    coverImage: varchar({ length: 512 }),
    isPublic: boolean().default(true).notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'string' }),
  },
  (table) => [
    index('cookbooks_user_id_idx').using('btree', table.userId.asc().nullsLast().op('text_ops')),
  ],
)

export const cookbookRecipes = pgTable(
  'cookbook_recipes',
  {
    id: serial().primaryKey().notNull(),
    cookbookId: integer()
      .notNull()
      .references(() => cookbooks.id, { onDelete: 'cascade' }),
    recipeId: integer()
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    addedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    notes: text(),
  },
  (table) => [
    index('cookbook_recipes_cookbook_id_idx').using('btree', table.cookbookId.asc().nullsLast().op('int4_ops')),
    index('cookbook_recipes_recipe_id_idx').using('btree', table.recipeId.asc().nullsLast().op('int4_ops')),
    uniqueIndex('cookbook_recipes_unique_idx').using('btree', [
      table.cookbookId.asc().nullsLast().op('int4_ops'),
      table.recipeId.asc().nullsLast().op('int4_ops'),
    ]),
  ],
)

export const comments = pgTable(
  'comments',
  {
    id: serial().primaryKey().notNull(),
    userId: varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer()
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'string' }),
  },
  (table) => [
    index('comments_user_id_idx').using('btree', table.userId.asc().nullsLast().op('text_ops')),
    index('comments_recipe_id_idx').using('btree', table.recipeId.asc().nullsLast().op('int4_ops')),
  ],
)

export const tags = pgTable(
  'tags',
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 50 }).notNull(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('tags_name_idx').using('btree', table.name.asc().nullsLast().op('text_ops')),
  ],
)

export const recipeTags = pgTable(
  'recipe_tags',
  {
    id: serial().primaryKey().notNull(),
    recipeId: integer()
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    tagId: integer()
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    index('recipe_tags_recipe_id_idx').using('btree', table.recipeId.asc().nullsLast().op('int4_ops')),
    index('recipe_tags_tag_id_idx').using('btree', table.tagId.asc().nullsLast().op('int4_ops')),
    uniqueIndex('recipe_tags_unique_idx').using('btree', [
      table.recipeId.asc().nullsLast().op('int4_ops'),
      table.tagId.asc().nullsLast().op('int4_ops'),
    ]),
  ],
)

export const follows = pgTable(
  'follows',
  {
    id: serial().primaryKey().notNull(),
    followerId: varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followedId: varchar({ length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (table) => [
    index('follows_follower_id_idx').using('btree', table.followerId.asc().nullsLast().op('text_ops')),
    index('follows_followed_id_idx').using('btree', table.followedId.asc().nullsLast().op('text_ops')),
    uniqueIndex('follows_unique_idx').using('btree', [
      table.followerId.asc().nullsLast().op('text_ops'),
      table.follow