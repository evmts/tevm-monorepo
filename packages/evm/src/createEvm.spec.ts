import { createChain } from '@tevm/blockchain'
import { mainnet } from '@tevm/common'
import { InvalidParamsError, MisconfiguredClientError } from '@tevm/errors'
import { createStateManager } from '@tevm/state'
import { EthjsAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
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

	describe('addCustomPrecompile', () => {
		it('Should add a custom precompile', async () => {
			const evm = await createEvm({
				common: mainnet,
				blockchain: await createChain({ common: mainnet }),
				stateManager: createStateManager({}),
			})
			const address = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)
			const precompileFunction = () => {
				return {
					executionGasUsed: 1n,
					returnValue: new Uint8Array(0),
				}
			}
			evm.addCustomPrecompile({
				address,
				function: precompileFunction,
			})
			expect(evm.getPrecompile(address)).toEqual(precompileFunction)
		})
		it('should throw if _customPrecompiles is undefined', async () => {
			const evm = await createEvm({
				common: mainnet,
				blockchain: await createChain({ common: mainnet }),
				stateManager: createStateManager({}),
			})
			const mutablaleEvm = evm as any
			mutablaleEvm._customPrecompiles = undefined
			try {
				evm.addCustomPrecompile({
					address: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
					function: () => {
						return {
							executionGasUsed: 1n,
							returnValue: new Uint8Array(0),
						}
					},
				})
			} catch (e) {
				expect(e).toBeInstanceOf(MisconfiguredClientError)
				return
			}
			throw new Error('should have thrown')
		})
	})
	describe('removeCustomPrecompile', () => {
		it('Should remove a custom precompile', async () => {
			const evm = await createEvm({
				common: mainnet,
				blockchain: await createChain({ common: mainnet }),
				stateManager: createStateManager({}),
			})
			const address = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)
			const precompileFunction = () => {
				return {
					executionGasUsed: 1n,
					returnValue: new Uint8Array(0),
				}
			}
			const precompile = {
				address,
				function: precompileFunction,
			}
			evm.addCustomPrecompile(precompile)
			evm.removeCustomPrecompile(precompile)
			expect(evm.getPrecompile(address)).toBeUndefined()
		})
	})
	it('should throw if _customPrecompiles is undefined', async () => {
		const evm = await createEvm({
			common: mainnet,
			blockchain: await createChain({ common: mainnet }),
			stateManager: createStateManager({}),
		})
		const mutableEvm = evm as any
		mutableEvm._customPrecompiles = undefined
		try {
			evm.removeCustomPrecompile({
				address: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
				function: () => {
					return {
						executionGasUsed: 1n,
						returnValue: new Uint8Array(0),
					}
				},
			})
		} catch (e) {
			expect(e).toBeInstanceOf(MisconfiguredClientError)
			return
		}
		throw new Error('should have thrown')
	})
	it('should throw if precompile does not exist', async () => {
		const evm = await createEvm({
			common: mainnet,
			blockchain: await createChain({ common: mainnet }),
			stateManager: createStateManager({}),
		})
		try {
			evm.removeCustomPrecompile({
				address: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
				function: () => {
					return {
						executionGasUsed: 1n,
						returnValue: new Uint8Array(0),
					}
				},
			})
		} catch (e) {
			expect(e).toBeInstanceOf(InvalidParamsError)
			return
		}
		throw new Error('should have thrown')
	})
})
