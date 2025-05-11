'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { recipes, reviews, savedRecipes, tags, recipeTags, type Recipe } from '@/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  not,
  sql,
  isNull,
  or,
} from 'drizzle-orm'
import { type z } from 'zod'

import type { FileUpload, RecipesType } from '@/types/recipes'
import {
  getRecipeSchema,
  type getRecipesSchema,
  type recipesSchema,
} from '@/lib/validations/recipes'

export async function filterProductsAction(query: string) {
  if (query.length === 0) return null
  const filteredRecipes = await db
    .select({
      category: recipes.category,
      name: recipes.name,
      id: recipes.id,
    })
    .from(recipes)
    .where(like(recipes.name, `%${query}%`))
    .orderBy(recipes.createdAt)
    .limit(10)
  const data = Object.values(recipes.category.enumValues).map((category) => ({
    category,
    recipes: filteredRecipes.filter((recipe) => recipe.category === category),
  }))
  return data
}
export async function getRecipesAction(
  input: z.infer<typeof getRecipesSchema>,
) {
  const [column, order] = (input.sort?.split('.') as [
    keyof Recipe | undefined,
    'asc' | 'desc' | undefined,
  ]) ?? ['createdAt', 'desc']
  const difficulty = (input.difficulty?.split('.') as Recipe['difficulty'][]) ?? []
  const [minPrepTime, maxPrepTime] = input.prepTime?.split('-') ?? []
  const [minCookTime, maxCookTime] = input.cookTime?.split('-') ?? []
  const categories = (input.categories?.split('.') as Recipe['category'][]) ?? []
  const category = (input.category as Recipe['category']) ?? undefined
  const author = (input.author?.split('.') as Recipe['author'][]) ?? []
  const cuisine = input.cuisine ?? undefined
  const searchQuery = input.query ?? undefined
  const tagsFilter = input.tags?.split(',') ?? []

  // Create a base where condition
  let whereConditions = [];
  
  // Add filters if provided
  if (author.length) whereConditions.push(inArray(recipes.author, author));
  if (category) whereConditions.push(eq(recipes.category, category));
  if (categories.length) whereConditions.push(inArray(recipes.category, categories));
  if (difficulty.length) whereConditions.push(inArray(recipes.difficulty, difficulty));
  if (minPrepTime) whereConditions.push(gte(recipes.prepTime, parseInt(minPrepTime)));
  if (maxPrepTime) whereConditions.push(lte(recipes.prepTime, parseInt(maxPrepTime)));
  if (minCookTime) whereConditions.push(gte(recipes.cookTime, parseInt(minCookTime)));
  if (maxCookTime) whereConditions.push(lte(recipes.cookTime, parseInt(maxCookTime)));
  if (cuisine) whereConditions.push(eq(recipes.cuisine!, cuisine));
  if (searchQuery) {
    whereConditions.push(
      or(
        like(recipes.name, `%${searchQuery}%`),
        like(recipes.description, `%${searchQuery}%`)
      )
    );
  }

  // Only show published recipes to non-authors
  whereConditions.push(eq(recipes.isPublished, true));

  let recipesQuery = db
    .select()
    .from(recipes)
    .limit(input.limit)
    .offset(input.offset);

  // Apply where conditions if there are any
  if (whereConditions.length > 0) {
    recipesQuery = recipesQuery.where(and(...whereConditions));
  }

  // Handle tag filtering separately - it requires a join
  if (tagsFilter.length > 0) {
    // Get recipe IDs that have the specified tags
    const taggedRecipeIds = await db
      .select({ recipeId: recipeTags.recipeId })
      .from(recipeTags)
      .innerJoin(tags, eq(recipeTags.tagId, tags.id))
      .where(inArray(tags.name, tagsFilter))
      .groupBy(recipeTags.recipeId)
      .having({ tagCount: sql`count(*)`.gte(tagsFilter.length) }) // All tags must match
      .execute();
    
    const recipeIdsWithTags = taggedRecipeIds.map(r => r.recipeId);
    
    if (recipeIdsWithTags.length > 0) {
      recipesQuery = recipesQuery.where(inArray(recipes.id, recipeIdsWithTags));
    } else {
      // If no recipes have all requested tags, return empty result
      return { 
        items: [], 
        count: 0 
      };
    }
  }

  // Order the results
  const items = await recipesQuery
    .groupBy(recipes.id)
    .orderBy(
      column && column in recipes
        ? order === 'asc'
          ? asc(recipes[column])
          : desc(recipes[column])
        : desc(recipes.createdAt)
    )
    .execute();

  // Count query with same filters
  let countQuery = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(recipes);

  if (whereConditions.length > 0) {
    countQuery = countQuery.where(and(...whereConditions));
  }

  // Apply tag filtering to count query if needed
  if (tagsFilter.length > 0) {
    const taggedRecipeIds = await db
      .select({ recipeId: recipeTags.recipeId })
      .from(recipeTags)
      .innerJoin(tags, eq(recipeTags.tagId, tags.id))
      .where(inArray(tags.name, tagsFilter))
      .groupBy(recipeTags.recipeId)
      .having({ tagCount: sql`count(*)`.gte(tagsFilter.length) })
      .execute();
    
    const recipeIdsWithTags = taggedRecipeIds.map(r => r.recipeId);
    
    if (recipeIdsWithTags.length > 0) {
      countQuery = countQuery.where(inArray(recipes.id, recipeIdsWithTags));
    }
  }

  const count = await countQuery
    .execute()
    .then((res) => res[0]?.count ?? 0);

  return {
    items,
    count,
  }
}

export async function AddRecipeAction(
  values: z.infer<typeof recipesSchema> & {
    images: FileUpload[] | null;
    tags?: string[];
  },
) {
  const user = await currentUser();

  if (!user) {
    throw new Error('You must be logged in to add a recipe.');
  }

  const existingRecipes = await db
    .select({ name: recipes.name })
    .from(recipes)
    .where(eq(recipes.name, values.name))
    .limit(1)
    .execute();

  if (existingRecipes.length > 0) {
    throw new Error('Recipe name already taken.');
  }

  const authorName = [user.firstName ?? user.username, user.lastName ?? '']
    .filter(Boolean)
    .join(' ');

  // Insert recipe without using transaction
  const [newRecipe] = await db.insert(recipes).values({
    name: values.name,
    userId: user.id,
    author: authorName,
    description: values.description,
    difficulty: values.difficulty,
    category: values.category,
    prepTime: values.prepTime,
    cookTime: values.cookTime || 0,
    totalTime: values.totalTime || (values.prepTime + (values.cookTime || 0)),
    servings: values.servings || 1,
    steps: values.steps,
    ingredients: values.ingredients,
    cuisine: values.cuisine,
    source: values.source,
    notes: values.notes,
    isPublished: values.isPublished ?? true,
    nutritionInfo: values.nutritionInfo,
    images: values.images,
  }).returning({ id: recipes.id });

  // Handle tags if provided - without transaction
  if (values.tags && values.tags.length > 0) {
    for (const tagName of values.tags) {
      // Check if tag exists, create if not
      let tagId;
      const existingTag = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.name, tagName))
        .limit(1)
        .execute();

      if (existingTag.length > 0) {
        tagId = existingTag[0].id;
      } else {
        const [newTag] = await db
          .insert(tags)
          .values({ name: tagName })
          .returning({ id: tags.id });
        tagId = newTag.id;
      }

      // Create recipe-tag relationship
      await db.insert(recipeTags).values({
        recipeId: newRecipe.id,
        tagId: tagId,
      });
    }
  }

  revalidatePath(`/dashboard/recipes`)
}

// Uncomment and update like/dislike actions
/*
export async function dislikeRecipeAction(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to dislike a recipe.');
  }

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
  });

  if (!recipe) {
    throw new Error('Recipe not found.');
  }
  
  if (recipe.userId === user.id) {
    throw new Error('You cannot dislike your own recipe.');
  }

  await db
    .update(recipes)
    .set({
      dislikes: recipe.dislikes + 1,
    })
    .where(eq(recipes.id, id));

  revalidatePath(`/recipe/${id}`);
  return;
}

export async function likeRecipeAction(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to like a recipe.');
  }

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
  });

  if (!recipe) {
    throw new Error('Recipe not found.');
  }

  await db
    .update(recipes)
    .set({
      likes: recipe.likes + 1,
    })
    .where(eq(recipes.id, id));

  revalidatePath(`/recipe/${id}`);
  return;
}
*/

export async function UpdateRecipeAction(
  values: z.infer<typeof recipesSchema> & {
    id: number;
    images: FileUpload[] | null;
    tags?: string[];
  },
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to update a recipe.');
  }

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, values.id),
  });

  if (!recipe) {
    throw new Error('Recipe not found.');
  }
  
  if (recipe.userId !== user.id) {
    throw new Error('You do not have permission to update this recipe.');
  }

  const recipeWithSameName = await db.query.recipes.findFirst({
    where: values.id
      ? and(eq(recipes.name, values.name), not(eq(recipes.id, values.id)))
      : eq(recipes.name, values.name),
  });

  if (recipeWithSameName) {
    throw new Error('Recipe name already taken.');
  }

  // Update recipe without transaction
  await db
    .update(recipes)
    .set({
      name: values.name,
      description: values.description,
      difficulty: values.difficulty,
      category: values.category,
      prepTime: values.prepTime,
      cookTime: values.cookTime || 0,
      totalTime: values.totalTime || (values.prepTime + (values.cookTime || 0)),
      servings: values.servings || 1,
      steps: values.steps,
      ingredients: values.ingredients,
      cuisine: values.cuisine,
      source: values.source,
      notes: values.notes,
      isPublished: values.isPublished ?? true,
      nutritionInfo: values.nutritionInfo,
      images: values.images,
      updatedAt: new Date(),
    })
    .where(eq(recipes.id, values.id));

  // Handle tags if provided - without transaction
  if (values.tags) {
    // Delete existing tag relationships
    await db
      .delete(recipeTags)
      .where(eq(recipeTags.recipeId, values.id));

    // Add new tags
    for (const tagName of values.tags) {
      // Check if tag exists, create if not
      let tagId;
      const existingTag = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.name, tagName))
        .limit(1)
        .execute();

      if (existingTag.length > 0) {
        tagId = existingTag[0].id;
      } else {
        const [newTag] = await db
          .insert(tags)
          .values({ name: tagName })
          .returning({ id: tags.id });
        tagId = newTag.id;
      }

      // Create recipe-tag relationship
      await db.insert(recipeTags).values({
        recipeId: values.id,
        tagId: tagId,
      });
    }
  }

  revalidatePath(`/dashboard/recipes`)
  revalidatePath(`/recipes/${values.id}`)
}

export async function DeleteRecipeAction(
  rawInput: z.infer<typeof getRecipeSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to delete a recipe.');
  }

  const input = getRecipeSchema.parse(rawInput);

  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, input.id),
  });
  
  if (!recipe) {
    throw new Error('Recipe not found.');
  }
  
  if (recipe.userId !== user.id) {
    throw new Error('You do not have permission to delete this recipe.');
  }

  // Delete associated records without using transaction
  // Delete associated records first
  await db.delete(savedRecipes).where(eq(savedRecipes.recipeId, input.id));
  await db.delete(recipeTags).where(eq(recipeTags.recipeId, input.id));
  await db.delete(reviews).where(eq(reviews.recipeId, input.id));
  
  // Then delete the recipe
  await db.delete(recipes).where(eq(recipes.id, input.id));

  revalidatePath(`/dashboard/recipes`)
}

export async function DeleteRecipesAction() {
  return await db.delete(savedRecipes)
}

export async function getRecipesByTagAction(tagName: string) {
  return await db
    .select()
    .from(recipes)
    .innerJoin(recipeTags, eq(recipes.id, recipeTags.recipeId))
    .innerJoin(tags, eq(recipeTags.tagId, tags.id))
    .where(eq(tags.name, tagName))
    .execute();
}

export const generateRecipes = async () => {}
