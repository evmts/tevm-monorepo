import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/test-utils'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

const eventAbi = {
	event: {
		inputs: [
			{
				indexed: true,
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				name: 'to',
				type: 'address',
			},
			{
				indexed: true,
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
} as const

let mc: MemoryClient

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

describe('createEventFilter', () => {
	it.todo('works with no args', async () => {
		const filter = await mc.createEventFilter()
		expect(filter.id).toBeDefined()
		expect(filter.type).toBe('event')
		expect(filter.args).toBeUndefined()
		expect(filter.abi).toBeUndefined()
		expect(filter.eventName).toBeUndefined()
	})

	it.todo('works with args: address', async () => {
		await mc.createEventFilter({
			address: `0x${'69'.repeat(20)}`,
		})
	})

	it.todo('works with args: event', async () => {
		const filter = await mc.createEventFilter(eventAbi)
		expect(filter.args).toBeUndefined()
		// @ts-expect-errory TODO this is a viem test copy pasted why is type not working?
		expect(filter.abi).toEqual([eventAbi])
		expect(filter.eventName).toEqual('Transfer')
	})
})
