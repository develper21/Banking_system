import { NextRequest, NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite'
import { plaidClient } from '@/lib/plaid'
import { CountryCode, Products } from 'plaid'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { account } = await createSessionClient()
    if (!account) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const configs = {
      user: {
        client_user_id: userId,
      },
      client_name: 'Banking App',
      products: ['auth', 'transactions'] as Products[],
      country_codes: ['US', 'IN'] as CountryCode[],
      language: 'en',
    }

    const createTokenResponse = await plaidClient.linkTokenCreate(configs)
    
    return NextResponse.json({
      success: true,
      data: createTokenResponse.data
    })
  } catch (error: any) {
    console.error('Plaid link token error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create link token' },
      { status: 500 }
    )
  }
}
