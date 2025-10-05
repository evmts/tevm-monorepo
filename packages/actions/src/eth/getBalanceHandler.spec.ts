import { createAddress } from '@tevm/address'
import { NoForkUrlSetError } from '@tevm/errors'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { createCachedMainnetNode, transports } from '@tevm/test-utils'
import { type Address, bytesToHex, type Hex, hexToBigInt, parseEther } from '@tevm/utils'
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

	// This test assumes you have a way to set up a forked client
	it('should fetch balance from fork when block is not in local state with blockTag latest', async () => {
		const node = createCachedMainnetNode() as unknown as TevmNode
		const forkedHandler = getBalanceHandler(node)

		// Use a known address from mainnet with a stable balance
		const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const balance = await forkedHandler({ address: vitalikAddress, blockTag: 'latest' })

		expect(balance).toBeGreaterThan(0n)
	})

	it('should fetch balance from fork when block is not in local state with block number', async () => {
		const node = createCachedMainnetNode() as unknown as TevmNode
		const forkedHandler = getBalanceHandler(node)

		const latestBlockNumber = (await transports.mainnet.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_blockNumber',
		})) as Hex

		// Use a known address from mainnet with a stable balance
		const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const balance = await forkedHandler({ address: vitalikAddress, blockTag: hexToBigInt(latestBlockNumber) })

		expect(balance).toBeGreaterThan(0n)
	})

	it('should fetch balance from fork when block is not in local state with block hash', async () => {
		const node = createCachedMainnetNode() as unknown as TevmNode
		const forkedHandler = getBalanceHandler(node)

		const latestBlockNumber = (await transports.mainnet.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_blockNumber',
		})) as Hex

		const latestBlock = (await transports.mainnet.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockByNumber',
			params: [latestBlockNumber, false],
		})) as { hash: Hex }

		// Use a known address from mainnet with a stable balance
		const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const balance = await forkedHandler({ address: vitalikAddress, blockTag: latestBlock.hash })

		expect(balance).toBeGreaterThan(0n)
	})
})
