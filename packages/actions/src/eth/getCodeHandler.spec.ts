import { createAddress } from '@tevm/address'
import { UnknownBlockError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { numberToHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { mainnetNode, optimismNode } from '../../vitest.setup.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getCodeHandler } from './getCodeHandler.js'

const contract = SimpleContract.withAddress(createAddress(420420).toString())

describe(getCodeHandler.name, () => {
	it('should implement eth_getCode', async () => {
		const client = createTevmNode()

		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
		})

		expect(
			await getCodeHandler(client)({
				address: contract.address,
			}),
		).toBe(contract.deployedBytecode)
	})

	it('should return empty bytecode for non-existent address', async () => {
		const client = createTevmNode()
		const nonExistentAddress = createAddress(123456).toString()

		const code = await getCodeHandler(client)({
			address: nonExistentAddress,
		})

		expect(code).toEqualHex('0x')
	})

	it('should handle "pending" block tag', async () => {
		const client = createTevmNode()

		const code = await getCodeHandler(client)({
			address: contract.address,
			blockTag: 'pending',
		})

		expect(code).toEqualHex('0x')
	})

	it('should throw UnknownBlockError for non-existent block', async () => {
		const client = createTevmNode()

		await expect(
			getCodeHandler(client)({
				address: contract.address,
				blockTag: '0x123456',
			}),
		).rejects.toThrow(UnknownBlockError)
	})

	it('should handle numeric block tag', async () => {
		const client = createTevmNode()
		const blockNumber = 0 // Use genesis block

		const code = await getCodeHandler(client)({
			address: contract.address,
			blockTag: blockNumber as any,
		})

		expect(code).toEqualHex('0x')
	})

	it('should handle latest block tag', async () => {
		const client = createTevmNode()

		const code = await getCodeHandler(client)({
			address: contract.address,
			blockTag: 'latest',
		})

		expect(code).toEqualHex('0x')
	})

	it('should return correct code after contract deployment', async () => {
		const client = createTevmNode()

		// Deploy the contract
		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
		})

		// Get the code
		const code = await getCodeHandler(client)({
			address: contract.address,
		})

		expect(code).toBe(contract.deployedBytecode)
	})

	it('should be able to fetch code with a block tag', async () => {
		const client = createTevmNode()

		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
		})

		const { blockHashes } = await mineHandler(client)({ blockCount: 1 })
		if (!blockHashes?.[0]) throw new Error('No block mined')

		// Get code with a block tag
		expect(
			await getCodeHandler(client)({
				address: contract.address,
				blockTag: 'latest',
			}),
		).toBe(contract.deployedBytecode)

		// Get code with a block hash
		expect(
			await getCodeHandler(client)({
				address: contract.address,
				blockTag: blockHashes[0],
			}),
		).toBe(contract.deployedBytecode)

		// Get code with a block number
		expect(
			await getCodeHandler(client)({
				address: contract.address,
				blockTag: 1n,
			}),
		).toBe(contract.deployedBytecode)

		// Get code with a block number as a hex string
		expect(
			await getCodeHandler(client)({
				address: contract.address,
				blockTag: numberToHex(1n),
			}),
		).toBe(contract.deployedBytecode)
	})
})

describe('Forking tests', () => {
	it('should fetch code from mainnet fork when block is not in local state', async () => {
		const forkedHandler = getCodeHandler(mainnetNode)

		// Use a known contract address from mainnet
		const uniswapV2Router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
		const code = await forkedHandler({ address: uniswapV2Router, blockTag: 'latest' })

		expect(code).not.toBe('0x')
		expect(code.length).toBeGreaterThan(2)
	})

	it('should fetch code from Optimism fork', async () => {
		const forkedHandler = getCodeHandler(optimismNode)

		// Use a known contract address from Optimism
		const optimismBridgeAddress = '0x4200000000000000000000000000000000000010'
		const code = await forkedHandler({ address: optimismBridgeAddress, blockTag: 'latest' })

		expect(code).not.toBe('0x')
		expect(code.length).toBeGreaterThan(2)
	})
})
