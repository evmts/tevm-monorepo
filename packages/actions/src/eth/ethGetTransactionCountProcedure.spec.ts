import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { numberToHex, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethGetTransactionCountProcedure } from './ethGetTransactionCountProcedure.js'

const address = '0xb5d85CBf7cB3EE0D56b3bB207D5Fc4B82f43F511' as const

describe(ethGetTransactionCountProcedure.name, () => {
	it('should work', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996967n,
			},
		})
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			}),
		).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "result": "0xa83701",
}
`)
	})
	it('should work with past block tags', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996939n,
			},
		})
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, numberToHex(21996939n)],
			}),
		).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "result": "0xa836d8",
}
`)
	})
	it('should work with pending tx', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996939n,
			},
		})
		await setAccountHandler(node)({
			address,
			balance: parseEther('25'),
		})
		await callHandler(node)({
			from: address,
			to: createAddress(500).toString(),
			value: parseEther('0.1'),
			createTransaction: true,
		})
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			}),
		).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "result": "0xa836d8",
}
`)
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'pending'],
			}),
		).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "result": "0xa836d9",
}
`)
	})
})
