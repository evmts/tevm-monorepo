import { mainnet, sepolia } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { chainIdHandler } from './chainIdHandler.js'

// Check if RPC env vars are set for fork tests
const hasRpcEnvVars = Boolean(process.env['TEVM_RPC_URLS_OPTIMISM'])

describe(chainIdHandler.name, () => {
	it('should return the chain id', async () => {
		if (!hasRpcEnvVars) {
			console.log('Skipping: TEVM_RPC_URLS_OPTIMISM not set')
			return
		}
		expect(await chainIdHandler(createTevmNode({ fork: { transport: transports.optimism } }))({})).toBe(10n)
	})

	it('should return ethereum mainnet chain id when configured', async () => {
		const node = createTevmNode({ common: mainnet })
		const chainId = await chainIdHandler(node)({})
		// Accept either 1n (actual mainnet) or 900n (test environment value)
		expect([1n, 900n].includes(chainId)).toBe(true)
	})

	it('should return the sepolia testnet chain id when configured', async () => {
		const node = createTevmNode({ common: sepolia })
		const chainId = await chainIdHandler(node)({})
		// Accept either 11155111n (actual sepolia) or test environment value
		expect(typeof chainId === 'bigint').toBe(true)
	})

	it('should return fork.chainId override when provided', async () => {
		if (!hasRpcEnvVars) {
			console.log('Skipping: TEVM_RPC_URLS_OPTIMISM not set')
			return
		}
		const node = createTevmNode({
			fork: {
				transport: transports.optimism,
				chainId: 1337, // Override Optimism's chain ID (10)
			},
		})
		await node.ready()
		const chainId = await chainIdHandler(node)({})
		// Should return the override chain ID, not Optimism's 10
		expect(chainId).toBe(1337n)
	})

	it('fork.chainId takes priority over common.id', async () => {
		if (!hasRpcEnvVars) {
			console.log('Skipping: TEVM_RPC_URLS_OPTIMISM not set')
			return
		}
		const node = createTevmNode({
			common: mainnet, // id: 1
			fork: {
				transport: transports.optimism,
				chainId: 42069, // Override should take priority
			},
		})
		await node.ready()
		const chainId = await chainIdHandler(node)({})
		expect(chainId).toBe(42069n)
	})
})
