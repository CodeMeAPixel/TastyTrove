import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { and, desc, eq, or } from 'drizzle-orm'

import { db } from '@/db'
import { cookbooks } from '@/db/schema'
import { cookbookSchema, getCookbooksSchema } from '@/lib/validations/cookbooks'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { CookbookType } from '@/types/recipes'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams)
    
    const parsedParams = getCookbooksSchema.parse({
      limit: params.limit ? parseInt(params.limit) : 10,
      offset: params.offset ? parseInt(params.offset) : 0,
      userId: params.userId || null,
    })

    const { limit, offset, userId } = parsedParams
    const user = await currentUser()
    
    // Build where conditions
    let whereConditions = []
    
    if (userId) {
      whereConditions.push(eq(cookbooks.userId, userId))
      
      // If viewing someone else's cookbooks, only show public ones
      if (user?.id !== userId) {
        whereConditions.push(eq(cookbooks.isPublic, true))
      }
    } else if (user) {
      // Either show user's cookbooks or public cookbooks
      whereConditions.push(
        or(
          eq(cookbooks.userId, user.id),
          eq(cookbooks.isPublic, true)
        )
      )
    } else {
      // Not logged in, only show public cookbooks
      whereConditions.push(eq(cookbooks.isPublic, true))
    }
    
    // Apply filters
    const whereClause = whereConditions.length > 0 
      ? { where: and(...whereConditions) }
      : {}
      
    // Get total count for pagination
    const totalItemsResult = await db.select({ count: db.fn.count() })
      .from(cookbooks)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      
    const totalItems = Number(totalItemsResult[0].count)
    
    // Execute query with pagination
    const cookbookResults = await db.query.cookbooks.findMany({
      ...whereClause,
      orderBy: desc(cookbooks.createdAt),
      limit,
      offset,
    })

    const response: PaginatedResponse<typeof cookbookResults[0]> = {
      data: cookbookResults,
      meta: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      }
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching cookbooks:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
    }

    const formData = await req.json() as CookbookType
    const validatedData = cookbookSchema.parse(formData)

    const newCookbook = await db.insert(cookbooks).values({
      userId: user.id,
      name: validatedData.name,
      description: validatedData.description,
      coverImage: validatedData.coverImage,
      isPublic: validatedData.isPublic ?? true,
    }).returning()

    const response: ApiResponse<typeof newCookbook[0]> = {
      data: newCookbook[0],
      status: 201,
      success: true,
      message: 'Cookbook created successfully',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating cookbook:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
