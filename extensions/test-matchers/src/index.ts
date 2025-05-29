import type { IsAddressOptions } from 'viem'
import { expect } from 'vitest'
import { toBeAddress } from './matchers/toBeAddress.js'
import { toBeBigInt } from './matchers/toBeBigInt.js'
import { type IsHexOptions, toBeHex } from './matchers/toBeHex.js'
import { toEqualAddress } from './matchers/toEqualAddress.js'
import { type EqualHexOptions, toEqualHex } from './matchers/toEqualHex.js'

// Define all matchers
const matchers = {
	toBeBigInt,
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
}

// Extend expect with all matchers
expect.extend(matchers)

// Export matchers for manual usage if needed
export { matchers }

// Export individual matchers
export { toBeBigInt } from './matchers/toBeBigInt.js'
export { toBeAddress } from './matchers/toBeAddress.js'
export { toBeHex } from './matchers/toBeHex.js'
export { toEqualAddress } from './matchers/toEqualAddress.js'
export { toEqualHex } from './matchers/toEqualHex.js'

// Type declarations for TypeScript
declare module 'vitest' {
	interface Assertion<T = any> {
		toBeBigInt(): T
		toBeAddress(opts?: IsAddressOptions): T
		toBeHex(opts?: IsHexOptions): T
		toEqualAddress(expected: string): T
		toEqualHex(expected: string, opts?: EqualHexOptions): T
	}
	interface AsymmetricMatchersContaining {
		toBeBigInt(): any
		toBeAddress(): any
		toBeHex(opts?: IsHexOptions): any
		toEqualAddress(expected: string): any
		toEqualHex(expected: string, opts?: EqualHexOptions): any
	}
}
