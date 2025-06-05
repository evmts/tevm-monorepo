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

expect.extend({
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
})

interface CustomMatchers {
	toBeAddress(opts?: IsAddressOptions): void
	toBeHex(opts?: IsHexOptions): void
	toEqualAddress(expected: unknown): void
	toEqualHex(expected: unknown, opts?: EqualHexOptions): void
}

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
