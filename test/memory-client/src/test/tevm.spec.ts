import { optimism } from '@tevm/common'
import { ERC20 } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { describe, expect, it } from 'vitest'
import { createCachedOptimismTransport } from '../cachedTransports.js'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'
const DaiContract = ERC20.withAddress(contractAddress)

describe('client.contract fork integration', () => {
	it('should fork a network and then execute a contract call', async () => {
		const tevm = createMemoryClient({
			fork: {
				transport: createCachedOptimismTransport(),
				blockTag: 142153711n,
			},
			common: optimism,
		})
		const res = await tevm.tevmContract(DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d'))
		expect(res.data).toBe(1n)
		expect(res.rawData).toBe('0x0000000000000000000000000000000000000000000000000000000000000001')
	})
})
