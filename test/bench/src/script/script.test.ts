import { test, describe, expect } from 'vitest'
import { SimpleContract } from '@tevm/test-utils'
import { createClient, http } from 'viem'
import { createMemoryClient } from 'tevm'
import { createServer } from 'tevm/server'
import { readContract } from 'viem/actions'

describe('Run a basic script', async () => {
	test('Run with viem', async () => {
		const PORT = 6969
		const server = await createServer(createMemoryClient())
		await new Promise<void>((resolve) => server.listen(PORT, () => resolve()))

		const client = expect(
			readContract(
				createClient({
					transport: http(`http://localhost:${PORT}`),
				}),
				SimpleContract.read.get(),
			),
		)
	})
})
