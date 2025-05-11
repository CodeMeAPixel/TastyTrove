import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { users } from '@/db/schema'
import { getUserSchema } from '@/lib/validations/users'
import type { ApiResponse } from '@/types/api'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    
    const validatedParams = getUserSchema.parse({ id: userId })
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, validatedParams.id),
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false }, 
        { status: 404 }
      )
    }
    
    const response: ApiResponse<typeof user> = {
      data: user,
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
