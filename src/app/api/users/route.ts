import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { users } from '@/db/schema'
import { userProfileSchema } from '@/lib/validations/users'
import type { ApiResponse } from '@/types/api'
import type { UserType } from '@/types/recipes'

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
    }
    
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    })
    
    // If user doesn't exist in our database yet, create a minimal profile
    if (!dbUser) {
      const newUser = await db.insert(users)
        .values({
          id: user.id,
          displayName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
          profileImage: user.imageUrl,
        })
        .returning()
        
      const response: ApiResponse<typeof newUser[0]> = {
        data: newUser[0],
        status: 200,
        success: true,
      }
      
      return NextResponse.json(response, { status: 200 })
    }
    
    const response: ApiResponse<typeof dbUser> = {
      data: dbUser,
      status: 200,
      success: true,
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching user profile:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 })
    }
    
    const formData = await req.json() as UserType
    const validatedData = userProfileSchema.parse(formData)
    
    // Check if user exists in our database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    })
    
    if (!existingUser) {
      // Create new user profile
      const newUser = await db.insert(users)
        .values({
          id: user.id,
          displayName: validatedData.displayName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username),
          bio: validatedData.bio,
          profileImage: validatedData.profileImage || user.imageUrl,
          preferences: validatedData.preferences,
          isChef: validatedData.isChef,
        })
        .returning()
        
      const response: ApiResponse<typeof newUser[0]> = {
        data: newUser[0],
        status: 201,
        success: true,
        message: 'User profile created successfully',
      }
      
      return NextResponse.json(response, { status: 201 })
    }
    
    // Update existing user profile
    const updatedUser = await db.update(users)
      .set({
        displayName: validatedData.displayName,
        bio: validatedData.bio,
        profileImage: validatedData.profileImage,
        preferences: validatedData.preferences,
        isChef: validatedData.isChef,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning()
      
    const response: ApiResponse<typeof updatedUser[0]> = {
      data: updatedUser[0],
      status: 200,
      success: true,
      message: 'User profile updated successfully',
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Error updating user profile:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred', success: false },
      { status: 500 },
    )
  }
}
