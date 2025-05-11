import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { recipes } from '@/db/schema'
import { getRecipeSchema, recipesSchema } from '@/lib/validations/recipes'
import type { ApiResponse } from '@/types/api'
import type { RecipesType } from '@/types/recipes'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const validatedParams = getRecipeSchema.parse({ id })
    
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, validatedParams.id),
    })
    
    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found', success: false }, 
        { status: 404 }
      )
    }
    
    const response: ApiResponse<typeof recipe> = {
      data: recipe,
      status: 200,
      success: true,
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching recipe:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
    }
    
    const id = parseInt(params.id)
    const formData = await req.json() as RecipesType
    const validatedData = recipesSchema.parse(formData)
    
    // Check if recipe exists and belongs to user
    const existingRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
    })
    
    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found', success: false }, 
        { status: 404 }
      )
    }
    
    if (existingRecipe.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this recipe', success: false }, 
        { status: 403 }
      )
    }
    
    // Update recipe
    const updatedRecipe = await db.update(recipes)
      .set({
        name: validatedData.name,
        author: validatedData.author,
        description: validatedData.description,
        difficulty: validatedData.difficulty,
        category: validatedData.category,
        prepTime: validatedData.prepTime,
        cookTime: validatedData.cookTime || 0,
        totalTime: validatedData.totalTime || (validatedData.prepTime + (validatedData.cookTime || 0)),
        servings: validatedData.servings || 1,
        steps: validatedData.steps,
        ingredients: validatedData.ingredients,
        images: validatedData.images,
        cuisine: validatedData.cuisine,
        nutritionInfo: validatedData.nutritionInfo,
        isPublished: validatedData.isPublished ?? true,
        notes: validatedData.notes,
        source: validatedData.source,
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id))
      .returning()
    
    const response: ApiResponse<typeof updatedRecipe[0]> = {
      data: updatedRecipe[0],
      status: 200,
      success: true,
      message: 'Recipe updated successfully',
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error updating recipe:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
    }
    
    const id = parseInt(params.id)
    
    // Check if recipe exists and belongs to user
    const existingRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
    })
    
    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found', success: false }, 
        { status: 404 }
      )
    }
    
    if (existingRecipe.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this recipe', success: false }, 
        { status: 403 }
      )
    }
    
    // Delete recipe
    await db.delete(recipes).where(eq(recipes.id, id))
    
    return NextResponse.json({
      status: 200,
      success: true,
      message: 'Recipe deleted successfully',
    }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error deleting recipe:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
