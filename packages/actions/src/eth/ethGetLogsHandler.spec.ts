import { createTevmNode } from '@tevm/node'
import { keccak256, stringToHex } from '@tevm/utils'
import { http } from 'viem'
import { describe, expect, it } from 'vitest'
import { ethGetLogsHandler } from './ethGetLogsHandler.js'

describe(ethGetLogsHandler.name, () => {
	// we are skipping because alchemy slowness makes this too flaky on ci
	// remove skip to run locally
	// we should update the test to not rely on alchemy archive nodes
	it.skip(
		'should work fetching from fork url',
		async () => {
			const client = createTevmNode({
				fork: {
					transport: http('https://mainnet.optimism.io')({}),
				},
			})

			expect(
				await ethGetLogsHandler(client)({
					filterParams: {
						fromBlock: 1_000_000n - 2n,
						toBlock: 1_000_000n,
						// this log is on the fork block. We must include fork block because we don't fetch receipts/logs from it
						address: '0x25E1c58040f27ECF20BBd4ca83a09290326896B3',
						topics: [keccak256(stringToHex('SubmissionReceived(int256,uint32,address)'))],
					},
				}),
			).toMatchSnapshot()
		},
		// big timeout because these blocks are very old
		{ timeout: 60_000 },
	)

	it.todo('should work fetching logs that were created by tevm after forking')
})
