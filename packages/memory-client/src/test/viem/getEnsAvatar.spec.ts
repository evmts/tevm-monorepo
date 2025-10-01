import { mainnet } from '@tevm/common'
import { SimpleContract, transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc = createMemoryClient()

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

describe('getEnsAvatar', async () => {
	it.todo('should work', { timeout: 40_000 }, async () => {
		const kzg = await loadKZG()
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
				blockTag: 23483670n,
			},
		})
		expect(
			await mainnetClient.getEnsAvatar({
				name: 'wevm.eth',
			}),
		).toBe('https://euc.li/wevm.eth')
	})
})
