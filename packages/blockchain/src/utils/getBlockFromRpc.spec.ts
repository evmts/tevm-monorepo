import { Block } from '@tevm/block'
import { optimism } from '@tevm/common'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { transports } from '@tevm/test-utils'
import { bytesToHex, custom } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getBlockFromRpc } from './getBlockFromRpc.js'

describe('getBlockFromRpc', () => {
	const baseChain = createBaseChain({ common: optimism.copy() })
	it('should fetch the latest block', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const [block] = await getBlockFromRpc(baseChain, { transport, blockTag: 'latest' }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBeGreaterThanOrEqual(0n)
	})

	const blockNumber = 122699513n
	const blockHash = '0x485643430d3c6d32d4391353b2de38d335443d6399eccd7f639cd73027cc3245'
	// it is different because we filter out optimism deposit tx
	const blockHashAfterForking = '0xcbec656e620f3182a946be85fb7fa34b802b064c4be1bd7ce52df74954d7a49e'

	it('should fetch a block by number', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const [block] = await getBlockFromRpc(baseChain, { transport, blockTag: blockNumber }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBe(blockNumber)
		expect(bytesToHex(block.hash())).toEqual(blockHashAfterForking)
		// Verify block structure and basic transaction properties
		const blockJson = block.toJSON()
		expect(blockJson.header).toEqual(expectedBlock.header)

		// Check transactions exist
		if (!blockJson.transactions) {
			throw new Error('Expected transactions to be defined')
		}
		expect(blockJson.transactions.length).toBe(4) // 5 transactions minus 1 filtered deposit tx

		// Check that first transaction has expected properties
		const tx0 = blockJson.transactions[0]
		if (!tx0) {
			throw new Error('Expected first transaction to be defined')
		}
		expect(tx0.type).toBe('0x0')
		expect(tx0.nonce).toBe('0x147')
		expect(tx0.gasLimit).toBe('0x175dea')
		expect(tx0.gasPrice).toBe('0x21064c')
		if (!tx0.to) {
			throw new Error('Expected transaction to have a "to" address')
		}
		expect(tx0.to.toLowerCase()).toBe('0xfb4e4811c7a811e098a556bd79b64c20b479e431')
		expect(tx0.value).toBe('0x0')
	})

	it('should fetch a block by hash', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const [block] = await getBlockFromRpc(baseChain, { transport, blockTag: blockHash }, common)
		expect(block).toBeInstanceOf(Block)
		expect(bytesToHex(block.hash())).toBe(blockHashAfterForking)
		expect(block.header.number).toBe(blockNumber)
		// Verify block structure and basic transaction properties
		const blockJson = block.toJSON()
		expect(blockJson.header).toEqual(expectedBlock.header)

		// Check transactions exist
		if (!blockJson.transactions) {
			throw new Error('Expected transactions to be defined')
		}
		expect(blockJson.transactions.length).toBe(4) // 5 transactions minus 1 filtered deposit tx

		// Check that first transaction has expected properties
		const tx0 = blockJson.transactions[0]
		if (!tx0) {
			throw new Error('Expected first transaction to be defined')
		}
		expect(tx0.type).toBe('0x0')
		expect(tx0.nonce).toBe('0x147')
		expect(tx0.gasLimit).toBe('0x175dea')
		expect(tx0.gasPrice).toBe('0x21064c')
		if (!tx0.to) {
			throw new Error('Expected transaction to have a "to" address')
		}
		expect(tx0.to.toLowerCase()).toBe('0xfb4e4811c7a811e098a556bd79b64c20b479e431')
		expect(tx0.value).toBe('0x0')
	})

	it('should handle invalid block tag', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const invalidBlockTag = '0x420420430d3c6d32d4391353b2de38d335443d6399eccd7f639cd73027420420'

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: invalidBlockTag as any }, common).catch(
			(e) => e,
		)
		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should throw InvalidBlockError for an invalid block tag', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const invalidBlockTag = 'invalid-tag' // Not a valid TevmBlockTag

		// Attempt to get a block with an invalid tag
		const error = await getBlockFromRpc(
			createBaseChain({ common: optimism.copy() }),
			// @ts-expect-error
			{ transport, blockTag: invalidBlockTag },
			common,
		).catch((e) => e)

		expect(error).toBeInstanceOf(InvalidBlockError)
		expect(error.message).toContain('Invalid blocktag')
		expect(error.message).toContain(invalidBlockTag)
	})

	it('should handle a fetch error', async () => {
		const transport = custom({
			request: () => {
				throw new Error('fetch error')
			},
		})({ retryCount: 0 })
		const common = optimism.copy()

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: blockNumber }, common).catch((e) => e)
		expect(err).toMatchSnapshot()
		const err2 = await getBlockFromRpc(baseChain, { transport, blockTag: blockHash }, common).catch((e) => e)
		expect(err2).toMatchSnapshot()
		const err3 = await getBlockFromRpc(baseChain, { transport, blockTag: 'latest' }, common).catch((e) => e)
		expect(err3).toMatchSnapshot()
	})

	it('should handle non-existing block number', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const nonExistingBlockNumber = 99999999999999999n

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: nonExistingBlockNumber }, common).catch(
			(e) => e,
		)

		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should handle non-existing block hash', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const nonExistingBlockHash = `0x${'0'.repeat(64)}` as const

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: nonExistingBlockHash }, common).catch((e) => e)
		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('shoudl handle unlikely event of a non-existing named block tag', async () => {
		const transport = custom({
			request: () => {
				return Promise.resolve(undefined)
			},
		})({ retryCount: 0 })
		const common = optimism.copy()
		const nonExistingBlockTag = 'latest'

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: nonExistingBlockTag }, common).catch((e) => e)
		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should handle Optimism deposit transactions filtering', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const baseChain = createBaseChain({ common })
		const consoleWarnSpy = vi.fn()
		baseChain.logger.warn = consoleWarnSpy

		const [block] = await getBlockFromRpc(baseChain, { transport, blockTag: blockNumber }, common)
		await getBlockFromRpc(baseChain, { transport, blockTag: blockNumber }, common)
		await getBlockFromRpc(baseChain, { transport, blockTag: blockNumber }, common)
		expect(block).toBeInstanceOf(Block)
		// only called once per call rather than once per tx
		expect(consoleWarnSpy).toHaveBeenCalledTimes(3)
		expect(consoleWarnSpy.mock.calls).toMatchSnapshot()
		consoleWarnSpy.mockRestore()
	})
})

const expectedBlock = {
	header: {
		baseFeePerGas: '0x49c53',
		blobGasUsed: '0x0',
		coinbase: '0x4200000000000000000000000000000000000011',
		difficulty: '0x0',
		excessBlobGas: '0x0',
		extraData: '0x',
		gasLimit: '0x1c9c380',
		gasUsed: '0x366775',
		logsBloom:
			'0x00b020004002000800000000000000000000210800080000000800004400000028000000254102000000000000000000004000040840000000402040000008000000001000000000002000080200000000000480000000000000043000a080000011000002000040000000004000082000000000000000040000005000000001001000210000000000001000000080000040008080000000004004022201087000140001040000000008000800000400a00008200000010200000000000000a04000000200020000400210020002004000000000008000000000000020002000000000280080008020000000000000000000010000000c8000020000000000c0',
		mixHash: '0xdc4f0757bd0f7e87f05c37e6bcaf12d12f4509e71ef7bcf9dadc6a916155ce16',
		nonce: '0x0000000000000000',
		number: '0x7503ef9',
		parentBeaconBlockRoot: '0x91cf67004be4a1f9cb638f1999aa9b013d2afebbfa1aa4c06ba82e4d668443aa',
		parentHash: '0x3e7b1c676f9450cd921209981847d633028d70c8c0720014e31d524b8cf54c07',
		receiptTrie: '0x8fa30f0a51947bff54300fefb7ea95998aaf88acefb018869ef6225136f960d4',
		stateRoot: '0xc517c452ae4595b87098d196d5ec2285851d39b2feeeeffd493109d3a093b0e0',
		timestamp: '0x669457ab',
		transactionsTrie: '0xd470b757c11beea437e14b493489946e4b951c60c5c510348a94f8393468e00d',
		uncleHash: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
		withdrawalsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	},
	requests: undefined,
	transactions: [
		{
			chainId: '0xa',
			data: '0x014e17b000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000030479e800000000000000000000000000000000000000000000000000616352f5b60af0000000000000000000000000000000000000000000000000000470de4df820000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000203434303738373500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000027190000000000000000000000000000000000000000000000000000000066946680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000616352f5b60af0000000000000000000000000000000000000000000000000008d6dffd0723a3c00000000000000000000000000000000000000000000000000000000000000006d02232bd3b64baa3746e97b85ffa8a136500a3167a8c4456787a3adcb968f63106636934809813db15d9fae9337df5a127d7087881281e08f948d4fc26917452b2fb8c7196962e8eb430dc38991796df40aa72943a6aa353b538a3083b467f28ca3c0222e7dd4c6e0ca71926856948902d6666b4dea0581dc30ddcb3ab1a9f2aff695e7479d2fe72e972a86c4f3a65781e377129f0c0fe35ac0dc3a0eca8e6086efe350136ca4f6bf8bb0b33f9f98b0e59c7bfbbd9652190d1f9b4214770d8a600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			gasLimit: '0x175dea',
			gasPrice: '0x21064c',
			nonce: '0x147',
			r: '0xd2319cf97f032213fff650db456510e8a11aa7221f30eb2490589b60bb71e889',
			s: '0x4696f3d45d8434199b1fb71fbae547f04ea52bcf06d7f6f7c163990ebf4349db',
			to: '0xfb4e4811c7a811e098a556bd79b64c20b479e431',
			type: '0x0',
			v: '0x38',
			value: '0x0',
		},
		{
			accessList: [],
			chainId: '0xa',
			data: '0x82ad56cb0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000320000000000000000000000000ca8290402f3639cebf46649a971d320dfb023d2e0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000002446a761202000000000000000000000000dc6ff44d5d932cbd77b52e5612ba0529dc6226f10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000cf344fb33e8d3fa1d790a6d03a382d1087b6f311000000000000000000000000000000000000000000000000b469471f80140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041dc87ae994c7c718c1dc3a713610f5ac9d03cdb9d232b193810ca3f1c07cb263a3a3f3a6b40ea82248fb1341779d87320e7cf19de3f56e2ea0e015c8e2fee7d231b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000dcce1199eb728d080b8c4fe77f6fa01445e8502e0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000002446a761202000000000000000000000000dc6ff44d5d932cbd77b52e5612ba0529dc6226f10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000635d5bbf389c218b0d07a960c677c9a62f715bc60000000000000000000000000000000000000000000000002bfe1a3461fd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041e76ae9a9fd0402e6d77b0fd5250b81da706a4fc5cd6abefce3c10bc2bc18460b2c20d6d459222377f5cdc86e566fcccd47aefdbb2bc688c5727aa00c387a315e1b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			gasLimit: '0x29188',
			maxFeePerGas: '0x20db37',
			maxPriorityFeePerGas: '0x17a291',
			nonce: '0x907ac',
			r: '0x95f5df460bc6ab7704ffb8d69289116833ebbbd11561c46fb698f321a97adf14',
			s: '0x19a83eab66e5f83e2c7c94431862736346b5b58ea222f4a2c9d369cc03f995a8',
			to: '0x087000a300de7200382b55d40045000000e5d60e',
			type: '0x2',
			v: '0x1',
			value: '0x0',
			yParity: '0x1',
		},
		{
			accessList: [],
			chainId: '0xa',
			data: '0x379607f500000000000000000000000000000000000000000000000000000000000014ac',
			gasLimit: '0x2447c5',
			maxFeePerGas: '0x140627',
			maxPriorityFeePerGas: '0xf4240',
			nonce: '0x3b',
			r: '0x7a71d359aed23c13d5bc9ee98906d83a94e1471e1a1cf5734c417932a24bcfa1',
			s: '0x5f1f5975144b69fdcde2fa0bbd637da9b3c7b369f58eec86ae716e31e8ae0b5c',
			to: '0x9d4736ec60715e71afe72973f7885dcbc21ea99b',
			type: '0x2',
			v: '0x0',
			value: '0x0',
			yParity: '0x0',
		},
		{
			accessList: [],
			chainId: '0xa',
			data: '0xa9059cbb000000000000000000000000f2287c150d6aad5754e718bbe9d052181343bd3f00000000000000000000000000000000000000000000000000000000017b7c70',
			gasLimit: '0x8926',
			maxFeePerGas: '0x7c63df4',
			maxPriorityFeePerGas: '0x1fd81',
			nonce: '0x3223b9',
			r: '0x8d808d9fffde2669d3b4e00d1ec594f14c0f348876a2df68962d27555ade6d47',
			s: '0x73d743608934c6e571db6ad6214844c466fe71e42b6e3e722bf98af60ce4096e',
			to: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
			type: '0x2',
			v: '0x0',
			value: '0x0',
			yParity: '0x0',
		},
	],
	uncleHeaders: [],
	withdrawals: [],
}
