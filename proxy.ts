import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkEnvVars } from '@/lib/env-validation'
import { log } from '@/lib/logger'
import { logRequest } from '@/lib/middleware-logger'

export function proxy(request: NextRequest) {
  const startTime = Date.now()
  
  // Check environment variables in development
  if (process.env.NODE_ENV === 'development') {
    const envCheck = checkEnvVars()
    if (!envCheck.valid) {
      log.warn('Environment Variables Warning', 'ENV', envCheck.errors)
    }
  }

  // Log the request
  logRequest(request, startTime)

  // Security headers
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )

  // Calculate and log response time
  const responseTime = Date.now() - startTime
  logRequest(request, responseTime, response.status)

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
