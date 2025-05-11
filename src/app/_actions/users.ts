'use server'

import { db } from '@/db'
import { users, follows } from '@/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { and, eq, not } from 'drizzle-orm'
import { type z } from 'zod'

import { userProfileSchema } from '@/lib/validations/users'
import type { UserType } from '@/types/recipes'

// Save user to our database when they authenticate with Clerk
export async function saveUserToDatabase(partialUserData?: Partial<UserType>) {
  const user = await currentUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if user already exists in our database
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  })

  if (existingUser) {
    // Update user data
    await db
      .update(users)
      .set({
        displayName: partialUserData?.displayName || existingUser.displayName,
        profileImage: partialUserData?.profileImage || existingUser.profileImage,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
  } else {
    // Create new user
    await db.insert(users).values({
      id: user.id,
      displayName: partialUserData?.displayName || user.firstName || user.username || '',
      profileImage: partialUserData?.profileImage || user.imageUrl,
    })
  }
}

export async function updateUserProfileAction(
  input: z.infer<typeof userProfileSchema>
) {
  const user = await currentUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  await db
    .update(users)
    .set({
      displayName: input.displayName,
      bio: input.bio,
      profileImage: input.profileImage,
      preferences: input.preferences,
      isChef: input.isChef,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
}

export async function getUserAction(userId: string) {
  const profile = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!profile) {
    throw new Error('User not found')
  }

  return profile
}

export async function followUserAction(userId: string) {
  const currentUserData = await currentUser()
  if (!currentUserData) {
    throw new Error('Not authenticated')
  }

  // Can't follow yourself
  if (currentUserData.id === userId) {
    throw new Error('You cannot follow yourself')
  }

  // Check if target user exists
  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (!targetUser) {
    throw new Error('User not found')
  }

  // Check if already following
  const existingFollow = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerId, currentUserData.id),
      eq(follows.followedId, userId)
    ),
  })

  if (existingFollow) {
    // Unfollow
    await db.delete(follows).where(eq(follows.id, existingFollow.id))
  } else {
    // Follow
    await db.insert(follows).values({
      followerId: currentUserData.id,
      followedId: userId,
    })
  }
}

export async function getFollowersAction(userId: string) {
  return await db.query.follows.findMany({
    where: eq(follows.followedId, userId),
    with: {
      follower: true,
    },
  })
}

export async function getFollowingAction(userId: string) {
  return await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
    with: {
      followed: true,
    },
  })
}

export async function isFollowingAction(userId: string) {
  const user = await currentUser()
  if (!user) return false

  const existingFollow = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerId, user.id),
      eq(follows.followedId, userId)
    ),
  })

  return !!existingFollow
}
