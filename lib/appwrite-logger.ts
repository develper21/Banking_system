import { log } from './logger'

export function logAppwriteConnection(service: string, status: 'connected' | 'disconnected' | 'error', details?: any) {
  log.database(service, status, details)
}

export function logAppwriteOperation(operation: string, collection: string, status: 'success' | 'failed', details?: any) {
  log.api(`Appwrite ${collection}`, operation, status, details)
}

export function logAppwriteQuery(collection: string, query: any, resultCount?: number, responseTime?: number) {
  log.debug(`Query executed on ${collection}`, 'APPWRITE', {
    query: JSON.stringify(query),
    resultCount,
    responseTime: responseTime ? `${responseTime}ms` : undefined
  })
}
