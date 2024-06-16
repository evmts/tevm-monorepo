import type { Server } from 'node:http'
import { SimpleContract } from '@tevm/test-utils'
import { createMemoryClient } from 'tevm'
import { createServer } from 'tevm/server'
import { http, createPublicClient } from 'viem'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

const PORT = 6969

let server: Server

beforeEach(async () => {
	server = await createServer(createMemoryClient())
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

		expect(await client.getBlockNumber()).toBe(0n)
		const result = await client.readContract(SimpleContract.read.get())

		expect(result).toBe(0n)
	})

	test('Run in memory with tevm MemoryClient', async () => {
		const client = createMemoryClient()

		const result = await client.readContract(SimpleContract.read.get())

		expect(result).toBe(0n)
	})

	test('Use tevmContract for more advanced features', async () => {
		const client = createMemoryClient({ loggingLevel: 'debug' })

		const result = await client.tevmContract(SimpleContract.read.get())

		expect(result).toMatchInlineSnapshot()
	})
})
