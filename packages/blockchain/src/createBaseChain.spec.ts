import { describe, expect, it } from 'bun:test'
import { createBaseChain } from './createBaseChain.js'
import { optimism } from '@tevm/common'
import { getMockBlocks } from './test/getBlocks.js'
import { EMPTY_STATE_ROOT } from '@tevm/trie'
import { Block } from '@tevm/block'
import { transports } from '@tevm/test-utils'

describe(createBaseChain.name, () => {
	it('should create a base chain with genesis block', async () => {
		const common = optimism.copy()
		const options = { common }
		const chain = createBaseChain(options)

		await chain.ready()

		expect(chain.common).toBe(common)
		expect(chain.blocks.size).toBe(1)
		expect(chain.blocksByNumber.size).toBe(1)
		expect(chain.blocksByTag.get('forked')).toBeUndefined()
		expect(chain.blocksByTag.get('latest')).toBeInstanceOf(Block)
	})

	it('should create a base chain with forked block from RPC', async () => {
		const common = optimism.copy()
		const mockBlocks = await getMockBlocks()
		const forkOptions = {
			common,
			fork: {
				transport: transports.optimism,
				blockTag: mockBlocks[0].header.number,
			},
		}

		const chain = createBaseChain(forkOptions)
		await chain.ready()

		expect(chain.common).toBe(common)
		expect(chain.blocks.size).toBeGreaterThan(0)
		expect(chain.blocksByNumber.size).toBeGreaterThan(0)
		expect(chain.blocksByTag.get('forked')).toBeDefined()
		expect(chain.blocksByTag.get('forked')).toEqual(mockBlocks[0])
		expect(chain.blocksByTag.get('latest')).toBeInstanceOf(Block)
	})

	it('should create a base chain with a provided genesis block', async () => {
		const common = optimism.copy()
		const genesisBlock = Block.fromBlockData(
			{
				header: {
					number: 0,
					stateRoot: EMPTY_STATE_ROOT,
					gasLimit: 30_000_000n,
					timestamp: 0,
					difficulty: 1,
					nonce: '0x0000000000000042',
				},
			},
			{ common },
		)
		const options = { common, genesisBlock }
		const chain = createBaseChain(options)

		await chain.ready()

		expect(chain.common).toBe(common)
		expect(chain.blocks.size).toBe(1)
		expect(chain.blocksByNumber.size).toBe(1)
		expect(chain.blocksByTag.get('forked')).toBeUndefined()
		expect(chain.blocksByTag.get('latest')).toBe(genesisBlock)
	})
})
