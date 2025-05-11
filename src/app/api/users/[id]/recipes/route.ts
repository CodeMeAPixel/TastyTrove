import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { and, desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { recipes } from '@/db/schema'
import { getUserSchema } from '@/lib/validations/users'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const url = new URL(req.url)
    const searchParams = Object.fromEntries(url.searchParams)
    
    const validatedParams = getUserSchema.parse({ id: userId })
    const limit = searchParams.limit ? parseInt(searchParams.limit) : 10
    const offset = searchParams.offset ? parseInt(searchParams.offset) : 0
    
    const currentUserData = await currentUser()
    
    // Build query conditions
    let whereConditions = [eq(recipes.userId, validatedParams.id)]
    
    // Only show published recipes unless viewing your own
    if (!currentUserData || currentUserData.id !== validatedParams.id) {
      whereConditions.push(eq(recipes.isPublished, true))
    }
    
    // Get total count for pagination
    const totalItemsResult = await db.select({ count: db.fn.count() })
      .from(recipes)
      .where(and(...whereConditions))
      
    const totalItems = Number(totalItemsResult[0].count)
    
    // Execute query with pagination
    const userRecipes = await db.query.recipes.findMany({
      where: and(...whereConditions),
      orderBy: desc(recipes.createdAt),
      limit,
      offset,
    })
    
    const response: PaginatedResponse<typeof userRecipes[0]> = {
      data: userRecipes,
      meta: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      }
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching user recipes:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
