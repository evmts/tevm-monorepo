import { expect } from 'vitest'
import { registerChainableMatchers } from './chainable/chainable.js'
import { type ContractLike, type EmitMatchers, type TransactionLike, eventMatchers } from './matchers/events/index.js'
import {
	type EqualHexOptions,
	type IsAddressOptions,
	type IsHexOptions,
	type UtilsMatchers,
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
} from './matchers/utils/index.js'

export type { IsAddressOptions, IsHexOptions, EqualHexOptions, ContractLike, TransactionLike }

expect.extend({
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
})

registerChainableMatchers(eventMatchers)

declare module 'vitest' {
	interface Assertion<T = any> extends UtilsMatchers, EmitMatchers {}
	interface AsymmetricMatchersContaining extends UtilsMatchers, EmitMatchers {}
}
