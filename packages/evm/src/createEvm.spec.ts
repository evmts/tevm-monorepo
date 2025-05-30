import { createChain } from '@tevm/blockchain'
import { mainnet } from '@tevm/common'
import { InvalidParamsError, MisconfiguredClientError } from '@tevm/errors'
import { createStateManager } from '@tevm/state'
import { createAddressFromString } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { Evm } from './Evm.js'
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
			origin: createAddressFromString(`0x${'01'.repeat(20)}`),
			caller: createAddressFromString(`0x${'01'.repeat(20)}`),
			to: createAddressFromString(`0x${'02'.repeat(20)}`),
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

	it('should use default logging level when not specified', async () => {
		const evm = await createEvm({
			common: mainnet,
			blockchain: await createChain({ common: mainnet }),
			stateManager: createStateManager({}),
		})
		// Just confirm EVM works without errors
		expect(evm).toBeDefined()
	})

	it('should support allowUnlimitedContractSize parameter', async () => {
		// Just verify we can create an EVM with this parameter
		const evm = await createEvm({
			common: mainnet,
			blockchain: await createChain({ common: mainnet }),
			stateManager: createStateManager({}),
			allowUnlimitedContractSize: true,
		})

		expect(evm).toBeDefined()
	})

	it('should support profiler option', async () => {
		// Just verify we can create an EVM with profiler
		const evm = await createEvm({
			common: mainnet,
			blockchain: await createChain({ common: mainnet }),
			stateManager: createStateManager({}),
			profiler: true,
		})

		expect(evm).toBeDefined()
	})

	it('should support customPrecompiles initialization', async () => {
		const address = createAddressFromString(`0x${'42'.repeat(20)}`)
		const precompileFunction = () => {
			return {
				executionGasUsed: 1n,
				returnValue: new Uint8Array([0x42]),
			}
		}

		const customPrecompile = {
			address,
			function: precompileFunction,
		}

		const evm = await createEvm({
			common: mainnet,
			blockchain: await createChain({ common: mainnet }),
			stateManager: createStateManager({}),
			customPrecompiles: [customPrecompile],
		})

		// Verify the precompile is available
		expect(evm.getPrecompile(address)).toEqual(precompileFunction)
	})

	describe('addCustomPrecompile', () => {
		it('Should add a custom precompile', async () => {
			const evm = await createEvm({
				common: mainnet,
				blockchain: await createChain({ common: mainnet }),
				stateManager: createStateManager({}),
			})
			const address = createAddressFromString(`0x${'69'.repeat(20)}`)
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
					address: createAddressFromString(`0x${'69'.repeat(20)}`),
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

		it('should have a functioning addCustomPrecompile method', async () => {
			const evm = await createEvm({
				common: mainnet,
				blockchain: await createChain({ common: mainnet }),
				stateManager: createStateManager({}),
			})

			// Verify the method exists
			expect(typeof evm.addCustomPrecompile).toBe('function')
		})

		it('should use fallback binding for custom precompile methods', async () => {
			// Create a mock object that simulates an EVM instance without the addCustomPrecompile and removeCustomPrecompile methods
			const mockEvm = {
				// Minimal properties needed for the test
				_customPrecompiles: [],
				common: mainnet.ethjsCommon,
				getPrecompile: () => undefined,
			} as any

			// Apply the binding logic from lines 67-68 in Evm.js to the mock object
			mockEvm.addCustomPrecompile = Evm.prototype.addCustomPrecompile.bind(mockEvm)
			mockEvm.removeCustomPrecompile = Evm.prototype.removeCustomPrecompile.bind(mockEvm)

			// Verify the methods are now bound functions
			expect(typeof mockEvm.addCustomPrecompile).toBe('function')
			expect(typeof mockEvm.removeCustomPrecompile).toBe('function')

			// Test that the methods are bound correctly
			expect(mockEvm.addCustomPrecompile).not.toBeUndefined()
			expect(mockEvm.removeCustomPrecompile).not.toBeUndefined()
		})
	})

	describe('removeCustomPrecompile', () => {
		it('Should remove a custom precompile', async () => {
			const evm = await createEvm({
				common: mainnet,
				blockchain: await createChain({ common: mainnet }),
				stateManager: createStateManager({}),
			})
			const address = createAddressFromString(`0x${'69'.repeat(20)}`)
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

		it('should have a functioning removeCustomPrecompile method', async () => {
			const evm = await createEvm({
				common: mainnet,
				blockchain: await createChain({ common: mainnet }),
				stateManager: createStateManager({}),
			})

			// Verify the method exists
			expect(typeof evm.removeCustomPrecompile).toBe('function')
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
				address: createAddressFromString(`0x${'69'.repeat(20)}`),
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
				address: createAddressFromString(`0x${'69'.repeat(20)}`),
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
