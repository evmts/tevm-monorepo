import { type Server, createServer } from 'node:http'
import { optimism } from '@tevm/common'
import { type MemoryClient, createMemoryClient } from '@tevm/memory-client'
import { createHttpHandler } from '@tevm/server'
import { transports } from '@tevm/test-utils'
import { http, type PublicClient, createPublicClient } from 'viem'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { tevmViemExtension } from './tevmViemExtension.js'

describe('tevmViemExtension', () => {
	let tevm: MemoryClient
	let server: Server
	let client: PublicClient

	beforeAll(async () => {
		tevm = createMemoryClient({
			common: optimism,
			fork: { transport: transports.optimism },
		})
		server = createServer(createHttpHandler(tevm)).listen(6420)
		client = createPublicClient({
			transport: http('http://localhost:6420', { timeout: 15_000 }),
		})
		await tevm.tevmReady()
	})

	afterAll(() => {
		server.close()
	})

	it('tevmRequest should call client.request and parse the response', async () => {
		const decorated = tevmViemExtension()(client)
		const params = { address: `0x${'77'.repeat(20)}`, balance: 420n } as const
		const response = await decorated.tevm.setAccount(params)

		expect(response.errors).toBe(undefined as any)

		// Verify the balance using the API instead of direct VM access
		const balance = await client.getBalance({
			address: params.address,
		})
		expect(balance).toBe(420n)
	})

	it.todo('runScript should call client.request with "tevm_script" and parse the response')
	// This test is skipped due to issues with the network or contract deployment

	it('putAccount should call client.request with "tevm_putAccount" and parse the response', async () => {
		const decorated = tevmViemExtension()(client)
		const params = { balance: 420n, address: `0x${'88'.repeat(20)}` } as const
		const response = await decorated.tevm.setAccount(params)

		expect(response).not.toHaveProperty('errors')

		// Verify the balance using the API instead of direct VM access
		const balance = await client.getBalance({
			address: params.address,
		})
		expect(balance).toBe(420n)
	})
})
