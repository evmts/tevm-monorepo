import { ERC20 } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { type RequestHandlers, createHandlers } from './createHandlers.js'

const ERC20_ADDRESS = `0x${'69'.repeat(20)}` as const

describe('createHandlers', () => {
	let client: any
	let handlers: RequestHandlers

	beforeEach(async () => {
		client = createTevmNode()
		await client.ready()
		handlers = createHandlers(client)
	})

	it('should handle eth_chainId', async () => {
		const res = await handlers.eth_chainId({
			jsonrpc: '2.0',
			method: 'eth_chainId',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle eth_call', async () => {
		const to = `0x${'69'.repeat(20)}` as const
		const res = await handlers.eth_call({
			jsonrpc: '2.0',
			method: 'eth_call',
			id: 1,
			params: [
				{
					from: to,
					to,
					data: '0x',
				},
				'latest',
			],
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle eth_getBalance', async () => {
		const address = `0x${'69'.repeat(20)}` as const
		const res = await handlers.eth_getBalance({
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			id: 1,
			params: [address, 'latest'],
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle tevm_getAccount', async () => {
		await handlers.tevm_setAccount({
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			id: 1,
			params: [
				{
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20.deployedBytecode,
					balance: numberToHex(420n),
					nonce: numberToHex(69n),
				},
			],
		})
		const res = await handlers.tevm_getAccount({
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			id: 1,
			params: [
				{
					address: ERC20_ADDRESS,
				},
			],
		})
		expect(res.error).toBeUndefined()
		expect(res).toMatchSnapshot
	})

	it('should handle eth_estimateGas', async () => {
		const to = `0x${'69'.repeat(20)}` as const
		const res = await handlers.eth_estimateGas({
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 1,
			params: [
				{
					from: to,
					to,
					data: '0x',
				},
			],
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle tevm_mine', async () => {
		const res = await handlers.tevm_miner({
			jsonrpc: '2.0',
			method: 'tevm_mine',
			id: 1,
			params: ['0x1', '0x1'],
		})
		expect(res.id).toBe(1)
		expect(res.error).toBeUndefined()
		expect(res.method).toBe('tevm_mine')
		expect(res.result?.blockHashes).toHaveLength(1)
	})

	it('should handle tevm_contract', async () => {
		const res = await handlers.tevm_contract({
			jsonrpc: '2.0',
			method: 'tevm_contract',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})

	// Add more tests for other handlers as needed...

	it('should handle eth_mining', async () => {
		const res = handlers.eth_mining({
			jsonrpc: '2.0',
			method: 'eth_mining',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle eth_syncing', async () => {
		const res = handlers.eth_syncing({
			jsonrpc: '2.0',
			method: 'eth_syncing',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})
})
