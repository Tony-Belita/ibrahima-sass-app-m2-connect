/**
 * Système de logging centralisé pour l'application
 * Permet de contrôler les logs par environnement et niveau
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  enableDebug: boolean;
  enableInfo: boolean;
  enableWarn: boolean;
  enableError: boolean;
}

// Configuration par défaut en fonction de l'environnement
const defaultConfig: LogConfig = {
  enableDebug: process.env.NODE_ENV === 'development',
  enableInfo: process.env.NODE_ENV === 'development',
  enableWarn: true,
  enableError: true,
};

class Logger {
  private config: LogConfig;

  constructor(config?: Partial<LogConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    switch (level) {
      case 'debug':
        return this.config.enableDebug;
      case 'info':
        return this.config.enableInfo;
      case 'warn':
        return this.config.enableWarn;
      case 'error':
        return this.config.enableError;
      default:
        return false;
    }
  }

  private formatMessage(level: LogLevel, message: string, context?: unknown): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, context || '');
        break;
      case 'info':
        console.info(prefix, message, context || '');
        break;
      case 'warn':
        console.warn(prefix, message, context || '');
        break;
      case 'error':
        console.error(prefix, message, context || '');
        break;
    }
  }

  debug(message: string, context?: unknown): void {
    this.formatMessage('debug', message, context);
  }

  info(message: string, context?: unknown): void {
    this.formatMessage('info', message, context);
  }

  warn(message: string, context?: unknown): void {
    this.formatMessage('warn', message, context);
  }

  error(message: string, context?: unknown): void {
    this.formatMessage('error', message, context);
  }

  // Méthodes spécialisées pour l'application
  api(endpoint: string, method: string, data?: unknown): void {
    this.debug(`API ${method} ${endpoint}`, data);
  }

  business(action: string, data?: unknown): void {
    this.info(`Business Logic: ${action}`, data);
  }

  audit(action: string, userId?: string, data?: Record<string, unknown>): void {
    this.info(`Audit: ${action}`, { userId, ...(data || {}) });
  }
}

// Instance globale du logger
export const logger = new Logger();

// Export des types pour utilisation externe si nécessaire
export type { LogLevel, LogConfig };
