import type { IsAddressOptions } from 'viem'
import { expect } from 'vitest'
import {
	type EqualHexOptions,
	type IsHexOptions,
	toBeAddress,
	toBeBigInt,
	toBeHex,
	toEqualAddress,
	toEqualHex,
} from './matchers/utils/index.js'

expect.extend({
	toBeBigInt,
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
})

interface CustomMatchers {
	toBeBigInt(): void
	toBeAddress(opts?: IsAddressOptions): void
	toBeHex(opts?: IsHexOptions): void
	toEqualAddress(expected: unknown): void
	toEqualHex(expected: unknown, opts?: EqualHexOptions): void
}

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
