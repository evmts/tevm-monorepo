import type { Server } from 'node:http'
import { SimpleContract } from '@tevm/test-utils'
import { createMemoryClient } from 'tevm'
import { createServer } from 'tevm/server'
import { createPublicClient, http } from 'viem'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

const PORT = 6969

let server: Server

beforeEach(async () => {
	server = createServer(createMemoryClient())
	await new Promise((resolve) => {
		server.listen(PORT, () => resolve(server))
	})
})

afterEach(() => {
	server.close()
})

describe('Run a deployless contract call with viem and tevm', async () => {
	test('Run with viem over http', async () => {
		const client = createPublicClient({
			// this works with all nodes not just tevm
			transport: http(`http://localhost:${PORT}`),
		})

		const result = await client.readContract(SimpleContract.script({ constructorArgs: [420n] }).read.get())

		expect(result).toBe(420n)
	})

	test('Run in memory with tevm MemoryClient', async () => {
		const client = createMemoryClient()

		const result = await client.readContract(SimpleContract.script({ constructorArgs: [69n] }).read.get())

		expect(result).toBe(69n)
	})

	test('Use tevmContract for more advanced features', async () => {
		const client = createMemoryClient({ loggingLevel: 'debug' })

		const result = await client.tevmContract(SimpleContract.script({ constructorArgs: [9n] }).read.get())

		expect(result).toEqual({
			amountSpent: 164472n,
			createdAddresses: new Set(),
			data: 9n,
			executionGasUsed: 2432n,
			gas: 29976504n,
			logs: [],
			rawData: '0x0000000000000000000000000000000000000000000000000000000000000009',
			selfdestruct: new Set(),
			totalGasSpent: 23496n,
		})
	})
})
