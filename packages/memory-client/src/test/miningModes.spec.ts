import type { CallJsonRpcResponse } from '@tevm/actions'
import { EthjsAddress, hexToBytes } from '@tevm/utils'
import { toHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'

describe('Mining modes', () => {
	it('should mine tx right away', async () => {
		const tevm = createMemoryClient({
			miningConfig: {
				type: 'auto',
			},
		})
		const balance = 0x11111111n
		const address1 = '0x1f420000000000000000000000000000000000ff' as const
		const address2 = '0x2f420000000000000000000000000000000000ff' as const
		await tevm.tevmSetAccount({
			address: address1,
			balance,
		})
		const transferAmount = 0x420n
		const res = (await tevm.transport.tevm.request({
			jsonrpc: '2.0',
			method: 'tevm_call',
			params: [
				{
					caller: address1,
					data: '0x0',
					to: address2,
					value: toHex(transferAmount),
					origin: address1,
					createTransaction: true,
				},
			],
			id: 1,
		})) as CallJsonRpcResponse['result']
		expect(res?.rawData).toEqual('0x')

		// should be no tx in mempool
		const txPool = await tevm.transport.tevm.getTxPool()
		expect((await txPool.getBySenderAddress(new EthjsAddress(hexToBytes(address1)))).length).toBe(0)

		// should have mined the tx
		expect(await tevm.getBlockNumber()).toBe(1n)

		// should have updated states
		expect(
			(await (await tevm.transport.tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address2))))
				?.balance,
		).toBe(transferAmount)
		expect(
			(await (await tevm.transport.tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address1))))
				?.balance,
		).toBe(286183069n)
	})
})
