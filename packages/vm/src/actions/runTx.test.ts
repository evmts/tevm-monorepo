import { describe, expect, it } from 'bun:test'
import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { mainnet } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { createImpersonatedTx } from '@tevm/tx'
import { PREFUNDED_ACCOUNTS, createAddressFromString } from '@tevm/utils'
import { createVm } from '../createVm.js'
import { runTx } from './runTx.js'

describe('runTx basic test', () => {
	it('should not hang on ready()', async () => {
		const common = mainnet
		const stateManager = createStateManager({})
		const blockchain = await createChain({ common })
		const evm = await createEvm({ common, stateManager, blockchain })
		const vm = createVm({
			common,
			evm,
			stateManager,
			blockchain,
			activatePrecompiles: false,
		})

		// Test ready
		const isReady = await vm.ready()
		expect(isReady).toBeTrue()
		
		// Simple transaction
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		
		const block = new Block({ common: mainnet })
		
		console.log('About to run tx...')
		const result = await runTx(vm)({
			tx,
			block,
			skipNonce: true,
			skipBalance: true,
		})
		console.log('Transaction completed')
		
		expect(result).toBeDefined()
		expect(result.execResult.exceptionError).toBeUndefined()
	})
})