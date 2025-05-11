import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { cookbookRecipes, cookbooks } from '@/db/schema'
import { cookbookSchema, getCookbookSchema } from '@/lib/validations/cookbooks'
import type { ApiResponse } from '@/types/api'
import type { CookbookType } from '@/types/recipes'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const validatedParams = getCookbookSchema.parse({ id })
    
    const cookbook = await db.query.cookbooks.findFirst({
      where: eq(cookbooks.id, validatedParams.id),
      with: {
        recipes: {
          with: {
            recipe: true
          }
        }
      }
    })
    
    if (!cookbook) {
      return NextResponse.json(
        { error: 'Cookbook not found', success: false }, 
        { status: 404 }
      )
    }
    
    // Check if private cookbook can be viewed by this user
    if (!cookbook.isPublic) {
      const user = await currentUser()
      if (!user || user.id !== cookbook.userId) {
        return NextResponse.json(
          { error: 'Not authorized to view this cookbook', success: false }, 
          { status: 403 }
        )
      }
    }
    
    const response: ApiResponse<typeof cookbook> = {
      data: cookbook,
      status: 200,
      success: true,
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching cookbook:', error)
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
    const formData = await req.json() as CookbookType
    const validatedData = cookbookSchema.parse(formData)
    
    // Check if cookbook exists and belongs to user
    const existingCookbook = await db.query.cookbooks.findFirst({
      where: eq(cookbooks.id, id),
    })
    
    if (!existingCookbook) {
      return NextResponse.json(
        { error: 'Cookbook not found', success: false }, 
        { status: 404 }
      )
    }
    
    if (existingCookbook.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this cookbook', success: false }, 
        { status: 403 }
      )
    }
    
    // Update cookbook
    const updatedCookbook = await db.update(cookbooks)
      .set({
        name: validatedData.name,
        description: validatedData.description,
        coverImage: validatedData.coverImage,
        isPublic: validatedData.isPublic,
        updatedAt: new Date(),
      })
      .where(eq(cookbooks.id, id))
      .returning()
    
    const response: ApiResponse<typeof updatedCookbook[0]> = {
      data: updatedCookbook[0],
      status: 200,
      success: true,
      message: 'Cookbook updated successfully',
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error updating cookbook:', error)
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
    
    // Check if cookbook exists and belongs to user
    const existingCookbook = await db.query.cookbooks.findFirst({
      where: eq(cookbooks.id, id),
    })
    
    if (!existingCookbook) {
      return NextResponse.json(
        { error: 'Cookbook not found', success: false }, 
        { status: 404 }
      )
    }
    
    if (existingCookbook.userId !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this cookbook', success: false }, 
        { status: 403 }
      )
    }
    
    // Delete cookbook (associated recipes will cascade delete)
    await db.delete(cookbooks).where(eq(cookbooks.id, id))
    
    return NextResponse.json({
      status: 200,
      success: true,
      message: 'Cookbook deleted successfully',
    }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error deleting cookbook:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
