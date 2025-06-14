import type { IsAddressOptions } from 'viem'
import { expect } from 'vitest'
import {
	type EqualHexOptions,
	type IsHexOptions,
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
} from './matchers/utils/index.js'

// Define all matchers
const matchers = {
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
export { toBeAddress } from './matchers/utils/toBeAddress.js'
export { toBeHex } from './matchers/utils/toBeHex.js'
export { toEqualAddress } from './matchers/utils/toEqualAddress.js'
export { toEqualHex } from './matchers/utils/toEqualHex.js'

// Type declarations for TypeScript
declare module 'vitest' {
	interface Assertion<T = any> {
		toBeAddress(opts?: IsAddressOptions): T
		toBeHex(opts?: IsHexOptions): T
		toEqualAddress(expected: unknown): T
		toEqualHex(expected: unknown, opts?: EqualHexOptions): T
	}
	interface AsymmetricMatchersContaining {
		toBeAddress(): any
		toBeHex(opts?: IsHexOptions): any
		toEqualAddress(expected: unknown): any
		toEqualHex(expected: unknown, opts?: EqualHexOptions): any
	}
}
