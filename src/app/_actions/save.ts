'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { recipes, savedRecipes } from '@/db/schema'
import { auth, currentUser } from '@clerk/nextjs/server'
import { and, eq, inArray } from 'drizzle-orm'
import { type z } from 'zod'

import {
  type addSaveRecipeSchema,
  type getSavedRecipeSchema,
} from '@/lib/validations/save-recipes'

export async function getSavedRecipesAction() {
  const { userId } = await auth()
  if (!userId) {
    return []
  }

  const savedRecipe = await db.query.savedRecipes.findMany({
    where: eq(savedRecipes.userId, String(userId)),
  })
  const recipesIds = savedRecipe.map((recipe) => recipe.recipeId)

  if (recipesIds.length === 0) return []

  const uniqueRecipesIds = [...new Set(recipesIds)]

  const allRecipes = await db
    .select()
    .from(recipes)
    .where(and(inArray(recipes.id, uniqueRecipesIds)))
    .groupBy(recipes.id)
    .execute()

  // Add closed status from savedRecipes
  const recipesWithSavedStatus = allRecipes.map((recipe) => {
    const savedInfo = savedRecipe.find((saved) => saved.recipeId === recipe.id)
    return {
      ...recipe,
      closed: savedInfo?.closed || false,
      savedAt: savedInfo?.createdAt || null,
      savedId: savedInfo?.id || null,
    }
  })

  return recipesWithSavedStatus
}

export async function addToSavedAction(
  input: z.infer<typeof addSaveRecipeSchema>,
) {
  const user = await currentUser()
  if (!user) {
    throw new Error('You must be logged in to save recipes.')
  }

  // Check if recipe exists
  const recipeExists = await db.query.recipes.findFirst({
    where: eq(recipes.id, input.recipeId),
  })

  if (!recipeExists) {
    throw new Error('Recipe not found.')
  }

  const checkIfSaved = await db.query.savedRecipes.findFirst({
    where: and(
      eq(savedRecipes.recipeId, input.recipeId),
      eq(savedRecipes.userId, user.id),
    ),
  })

  if (checkIfSaved) {
    // If already saved, toggle the closed status
    await db
      .update(savedRecipes)
      .set({
        closed: !checkIfSaved.closed,
      })
      .where(eq(savedRecipes.id, checkIfSaved.id))
  } else {
    // Otherwise, create a new saved recipe
    await db.insert(savedRecipes).values({
      recipeId: input.recipeId,
      userId: user.id,
    })
  }
  
  revalidatePath('/')
  revalidatePath(`/recipes/${input.recipeId}`)
  revalidatePath('/dashboard/saved')
}

export async function DeleteSavedRecipeAction(
  input: z.infer<typeof getSavedRecipeSchema>,
) {
  const user = await currentUser()
  if (!user) {
    throw new Error('You must be logged in to manage saved recipes.')
  }

  const saveRecipe = await db.query.savedRecipes.findFirst({
    where: and(
      eq(savedRecipes.recipeId, input.recipeId),
      eq(savedRecipes.userId, user.id),
    ),
  })

  if (!saveRecipe) {
    throw new Error('Saved recipe not found.')
  }

  await db.delete(savedRecipes).where(eq(savedRecipes.id, saveRecipe.id))

  revalidatePath(`/dashboard/saved`)
  revalidatePath(`/recipes/${input.recipeId}`)
}

export async function toggleSavedStatusAction(savedId: number) {
  const user = await currentUser()
  if (!user) {
    throw new Error('You must be logged in to manage saved recipes.')
  }

  const savedEntry = await db.query.savedRecipes.findFirst({
    where: and(
      eq(savedRecipes.id, savedId),
      eq(savedRecipes.userId, user.id),
    ),
  })

  if (!savedEntry) {
    throw new Error('Saved recipe not found.')
  }

  await db
    .update(savedRecipes)
    .set({
      closed: !savedEntry.closed,
    })
    .where(eq(savedRecipes.id, savedId))

  revalidatePath(`/dashboard/saved`)
}
