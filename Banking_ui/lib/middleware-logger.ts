import { NextRequest, NextResponse } from 'next/server'
import { log } from './logger'

export function logRequest(request: NextRequest, responseTime?: number, statusCode?: number) {
  const method = request.method
  const url = request.url
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  
  // Extract path from URL
  const urlObj = new URL(url)
  const path = urlObj.pathname + urlObj.search
  
  log.route(method, path, statusCode, responseTime)
  
  // Log additional details in development
  if (process.env.NODE_ENV === 'development') {
    log.debug('Request details', 'HTTP', {
      method,
      path,
      userAgent,
      ip: request.ip || 'unknown',
      headers: Object.fromEntries(request.headers.entries())
    })
  }
}

export function createLoggingMiddleware() {
  return (request: NextRequest) => {
    const startTime = Date.now()
    
    // Log the incoming request
    logRequest(request)
    
    // Create a response
    const response = NextResponse.next()
    
    // Calculate response time
    const responseTime = Date.now() - startTime
    
    // Log the response
    logRequest(request, responseTime, response.status)
    
    return response
  }
}
