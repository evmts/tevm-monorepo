import { SimpleContract } from '@tevm/test-utils'
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

describe('getLogs', () => {
	// this has a bug
	it.todo('should work', async () => {
		const filter = await mc.createEventFilter('eventAbi' as any)
		const logs = await mc.getLogs(filter)
		expect(logs).toHaveLength(0)
	})
})
