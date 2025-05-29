import { expect } from 'vitest'
import type { IsAddressOptions } from 'viem'
import { toBeBigInt } from './matchers/toBeBigInt.js'
import { toBeAddress } from './matchers/toBeAddress.js'
import { toBeHex, type IsHexOptions } from './matchers/toBeHex.js'

// Define all matchers
const matchers = {
  toBeBigInt,
  toBeAddress,
  toBeHex,
}

// Extend expect with all matchers
expect.extend(matchers)

// Export matchers for manual usage if needed
export { matchers }

// Export individual matchers
export { toBeBigInt } from './matchers/toBeBigInt.js'
export { toBeAddress } from './matchers/toBeAddress.js'
export { toBeHex } from './matchers/toBeHex.js'

// Type declarations for TypeScript
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeBigInt(): T
    toBeAddress(opts?: IsAddressOptions): T
    toBeHex(opts?: IsHexOptions): T
  }
  interface AsymmetricMatchersContaining {
    toBeBigInt(): any
    toBeAddress(): any
    toBeHex(opts?: IsHexOptions): any
  }
}