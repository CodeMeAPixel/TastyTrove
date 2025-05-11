import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { and, desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { reviews } from '@/db/schema'
import { getReviewsSchema, reviewSchema } from '@/lib/validations/reviews'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { RecipeReviewType } from '@/types/recipes'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams)
    
    const parsedParams = getReviewsSchema.parse({
      recipeId: parseInt(params.recipeId || '0'),
      limit: params.limit ? parseInt(params.limit) : 10,
      offset: params.offset ? parseInt(params.offset) : 0,
    })

    const { recipeId, limit, offset } = parsedParams

    // Get total count for pagination
    const totalItemsResult = await db.select({ count: db.fn.count() })
      .from(reviews)
      .where(eq(reviews.recipeId, recipeId))
      
    const totalItems = Number(totalItemsResult[0].count)
    
    // Execute query with pagination
    const reviewResults = await db.query.reviews.findMany({
      where: eq(reviews.recipeId, recipeId),
      orderBy: desc(reviews.createdAt),
      limit,
      offset,
    })

    const response: PaginatedResponse<typeof reviewResults[0]> = {
      data: reviewResults,
      meta: {
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      }
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error)
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

    const formData = await req.json() as RecipeReviewType
    const validatedData = reviewSchema.parse(formData)

    // Check if user already reviewed this recipe
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.userId, user.id),
        eq(reviews.recipeId, validatedData.recipeId)
      ),
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this recipe', success: false }, 
        { status: 400 }
      )
    }

    const newReview = await db.insert(reviews).values({
      userId: user.id,
      recipeId: validatedData.recipeId,
      rating: validatedData.rating,
      title: validatedData.title,
      content: validatedData.content,
      images: validatedData.images,
    }).returning()

    // Update recipe rating average
    const recipeReviews = await db.query.reviews.findMany({
      where: eq(reviews.recipeId, validatedData.recipeId),
    })
    
    const averageRating = recipeReviews.reduce((sum, review) => sum + review.rating, 0) / recipeReviews.length

    await db.update(reviews)
      .set({ rating: Math.round(averageRating) })
      .where(eq(reviews.id, validatedData.recipeId))

    const response: ApiResponse<typeof newReview[0]> = {
      data: newReview[0],
      status: 201,
      success: true,
      message: 'Review submitted successfully',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating review:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
