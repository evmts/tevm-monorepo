import { mainnet } from '@tevm/common'
import { SimpleContract, transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
	const deployResult = await mc.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	await mc.tevmMine()
})

describe('getEnsAddress', async () => {
	it.todo('should work', { timeout: 40_000 }, async () => {
		const kzg = await loadKZG()
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
				blockTag: 23449343n,
			},
		})
		expect(await mainnetClient.getEnsAddress({ name: 'vitalik.eth' })).toBe(
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		)
	})
})
