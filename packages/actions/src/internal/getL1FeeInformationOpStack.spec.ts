import { describe, expect, it } from 'bun:test'
import { getL1FeeInformationOpStack } from './getL1FeeInformationOpStack.js'
import { createBaseClient } from '@tevm/base-client'
import { numberToBytes } from 'viem'
import { transports } from '@tevm/test-utils'
import { optimism } from '@tevm/common'

describe(getL1FeeInformationOpStack.name, () => {
	it('should work', async () => {
		const client = createBaseClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 121138357n,
			},
		})
		const vm = await client.getVm()
		const data = numberToBytes(42069420)
		expect(await getL1FeeInformationOpStack(data, vm)).toEqual({
			l1BaseFee: 10396876243n,
			l1BlobFee: 1n,
			l1Fee: 18888046725n,
			l1GasUsed: 1328n,
		})
	})
})
