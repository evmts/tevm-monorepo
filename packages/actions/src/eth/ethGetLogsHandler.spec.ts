import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { getAlchemyUrl } from '@tevm/test-utils'
import { keccak256, stringToHex } from '@tevm/utils'
import { ethGetLogsHandler } from './ethGetLogsHandler.js'

describe(ethGetLogsHandler.name, () => {
	it(
		'should work fetching from fork url',
		async () => {
			const client = createBaseClient({
				// these logs slow down the client and reduce chances of us getting throttled for these very very old blocks
				loggingLevel: 'debug',
				fork: {
					url: getAlchemyUrl(),
					blockTag: 1_000_000n,
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
		{ timeout: 30_000 },
	)

	it.todo('should work fetching logs that were created by tevm after forking')
})
