import { ERC20 } from './tests/ERC20.sol.js'
import { tevmViemExtension } from './tevmViemExtension.js'
import { Address } from '@ethereumjs/util'
import { type MemoryClient, createMemoryClient } from '@tevm/memory-client'
import { createHttpHandler } from '@tevm/server'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { Server, createServer } from 'http'
import { type PublicClient, createPublicClient, http } from 'viem'

describe('tevmViemExtension', () => {
	let tevm: MemoryClient
	let server: Server
	let client: PublicClient

	beforeAll(async () => {
		tevm = await createMemoryClient({
			fork: { url: 'https://mainnet.optimism.io' },
		})
		server = createServer(createHttpHandler(tevm)).listen(6969)
		client = createPublicClient({
			transport: http('http://localhost:6969'),
		})
	})

	afterAll(() => {
		server.close()
	})

	it('tevmRequest should call client.request and parse the response', async () => {
		const decorated = tevmViemExtension()(client)
		const params = { address: `0x${'77'.repeat(20)}`, balance: 420n } as const
		const response = await decorated.tevm.setAccount(params)

		expect(response.errors).toBe(undefined as any)
		expect(
			(
				await tevm.vm.stateManager.getAccount(
					Address.fromString(params.address),
				)
			)?.balance,
		).toBe(420n)
	})

	it('runScript should call client.request with "tevm_script" and parse the response', async () => {
		const decorated = tevmViemExtension()(client)
		const params = {
			caller: `0x${'4'.repeat(40)}`,
			...ERC20.read.balanceOf(`0x${'4'.repeat(40)}`),
		} as const
		const response = await decorated.tevm.script(params)

		expect(response.executionGasUsed).toEqual(2447n)
		expect(response.rawData).toEqual(
			'0x0000000000000000000000000000000000000000000000000000000000000000',
		)
		expect(response.data).toBe(0n)
	})

	it('putAccount should call client.request with "tevm_putAccount" and parse the response', async () => {
		const decorated = tevmViemExtension()(client)
		const params = { balance: 420n, address: `0x${'88'.repeat(20)}` } as const
		const response = await decorated.tevm.setAccount(params)

		expect(response).not.toHaveProperty('errors')

		const account = await tevm.vm.stateManager.getAccount(
			Address.fromString(params.address),
		)

		expect(account?.balance).toBe(420n)
	})
})
