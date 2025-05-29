import { isHex } from "viem"

export type IsHexOptions = {
  /**
   * Whether to check for strict hex format or only for 0x prefix
   * @default true
   */
  strict?: boolean
  /**
   * Optional expected length in bytes
   */
  length?: number
}

/**
 * Custom Vitest matcher to assert that a value is valid hex
 * @param received - The value to test
 * @param expectedLength - Optional expected length of hex characters (without 0x prefix)
 * @returns Object with pass boolean and message function
 */
export function toBeHex(received: string, opts?: IsHexOptions) {
  const isValidHex = isHex(received, opts)
  const isValidLength = opts?.length === undefined || (received.length % 2 === 0 && received.length === opts.length * 2 + 2)
  const startsWithHex = typeof received === 'string' && received.startsWith('0x')
  const pass = isValidHex && isValidLength

  return {
    pass,
    message: () => {
      if (pass) {
        return `Expected "${received}" not to be valid hex${opts?.length ? ` with length ${opts.length}` : ''}`
      } else {
        if (!startsWithHex) return `Expected "${received}" to start with "0x"`
        if (!isValidHex) return `Expected "${received}" to contain only hex characters (0-9, a-f, A-F) after "0x"`
        if (!isValidLength) return `Expected "${received}" to have ${opts?.length} hex characters after "0x", but got ${received.length}`
        return `Expected "${received}" to be valid hex${opts?.length ? ` with length ${opts.length}` : ''}`
      }
    },
  }
}