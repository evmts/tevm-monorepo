import { describe, expect, it } from 'bun:test'
import { createBlockchain } from '@tevm/blockchain'
import { Common } from '@tevm/common'
import { createStateManager } from '@tevm/state'
import { EthjsAddress } from '@tevm/utils'
import { createEvm } from './createEvm.js'

describe(createEvm.name, () => {
	it('wraps ethereumjs EVM', async () => {
		const common = new Common({ chain: 1 })
		const vm = await createEvm({
			common,
			blockchain: await createBlockchain({
				common,
			}),
			stateManager: createStateManager({}),
		})
		const res = await vm.runCall({
			skipBalance: true,
			value: 2n,
			origin: EthjsAddress.fromString(`0x${'01'.repeat(20)}`),
			caller: EthjsAddress.fromString(`0x${'01'.repeat(20)}`),
			to: EthjsAddress.fromString(`0x${'02'.repeat(20)}`),
		})
		expect(res.execResult.exceptionError).toBeUndefined()
		expect(res.execResult.returnValue).toEqual(Uint8Array.from([]))
	})
})
