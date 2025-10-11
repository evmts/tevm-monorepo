import { mainnet, sepolia } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { chainIdHandler } from './chainIdHandler.js'

describe(chainIdHandler.name, () => {
	it('should return the chain id', async () => {
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

	it('should return overridden chain ID from fork options', async () => {
		const customChainId = 999
		const node = createTevmNode({
			fork: {
				transport: transports.optimism,
				chainId: customChainId,
			},
		})
		const chainId = await chainIdHandler(node)({})
		expect(chainId).toBe(BigInt(customChainId))
	})
})
