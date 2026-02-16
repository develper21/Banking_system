import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite'
import { ID } from 'node-appwrite'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const { account, database } = await createAdminClient()
    
    // Create user account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    )

    // Create user profile in database
    const userData = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_USER_COLLECTION_NAME!,
      ID.unique(),
      {
        userId: user.$id,
        email: user.email,
        name: user.name,
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      }
    )

    return NextResponse.json({
      success: true,
      data: {
        user,
        profile: userData
      }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
