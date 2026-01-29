export enum LogLevel {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ROUTE = 'ROUTE',
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: string
  details?: any
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  
  // Bright colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
}

const levelConfig = {
  [LogLevel.SUCCESS]: {
    color: colors.brightGreen,
    bg: colors.bgGreen,
    symbol: '✓',
    prefix: '[SUCCESS]'
  },
  [LogLevel.ERROR]: {
    color: colors.brightRed,
    bg: colors.bgRed,
    symbol: '✗',
    prefix: '[ERROR]'
  },
  [LogLevel.WARN]: {
    color: colors.brightYellow,
    bg: colors.bgYellow,
    symbol: '⚠',
    prefix: '[WARNING]'
  },
  [LogLevel.INFO]: {
    color: colors.brightBlue,
    bg: colors.bgBlue,
    symbol: 'ℹ',
    prefix: '[INFO]'
  },
  [LogLevel.DEBUG]: {
    color: colors.dim,
    bg: colors.bgMagenta,
    symbol: '🔍',
    prefix: '[DEBUG]'
  },
  [LogLevel.ROUTE]: {
    color: colors.brightCyan,
    bg: colors.bgCyan,
    symbol: '🛣',
    prefix: '[ROUTE]'
  },
}

function getTimestamp(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0')
  
  return `${colors.dim}${hours}:${minutes}:${seconds}.${milliseconds}${colors.reset}`
}

function formatMessage(level: LogLevel, message: string, context?: string, details?: any): string {
  const config = levelConfig[level]
  const timestamp = getTimestamp()
  
  let formatted = `${timestamp} ${config.bg}${colors.white}${config.symbol}${colors.reset} ${config.color}${config.prefix}${colors.reset} ${colors.bright}${message}${colors.reset}`
  
  if (context) {
    formatted += ` ${colors.cyan}(${context})${colors.reset}`
  }
  
  if (details) {
    const detailsStr = typeof details === 'string' ? details : JSON.stringify(details, null, 2)
    formatted += `\n${colors.dim}┌─ Details:${colors.reset}\n${colors.dim}│${colors.reset} ${detailsStr.split('\n').join(`\n${colors.dim}│${colors.reset} `)}\n${colors.dim}└─${colors.reset}`
  }
  
  return formatted
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs: number = 1000

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, context?: string, details?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      details
    }

    this.logs.push(entry)
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output with colors
    console.log(formatMessage(level, message, context, details))
  }

  success(message: string, context?: string, details?: any): void {
    this.log(LogLevel.SUCCESS, message, context, details)
  }

  error(message: string, context?: string, details?: any): void {
    this.log(LogLevel.ERROR, message, context, details)
  }

  warn(message: string, context?: string, details?: any): void {
    this.log(LogLevel.WARN, message, context, details)
  }

  info(message: string, context?: string, details?: any): void {
    this.log(LogLevel.INFO, message, context, details)
  }

  debug(message: string, context?: string, details?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, context, details)
    }
  }

  route(method: string, path: string, statusCode?: number, responseTime?: number): void {
    const message = `${method} ${path}`
    const details: any = {}
    
    if (statusCode) {
      details.status = statusCode
      const statusColor = statusCode >= 400 ? colors.red : statusCode >= 300 ? colors.yellow : colors.green
      details.statusText = `${statusColor}${statusCode}${colors.reset}`
    }
    
    if (responseTime) {
      details.responseTime = `${responseTime}ms`
    }

    this.log(LogLevel.ROUTE, message, 'HTTP', details)
  }

  // Database connection logs
  database(service: string, status: 'connected' | 'disconnected' | 'error', details?: any): void {
    const level = status === 'connected' ? LogLevel.SUCCESS : status === 'error' ? LogLevel.ERROR : LogLevel.WARN
    const message = `${service} ${status}`
    this.log(level, message, 'DATABASE', details)
  }

  // API service logs
  api(service: string, action: string, status: 'success' | 'failed', details?: any): void {
    const level = status === 'success' ? LogLevel.SUCCESS : LogLevel.ERROR
    const message = `${service} ${action}`
    this.log(level, message, 'API', details)
  }

  // Authentication logs
  auth(action: string, status: 'success' | 'failed', userId?: string): void {
    const level = status === 'success' ? LogLevel.SUCCESS : LogLevel.ERROR
    const message = `Auth ${action}`
    const details = userId ? { userId } : undefined
    this.log(level, message, 'AUTH', details)
  }

  // Get logs
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }
    
    return filteredLogs
  }

  // Clear logs
  clearLogs(): void {
    this.logs = []
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Export convenience functions
export const log = {
  success: (message: string, context?: string, details?: any) => logger.success(message, context, details),
  error: (message: string, context?: string, details?: any) => logger.error(message, context, details),
  warn: (message: string, context?: string, details?: any) => logger.warn(message, context, details),
  info: (message: string, context?: string, details?: any) => logger.info(message, context, details),
  debug: (message: string, context?: string, details?: any) => logger.debug(message, context, details),
  route: (method: string, path: string, statusCode?: number, responseTime?: number) => logger.route(method, path, statusCode, responseTime),
  database: (service: string, status: 'connected' | 'disconnected' | 'error', details?: any) => logger.database(service, status, details),
  api: (service: string, action: string, status: 'success' | 'failed', details?: any) => logger.api(service, action, status, details),
  auth: (action: string, status: 'success' | 'failed', userId?: string) => logger.auth(action, status, userId),
}

export default logger
