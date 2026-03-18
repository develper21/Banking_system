import { NextRequest, NextResponse } from 'next/server'
import { createSessionClient, createAdminClient } from '@/lib/appwrite'
import { Query } from 'node-appwrite'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { account } = await createSessionClient()
    const { database } = await createAdminClient()
    if (!account) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const offset = (page - 1) * limit

    const transactions = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_TRANSACTION_COLLECTION_NAME!,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ]
    )

    return NextResponse.json({
      success: true,
      data: transactions.documents,
      pagination: {
        page,
        limit,
        total: transactions.total,
        pages: Math.ceil(transactions.total / limit)
      }
    })
  } catch (error: any) {
    console.error('Transactions fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      bankId, 
      amount, 
      category, 
      description, 
      date,
      type 
    } = await request.json()

    if (!userId || !bankId || !amount || !category || !description) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const { account } = await createSessionClient()
    const { database } = await createAdminClient()
    if (!account) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const transaction = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_TRANSACTION_COLLECTION_NAME!,
      'unique()',
      {
        userId,
        bankId,
        amount: parseFloat(amount),
        category,
        description,
        date: date || new Date().toISOString(),
        type: type || 'debit',
        createdAt: new Date().toISOString(),
      }
    )

    return NextResponse.json({
      success: true,
      data: transaction
    })
  } catch (error: any) {
    console.error('Transaction creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
