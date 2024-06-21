import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { transports } from '@tevm/test-utils'
import { InternalError } from '@tevm/errors'
import { cloneVmWithBlockTag } from './cloneVmWithBlock.js'
import { bytesToHex } from 'viem'

describe('cloneVmWithBlockTag', () => {
	it('should clone the VM and set the state root successfully', async () => {
		const client = createBaseClient({
			fork: { transport: transports.optimism },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vmClone = await cloneVmWithBlockTag(client, block)
		if ('errors' in vmClone) {
			throw vmClone.errors
		}
		expect(vmClone).toBeDefined()
		expect(await vmClone.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
	})

	it('should fork and cache the block if state root is not available', async () => {
		const client = createBaseClient({
			fork: { transport: transports.optimism },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vm = await client.getVm()
		const stateRoot = block.header.stateRoot

		// Manually remove the state root to simulate it being unavailable
		vm.stateManager._baseState.stateRoots.delete(bytesToHex(stateRoot))

		const vmClone = await cloneVmWithBlockTag(client, block)
		if ('errors' in vmClone) {
			throw vmClone.errors
		}
		expect(vmClone).toBeDefined()
		expect(await vmClone.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
	})

	it('should handle errors during VM cloning', async () => {
		const client = createBaseClient({
			fork: { transport: transports.optimism },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		// Simulate an error during deep copy by providing an invalid block
		const invalidBlock = { ...block, header: { ...block.header, stateRoot: '0x1234' } }

		const result = await cloneVmWithBlockTag(client, invalidBlock as any)
		if (!('errors' in result)) {
			throw result
		}
		expect(result.errors).toBeDefined()
		expect(result.errors[0]).toBeInstanceOf(InternalError)
		expect(result.errors[0]?.name).toBe('InternalError')
		expect(result.errors[0]?.message).toMatchSnapshot()
	})
})
