import { expect } from 'vitest'
import { registerChainableMatchers } from './chainable/chainable.js'
import type {
	ContainsAddress,
	ContainsContractAbi,
	ContainsTransactionAny,
	ContainsTransactionLogs,
} from './common/types.js'
import {
	chainableErrorMatchers,
	type ErrorMatchers,
	toBeReverted,
	toBeRevertedWithString,
} from './matchers/errors/index.js'
import { chainableEventMatchers, type EmitMatchers } from './matchers/events/index.js'
import { type StateMatchers, toBeInitializedAccount } from './matchers/state/index.js'
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

export type {
	IsAddressOptions,
	IsHexOptions,
	EqualHexOptions,
	ContainsContractAbi,
	ContainsTransactionLogs,
	ContainsAddress,
	ContainsTransactionAny,
}

expect.extend({
	toBeAddress,
	toBeHex,
	toEqualAddress,
	toEqualHex,
	toBeReverted,
	toBeRevertedWithString,
	toBeInitializedAccount,
})

registerChainableMatchers(chainableEventMatchers)
registerChainableMatchers(chainableErrorMatchers)

declare module 'vitest' {
	interface Assertion<T = any> extends UtilsMatchers, EmitMatchers, ErrorMatchers, StateMatchers {}
	interface AsymmetricMatchersContaining extends UtilsMatchers, EmitMatchers, ErrorMatchers, StateMatchers {}
}
