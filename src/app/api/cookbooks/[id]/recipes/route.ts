import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { cookbookRecipes, cookbooks, recipes } from '@/db/schema'
import { addRecipeToCookbookSchema, removeRecipeFromCookbookSchema } from '@/lib/validations/cookbooks'
import type { ApiResponse } from '@/types/api'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
    }
    
    const cookbookId = parseInt(params.id)
    
    // Validate request data
    const formData = await req.json()
    const validatedData = addRecipeToCookbookSchema.parse({ 
      ...formData,
      cookbookId, 
    })
    
    // Check if cookbook exists and belongs to user
    const existingCookbook = await db.query.cookbooks.findFirst({
      where: eq(cookbooks.id, cookbookId),
    })
    
    if (!existingCookbook) {
      return NextResponse.json(
        { error: 'Cookbook not found', success: false }, 
        { status: 404 }
      )
    }
    
    if (existingCookbook.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this cookbook', success: false }, 
        { status: 403 }
      )
    }
    
    // Check if recipe exists
    const existingRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, validatedData.recipeId),
    })
    
    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found', success: false }, 
        { status: 404 }
      )
    }
    
    // Check if recipe is already in cookbook
    const existingEntry = await db.query.cookbookRecipes.findFirst({
      where: and(
        eq(cookbookRecipes.cookbookId, cookbookId),
        eq(cookbookRecipes.recipeId, validatedData.recipeId)
      ),
    })
    
    if (existingEntry) {
      return NextResponse.json(
        { error: 'Recipe is already in this cookbook', success: false }, 
        { status: 400 }
      )
    }
    
    // Add recipe to cookbook
    const newEntry = await db.insert(cookbookRecipes)
      .values({
        cookbookId,
        recipeId: validatedData.recipeId,
        notes: validatedData.notes,
      })
      .returning()
    
    const response: ApiResponse<typeof newEntry[0]> = {
      data: newEntry[0],
      status: 201,
      success: true,
      message: 'Recipe added to cookbook successfully',
    }
    
    return NextResponse.json(response, { status: 201 })
  } catch (error: unknown) {
    console.error('Error adding recipe to cookbook:', error)
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
    
    const cookbookId = parseInt(params.id)
    
    // Validate request data
    const formData = await req.json()
    const validatedData = removeRecipeFromCookbookSchema.parse({ 
      ...formData,
      cookbookId, 
    })
    
    // Check if cookbook exists and belongs to user
    const existingCookbook = await db.query.cookbooks.findFirst({
      where: eq(cookbooks.id, cookbookId),
    })
    
    if (!existingCookbook) {
      return NextResponse.json(
        { error: 'Cookbook not found', success: false }, 
        { status: 404 }
      )
    }
    
    if (existingCookbook.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to modify this cookbook', success: false }, 
        { status: 403 }
      )
    }
    
    // Remove recipe from cookbook
    await db.delete(cookbookRecipes)
      .where(
        and(
          eq(cookbookRecipes.cookbookId, cookbookId),
          eq(cookbookRecipes.recipeId, validatedData.recipeId)
        )
      )
    
    return NextResponse.json({
      status: 200,
      success: true,
      message: 'Recipe removed from cookbook successfully',
    }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error removing recipe from cookbook:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
