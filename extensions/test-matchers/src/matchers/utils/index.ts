import type { IsAddressOptions } from 'viem'
import { toBeAddress } from './toBeAddress.js'
import { toBeBigInt } from './toBeBigInt.js'
import { type IsHexOptions, toBeHex } from './toBeHex.js'
import { toEqualAddress } from './toEqualAddress.js'
import { type EqualHexOptions, toEqualHex } from './toEqualHex.js'

export { toBeBigInt, toBeAddress, toBeHex, toEqualAddress, toEqualHex }
export type { IsAddressOptions, IsHexOptions, EqualHexOptions }

export interface UtilsMatchers {
	toBeBigInt(): void
	toBeAddress(opts?: IsAddressOptions): void
	toBeHex(opts?: IsHexOptions): void
	toEqualAddress(expected: unknown): void
	toEqualHex(expected: unknown, opts?: EqualHexOptions): void
}
