import type { EIP1193Parameters, EIP1474Methods } from 'viem'
import { describe, expect, it } from 'vitest'
import { ethMethodToCacheKey } from './ethMethodToCacheKey.js'

type Request<TMethod extends EIP1474Methods[number]['Method']> = Extract<
	EIP1193Parameters<EIP1474Methods>,
	{ method: TMethod }
> & { jsonrpc: string }

describe('ethMethodToCacheKey', () => {
	// Methods with no parameters
	it('should generate cache key for eth_chainId', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_chainId' as const,
		} as const satisfies Request<'eth_chainId'>

		const cacheKeyFn = ethMethodToCacheKey('eth_chainId')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_chainId"]')
	})

	it('should generate cache key for eth_coinbase', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_coinbase' as const,
		} as const satisfies Request<'eth_coinbase'>

		const cacheKeyFn = ethMethodToCacheKey('eth_coinbase')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_coinbase"]')
	})

	it('should generate cache key for eth_protocolVersion', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_protocolVersion' as const,
		} as const satisfies Request<'eth_protocolVersion'>

		const cacheKeyFn = ethMethodToCacheKey('eth_protocolVersion')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_protocolVersion"]')
	})

	it('should generate cache key for eth_supportedEntryPoints', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_supportedEntryPoints' as const,
		} as const satisfies Request<'eth_supportedEntryPoints'>

		const cacheKeyFn = ethMethodToCacheKey('eth_supportedEntryPoints')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_supportedEntryPoints"]')
	})

	// Methods with address and block tag
	it('should generate cache key for eth_getBalance', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBalance' as const,
			params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', 'latest'],
		} as const satisfies Request<'eth_getBalance'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getBalance')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getBalance","0x742d35cc6634c0532925a3b844bc9e7595f93b7a","latest"]')
	})

	it('should generate cache key for eth_getCode', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getCode' as const,
			params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x123'],
		} as const satisfies Request<'eth_getCode'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getCode')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getCode","0x742d35cc6634c0532925a3b844bc9e7595f93b7a","0x123"]')
	})

	it('should generate cache key for eth_getTransactionCount', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getTransactionCount' as const,
			params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', 'pending'],
		} as const satisfies Request<'eth_getTransactionCount'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getTransactionCount')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getTransactionCount","0x742d35cc6634c0532925a3b844bc9e7595f93b7a","pending"]')
	})

	// Block methods
	it('should generate cache key for eth_getBlockByHash', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockByHash' as const,
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35', true],
		} as const satisfies Request<'eth_getBlockByHash'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getBlockByHash')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getBlockByHash","0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35",true]',
		)
	})

	it('should generate cache key for eth_getBlockByNumber', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockByNumber' as const,
			params: ['0x123', true],
		} as const satisfies Request<'eth_getBlockByNumber'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getBlockByNumber')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getBlockByNumber","0x123",true]')
	})

	it('should generate cache key for eth_getBlockTransactionCountByHash', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockTransactionCountByHash' as const,
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35'],
		} as const satisfies Request<'eth_getBlockTransactionCountByHash'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getBlockTransactionCountByHash')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getBlockTransactionCountByHash","0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"]',
		)
	})

	it('should generate cache key for eth_getBlockTransactionCountByNumber', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockTransactionCountByNumber' as const,
			params: ['latest'],
		} as const satisfies Request<'eth_getBlockTransactionCountByNumber'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getBlockTransactionCountByNumber')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getBlockTransactionCountByNumber","latest"]')
	})

	// Transaction methods
	it('should generate cache key for eth_getTransactionByHash', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getTransactionByHash' as const,
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getTransactionByHash'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getTransactionByHash')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getTransactionByHash","0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"]',
		)
	})

	it('should generate cache key for eth_getTransactionByBlockHashAndIndex', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getTransactionByBlockHashAndIndex' as const,
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35', '0x0'],
		} as const satisfies Request<'eth_getTransactionByBlockHashAndIndex'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getTransactionByBlockHashAndIndex')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getTransactionByBlockHashAndIndex","0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35","0x0"]',
		)
	})

	it('should generate cache key for eth_getTransactionByBlockNumberAndIndex', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getTransactionByBlockNumberAndIndex' as const,
			params: ['0x123', '0x0'],
		} as const satisfies Request<'eth_getTransactionByBlockNumberAndIndex'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getTransactionByBlockNumberAndIndex')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getTransactionByBlockNumberAndIndex","0x123","0x0"]')
	})

	it('should generate cache key for eth_getTransactionReceipt', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getTransactionReceipt' as const,
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getTransactionReceipt'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getTransactionReceipt')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getTransactionReceipt","0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"]',
		)
	})

	// Uncle methods
	it('should generate cache key for eth_getUncleByBlockHashAndIndex', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getUncleByBlockHashAndIndex' as const,
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35', '0x0'],
		} as const satisfies Request<'eth_getUncleByBlockHashAndIndex'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getUncleByBlockHashAndIndex')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getUncleByBlockHashAndIndex","0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35","0x0"]',
		)
	})

	it('should generate cache key for eth_getUncleByBlockNumberAndIndex', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getUncleByBlockNumberAndIndex' as const,
			params: ['0x123', '0x0'],
		} as const satisfies Request<'eth_getUncleByBlockNumberAndIndex'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getUncleByBlockNumberAndIndex')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getUncleByBlockNumberAndIndex","0x123","0x0"]')
	})

	it('should generate cache key for eth_getUncleCountByBlockHash', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getUncleCountByBlockHash' as const,
			params: ['0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35'],
		} as const satisfies Request<'eth_getUncleCountByBlockHash'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getUncleCountByBlockHash')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getUncleCountByBlockHash","0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35"]',
		)
	})

	it('should generate cache key for eth_getUncleCountByBlockNumber', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getUncleCountByBlockNumber' as const,
			params: ['0x123'],
		} as const satisfies Request<'eth_getUncleCountByBlockNumber'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getUncleCountByBlockNumber')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getUncleCountByBlockNumber","0x123"]')
	})

	// Storage methods
	it('should generate cache key for eth_getStorageAt', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getStorageAt' as const,
			params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x0', 'latest'],
		} as const satisfies Request<'eth_getStorageAt'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getStorageAt')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getStorageAt","0x742d35cc6634c0532925a3b844bc9e7595f93b7a","0x0","latest"]')
	})

	// Logs and proof
	it('should generate cache key for eth_getLogs', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getLogs' as const,
			params: [{ fromBlock: '0x1', toBlock: 'latest' }],
		} as const satisfies Request<'eth_getLogs'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getLogs')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getLogs","0x1","latest"]')
	})

	it('should generate cache key for eth_getProof', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getProof' as const,
			params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', ['0x0', '0x1'], 'latest'],
		} as const satisfies Request<'eth_getProof'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getProof')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getProof","0x742d35cc6634c0532925a3b844bc9e7595f93b7a",["0x0","0x1"],"latest"]')
	})

	// Gas estimation and fee history
	it('should generate cache key for eth_estimateGas', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_estimateGas' as const,
			params: [
				{
					from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					data: '0x',
				},
				'latest',
			],
		} as const satisfies Request<'eth_estimateGas'>

		const cacheKeyFn = ethMethodToCacheKey('eth_estimateGas')
		const result = cacheKeyFn(request)
		// The transaction object is normalized by normalizeTx
		expect(result).toContain('"eth_estimateGas"')
		expect(result).toContain('"latest"')
	})

	it('should generate cache key for eth_feeHistory', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_feeHistory' as const,
			params: ['0x5', 'latest', [25, 50, 75]],
		} as const satisfies Request<'eth_feeHistory'>

		const cacheKeyFn = ethMethodToCacheKey('eth_feeHistory')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_feeHistory","0x5","latest",[25,50,75]]')
	})

	it('should generate cache key for eth_createAccessList', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_createAccessList' as const,
			params: [
				{
					from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					data: '0x',
				},
				'latest',
			],
		} as const satisfies Request<'eth_createAccessList'>

		const cacheKeyFn = ethMethodToCacheKey('eth_createAccessList')
		const result = cacheKeyFn(request)
		// The transaction object is normalized by normalizeTx
		expect(result).toContain('"eth_createAccessList"')
		expect(result).toContain('"latest"')
	})

	// Signing methods
	it('should generate cache key for eth_sign', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_sign' as const,
			params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a', '0x48656c6c6f20576f726c64'],
		} as const satisfies Request<'eth_sign'>

		const cacheKeyFn = ethMethodToCacheKey('eth_sign')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_sign","0x742d35cc6634c0532925a3b844bc9e7595f93b7a","0x48656c6c6f20576f726c64"]')
	})

	it('should generate cache key for eth_signTransaction', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_signTransaction' as const,
			params: [
				{
					from: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					to: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					value: '0x0',
				},
			],
		} as const satisfies Request<'eth_signTransaction'>

		const cacheKeyFn = ethMethodToCacheKey('eth_signTransaction')
		const result = cacheKeyFn(request)
		// The transaction object is normalized by normalizeTx
		expect(result).toContain('"eth_signTransaction"')
	})

	// Simulation
	it('should generate cache key for eth_simulateV1', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_simulateV1' as const,
			params: [{ blockStateCalls: [] }, 'latest'],
		} as const satisfies Request<'eth_simulateV1'>

		const cacheKeyFn = ethMethodToCacheKey('eth_simulateV1')
		const result = cacheKeyFn(request)
		// TODO: This method needs proper normalization implementation
		expect(result).toBe('["2.0","eth_simulateV1",{"blockStateCalls":[]},"latest"]')
	})

	// EIP-4337 User Operation methods
	it('should generate cache key for eth_estimateUserOperationGas', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_estimateUserOperationGas' as const,
			params: [
				{
					sender: '0x742d35Cc6634C0532925a3b844Bc9e7595f93b7a',
					nonce: '0x0',
					callData: '0x',
					initCode: '0x',
					paymasterAndData: '0x',
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

		const cacheKeyFn = ethMethodToCacheKey('eth_estimateUserOperationGas')
		const result = cacheKeyFn(request)
		// The user operation is normalized by normalizeUserOperation
		expect(result).toContain('"eth_estimateUserOperationGas"')
		expect(result).toContain('0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789') // entrypoint address normalized
	})

	it('should generate cache key for eth_getUserOperationByHash', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getUserOperationByHash' as const,
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getUserOperationByHash'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getUserOperationByHash')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getUserOperationByHash","0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"]',
		)
	})

	it('should generate cache key for eth_getUserOperationReceipt', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getUserOperationReceipt' as const,
			params: ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'],
		} as const satisfies Request<'eth_getUserOperationReceipt'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getUserOperationReceipt')
		const result = cacheKeyFn(request)
		expect(result).toBe(
			'["2.0","eth_getUserOperationReceipt","0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"]',
		)
	})
})
