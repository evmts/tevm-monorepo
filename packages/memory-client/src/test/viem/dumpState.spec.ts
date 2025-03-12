import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { type Hex } from '@tevm/utils'
import { createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import { createTevmTransport } from '../../createTevmTransport.js'
import { tevmDumpState } from '../../tevmDumpState.js'

let mc: MemoryClient
let deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	mc = createMemoryClient()
	await mc.tevmReady()
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

describe('dumpState', () => {
	it('should dump the current state', async () => {
		// Use the standard client approach to match the existing implementation
		const client = createClient({
			transport: createTevmTransport({}),
			chain: optimism,
		})
		
		const stateDump = await tevmDumpState(client)
		
		// Basic structure checks
		expect(stateDump).toBeDefined()
		expect(stateDump.stateRoot).toBeDefined()
		expect(typeof stateDump.stateRoot).toBe('string')
		expect(stateDump.stateRoot.startsWith('0x')).toBe(true)
	})
	
	it('should work with a memory client', async () => {
		// Use the memory client
		const stateDump = await mc.tevmDumpState()
		
		// Basic structure checks
		expect(stateDump).toBeDefined()
		expect(stateDump.stateRoot).toBeDefined()
		expect(typeof stateDump.stateRoot).toBe('string')
		expect(stateDump.stateRoot.startsWith('0x')).toBe(true)
	})
	
	it('should contain blockchain state information', async () => {
		const stateDump = await mc.tevmDumpState()
		
		// Check blockchain state properties
		expect(stateDump.blockNumber).toBeDefined()
		expect(typeof stateDump.blockNumber).toBe('bigint')
	})
})
