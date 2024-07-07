import { describe, expect, it, beforeEach, jest } from 'bun:test'
import { AsyncEventEmitter } from '@tevm/utils'
import { createBaseVm } from './createBaseVm.js'
import { createStateManager } from '@tevm/state'
import { createEvm } from '@tevm/evm'
import { createChain } from '@tevm/blockchain'
import { mainnet } from '@tevm/common'

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
		expect(baseVm.events).toBeInstanceOf(AsyncEventEmitter)
	})

	it('should emit events correctly', async () => {
		const baseVm = createBaseVm(opts)
		const mockCallback = jest.fn()
		baseVm.events.on('afterTx', mockCallback)
		await baseVm._emit('afterTx', { test: 'data' })
		expect(mockCallback).toHaveBeenCalledWith({ test: 'data' }, expect.any(Function))
	})

	it('should call ready functions on stateManager and blockchain', async () => {
		const baseVm = createBaseVm(opts)
		expect(await baseVm.ready()).toBeTrue()
	})
})
