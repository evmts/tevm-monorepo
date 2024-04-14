// Highly adapted from pino api https://github.com/pinojs/pino/blob/master/docs/api.md

export type Level = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

/**
 * Options for logger
 */
export type LogOptions = {
  /**
   * The name of the logger. Adds a name field to every JSON line logged.
   */
  name: string
  /**
   * The minimum level to log.
   * Typically, debug and trace logs are only valid for development, and not needed in production.
   */
  level: Level
}
