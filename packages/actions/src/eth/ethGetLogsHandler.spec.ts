import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { keccak256, stringToHex } from '@tevm/utils'
import { ethGetLogsHandler } from './ethGetLogsHandler.js'

describe(ethGetLogsHandler.name, () => {
	it('should work', async () => {
		const client = createBaseClient({
			fork: {
				url: 'https://mainnet.optimism.io',
				blockTag: 1_000_000n,
			},
		})

		const vm = await client.getVm()
		const head = await vm.blockchain.getCanonicalHeadBlock()
		console.log(head.transactions)

		expect(
			await ethGetLogsHandler(client)({
				filterParams: {
					fromBlock: 1_000_000n - 2n,
					toBlock: 1_000_000n,
					address: '0x25E1c58040f27ECF20BBd4ca83a09290326896B3',
					topics: [keccak256(stringToHex('SubmissionReceived(int256,uint32,address)'))],
				},
			}),
		).toMatchSnapshot()
	})
})
