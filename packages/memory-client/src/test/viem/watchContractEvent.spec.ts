import { SimpleContract } from '@tevm/test-utils'
import type { Log } from '@tevm/utils'
import { beforeEach, describe, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>
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
	await mc.tevmMine()
})

describe('watchContractEvent', () => {
	it('watchContract should work', async () => {
		const logs: Log[] = []
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
