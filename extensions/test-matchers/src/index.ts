import { expect } from 'vitest'
import { registerChainableMatchers } from './chainable/chainable.js'
import { type EmitMatchers, eventMatchers } from './matchers/events/index.js'
import { type ContainsContractAbi, type ContainsTransactionLogs } from './common/types.js'
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

export type { IsAddressOptions, IsHexOptions, EqualHexOptions, ContainsContractAbi, ContainsTransactionLogs }

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
