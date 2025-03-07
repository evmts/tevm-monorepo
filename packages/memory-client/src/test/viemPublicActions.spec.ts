import { type PublicActions } from 'viem'
import { describe, expect, it } from 'vitest'

describe('viemPublicActions', () => {
	it('should support all viem public actions', () => {
		/**
		 * If this type breaks it means viem added new apis and we should add tests
		 */
		const isSupported: Record<keyof PublicActions, boolean> = {
			call: true,
			createAccessList: true,
			createBlockFilter: true,
			createContractEventFilter: true,
			createEventFilter: true,
			createPendingTransactionFilter: true,
			estimateContractGas: true,
			estimateFeesPerGas: true,
			estimateGas: true,
			estimateMaxPriorityFeePerGas: true,
			getBalance: true,
			getBlobBaseFee: true,
			getBlock: true,
			getBlockNumber: true,
			getBlockTransactionCount: true,
			getBytecode: true,
			getChainId: true,
			getContractEvents: true,
			getEnsAddress: true,
			getEnsAvatar: true,
			getEnsName: true,
			getEnsResolver: true,
			getEnsText: true,
			getFeeHistory: true,
			getFilterChanges: true,
			getFilterLogs: true,
			getGasPrice: true,
			getLogs: true,
			getProof: true,
			getStorageAt: true,
			getTransaction: true,
			getTransactionConfirmations: true,
			getTransactionCount: true,
			getTransactionReceipt: true,
			multicall: true,
			prepareTransactionRequest: true,
			readContract: true,
			sendRawTransaction: true,
			simulate: true,
			simulateBlocks: true,
			simulateCalls: true,
			simulateContract: true,
			uninstallFilter: true,
			verifyMessage: true,
			verifyTypedData: true,
			watchContractEvent: true,
			waitForTransactionReceipt: true,
			watchBlockNumber: true,
			watchBlocks: true,
			watchEvent: true,
			watchPendingTransactions: true,
			verifySiweMessage: true,
			getCode: true,
			getEip712Domain: true,
		}
		expect(Object.values(isSupported).every(Boolean)).toBe(true)
	})
})
