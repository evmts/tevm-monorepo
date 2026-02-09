import { createAddress } from '@tevm/address'
import { mainnet } from '@tevm/common'
import { NoForkUrlSetError } from '@tevm/errors'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, bytesToHex, parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getBalanceHandler } from './getBalanceHandler.js'

describe(getBalanceHandler.name, () => {
	let baseClient: ReturnType<typeof createTevmNode>
	let address: Address
	let handler: ReturnType<typeof getBalanceHandler>

	beforeEach(() => {
		baseClient = createTevmNode()
		address = createAddress('0x1234567890123456789012345678901234567890').toString()
		handler = getBalanceHandler(baseClient)
	})

	it('should fetch balance from state manager if tag is not defined defaulting the tag to `latest`', async () => {
		await setAccountHandler(baseClient)({ address, balance: parseEther('1') })
		expect(await handler({ address })).toEqual(parseEther('1'))
	})

	it('should return 0n for an address with no balance', async () => {
		const emptyAddress = createAddress('0x0000000000000000000000000000000000000002')
		expect(await handler({ address: emptyAddress.toString() })).toEqual(0n)
	})

	it('should fetch balance for a specific block number', async () => {
		await setAccountHandler(baseClient)({ address, balance: parseEther('1') })
		await mineHandler(baseClient)()
		await setAccountHandler(baseClient)({ address, balance: parseEther('2') })

		const balanceAtBlock2 = await handler({ address, blockTag: 1n })
		expect(balanceAtBlock2).toEqual(parseEther('2'))

		const balanceAtBlock1 = await handler({ address, blockTag: 0n })
		expect(balanceAtBlock1).toEqual(parseEther('1'))
	})

	it('should fetch balance for a specific block hash', async () => {
		await setAccountHandler(baseClient)({ address, balance: parseEther('1') })
		await mineHandler(baseClient)()
		await setAccountHandler(baseClient)({ address, balance: parseEther('2') })

		const vm = await baseClient.getVm()
		const block2 = vm.blockchain.blocksByNumber.get(1n)
		const block1 = vm.blockchain.blocksByNumber.get(0n)
		if (!block1 || !block2) throw new Error('Blocks not found')

		const balanceAtBlock2 = await handler({ address, blockTag: bytesToHex(block2.hash()) })
		expect(balanceAtBlock2).toEqual(parseEther('2'))

		const balanceAtBlock1 = await handler({ address, blockTag: bytesToHex(block1.hash()) })
		expect(balanceAtBlock1).toEqual(parseEther('1'))
	})

	it('should fetch balance for `pending` block', async () => {
		await setAccountHandler(baseClient)({ address, balance: parseEther('1') })
		await mineHandler(baseClient)()
		await setAccountHandler(baseClient)({ address, balance: parseEther('2') })

		const pendingBalance = await handler({ address, blockTag: 'pending' })
		expect(pendingBalance).toEqual(parseEther('2'))
	})

	it('should throw NoForkUrlSetError when trying to fetch balance for non-existent block in non-fork mode', async () => {
		await expect(handler({ address, blockTag: '0x1000' })).rejects.toThrow(NoForkUrlSetError)
	})

	const createMockForkTransport = () => ({
		request: async ({ method, params }: { method: string; params?: readonly unknown[] }) => {
			if (method === 'eth_chainId') return '0x1'
			if (method === 'eth_getProof') {
				return {
					address: params?.[0] ?? address,
					accountProof: [],
					balance: '0x1a4',
					codeHash: `0x${'0'.repeat(64)}`,
					nonce: '0x0',
					storageHash: `0x${'0'.repeat(64)}`,
					storageProof: [],
				}
			}
			if (method === 'eth_getBalance') {
				const tag = params?.[1]
				if (tag === 'latest') return '0x1a4'
				if (tag === '0x1670f2c') return '0x1b8'
				if (tag === '0x08d73a165cd64ecf0872c4d21099bcbec4d0a0242eeb77f83ca2cf1bde4ca196') return '0x1cc'
				return '0x0'
			}
			return '0x0'
		},
	})

	it('should fetch balance from local state on a forked node when blockTag is latest', async () => {
		const node = createTevmNode({
			common: mainnet,
			fork: {
				transport: createMockForkTransport(),
			},
		})
		const forkedHandler = getBalanceHandler(node)

		const balance = await forkedHandler({ address, blockTag: 'latest' })

		expect(balance).toBe(420n)
	})

	it('should fetch balance from fork when block is not in local state with block number', async () => {
		const node = createTevmNode({
			common: mainnet,
			fork: { transport: createMockForkTransport() },
		}) as unknown as TevmNode
		const forkedHandler = getBalanceHandler(node)

		const balance = await forkedHandler({ address, blockTag: 23531308n })

		expect(balance).toBe(440n)
	})

	it('should fetch balance from fork when block is not in local state with block hash', async () => {
		const node = createTevmNode({
			common: mainnet,
			fork: { transport: createMockForkTransport() },
		}) as unknown as TevmNode
		const forkedHandler = getBalanceHandler(node)

		const balance = await forkedHandler({
			address,
			blockTag: '0x08d73a165cd64ecf0872c4d21099bcbec4d0a0242eeb77f83ca2cf1bde4ca196',
		})

		expect(balance).toBe(460n)
	})
})
