import { describe, it, expect } from 'bun:test'
import { ethGetLogsHandler } from './ethGetLogsHandler.js'
import { createBaseClient } from '@tevm/base-client'
import { keccak256, stringToHex } from '@tevm/utils'

describe(ethGetLogsHandler.name, () => {
it('should work', async () => {
const client = createBaseClient({
fork: {
url: 'https://mainnet.optimism.io',
blockTag: 1_000_000n
}
})

expect(await ethGetLogsHandler(client)({
filterParams: {
fromBlock: 1_000_000n - 2n,
toBlock: 1_000_000n,
address: '0x25E1c58040f27ECF20BBd4ca83a09290326896B3',
topics: [keccak256(stringToHex('SubmissionReceived(int256,uint32,address)'))]
}
})).toMatchSnapshot()
})
})
