import { describe, it, expect } from 'bun:test'
import { createMemoryClient } from './createMemoryClient.js'
import type { PublicActions, TestActions } from 'viem'

describe('createMemoryClient', () => {
	it('should inject an in memory transport as the client transport', () => {
		const client = createMemoryClient()
		expect(client.transport.name).toBe('Tevm transport')
		expect(client.transport.key).toBe('tevm')
		expect(client.transport.type).toBe('tevm')
	})

	it('should support all viem public actions', () => {
		/**
		 * If this type breaks it means viem added new apis and we should add tests to `./viem/*.spec.ts`
		 */
		const isSupported: Record<keyof PublicActions, boolean> = {
			call: true,
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
		}
		Object.keys(isSupported).forEach((key) => {
			const client = createMemoryClient()
			expect(client satisfies PublicActions).toHaveProperty(key)
		})
	})

	it('should support all viem test actions', () => {
		/**
		 * If this type breaks it means viem added new apis and we should add tests to ./viem/*.spec.ts
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
		Object.keys(isSupported).forEach((key) => {
			const client = createMemoryClient()
			expect(client satisfies TestActions).toHaveProperty(key)
		})
	})

	it('supports tevm actions api', () => {
		const client = createMemoryClient()
		expect(client).toHaveProperty('tevmCall')
		expect(client).toHaveProperty('tevmContract')
		expect(client).toHaveProperty('tevmDeploy')
		expect(client).toHaveProperty('tevmScript')
		expect(client).toHaveProperty('tevmMine')
		expect(client).toHaveProperty('tevmDumpState')
		expect(client).toHaveProperty('tevmLoadState')
		expect(client).toHaveProperty('tevmGetAccount')
		expect(client).toHaveProperty('tevmSetAccount')
		expect(client).toHaveProperty('tevmReady')
		expect(client).toHaveProperty('_tevm')
	})
})
