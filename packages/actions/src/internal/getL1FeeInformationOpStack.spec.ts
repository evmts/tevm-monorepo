import { optimism } from '@tevm/common'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { numberToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { getL1FeeInformationOpStack } from './getL1FeeInformationOpStack.js'

describe.skipIf(!process.env.TEVM_RUN_LIVE_FORK_TESTS)(getL1FeeInformationOpStack.name, () => {
	it('should work', async () => {
		const node = createTevmNode({ common: optimism, fork: { transport: transports.optimism } }) as unknown as TevmNode
		const vm = await node.getVm()
		const data = numberToBytes(42069420)
		const feeInfo = await getL1FeeInformationOpStack(data, vm)
		expect(feeInfo.l1GasUsed).toBe(1600n)
		expect(feeInfo.l1BaseFee).toBeGreaterThan(0n)
		expect(feeInfo.l1BlobFee).toBeGreaterThan(0n)
		expect(feeInfo.l1Fee).toBeGreaterThan(0n)
	})
})
