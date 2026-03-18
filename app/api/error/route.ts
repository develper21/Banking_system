import { NextRequest, NextResponse } from 'next/server'
import { logError, createErrorResponse } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const { error, context } = await request.json()

    if (!error) {
      return NextResponse.json(
        { error: 'Error data is required' },
        { status: 400 }
      )
    }

    // Log the error with additional context
    logError(error, context)

    // In production, you would send this to your error monitoring service
    // For example: Sentry.captureException(error, { extra: { context, userAgent, url } })

    return NextResponse.json({
      success: true,
      message: 'Error logged successfully'
    })
  } catch (err) {
    console.error('Error logging failed:', err)
    return NextResponse.json(
      createErrorResponse(err),
      { status: 500 }
    )
  }
}
