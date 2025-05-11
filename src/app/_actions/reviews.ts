'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { reviews, recipes } from '@/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { and, eq, desc, average, sum } from 'drizzle-orm'
import { type z } from 'zod'

import type { RecipeReviewType } from '@/types/recipes'
import {
  reviewSchema,
  getReviewsSchema,
  voteReviewSchema,
} from '@/lib/validations/reviews'

export async function getReviewsAction(
  input: z.infer<typeof getReviewsSchema>,
) {
  const { recipeId, limit, offset } = input;

  // Find all reviews for a recipe
  const reviewList = await db.query.reviews.findMany({
    where: eq(reviews.recipeId, recipeId),
    orderBy: [desc(reviews.helpfulVotes), desc(reviews.createdAt)],
    limit,
    offset,
  });

  // Get total count
  const countResult = await db
    .select({ count: db.fn.count() })
    .from(reviews)
    .where(eq(reviews.recipeId, recipeId))
    .execute();

  const totalCount = Number(countResult[0].count);

  return {
    reviews: reviewList,
    count: totalCount,
  };
}

export async function addReviewAction(
  input: z.infer<typeof reviewSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to add a review.');
  }

  // Check if user already reviewed this recipe
  const existingReview = await db.query.reviews.findFirst({
    where: and(
      eq(reviews.userId, user.id),
      eq(reviews.recipeId, input.recipeId)
    ),
  });

  if (existingReview) {
    throw new Error('You have already reviewed this recipe.');
  }

  // Check if recipe exists
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, input.recipeId),
  });

  if (!recipe) {
    throw new Error('Recipe not found.');
  }

  // Don't allow authors to review their own recipes
  if (recipe.userId === user.id) {
    throw new Error('You cannot review your own recipe.');
  }

  // Add the new review
  await db.insert(reviews).values({
    userId: user.id,
    recipeId: input.recipeId,
    rating: input.rating,
    title: input.title,
    content: input.content,
    images: input.images,
  });

  // Update recipe's average rating
  const ratingsResult = await db
    .select({ avgRating: average(reviews.rating) })
    .from(reviews)
    .where(eq(reviews.recipeId, input.recipeId))
    .execute();

  if (ratingsResult[0]?.avgRating) {
    await db
      .update(recipes)
      .set({ rating: Math.round(ratingsResult[0].avgRating) })
      .where(eq(recipes.id, input.recipeId));
  }

  revalidatePath(`/recipes/${input.recipeId}`);
}

export async function updateReviewAction(
  reviewId: number,
  input: z.infer<typeof reviewSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to update a review.');
  }

  // Get the review
  const existingReview = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  });

  if (!existingReview) {
    throw new Error('Review not found.');
  }

  // Check ownership
  if (existingReview.userId !== user.id) {
    throw new Error('You can only update your own reviews.');
  }

  // Update the review
  await db
    .update(reviews)
    .set({
      rating: input.rating,
      title: input.title,
      content: input.content,
      images: input.images,
      updatedAt: new Date(),
    })
    .where(eq(reviews.id, reviewId));

  // Update recipe's average rating
  const ratingsResult = await db
    .select({ avgRating: average(reviews.rating) })
    .from(reviews)
    .where(eq(reviews.recipeId, input.recipeId))
    .execute();

  if (ratingsResult[0]?.avgRating) {
    await db
      .update(recipes)
      .set({ rating: Math.round(ratingsResult[0].avgRating) })
      .where(eq(recipes.id, input.recipeId));
  }

  revalidatePath(`/recipes/${input.recipeId}`);
}

export async function deleteReviewAction(reviewId: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to delete a review.');
  }

  // Get the review
  const existingReview = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  });

  if (!existingReview) {
    throw new Error('Review not found.');
  }

  // Check ownership
  if (existingReview.userId !== user.id) {
    throw new Error('You can only delete your own reviews.');
  }

  const recipeId = existingReview.recipeId;

  // Delete the review
  await db.delete(reviews).where(eq(reviews.id, reviewId));

  // Update recipe's average rating
  const ratingsResult = await db
    .select({ avgRating: average(reviews.rating) })
    .from(reviews)
    .where(eq(reviews.recipeId, recipeId))
    .execute();

  if (ratingsResult[0]?.avgRating) {
    await db
      .update(recipes)
      .set({ rating: Math.round(ratingsResult[0].avgRating) })
      .where(eq(recipes.id, recipeId));
  } else {
    // No reviews left, reset rating to 0
    await db
      .update(recipes)
      .set({ rating: 0 })
      .where(eq(recipes.id, recipeId));
  }

  revalidatePath(`/recipes/${recipeId}`);
}

export async function voteReviewAction(
  input: z.infer<typeof voteReviewSchema>,
) {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to vote on reviews.');
  }

  // Get the review
  const existingReview = await db.query.reviews.findFirst({
    where: eq(reviews.id, input.reviewId),
  });

  if (!existingReview) {
    throw new Error('Review not found.');
  }

  // Don't allow users to vote on their own reviews
  if (existingReview.userId === user.id) {
    throw new Error('You cannot vote on your own review.');
  }

  // If helpful, increment the helpful votes counter
  if (input.helpful) {
    await db
      .update(reviews)
      .set({
        helpfulVotes: existingReview.helpfulVotes + 1,
      })
      .where(eq(reviews.id, input.reviewId));
  }

  revalidatePath(`/recipes/${existingReview.recipeId}`);
}
