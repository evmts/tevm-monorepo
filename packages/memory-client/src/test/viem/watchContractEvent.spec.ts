import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import type { Hex, WatchContractEventOnLogsParameter } from 'viem'
import { createMemoryClient } from '../../createMemoryClient.js'

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

describe('watchContractEvent', () => {
	it('watchContract should work', async () => {
		const logs: WatchContractEventOnLogsParameter<typeof c.simpleContract.abi> = []
		const unwatch = mc.watchContractEvent({
			abi: c.simpleContract.abi,
			address: c.simpleContract.address,
			poll: true,
			onLogs: (/**log*/) => {
				// todo need to add events to simpleContract
				logs.push()
			},
		})
		unwatch()
	})
})
