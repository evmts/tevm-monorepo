import { isHex, hexToBytes, trim } from "viem"
import { equalsBytes } from "@tevm/utils"

export type EqualHexOptions = {
  /**
   * Whether to compare hex strings exactly as written or normalize them first.
   * When false (default), leading zeros are trimmed before byte comparison (e.g., "0x00123" equals "0x123").
   * When true, hex strings must match exactly including leading zeros.
   * @default false
   */
  exact?: boolean
}

/**
 * Custom Vitest matcher to assert that two hex strings are equal (after converting to bytes)
 * @param received - The first hex string to compare
 * @param expected - The second hex string to compare
 * @param opts - Options for comparison behavior
 * @returns Object with pass boolean and message function
 */
export function toEqualHex(received: string, expected: string, opts?: EqualHexOptions) {
  // First validate both are valid hex strings
  const isHexReceived = isHex(received, { strict: true })
  const isHexExpected = isHex(expected, { strict: true })

  if (!isHexReceived || !isHexExpected) {
    return {
      pass: false,
      message: () => {
        if (!isHexReceived) return `Expected "${received}" to be a valid hex string`
        if (!isHexExpected) return `Expected "${expected}" to be a valid hex string`
        return `Expected "${received}" to equal hex "${expected}"`
      },
    }
  }

  let pass: boolean

  if (opts?.exact) {
    // For exact comparison, compare strings directly (case-insensitive)
    pass = received.toLowerCase() === expected.toLowerCase()
  } else {
    // For normalized comparison, trim leading zeros and compare bytes
    const receivedBytes = hexToBytes(trim(received))
    const expectedBytes = hexToBytes(trim(expected))
    pass = equalsBytes(receivedBytes, expectedBytes)
  }

  return {
    pass,
    message: () => {
      if (pass) {
        return `Expected "${received}" not to equal hex "${expected}"`
      } else {
        return `Expected "${received}" to equal hex "${expected}"`
      }
    },
  }
}