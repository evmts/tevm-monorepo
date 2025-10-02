import { expect } from 'vitest'
import { registerChainableMatchers } from './chainable/chainable.js'
import { type ContainsContractAbi, type ContainsTransactionLogs } from './common/types.js'
import {
	chainableErrorMatchers,
	type ErrorMatchers,
	toBeReverted,
	toBeRevertedWithString,
} from './matchers/errors/index.js'
import { chainableEventMatchers, type EmitMatchers } from './matchers/events/index.js'
import {
	type EqualHexOptions,
	type IsAddressOptions,
	type IsHexOptions,
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
	type UtilsMatchers,
} from './matchers/utils/index.js'

export type { IsAddressOptions, IsHexOptions, EqualHexOptions, ContainsContractAbi, ContainsTransactionLogs }

expect.extend({
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
	toBeReverted,
	toBeRevertedWithString,
})

registerChainableMatchers(chainableEventMatchers)
registerChainableMatchers(chainableErrorMatchers)

declare module 'vitest' {
	// biome-ignore lint/correctness/noUnusedVariables: we need to match exactly the base vitest Assertion type
	interface Assertion<T = any> extends UtilsMatchers, EmitMatchers, ErrorMatchers {}
	interface AsymmetricMatchersContaining extends UtilsMatchers, EmitMatchers, ErrorMatchers {}
}
