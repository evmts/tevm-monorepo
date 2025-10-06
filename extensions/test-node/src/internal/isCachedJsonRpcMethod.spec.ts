import type { EIP1193Parameters, EIP1474Methods } from 'viem'
import { describe, expect, it } from 'vitest'
import { isCachedJsonRpcMethod } from './isCachedJsonRpcMethod.js'

type Request<TMethod extends EIP1474Methods[number]['Method']> = Extract<
	EIP1193Parameters<EIP1474Methods>,
	{ method: TMethod }
>

describe('isCachedJsonRpcMethod', () => {
	// Always cached methods (no parameters affect caching)
	it('should always cache eth_chainId', () => {
		const request = { method: 'eth_chainId' } as const satisfies Request<'eth_chainId'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_coinbase', () => {
		const request = { method: 'eth_coinbase' } as const satisfies Request<'eth_coinbase'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_protocolVersion', () => {
		const request = { method: 'eth_protocolVersion' } as const satisfies Request<'eth_protocolVersion'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getBlockByHash', () => {
		const request = {
			method: 'eth_getBlockByHash',
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35', true],
		} as const satisfies Request<'eth_getBlockByHash'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getBlockTransactionCountByHash', () => {
		const request = {
			method: 'eth_getBlockTransactionCountByHash',
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35'],
		} as const satisfies Request<'eth_getBlockTransactionCountByHash'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getTransactionByHash', () => {
		const request = {
			method: 'eth_getTransactionByHash',
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getTransactionByHash'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getTransactionByBlockHashAndIndex', () => {
		const request = {
			method: 'eth_getTransactionByBlockHashAndIndex',
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35', '0x0'],
		} as const satisfies Request<'eth_getTransactionByBlockHashAndIndex'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getTransactionReceipt', () => {
		const request = {
			method: 'eth_getTransactionReceipt',
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getTransactionReceipt'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getUncleByBlockHashAndIndex', () => {
		const request = {
			method: 'eth_getUncleByBlockHashAndIndex',
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35', '0x0'],
		} as const satisfies Request<'eth_getUncleByBlockHashAndIndex'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getUncleCountByBlockHash', () => {
		const request = {
			method: 'eth_getUncleCountByBlockHash',
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35'],
		} as const satisfies Request<'eth_getUncleCountByBlockHash'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_sign', () => {
		const request = {
			method: 'eth_sign',
			params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x48656c6c6f20576f726c64'],
		} as const satisfies Request<'eth_sign'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	// EIP-4337 methods that are always cached
	it('should always cache eth_estimateUserOperationGas', () => {
		const request = {
			method: 'eth_estimateUserOperationGas',
			params: [
				{
					sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					nonce: '0x0',
					callData: '0x',
					callGasLimit: '0x100000',
					maxFeePerGas: '0x3b9aca00',
					maxPriorityFeePerGas: '0x3b9aca00',
					preVerificationGas: '0x5208',
					verificationGasLimit: '0x100000',
					signature: '0x',
				},
				'0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
			],
		} as const satisfies Request<'eth_estimateUserOperationGas'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getUserOperationByHash', () => {
		const request = {
			method: 'eth_getUserOperationByHash',
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getUserOperationByHash'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_getUserOperationReceipt', () => {
		const request = {
			method: 'eth_getUserOperationReceipt',
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getUserOperationReceipt'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should always cache eth_supportedEntryPoints', () => {
		const request = { method: 'eth_supportedEntryPoints' } as const satisfies Request<'eth_supportedEntryPoints'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	// Never cached methods
	it('should never cache eth_accounts', () => {
		const request = { method: 'eth_accounts' } as const satisfies Request<'eth_accounts'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_blobBaseFee', () => {
		const request = { method: 'eth_blobBaseFee' } as const satisfies Request<'eth_blobBaseFee'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_blockNumber', () => {
		const request = { method: 'eth_blockNumber' } as const satisfies Request<'eth_blockNumber'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_call', () => {
		const request = {
			method: 'eth_call',
			params: [{ to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', data: '0x' }, 'latest'],
		} as const satisfies Request<'eth_call'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_gasPrice', () => {
		const request = { method: 'eth_gasPrice' } as const satisfies Request<'eth_gasPrice'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_getFilterChanges', () => {
		const request = {
			method: 'eth_getFilterChanges',
			params: ['0x1'],
		} as const satisfies Request<'eth_getFilterChanges'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_getFilterLogs', () => {
		const request = {
			method: 'eth_getFilterLogs',
			params: ['0x1'],
		} as const satisfies Request<'eth_getFilterLogs'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_maxPriorityFeePerGas', () => {
		const request = { method: 'eth_maxPriorityFeePerGas' } as const satisfies Request<'eth_maxPriorityFeePerGas'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_newBlockFilter', () => {
		const request = { method: 'eth_newBlockFilter' } as const satisfies Request<'eth_newBlockFilter'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_newFilter', () => {
		const request = {
			method: 'eth_newFilter',
			params: [{ fromBlock: 'latest' }],
		} as const satisfies Request<'eth_newFilter'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_newPendingTransactionFilter', () => {
		const request = {
			method: 'eth_newPendingTransactionFilter',
		} as const satisfies Request<'eth_newPendingTransactionFilter'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_sendRawTransaction', () => {
		const request = {
			method: 'eth_sendRawTransaction',
			params: ['0x0'],
		} as const satisfies Request<'eth_sendRawTransaction'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_sendTransaction', () => {
		const request = {
			method: 'eth_sendTransaction',
			params: [
				{ from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a' },
			],
		} as const satisfies Request<'eth_sendTransaction'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_sendUserOperation', () => {
		const request = {
			method: 'eth_sendUserOperation',
			params: [
				{
					sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					nonce: '0x0',
					callData: '0x',
					callGasLimit: '0x100000',
					maxFeePerGas: '0x3b9aca00',
					maxPriorityFeePerGas: '0x3b9aca00',
					preVerificationGas: '0x5208',
					verificationGasLimit: '0x100000',
					signature: '0x',
				},
				'0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
			],
		} as const satisfies Request<'eth_sendUserOperation'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_syncing', () => {
		const request = { method: 'eth_syncing' } as const satisfies Request<'eth_syncing'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should never cache eth_uninstallFilter', () => {
		const request = {
			method: 'eth_uninstallFilter',
			params: ['0x1'],
		} as const satisfies Request<'eth_uninstallFilter'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	// Conditionally cached methods based on static block tags
	describe('methods cached based on static block tags', () => {
		it('should cache eth_getBlockByNumber with static block tags', () => {
			// Cache with hex block number
			const hexRequest = {
				method: 'eth_getBlockByNumber',
				params: ['0x123', true],
			} as const satisfies Request<'eth_getBlockByNumber'>
			expect(isCachedJsonRpcMethod(hexRequest)).toBe(true)

			// Cache with earliest
			const earliestRequest = {
				method: 'eth_getBlockByNumber',
				params: ['earliest', true],
			} as const satisfies Request<'eth_getBlockByNumber'>
			expect(isCachedJsonRpcMethod(earliestRequest)).toBe(true)
		})

		it('should not cache eth_getBlockByNumber with dynamic block tags', () => {
			const latestRequest = {
				method: 'eth_getBlockByNumber',
				params: ['latest', true],
			} as const satisfies Request<'eth_getBlockByNumber'>
			expect(isCachedJsonRpcMethod(latestRequest)).toBe(false)

			const pendingRequest = {
				method: 'eth_getBlockByNumber',
				params: ['pending', true],
			} as const satisfies Request<'eth_getBlockByNumber'>
			expect(isCachedJsonRpcMethod(pendingRequest)).toBe(false)

			const finalizedRequest = {
				method: 'eth_getBlockByNumber',
				params: ['finalized', true],
			} as const satisfies Request<'eth_getBlockByNumber'>
			expect(isCachedJsonRpcMethod(finalizedRequest)).toBe(false)

			const safeRequest = {
				method: 'eth_getBlockByNumber',
				params: ['safe', true],
			} as const satisfies Request<'eth_getBlockByNumber'>
			expect(isCachedJsonRpcMethod(safeRequest)).toBe(false)
		})

		it('should cache eth_getBalance with static block tags', () => {
			const hexRequest = {
				method: 'eth_getBalance',
				params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x123'],
			} as const satisfies Request<'eth_getBalance'>
			expect(isCachedJsonRpcMethod(hexRequest)).toBe(true)

			const earliestRequest = {
				method: 'eth_getBalance',
				params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', 'earliest'],
			} as const satisfies Request<'eth_getBalance'>
			expect(isCachedJsonRpcMethod(earliestRequest)).toBe(true)
		})

		it('should not cache eth_getBalance with dynamic block tags', () => {
			const latestRequest = {
				method: 'eth_getBalance',
				params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', 'latest'],
			} as const satisfies Request<'eth_getBalance'>
			expect(isCachedJsonRpcMethod(latestRequest)).toBe(false)
		})

		it('should cache eth_getCode with static block tags', () => {
			const request = {
				method: 'eth_getCode',
				params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x123'],
			} as const satisfies Request<'eth_getCode'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getStorageAt with static block tags', () => {
			const request = {
				method: 'eth_getStorageAt',
				params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x0', '0x123'],
			} as const satisfies Request<'eth_getStorageAt'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getTransactionCount with static block tags', () => {
			const request = {
				method: 'eth_getTransactionCount',
				params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x123'],
			} as const satisfies Request<'eth_getTransactionCount'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getProof with static block tags', () => {
			const request = {
				method: 'eth_getProof',
				params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', ['0x0'], '0x123'],
			} as const satisfies Request<'eth_getProof'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getTransactionByBlockNumberAndIndex with static block tags', () => {
			const request = {
				method: 'eth_getTransactionByBlockNumberAndIndex',
				params: ['0x123', '0x0'],
			} as const satisfies Request<'eth_getTransactionByBlockNumberAndIndex'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getUncleByBlockNumberAndIndex with static block tags', () => {
			const request = {
				method: 'eth_getUncleByBlockNumberAndIndex',
				params: ['0x123', '0x0'],
			} as const satisfies Request<'eth_getUncleByBlockNumberAndIndex'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getUncleCountByBlockNumber with static block tags', () => {
			const request = {
				method: 'eth_getUncleCountByBlockNumber',
				params: ['0x123'],
			} as const satisfies Request<'eth_getUncleCountByBlockNumber'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getBlockTransactionCountByNumber with static block tags', () => {
			const request = {
				method: 'eth_getBlockTransactionCountByNumber',
				params: ['0x123'],
			} as const satisfies Request<'eth_getBlockTransactionCountByNumber'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_estimateGas with static block tags', () => {
			const request = {
				method: 'eth_estimateGas',
				params: [
					{ from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a' },
					'0x123',
				],
			} as const satisfies Request<'eth_estimateGas'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_createAccessList with static block tags', () => {
			const request = {
				method: 'eth_createAccessList',
				params: [
					{ from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a' },
					'0x123',
				],
			} as const satisfies Request<'eth_createAccessList'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_feeHistory with static block tags', () => {
			const request = {
				method: 'eth_feeHistory',
				params: ['0x5', '0x123', [25, 50, 75]],
			} as const satisfies Request<'eth_feeHistory'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_simulateV1 with static block tags', () => {
			const request = {
				method: 'eth_simulateV1',
				params: [{ blockStateCalls: [] }, '0x123'],
			} as const satisfies Request<'eth_simulateV1'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should cache eth_getLogs with both static block tags', () => {
			const request = {
				method: 'eth_getLogs',
				params: [{ fromBlock: '0x1', toBlock: '0x123' }],
			} as const satisfies Request<'eth_getLogs'>
			expect(isCachedJsonRpcMethod(request)).toBe(true)
		})

		it('should not cache eth_getLogs with any dynamic block tags', () => {
			const fromLatestRequest = {
				method: 'eth_getLogs',
				params: [{ fromBlock: 'latest', toBlock: '0x123' }],
			} as const satisfies Request<'eth_getLogs'>
			expect(isCachedJsonRpcMethod(fromLatestRequest)).toBe(false)

			const toLatestRequest = {
				method: 'eth_getLogs',
				params: [{ fromBlock: '0x1', toBlock: 'latest' }],
			} as const satisfies Request<'eth_getLogs'>
			expect(isCachedJsonRpcMethod(toLatestRequest)).toBe(false)

			const bothLatestRequest = {
				method: 'eth_getLogs',
				params: [{ fromBlock: 'latest', toBlock: 'latest' }],
			} as const satisfies Request<'eth_getLogs'>
			expect(isCachedJsonRpcMethod(bothLatestRequest)).toBe(false)
		})
	})

	// Comprehensive tests for isStaticTxParams (eth_signTransaction)
	describe('eth_signTransaction caching based on isStaticTxParams', () => {
		it('should cache when all required static params are provided (legacy tx)', () => {
			const legacyTx = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						nonce: '0x1',
						gas: '0x5208',
						gasPrice: '0x3b9aca00',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(legacyTx)).toBe(true)
		})

		it('should cache when all required static params are provided (EIP-1559 tx)', () => {
			const eip1559Tx = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						nonce: '0x1',
						gas: '0x5208',
						maxFeePerGas: '0x3b9aca00',
						maxPriorityFeePerGas: '0x3b9aca00',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(eip1559Tx)).toBe(true)
		})

		it('should not cache when nonce is missing', () => {
			const missingNonce = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						gas: '0x5208',
						gasPrice: '0x3b9aca00',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(missingNonce)).toBe(false)
		})

		it('should not cache when gas is missing', () => {
			const missingGas = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						nonce: '0x1',
						gasPrice: '0x3b9aca00',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(missingGas)).toBe(false)
		})

		it('should not cache when gasPrice is missing (legacy tx)', () => {
			const missingGasPrice = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						nonce: '0x1',
						gas: '0x5208',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(missingGasPrice)).toBe(false)
		})

		it('should not cache when maxFeePerGas is missing (EIP-1559 tx)', () => {
			const missingMaxFee = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						nonce: '0x1',
						gas: '0x5208',
						maxPriorityFeePerGas: '0x3b9aca00',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(missingMaxFee)).toBe(false)
		})

		it('should not cache when maxPriorityFeePerGas is missing (EIP-1559 tx)', () => {
			const missingMaxPriority = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						nonce: '0x1',
						gas: '0x5208',
						maxFeePerGas: '0x3b9aca00',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(missingMaxPriority)).toBe(false)
		})

		it('should not cache when neither legacy nor EIP-1559 gas params are complete', () => {
			const incompleteTransaction = {
				method: 'eth_signTransaction',
				params: [
					{
						from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
						nonce: '0x1',
						gas: '0x5208',
						// No gasPrice (for legacy) and incomplete EIP-1559 (missing maxPriorityFeePerGas)
						maxFeePerGas: '0x3b9aca00',
						value: '0x0',
					},
				],
			} as const satisfies Request<'eth_signTransaction'>
			expect(isCachedJsonRpcMethod(incompleteTransaction)).toBe(false)
		})
	})

	// Edge cases
	it('should not cache unknown methods by default', () => {
		const request = { method: 'custom_method', params: [] }
		expect(isCachedJsonRpcMethod(request as unknown as Request<EIP1474Methods[number]['Method']>)).toBe(false)
	})

	it('should handle various hex formats for block numbers', () => {
		const validHex = {
			method: 'eth_getBlockByNumber',
			params: ['0xabc', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(validHex)).toBe(true)

		const upperHex = {
			method: 'eth_getBlockByNumber',
			params: ['0xABC', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(upperHex)).toBe(true)

		const shortHex = {
			method: 'eth_getBlockByNumber',
			params: ['0x1', false],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(shortHex)).toBe(true)
	})
})
