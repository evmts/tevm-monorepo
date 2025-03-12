import { optimism } from '@tevm/common'
import { bytesToHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { putBlock } from './putBlock.js'

describe(putBlock.name, async () => {
	const blocks = await getMockBlocks()

	it('should save the block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		expect(chain.blocks.get(bytesToHex(blocks[0].hash()))).toBe(blocks[0])
		expect(chain.blocksByNumber.get(blocks[0].header.number)).toBe(blocks[0])
	})

	it('should set the latest block if it is the highest block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[0])
		expect(chain.blocksByTag.get('latest')).toBe(blocks[0])
	})

	it('should not set the latest block if it is not the highest block', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		await putBlock(chain)(blocks[1])
		await putBlock(chain)(blocks[0])
		expect(chain.blocksByTag.get('latest')).toBe(blocks[1])
	})

	it('should throw an error if block chainId does not match common chainId', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const mockBlocks = await getMockBlocks()

		// Create a modified block with different chainId
		const invalidBlock = {
			...mockBlocks[0],
			common: {
				...mockBlocks[0].common,
				ethjsCommon: {
					chainId: () => 999n, // Different from optimism chain ID
				},
			},
			hash: () => mockBlocks[0].hash(),
		}

		// Attempt to put this block and verify it throws the expected error
		let error: any
		try {
			await putBlock(chain)(invalidBlock as any)
		} catch (err) {
			error = err
		}

		expect(error).toBeDefined()
		expect(error.message).toBe('Block does not match the chainId of common')
	})
})
