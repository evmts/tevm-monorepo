import { numberToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { optimismNode } from '../../vitest.setup.js'
import { getL1FeeInformationOpStack } from './getL1FeeInformationOpStack.js'

describe(getL1FeeInformationOpStack.name, () => {
	it('should work', async () => {
		const vm = await optimismNode.getVm()
		const data = numberToBytes(42069420)
		expect(await getL1FeeInformationOpStack(data, vm)).toEqual({
			l1BaseFee: 961849046n,
			l1BlobFee: 1n,
			l1Fee: 8044136042n,
			l1GasUsed: 1600n,
		})
	})
})
