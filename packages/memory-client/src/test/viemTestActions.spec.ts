import { type TestActions } from '@tevm/utils'
import { describe, expect, it } from 'vitest'

describe('viemTestActions', () => {
	it('should support all viem Test actions', () => {
		/**
		 * If this type breaks it means viem added new apis and we should add tests
		 */
		const isSupported: Record<keyof TestActions, boolean> = {
			mine: true,
			reset: true,
			revert: true,
			setCode: true,
			setNonce: true,
			snapshot: true,
			dumpState: true,
			loadState: true,
			setRpcUrl: true,
			setBalance: true,
			getAutomine: true,
			setAutomine: true,
			setCoinbase: true,
			increaseTime: true,
			setStorageAt: true,
			inspectTxpool: true,
			setMinGasPrice: true,
			dropTransaction: true,
			getTxpoolStatus: true,
			getTxpoolContent: true,
			setBlockGasLimit: true,
			setIntervalMining: true,
			setLoggingEnabled: true,
			impersonateAccount: true,
			setNextBlockTimestamp: true,
			sendUnsignedTransaction: true,
			stopImpersonatingAccount: true,
			setBlockTimestampInterval: true,
			setNextBlockBaseFeePerGas: true,
			removeBlockTimestampInterval: true,
		}
		expect(Object.values(isSupported).every(Boolean)).toBe(true)
	})
})
