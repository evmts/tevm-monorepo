import { optimism } from '@tevm/common'
import { bytesToHex, hexToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { putBlock } from './putBlock.js'
import { setIteratorHead } from './setIteratorHead.js'

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

	it('should not replace the canonical block at the same height', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const sideBlock = {
			...blocks[0],
			hash: () => hexToBytes(`0x${'11'.repeat(32)}`),
		}

		await putBlock(chain)(blocks[0])
		await putBlock(chain)(sideBlock)

		expect(chain.blocksByNumber.get(blocks[0].header.number)).toBe(blocks[0])
		expect(chain.blocksByTag.get('latest')).toBe(blocks[0])
		expect(chain.blocks.get(bytesToHex(sideBlock.hash()))).toBe(sideBlock)
	})

	it('should not promote a disconnected higher block to latest', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const disconnectedBlock = {
			...blocks[1],
			hash: () => hexToBytes(`0x${'22'.repeat(32)}`),
			header: {
				...blocks[1].header,
				number: blocks[0].header.number + 10n,
				parentHash: hexToBytes(`0x${'33'.repeat(32)}`),
			},
		}

		await putBlock(chain)(blocks[0])
		await putBlock(chain)(disconnectedBlock)

		expect(chain.blocksByTag.get('latest')).toBe(blocks[0])
		expect(chain.blocks.get(bytesToHex(disconnectedBlock.hash()))).toBe(disconnectedBlock)
	})

	it('should repoint blocksByNumber to the canonical block on a reorg to a sibling at the same height (#9)', async () => {
		const chain = createBaseChain({ common: optimism.copy() })

		// Build a base head at some height, then two siblings (5a, 5b) at base + 1 that both extend it.
		const base = blocks[0]
		const siblingHeight = base.header.number + 1n
		// Both siblings carry a __tevmJsonRpcBlockHash so putBlock skips header validation (matching how
		// forked blocks are stored), letting us focus the assertion on the blocksByNumber index.
		const siblingA = {
			...blocks[1],
			__tevmJsonRpcBlockHash: `0x${'aa'.repeat(32)}`,
			hash: () => hexToBytes(`0x${'aa'.repeat(32)}`),
			header: {
				...blocks[1].header,
				number: siblingHeight,
				parentHash: base.hash(),
				toJSON: () => ({ number: siblingHeight }),
			},
		}
		const siblingB = {
			...blocks[1],
			__tevmJsonRpcBlockHash: `0x${'bb'.repeat(32)}`,
			hash: () => hexToBytes(`0x${'bb'.repeat(32)}`),
			header: {
				...blocks[1].header,
				number: siblingHeight,
				parentHash: base.hash(),
				toJSON: () => ({ number: siblingHeight }),
			},
		}

		await putBlock(chain)(base)
		await putBlock(chain)(siblingA as any)
		expect(chain.blocksByTag.get('latest')).toBe(siblingA)
		expect(chain.blocksByNumber.get(siblingHeight)).toBe(siblingA)

		// Reorg the canonical head back to the shared parent, then extend with the other sibling.
		await setIteratorHead(chain)('latest', base.hash())
		await putBlock(chain)(siblingB as any)

		// siblingB now extends the (reset) latest head and becomes canonical. The number->hash index
		// must be repointed at siblingB; without the fix it would still return the stale sibling siblingA.
		expect(chain.blocksByTag.get('latest')).toBe(siblingB)
		expect(chain.blocksByNumber.get(siblingHeight)).toBe(siblingB)
		expect(chain.blocks.get(bytesToHex(siblingA.hash()))).toBe(siblingA)
	})

	it('should reject a local block with an invalid header when its parent is known', async () => {
		const chain = createBaseChain({ common: optimism.copy() })
		const invalidBlock = {
			...blocks[1],
			hash: () => hexToBytes(`0x${'44'.repeat(32)}`),
			header: {
				...blocks[1].header,
				isGenesis: () => false,
				errorStr: () => 'invalid local block',
				number: blocks[0].header.number,
			},
		}

		await putBlock(chain)(blocks[0])
		await expect(putBlock(chain)(invalidBlock)).rejects.toThrow('invalid number')
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
