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
				blockTag: 'latest',
			},
		})
		const vm = await client.getVm()
		const data = numberToBytes(42069420)
		// TODO: we can test with precise values when we cache rpc requests otherwise we need to update the block tag every day
		const result = await getL1FeeInformationOpStack(data, vm)
		expect(result.l1BaseFee).toBeGreaterThan(0n)
		expect(result.l1BlobFee).toBeGreaterThan(0n)
		expect(result.l1Fee).toBeGreaterThan(0n)
		expect(result.l1GasUsed).toBeGreaterThan(0n)
	})
})
