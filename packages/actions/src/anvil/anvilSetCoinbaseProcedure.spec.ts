import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { ethCoinbaseJsonRpcProcedure } from '../eth/ethCoinbaseProcedure.js'
import { anvilSetCoinbaseJsonRpcProcedure } from './anvilSetCoinbaseProcedure.js'

describe('anvilSetCoinbaseJsonRpcProcedure', () => {
	it('should set coinbase address', async () => {
		const client = createTevmNode()
		const procedure = anvilSetCoinbaseJsonRpcProcedure(client)
		const coinbase = createAddress('0x1234567890123456789012345678901234567890')

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setCoinbase',
			params: [coinbase.toString()],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setCoinbase',
			result: coinbase.toString(),
			id: 1,
		})

		const getCoinbaseResult = await ethCoinbaseJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_coinbase',
			params: [],
			id: 1,
		})
		expect(getCoinbaseResult.result).toEqual(coinbase.toString())
	})
})
