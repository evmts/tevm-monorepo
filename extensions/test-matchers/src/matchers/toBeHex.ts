import { isHex } from "viem"

export type IsHexOptions = {
  /**
   * Whether to check for strict hex format or only for 0x prefix
   * @default true
   */
  strict?: boolean
  /**
   * Optional expected size in bytes
   */
  size?: number
}

/**
 * Custom Vitest matcher to assert that a value is valid hex
 * @param received - The value to test
 * @param expectedSize - Optional expected size of hex characters (without 0x prefix)
 * @returns Object with pass boolean and message function
 */
export function toBeHex(received: string, opts?: IsHexOptions) {
  const isValidHex = isHex(received, opts)
  const receivedSize = typeof received === 'string' ? (received.length - 2) / 2 : 0
  const isValidSize = opts?.size === undefined || receivedSize === opts.size
  const startsWithHex = typeof received === 'string' && received.startsWith('0x')
  const pass = isValidHex && isValidSize

  return {
    pass,
    message: () => {
      if (pass) {
        return `Expected "${received}" not to be valid hex${opts?.size ? ` with size ${opts.size}` : ''}`
      } else {
        if (!startsWithHex) return `Expected "${received}" to start with "0x"`
        if (!isValidHex) return `Expected "${received}" to contain only hex characters (0-9, a-f, A-F) after "0x"`
        if (!isValidSize) return `Expected "${received}" to have ${opts?.size} bytes after "0x", but got ${receivedSize}`
        return `Expected "${received}" to be valid hex${opts?.size ? ` with size ${opts.size}` : ''}`
      }
    },
  }
}