import { createTevmNode, definePrecompile, hexToBytes, PREFUNDED_ACCOUNTS } from 'tevm'
import { createAddress } from 'tevm/address'
import { createContract } from 'tevm/contract'
import { EvmError, EvmErrorMessage } from 'tevm/evm'
import { createImpersonatedTx } from 'tevm/tx'
import { parseAbi } from 'tevm/utils'
import { describe, expect, it } from 'vitest'

const txDefaults = {
	gasLimit: 100000n,
	maxFeePerGas: 10n,
	maxPriorityFeePerGas: 1n,
} as const

const testAddress = (id: number) => createAddress(PREFUNDED_ACCOUNTS[id % PREFUNDED_ACCOUNTS.length].address)

describe('Custom Precompiles', () => {
	describe('Basic Precompiles', () => {
		it('should register and use custom precompile', async () => {
			const customPrecompile = definePrecompile({
				contract: createContract({
					abi: parseAbi(['function double(bytes) returns (bytes)']),
					address: '0x0000000000000000000000000000000000000123',
				}),
				call: async ({ data }) => {
					// Simple precompile that doubles each byte
					const input = Array.from(hexToBytes(data))
					return {
						returnValue: new Uint8Array(input.map((byte) => Number(byte) * 2)),
						executionGasUsed: 200n,
					}
				},
			})

			const node = createTevmNode({
				customPrecompiles: [customPrecompile.precompile()],
			})

			const tx = createImpersonatedTx({
				...txDefaults,
				impersonatedAddress: testAddress(1),
				to: customPrecompile.contract.address,
				data: '0x00',
			})

			const vm = await node.getVm()
			const result = await vm.runTx({ tx })
			expect(result.execResult.returnValue).toBeDefined()
		})
	})

	describe('Advanced Precompiles', () => {
		it('should handle precompile with JavaScript state', async () => {
			const storage = new Map<string, Uint8Array>()
			const statePrecompile = definePrecompile({
				contract: createContract({
					abi: parseAbi(['function store(bytes32,bytes32)']),
					address: '0x0000000000000000000000000000000000000124',
				}),
				call: async ({ data, gasLimit }) => {
					const bytes = hexToBytes(data)
					const key = bytes.slice(0, 32)
					const value = bytes.slice(32, 64)
					storage.set(Buffer.from(key).toString('hex'), value)
					const executionGasUsed = 200n
					if (gasLimit <= executionGasUsed) {
						return {
							returnValue: new Uint8Array(),
							exceptionError: new EvmError(EvmErrorMessage.OUT_OF_GAS),
							executionGasUsed: gasLimit,
						}
					}
					return {
						returnValue: new Uint8Array(),
						executionGasUsed,
					}
				},
			})

			const node = createTevmNode({
				customPrecompiles: [statePrecompile.precompile()],
			})

			const tx = createImpersonatedTx({
				...txDefaults,
				impersonatedAddress: testAddress(2),
				to: statePrecompile.contract.address,
				data: `0x${'00'.repeat(32)}${'ff'.repeat(32)}` as `0x${string}`,
			})

			const vm = await node.getVm()
			await vm.runTx({ tx })
			const storedValue = storage.get(Buffer.from(new Uint8Array(32)).toString('hex'))
			expect(storedValue).toEqual(new Uint8Array(32).fill(0xff))
		})

		it('should handle gas calculation', async () => {
			const gasPrecompile = definePrecompile({
				contract: createContract({
					abi: parseAbi(['function processWithGas(bytes)']),
					address: '0x0000000000000000000000000000000000000125',
				}),
				call: async ({ data, gasLimit }) => {
					// Charge 100 gas per byte
					const gasUsed = BigInt(hexToBytes(data).length * 100)
					if (gasUsed > gasLimit) {
						throw new Error('Out of gas')
					}
					return {
						returnValue: new Uint8Array(),
						executionGasUsed: gasUsed,
					}
				},
			})

			const node = createTevmNode({
				customPrecompiles: [gasPrecompile.precompile()],
			})

			const tx = createImpersonatedTx({
				...txDefaults,
				impersonatedAddress: testAddress(3),
				to: gasPrecompile.contract.address,
				data: new Uint8Array(100).fill(0xff), // 100 bytes
			})

			const vm = await node.getVm()
			const result = await vm.runTx({ tx })
			expect(result.execResult.executionGasUsed).toBe(10000n)
		})
	})

	describe('Error Handling', () => {
		it('should handle precompile errors', async () => {
			const errorPrecompile = definePrecompile({
				contract: createContract({
					abi: parseAbi(['function process()']),
					address: '0x0000000000000000000000000000000000000126',
				}),
				call: async ({ data }) => {
					if (data === '0x') {
						throw new Error('Empty input not allowed')
					}
					return {
						returnValue: new Uint8Array(),
						executionGasUsed: 200n,
					}
				},
			})

			const node = createTevmNode({
				customPrecompiles: [errorPrecompile.precompile()],
			})

			const tx = createImpersonatedTx({
				...txDefaults,
				impersonatedAddress: testAddress(4),
				to: errorPrecompile.contract.address,
				data: '0x',
			})

			const vm = await node.getVm()
			try {
				await vm.runTx({ tx })
				throw new Error('Should have failed')
			} catch (error: any) {
				expect(error.message).toContain('Empty input not allowed')
			}
		})

		it('should handle invalid precompile address', async () => {
			const tx = createImpersonatedTx({
				...txDefaults,
				impersonatedAddress: testAddress(5),
				to: createAddress('0x0000000000000000000000000000000000000999'), // Non-existent precompile
				data: '0x00',
			})

			const node = createTevmNode()
			const vm = await node.getVm()
			const result = await vm.runTx({ tx })
			expect(result.execResult.exceptionError).toBeUndefined()
			expect(result.execResult.returnValue).toEqual(new Uint8Array())
		})
	})

	describe('Multiple Precompiles', () => {
		it('should handle multiple precompiles', async () => {
			const precompileA = definePrecompile({
				contract: createContract({
					abi: parseAbi(['function processA() returns (bytes)']),
					address: '0x0000000000000000000000000000000000000127',
				}),
				call: async () => ({
					returnValue: new Uint8Array([1]),
					executionGasUsed: 200n,
				}),
			})

			const precompileB = definePrecompile({
				contract: createContract({
					abi: parseAbi(['function processB() returns (bytes)']),
					address: '0x0000000000000000000000000000000000000128',
				}),
				call: async () => ({
					returnValue: new Uint8Array([2]),
					executionGasUsed: 200n,
				}),
			})

			const node = createTevmNode({
				customPrecompiles: [precompileA.precompile(), precompileB.precompile()],
			})

			const txA = createImpersonatedTx({
				...txDefaults,
				impersonatedAddress: testAddress(6),
				to: precompileA.contract.address,
				data: '0x00',
			})

			const txB = createImpersonatedTx({
				...txDefaults,
				impersonatedAddress: testAddress(7),
				to: precompileB.contract.address,
				data: '0x00',
			})

			const vm = await node.getVm()
			const resultA = await vm.runTx({ tx: txA })
			const resultB = await vm.runTx({ tx: txB })

			expect(resultA.execResult.returnValue).toEqual(new Uint8Array([1]))
			expect(resultB.execResult.returnValue).toEqual(new Uint8Array([2]))
		})
	})

	describe('Performance', () => {
		it('should handle concurrent precompile calls', async () => {
			const asyncPrecompile = definePrecompile({
				contract: createContract({
					abi: parseAbi(['function processAsync(bytes) returns (bytes)']),
					address: '0x0000000000000000000000000000000000000129',
				}),
				call: async ({ data }) => {
					// Simulate async processing
					await new Promise((resolve) => setTimeout(resolve, 100))
					return {
						returnValue: new Uint8Array([Number(hexToBytes(data)[0]) || 0]),
						executionGasUsed: 200n,
					}
				},
			})

			const node = createTevmNode({
				customPrecompiles: [asyncPrecompile.precompile()],
			})

			const txs = Array.from({ length: 5 }, (_, i) =>
				createImpersonatedTx({
					...txDefaults,
					impersonatedAddress: testAddress(8 + i),
					to: asyncPrecompile.contract.address,
					data: `0x0${i + 1}` as `0x${string}`,
				}),
			)

			const vm = await node.getVm()
			const results = await Promise.all(txs.map((tx) => vm.runTx({ tx })))
			results.forEach((result: any, i: number) => {
				expect(result.execResult.returnValue).toEqual(new Uint8Array([i + 1]))
			})
		})
	})
})
