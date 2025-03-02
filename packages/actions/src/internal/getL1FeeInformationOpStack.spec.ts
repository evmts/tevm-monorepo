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
				blockTag: 132675810n, // Updated to latest block as of Mar 2, 2025
			},
		})
		const vm = await client.getVm()
		const data = numberToBytes(42069420)
		expect(await getL1FeeInformationOpStack(data, vm)).toEqual({
			l1BaseFee: 1997813623n,
			l1BlobFee: 95454059n,
			l1Fee: 26389189645n,
			l1GasUsed: 1600n,
		})
	})
})
