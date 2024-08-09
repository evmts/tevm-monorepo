import { optimism } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { numberToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { getL1FeeInformationOpStack } from './getL1FeeInformationOpStack.js'

describe(getL1FeeInformationOpStack.name, () => {
	it('should work', async () => {
		const client = createTevmNode({
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
