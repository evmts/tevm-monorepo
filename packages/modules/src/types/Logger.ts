export type Logger = {
  info: (...messages: string[]) => void
  error: (...message: string[]) => void
  warn: (...message: string[]) => void
  log: (...message: string[]) => void
}
