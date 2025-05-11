import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { and, desc, eq, like, or } from 'drizzle-orm'

import { db } from '@/db'
import { recipes } from '@/db/schema'
import { getRecipesSchema, recipesSchema } from '@/lib/validations/recipes'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { RecipesType } from '@/types/recipes'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams)

    const parsedParams = getRecipesSchema.parse({
      limit: params.limit ? parseInt(params.limit) : 10,
      offset: params.offset ? parseInt(params.offset) : 0,
      category: params.category || null,
      cuisine: params.cuisine || null,
      author: params.author || null,
      sort: params.sort || 'createdAt.desc',
      difficulty: params.difficulty || null,
      prepTime: params.prepTime || null,
      cookTime: params.cookTime || null,
      query: params.query || null,
      tags: params.tags || null,
    })

    const {
      limit,
      offset,
      category,
      cuisine,
      author,
      sort,
      difficulty,
      prepTime,
      cookTime,
      query,
      tags,
    } = parsedParams

    // Build where conditions based on filters
    let whereConditions = []

    if (category) {
      whereConditions.push(eq(recipes.category, category))
    }

    if (cuisine) {
      whereConditions.push(eq(recipes.cuisine!, cuisine))
    }

    if (difficulty) {
      whereConditions.push(eq(recipes.difficulty, difficulty))
    }

    if (author) {
      whereConditions.push(eq(recipes.userId, author))
    }

    if (prepTime) {
      const [min, max] = prepTime.split('.').map(Number)
      whereConditions.push(
        and(recipes.prepTime >= min, recipes.prepTime <= max),
      )
    }

    if (cookTime) {
      const [min, max] = cookTime.split('.').map(Number)
      whereConditions.push(
        and(recipes.cookTime! >= min, recipes.cookTime! <= max),
      )
    }

    if (query) {
      whereConditions.push(
        or(
          like(recipes.name, `%${query}%`),
          like(recipes.description, `%${query}%`),
        ),
      )
    }

    // Apply filters
    const whereClause =
      whereConditions.length > 0 ? { where: and(...whereConditions) } : {}

    // Sort logic
    const [sortField, sortDirection] = sort.split('.')
    const orderBy =
      sortDirection === 'asc'
        ? recipes[sortField as keyof typeof recipes]
        : desc(recipes[sortField as keyof typeof recipes])

    // Get total count for pagination
    const totalItemsResult = await db
      .select({ count: db.fn.count() })
      .from(recipes)
    const totalItems = Number(totalItemsResult[0].count)

    // Execute query with pagination
    const recipeResults = await db.query.recipes.findMany({
      ...whereClause,
      orderBy,
      limit,
      offset,
    })

    const response: PaginatedResponse<typeof recipeResults[0]> = {
      data: recipeResults,
      meta: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching recipes:', error)
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

    const formData = (await req.json()) as RecipesType
    const validatedData = recipesSchema.parse(formData)

    const newRecipe = await db
      .insert(recipes)
      .values({
        userId: user.id,
        name: validatedData.name,
        author:
          validatedData.author || user.firstName || user.username || 'Anonymous',
        description: validatedData.description,
        difficulty: validatedData.difficulty,
        category: validatedData.category,
        prepTime: validatedData.prepTime,
        cookTime: validatedData.cookTime || 0,
        totalTime:
          validatedData.totalTime ||
          (validatedData.prepTime + (validatedData.cookTime || 0)),
        servings: validatedData.servings || 1,
        steps: validatedData.steps,
        ingredients: validatedData.ingredients,
        images: validatedData.images,
        cuisine: validatedData.cuisine,
        nutritionInfo: validatedData.nutritionInfo,
        isPublished: validatedData.isPublished ?? true,
        notes: validatedData.notes,
        source: validatedData.source,
      })
      .returning()

    const response: ApiResponse<typeof newRecipe[0]> = {
      data: newRecipe[0],
      status: 201,
      success: true,
      message: 'Recipe created successfully',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating recipe:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
