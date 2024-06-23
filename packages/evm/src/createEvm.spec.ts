import { describe, expect, it } from 'bun:test'
import { createChain } from '@tevm/blockchain'
import { mainnet } from '@tevm/common'
import { createStateManager } from '@tevm/state'
import { EthjsAddress } from '@tevm/utils'
import { createEvm } from './createEvm.js'

describe(createEvm.name, () => {
	it('wraps ethereumjs EVM', async () => {
		const evm = await createEvm({
			common: mainnet,
			blockchain: await createChain({
				common: mainnet,
			}),
			stateManager: createStateManager({}),
		})
		const res = await evm.runCall({
			skipBalance: true,
			value: 2n,
			origin: EthjsAddress.fromString(`0x${'01'.repeat(20)}`),
			caller: EthjsAddress.fromString(`0x${'01'.repeat(20)}`),
			to: EthjsAddress.fromString(`0x${'02'.repeat(20)}`),
		})
		expect(res.execResult.exceptionError).toBeUndefined()
		expect(res.execResult.returnValue).toEqual(Uint8Array.from([]))
	})

	it('handles trace loggingg level', async () => {
		const evm = await createEvm({
			loggingLevel: 'trace',
			common: mainnet,
			blockchain: await createChain({
				common: mainnet,
			}),
			stateManager: createStateManager({}),
		})
		expect((evm as any).DEBUG).toBe(true)
	})
})
