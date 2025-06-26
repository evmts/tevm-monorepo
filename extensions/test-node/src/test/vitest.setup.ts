import { transports } from '@tevm/test-utils'
import { afterAll, beforeAll } from 'vitest'
import { configureTestClient } from '../core/global.js'
import { chain, BLOCK_NUMBER } from './constants.js'

// Configure the test client once globally
const client = configureTestClient({
	tevm: {
		fork: {
			transport: transports.mainnet,
			blockTag: BigInt(BLOCK_NUMBER) + 1n
		},
		common: chain,
	},
})

beforeAll(async () => {
	await client.start()
})

afterAll(async () => {
	await client.destroy()
})
