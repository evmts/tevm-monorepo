import { expect } from 'vitest'
import { registerChainableMatchers } from './chainable/chainable.js'
import type {
	ContainsAddress,
	ContainsContractAbi,
	ContainsTransactionAny,
	ContainsTransactionLogs,
} from './common/types.js'
import {
	type BalanceChange,
	type BalanceMatchers,
	toChangeBalance,
	toChangeBalances,
} from './matchers/balance/index.js'
import {
	type ErrorMatchers,
	chainableErrorMatchers,
	toBeReverted,
	toBeRevertedWithString,
} from './matchers/errors/index.js'
import { type EmitMatchers, chainableEventMatchers } from './matchers/events/index.js'
import { type StateMatchers, toBeInitializedAccount, toHaveState, toHaveStorageAt } from './matchers/state/index.js'
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

export type {
	BalanceChange,
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
	toHaveState,
	toHaveStorageAt,
	toChangeBalance,
	toChangeBalances,
})

registerChainableMatchers(chainableEventMatchers)
registerChainableMatchers(chainableErrorMatchers)

declare module 'vitest' {
	interface Assertion<T = any> extends UtilsMatchers, EmitMatchers, ErrorMatchers, StateMatchers, BalanceMatchers {}
	interface AsymmetricMatchersContaining
		extends UtilsMatchers,
			EmitMatchers,
			ErrorMatchers,
			StateMatchers,
			BalanceMatchers {}
}
