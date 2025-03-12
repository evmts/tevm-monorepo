import { Block } from '@tevm/block'
import { optimism } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { EMPTY_STATE_ROOT } from '@tevm/trie'
import { describe, expect, it } from 'vitest'
import { createBaseChain } from './createBaseChain.js'
import { getMockBlocks } from './test/getBlocks.js'

describe(createBaseChain.name, () => {
	it('has state', () => {
		const chain = createBaseChain({ common: optimism.copy() })
		expect(chain.blocks).toBeInstanceOf(Map)
		expect(chain.blocksByNumber).toBeInstanceOf(Map)
		expect(chain.blocksByTag).toBeInstanceOf(Map)
	})

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
		expect(chain.blocksByTag.get('forked')?.hash()).toEqual(mockBlocks[0].hash())
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

	it('should create a genesis block with withdrawals when EIP-4895 is activated', async () => {
		// Create a common with EIP-4895 activated
		const common = optimism.copy()
		common.ethjsCommon.setEIPs([4895])

		const options = { common }
		const chain = createBaseChain(options)
		await chain.ready()

		// Get the genesis block
		const genesisBlock = chain.blocksByNumber.get(0n)
		// Verify it has withdrawalsRoot and withdrawals field
		expect(genesisBlock?.header.withdrawalsRoot).toBeDefined()
		expect(genesisBlock?.withdrawals).toBeDefined()
		expect(genesisBlock?.withdrawals).toEqual([])
	})
})
