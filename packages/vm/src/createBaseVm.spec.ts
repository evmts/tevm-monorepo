import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { createChain } from '@tevm/blockchain'
import { mainnet } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { EventEmitter } from 'eventemitter3'
import { createBaseVm } from './createBaseVm.js'

describe('createBaseVm', () => {
	let opts: any

	beforeEach(async () => {
		const common = mainnet
		const stateManager = createStateManager({})
		const blockchain = await createChain({ common })
		const evm = await createEvm({ common, stateManager, blockchain })
		opts = {
			stateManager,
			evm,
			blockchain,
			common,
		}
	})

	it('should create a BaseVm instance', () => {
		const baseVm = createBaseVm(opts)
		expect(baseVm).toBeDefined()
		expect(baseVm.stateManager).toBe(opts.stateManager)
		expect(baseVm.evm).toBe(opts.evm)
		expect(baseVm.blockchain).toBe(opts.blockchain)
		expect(baseVm.common).toBe(opts.common)
		expect(baseVm.events).toBeInstanceOf(EventEmitter)
	})

	it('should emit events correctly', async () => {
		const baseVm = createBaseVm(opts)
		const mockCallback = jest.fn((_, done) => done())
		baseVm.events.on('afterTx', mockCallback)
		const expectedData = { test: 'data' }
		await baseVm._emit('afterTx', expectedData)
		expect(mockCallback).toHaveBeenCalledWith(expectedData, expect.any(Function))
	})

	it('should resolve even when a synchronous listener ignores the resolve callback', async () => {
		// Regression: a normal listener registered via the documented public API
		// (vm.events.on('afterTx', (event) => {...})) does not call the optional
		// resolve callback. Previously this caused _emit to never resolve and hung
		// runTx/runBlock forever.
		const baseVm = createBaseVm(opts)
		const received: Array<unknown> = []
		baseVm.events.on('afterTx', (event) => {
			received.push(event)
		})
		const expectedData = { test: 'data' }
		// If _emit hangs, this await never resolves and the test times out.
		await baseVm._emit('afterTx', expectedData)
		expect(received).toEqual([expectedData])
	})

	it('should resolve when there are no listeners', async () => {
		const baseVm = createBaseVm(opts)
		await baseVm._emit('afterTx', { test: 'data' })
	})

	it('should propagate errors thrown by a synchronous listener', async () => {
		const baseVm = createBaseVm(opts)
		const boom = new Error('listener boom')
		baseVm.events.on('afterTx', () => {
			throw boom
		})
		await expect(baseVm._emit('afterTx', { test: 'data' })).rejects.toThrow('listener boom')
	})

	it('should call ready functions on stateManager and blockchain', async () => {
		const baseVm = createBaseVm(opts)
		expect(await baseVm.ready()).toBeTrue()
	})
})
