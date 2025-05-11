'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { cookbooks, cookbookRecipes, recipes } from '@/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { and, eq, desc, not, sql } from 'drizzle-orm'
import { type z } from 'zod'

import {
  cookbookSchema,
  getCookbookSchema,
  getCookbooksSchema,
  addRecipeToCookbookSchema,
  removeRecipeFromCookbookSchema,
} from '@/lib/validations/cookbooks'

export async function getCookbooksAction(
  input: z.infer<typeof getCookbooksSchema>,
) {
  const { limit, offset, userId } = input;

  // Create base query
  let query = db.query.cookbooks.findMany({
    orderBy: [desc(cookbooks.createdAt)],
    limit,
    offset,
  });

  // Filter by user ID if provided
  if (userId) {
    query = db.query.cookbooks.findMany({
      where: eq(cookbooks.userId, userId),
      orderBy: [desc(cookbooks.createdAt)],
      limit,
      offset,
    });
  } else {
    // If no userId specified, only show public cookbooks
    query = db.query.cookbooks.findMany({
      where: eq(cookbooks.isPublic, true),
      orderBy: [desc(cookbooks.createdAt)],
      limit,
      offset,
    });
  }

  // Execute the query
  const cookbooksList = await query;

  // Get the total count based on the same filters
  const countQuery = userId
    ? db
        .select({ count: sql<number>`count(*)` })
        .from(cookbooks)
        .where(eq(cookbooks.userId, userId))
    : db
        .select({ count: sql<number>`count(*)` })
        .from(cookbooks)
        .where(eq(cookbooks.isPublic, true));

  const countResult = await countQuery.execute();
  const totalCount = Number(countResult[0].count);

  return {
    cookbooks: cookbooksList,
    count: totalCount,
  };
}

export async function getCookbookAction(
  input: z.infer<typeof getCookbookSchema>,
) {
  const { id } = input;
  const user = await currentUser();

  // Find the cookbook
  const cookbook = await db.query.cookbooks.findFirst({
    where: eq(cookbooks.id, id),
  });

  if (!cookbook) {
    throw new Error('Cookbook not found.');
  }

  // Check permissions - cookbook must be public or owned by the current user
  if (!cookbook.isPublic && (!user || cookbook.userId !== user.id)) {
    throw new Error('You do not have permission to view this cookbook.');
  }

  // Get all recipes in this cookbook
  const cookbookRecipesList = await db
    .select()
    .from(cookbookRecipes)
    .where(eq(cookbookRecipes.cookbookId, id))
    .execute();

  const recipeIds = cookbookRecipesList.map((cr) => cr.recipeId);

  // Get the actual recipe data if there are recipes in the cookbook
  let recipesList = [];
  if (recipeIds.length > 0) {
    recipesList = await db
      .select()
      .from(recipes)
      .where(sql`${recipes.id} IN (${recipeIds.join(',')})`)
      .execute();
  }

  // Associate notes with recipes
  const recipesWithNotes = recipesList.map((recipe) => {
    const cookbookRecipe = cookbookRecipesList.find(
      (cr) => cr.recipeId === recipe.id
    );
    return {
      ...recipe,
      notes: cookbookRecipe?.notes || null,
      addedAt: cookbookRecipe?.addedAt || null,
    };
  });

  return {
    ...cookbook,
    recipes: recipesWithNotes,
  };
}

export async function createCookbookAction(
  input: z.infer<typeof cookbookSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to create a cookbook.');
  }

  // Create the cookbook
  const [newCookbook] = await db
    .insert(cookbooks)
    .values({
      userId: user.id,
      name: input.name,
      description: input.description || '',
      coverImage: input.coverImage,
      isPublic: input.isPublic,
    })
    .returning();

  revalidatePath('/dashboard/cookbooks');
  return newCookbook;
}

export async function updateCookbookAction(
  id: number,
  input: z.infer<typeof cookbookSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to update a cookbook.');
  }

  // Check if cookbook exists and belongs to user
  const existingCookbook = await db.query.cookbooks.findFirst({
    where: eq(cookbooks.id, id),
  });

  if (!existingCookbook) {
    throw new Error('Cookbook not found.');
  }

  if (existingCookbook.userId !== user.id) {
    throw new Error('You do not have permission to update this cookbook.');
  }

  // Update the cookbook
  await db
    .update(cookbooks)
    .set({
      name: input.name,
      description: input.description || '',
      coverImage: input.coverImage,
      isPublic: input.isPublic,
      updatedAt: new Date(),
    })
    .where(eq(cookbooks.id, id));

  revalidatePath('/dashboard/cookbooks');
  revalidatePath(`/cookbooks/${id}`);
}

export async function deleteCookbookAction(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to delete a cookbook.');
  }

  // Check if cookbook exists and belongs to user
  const existingCookbook = await db.query.cookbooks.findFirst({
    where: eq(cookbooks.id, id),
  });

  if (!existingCookbook) {
    throw new Error('Cookbook not found.');
  }

  if (existingCookbook.userId !== user.id) {
    throw new Error('You do not have permission to delete this cookbook.');
  }

  // Use transaction to delete cookbook and all references
  await db.transaction(async (tx) => {
    // Delete cookbook recipes first
    await tx.delete(cookbookRecipes).where(eq(cookbookRecipes.cookbookId, id));
    
    // Then delete the cookbook
    await tx.delete(cookbooks).where(eq(cookbooks.id, id));
  });

  revalidatePath('/dashboard/cookbooks');
}

export async function addRecipeToCookbookAction(
  input: z.infer<typeof addRecipeToCookbookSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to add recipes to cookbooks.');
  }

  // Check if cookbook exists and belongs to user
  const existingCookbook = await db.query.cookbooks.findFirst({
    where: eq(cookbooks.id, input.cookbookId),
  });

  if (!existingCookbook) {
    throw new Error('Cookbook not found.');
  }

  if (existingCookbook.userId !== user.id) {
    throw new Error('You do not have permission to modify this cookbook.');
  }

  // Check if recipe exists
  const existingRecipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, input.recipeId),
  });

  if (!existingRecipe) {
    throw new Error('Recipe not found.');
  }

  // Check if recipe is already in cookbook
  const existingEntry = await db.query.cookbookRecipes.findFirst({
    where: and(
      eq(cookbookRecipes.cookbookId, input.cookbookId),
      eq(cookbookRecipes.recipeId, input.recipeId)
    ),
  });

  if (existingEntry) {
    throw new Error('Recipe is already in this cookbook.');
  }

  // Add recipe to cookbook
  await db.insert(cookbookRecipes).values({
    cookbookId: input.cookbookId,
    recipeId: input.recipeId,
    notes: input.notes,
  });

  revalidatePath(`/cookbooks/${input.cookbookId}`);
  revalidatePath('/dashboard/cookbooks');
}

export async function removeRecipeFromCookbookAction(
  input: z.infer<typeof removeRecipeFromCookbookSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to remove recipes from cookbooks.');
  }

  // Check if cookbook exists and belongs to user
  const existingCookbook = await db.query.cookbooks.findFirst({
    where: eq(cookbooks.id, input.cookbookId),
  });

  if (!existingCookbook) {
    throw new Error('Cookbook not found.');
  }

  if (existingCookbook.userId !== user.id) {
    throw new Error('You do not have permission to modify this cookbook.');
  }

  // Remove recipe from cookbook
  await db
    .delete(cookbookRecipes)
    .where(
      and(
        eq(cookbookRecipes.cookbookId, input.cookbookId),
        eq(cookbookRecipes.recipeId, input.recipeId)
      )
    );

  revalidatePath(`/cookbooks/${input.cookbookId}`);
  revalidatePath('/dashboard/cookbooks');
}
