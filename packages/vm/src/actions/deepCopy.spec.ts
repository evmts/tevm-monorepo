import { createChain } from '@tevm/blockchain'
import { type Common, mainnet } from '@tevm/common'
import { createCommon } from '@tevm/common'
import { MisconfiguredClientError } from '@tevm/errors'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { beforeEach, describe, expect, it } from 'vitest'
import type { BaseVm } from '../BaseVm.js'
import { createBaseVm } from '../createBaseVm.js'
import { deepCopy } from './deepCopy.js'

describe('deepCopy', () => {
	let baseVm: BaseVm
	let common: Common

	beforeEach(async () => {
		common = createCommon({ ...mainnet, hardfork: 'cancun', loggingLevel: 'warn' })
		const stateManager = createStateManager({})
		const blockchain = await createChain({ common })
		const evm = await createEvm({ common, stateManager, blockchain })
		baseVm = createBaseVm({
			common,
			stateManager,
			blockchain,
			evm,
			activatePrecompiles: false,
		})
	})

	it('should create a deep copy of the VM', async () => {
		const deepCopyVm = await deepCopy(baseVm)()
		expect(deepCopyVm).toBeDefined()
		expect(deepCopyVm.common.ethjsCommon.hardfork()).toBe(baseVm.common.ethjsCommon.hardfork())
		expect(deepCopyVm.blockchain).toBeDefined()
		expect(deepCopyVm.stateManager).toBeDefined()
		expect(deepCopyVm.evm).toBeDefined()
	})

	it('should throw MisconfiguredClientError if stateManager does not support deepCopy', async () => {
		delete (baseVm as any).stateManager.deepCopy
		const err = await deepCopy(baseVm)().catch((err) => err)
		expect(err).toBeInstanceOf(Error)
		expect(err).toBeInstanceOf(MisconfiguredClientError)
		expect(err.message).toContain('StateManager does not support deepCopy')
	})

	it.todo('should retain custom EVM configurations')
})
