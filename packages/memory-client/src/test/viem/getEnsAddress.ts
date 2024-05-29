import { SimpleContract, transports } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import type { Hex } from 'viem'
import { createMemoryClient } from '../../createMemoryClient.js'
import { loadKZG } from 'kzg-wasm'
import { mainnet } from '@tevm/common'

let mc: MemoryClient
let deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

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
	c = {
		simpleContract: SimpleContract.withAddress(deployResult.createdAddress),
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	deployTxHash = deployResult.txHash
	await mc.tevmMine()
})

describe('getEnsAddress', async () => {
	it.todo(
		'should work',
		async () => {
			const kzg = await loadKZG()
			const mainnetClient = createMemoryClient({
				common: Object.assign({ kzg }, mainnet),
				fork: {
					transport: transports.mainnet,
					blockTag: 19804639n,
				},
			})
			expect(await mainnetClient.getEnsAddress({ name: 'vitalik.eth' })).toBe(
				'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
			)
		},
		{ timeout: 40_000 },
	)
})
