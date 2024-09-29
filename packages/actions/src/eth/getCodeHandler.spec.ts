import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract, transports } from '@tevm/test-utils'
import { describe, expect, it} from 'vitest'
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
})

describe('Forking tests', () => {
	it('should fetch code from mainnet fork when block is not in local state', async () => {
		const forkedClient = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const forkedHandler = getCodeHandler(forkedClient)

		// Use a known contract address from mainnet
		const uniswapV2Router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
		const code = await forkedHandler({ address: uniswapV2Router, blockTag: 'latest' })

		expect(code).not.toBe('0x')
		expect(code.length).toBeGreaterThan(2)
	})

	it('should fetch code from Optimism fork', async () => {
		const forkedClient = createTevmNode({
			fork: {
				transport: transports.optimism,
			},
		})
		const forkedHandler = getCodeHandler(forkedClient)

		// Use a known contract address from Optimism
		const optimismBridgeAddress = '0x4200000000000000000000000000000000000010'
		const code = await forkedHandler({ address: optimismBridgeAddress, blockTag: 'latest' })

		expect(code).not.toBe('0x')
		expect(code.length).toBeGreaterThan(2)
	})
})
