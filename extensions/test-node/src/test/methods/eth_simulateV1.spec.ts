import { type EIP1193RequestFn, type EIP1474Methods } from 'viem'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodCached, assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_simulateV1', () => {
	it('should create a cache entry with a static block parameter', async () => {
		await (client.tevm.transport.tevm.forkTransport?.request as EIP1193RequestFn<EIP1474Methods>)({
			method: 'eth_simulateV1',
			// borrowed from https://www.quicknode.com/docs/ethereum/eth_simulateV1
			params: [
				{
					blockStateCalls: [
						{
							blockOverrides: { baseFeePerGas: '0x9' },
							stateOverrides: { '0xc000000000000000000000000000000000000000': { balance: '0x4a817c420' } },
							calls: [
								{
									from: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
									to: '0x014d023e954bAae7F21E56ed8a5d81b12902684D',
									maxFeePerGas: '0xf',
									value: '0x1',
								},
							],
						},
					],
					validation: true,
					traceTransfers: true,
				},
				BLOCK_NUMBER,
			],
		})

		assertMethodCached('eth_simulateV1', (params) => params[1] === BLOCK_NUMBER)
	})

	it('should NOT create a cache entry with dynamic block parameter tag', async () => {
		await (client.tevm.transport.tevm.forkTransport?.request as EIP1193RequestFn<EIP1474Methods>)({
			method: 'eth_simulateV1',
			params: [
				{
					blockStateCalls: [
						{
							blockOverrides: { baseFeePerGas: '0x9' },
							stateOverrides: { '0xc000000000000000000000000000000000000000': { balance: '0x4a817c420' } },
							calls: [
								{
									from: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
									to: '0x014d023e954bAae7F21E56ed8a5d81b12902684D',
									maxFeePerGas: '0xf',
									value: '0x1',
								},
							],
						},
					],
					validation: true,
					traceTransfers: true,
				},
				'latest',
			],
		})

		assertMethodNotCached('eth_simulateV1', (params) => params[1] === 'latest')
	})
})
