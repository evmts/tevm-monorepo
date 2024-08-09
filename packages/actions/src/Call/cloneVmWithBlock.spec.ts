import { ForkError, InternalError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { bytesToHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { cloneVmWithBlockTag } from './cloneVmWithBlock.js'

describe('cloneVmWithBfockTag', () => {
	it('should clone the VM and set the state root successfully', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vmClone = await cloneVmWithBlockTag(client, block)
		if (vmClone instanceof Error) {
			throw vmClone
		}
		expect(vmClone).toBeDefined()
		expect(await vmClone.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
	})

	it('should fork and cache the block if state root is not available', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vm = await client.getVm()
		const stateRoot = block.header.stateRoot

		// Manually remove the state root to simulate it being unavailable
		vm.stateManager._baseState.stateRoots.delete(bytesToHex(stateRoot))

		const vmClone = await cloneVmWithBlockTag(client, block)
		if (vmClone instanceof Error) {
			throw vmClone
		}
		expect(vmClone).toBeDefined()
		expect(await vmClone.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
	})

	it('should handle errors during forking', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		// block Infinity is invalid
		const invalidBlock = {
			...block,
			header: { ...block.header, number: Number.POSITIVE_INFINITY, stateRoot: '0x1234' },
		}

		const result = await cloneVmWithBlockTag(client, invalidBlock as any)
		if (!(result instanceof Error)) {
			throw new Error('Expected errors to be present')
		}
		expect(result).toBeDefined()
		expect(result).toBeInstanceOf(ForkError)
		expect(result.name).toBe('ForkError')
		expect(result).toMatchSnapshot()
	})

	it('should handle errors during VM cloning', async () => {
		const client = createTevmNode({})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vm = await client.getVm()
		vm.deepCopy = () => {
			throw new Error('deepCopy error')
		}

		const result = await cloneVmWithBlockTag(client, block)
		if (!(result instanceof Error)) {
			throw new Error('Expected errors to be present')
		}
		expect(result).toBeDefined()
		expect(result).toBeInstanceOf(InternalError)
		expect(result.name).toBe('InternalError')
		expect(result).toMatchSnapshot()
	})

	it('should properly handle a fork client requestiong a block prefork', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
		})
		const vm = await client.getVm()
		const forkBlock = await vm.blockchain.getCanonicalHeadBlock()
		const forkParentBlock = await vm.blockchain.getBlock(forkBlock.header.number - 100n)
		expect(forkParentBlock.header.number).toBe(forkBlock.header.number - 100n)
		expect(forkBlock.header.number).toBeGreaterThan(forkParentBlock.header.number)
		console.log('numbers', forkBlock.header.number, forkParentBlock.header.number)
		const vmClone = await cloneVmWithBlockTag(client, forkParentBlock)
		if (vmClone instanceof Error) {
			throw vmClone
		}
		expect(vmClone).toBeDefined()
		expect(await vmClone.stateManager.getStateRoot()).toBeDefined()
		// we expect the returned vm to look like it actually forked the requested block
		expect(vmClone.stateManager._baseState.options.fork).toEqual({
			transport: client.forkTransport as any,
			blockTag: forkParentBlock.header.number,
		})
		expect(vmClone.blockchain.blocksByTag.get('forked')?.header.hash()).toEqual(forkParentBlock.header.hash())
	})
})
