import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite'
import { log } from '@/lib/logger'
import { ValidationError, createErrorResponse } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      throw new ValidationError('Email and password are required')
    }

    log.info('Login attempt', 'AUTH', { email })

    const { account } = await createAdminClient()
    const session = await account.createSession(email, password)
    
    log.auth('login', 'success', session.$id)
    log.success('User logged in successfully', 'AUTH', { userId: session.$id })
    
    return NextResponse.json({
      success: true,
      data: session
    })
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    log.auth('login', 'failed', error.message)
    log.error('Authentication failed', 'AUTH', { 
      error: error.message, 
      responseTime: `${responseTime}ms` 
    })
    
    return NextResponse.json(
      createErrorResponse(error),
      { status: error instanceof ValidationError ? 400 : 401 }
    )
  }
}

export async function DELETE() {
  const startTime = Date.now()
  
  try {
    log.info('Logout attempt', 'AUTH')

    const { account } = await createAdminClient()
    await account.deleteSession('current')
    
    log.auth('logout', 'success')
    log.success('User logged out successfully', 'AUTH')
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    log.auth('logout', 'failed', error.message)
    log.error('Logout failed', 'AUTH', { 
      error: error.message, 
      responseTime: `${responseTime}ms` 
    })
    
    return NextResponse.json(
      createErrorResponse(error),
      { status: 500 }
    )
  }
}
