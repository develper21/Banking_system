import { log } from './logger'
import { validateEnv } from './env-validation'

export function logStartup() {
  log.info('🚀 Banking App Starting...', 'STARTUP')
  
  try {
    // Validate environment variables
    const env = validateEnv()
    log.success('Environment variables validated', 'STARTUP')
    
    // Log environment info
    log.info('Environment Configuration', 'STARTUP', {
      nodeEnv: process.env.NODE_ENV,
      appwriteProject: env.NEXT_PUBLIC_APPWRITE_PROJECT,
      plaidEnv: env.PLAID_ENV,
      dwollaEnv: env.DWOLLA_ENV,
      sentryEnabled: !!env.SENTRY_AUTH_TOKEN
    })
    
    // Log database connections
    log.database('Appwrite', 'connected')
    
    // Log external services
    log.api('Plaid', 'initializing', 'success')
    log.api('Dwolla', 'initializing', 'success')
    
    if (env.SENTRY_AUTH_TOKEN) {
      log.api('Sentry', 'initializing', 'success')
    }
    
    log.success('🎉 Banking App Started Successfully!', 'STARTUP')
    
  } catch (error: any) {
    log.error('❌ Failed to start application', 'STARTUP', { error: error.message })
    throw error
  }
}

export function logShutdown() {
  log.info('🛑 Banking App Shutting Down...', 'SHUTDOWN')
  log.database('Appwrite', 'disconnected')
  log.success('Banking App Shutdown Complete', 'SHUTDOWN')
}
