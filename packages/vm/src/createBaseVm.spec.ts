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
		const mockCallback = jest.fn((data, done) => done())
		baseVm.events.on('afterTx', mockCallback)
		const expectedData = { test: 'data' }
		await baseVm._emit('afterTx', expectedData)
		expect(mockCallback).toHaveBeenCalledWith(expectedData, expect.any(Function))
	})

	it('should call ready functions on stateManager and blockchain', async () => {
		const baseVm = createBaseVm(opts)
		expect(await baseVm.ready()).toBeTrue()
	})
})
