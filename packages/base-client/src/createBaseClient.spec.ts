import { describe, expect, it } from 'bun:test'
import { createBaseClient } from './createBaseClient.js'

describe('createBaseClient', () => {
	it('Creates a base client', async () => {
		const { mode, getVm, ready, extend, logger, forkTransport, getTxPool, miningConfig, getReceiptsManager } =
			createBaseClient()
		expect(mode).toBe('normal')
		expect(await ready()).toBe(true)
		expect(await getVm().then((vm) => vm.evm.runCall({}))).toMatchSnapshot()
		expect(extend).toBeFunction()
		expect(logger.warn).toBeFunction()
		expect(forkTransport).toBeUndefined()
		expect(await getTxPool().then((pool) => pool.pool)).toEqual(new Map())
		expect(miningConfig).toEqual({ type: 'auto' })
		expect(await getReceiptsManager().then((manager) => manager.getReceipts)).toBeFunction()
	})

	it('Can be extended', async () => {
		const client = createBaseClient().extend(() => ({
			hello: 'world',
		}))
		expect(client.hello).toBe('world')
	})
})
