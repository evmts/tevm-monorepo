import { Server, createServer } from 'http'
import { Address } from '@ethereumjs/util'
import { createHttpHandler } from '@tevm/server'
import type { Tevm } from '@tevm/vm'
import { createTevm } from '@tevm/vm'
import { http, type PublicClient, createPublicClient } from 'viem'
import { ERC20 } from './tests/ERC20.sol.js'
import { tevmViemExtension } from './tevmViemExtension.js'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'

describe('tevmViemExtension', () => {
	let tevm: Tevm
	let server: Server
	let client: PublicClient

	beforeAll(async () => {
		tevm = await createTevm({ fork: { url: 'https://mainnet.optimism.io' } })
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
				await tevm._evm.stateManager.getAccount(
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

		const account = await tevm._evm.stateManager.getAccount(
			Address.fromString(params.address),
		)

		expect(account?.balance).toBe(420n)
	})
})
