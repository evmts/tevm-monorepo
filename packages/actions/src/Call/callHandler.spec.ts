import { createAddress, createContractAddress } from '@tevm/address'
import { optimism } from '@tevm/common'
import { InvalidGasPriceError, MisconfiguredClientError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { SimpleContract, TestERC20, transports } from '@tevm/test-utils'
import {
	type Address,
	EthjsAddress,
	PREFUNDED_ACCOUNTS,
	decodeFunctionResult,
	encodeDeployData,
	encodeFunctionData,
	hexToBytes,
	parseEther,
} from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { callHandler } from './callHandler.js'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('callHandler', () => {
	it('should execute a contract call', async () => {
		const client = createTevmNode()
		// deploy contract
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()
		expect(
			await getAccountHandler(client)({
				address: ERC20_ADDRESS,
			}),
		).toMatchObject({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		// as a sanity check double check calling the underlying evm works
		const gasUsed = await client
			.getVm()
			.then((vm) => vm.deepCopy())
			.then(async (vm) => {
				const head = await vm.blockchain.getCanonicalHeadBlock()
				await vm.stateManager.setStateRoot(head.header.stateRoot)
				return vm
			})
			.then(async (vm) =>
				vm.evm
					.runCall({
						data: hexToBytes(
							encodeFunctionData({
								abi: ERC20_ABI,
								functionName: 'balanceOf',
								args: [ERC20_ADDRESS],
							}),
						),
						gasLimit: 16784800n,
						to: EthjsAddress.fromString(ERC20_ADDRESS),
						block: await vm.blockchain.getCanonicalHeadBlock(),
						origin: EthjsAddress.zero(),
						caller: EthjsAddress.zero(),
					})
					.then((res) => {
						if (res.execResult.exceptionError) {
							throw res.execResult.exceptionError
						}
						return res.execResult.executionGasUsed
					}),
			)
		expect(gasUsed).toBe(2851n)

		expect(
			await callHandler(client)({
				createAccessList: true,
				data: encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [ERC20_ADDRESS],
				}),
				to: ERC20_ADDRESS,
				gas: 16784800n,
			}),
		).toEqual({
			amountSpent: 169981n,
			preimages: {
				'0x37d95e0aa71e34defa88b4c43498bc8b90207e31ad0ef4aa6f5bea78bd25a1ab':
					'0x3333333333333333333333333333333333333333',
				'0x5380c7b7ae81a58eb98d9c78de4a1fd7fd9535fc953ed2be602daaa41767312a':
					'0x0000000000000000000000000000000000000000',
			},
			totalGasSpent: 24283n,
			rawData: '0x0000000000000000000000000000000000000000000000000000000000000000',
			executionGasUsed: 2851n,
			gas: 29975717n,
			selfdestruct: new Set(),
			logs: [],
			createdAddresses: new Set(),
			accessList: Object.fromEntries([
				[
					'0x3333333333333333333333333333333333333333',
					new Set(['0x0ae1369e98a926a2595ace665f90c7976b6a86afbcadb3c1ceee24998c087435']),
				],
			]),
		})
	})

	it('should be able to send value with addToMempool', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const
		// send value using addToMempool
		expect(
			await callHandler(client)({
				addToMempool: true,
				to,
				value: 420n,
				skipBalance: true,
			}),
		).toEqual({
			executionGasUsed: 0n,
			rawData: '0x',
			txHash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80',
			amountSpent: 147000n,
			totalGasSpent: 21000n,
		})
		await mineHandler(client)()
		expect(
			(
				await getAccountHandler(client)({
					address: to,
				})
			).balance,
		).toEqual(420n)
	})

	it('should be able to send value with addToBlockchain', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const
		// send value using addToBlockchain (auto-mines)
		expect(
			await callHandler(client)({
				addToBlockchain: true,
				to,
				value: 420n,
				skipBalance: true,
			}),
		).toEqual({
			executionGasUsed: 0n,
			rawData: '0x',
			txHash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80',
			amountSpent: 147000n,
			totalGasSpent: 21000n,
		})
		// No need to call mine - transaction should already be mined
		expect(
			(
				await getAccountHandler(client)({
					address: to,
				})
			).balance,
		).toEqual(420n)
	})

	it('should be able to send value with deprecated createTransaction', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const
		// Mock logger to check for deprecation warning
		const warnSpy = vi.spyOn(client.logger, 'warn')

		// send value using createTransaction (deprecated)
		expect(
			await callHandler(client)({
				createTransaction: true,
				to,
				value: 420n,
				skipBalance: true,
			}),
		).toEqual({
			executionGasUsed: 0n,
			rawData: '0x',
			txHash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80',
			amountSpent: 147000n,
			totalGasSpent: 21000n,
		})

		// Check that deprecation warning was logged
		expect(warnSpy).toHaveBeenCalledWith(
			'The createTransaction parameter is deprecated. Please use addToMempool or addToBlockchain instead.',
		)

		await mineHandler(client)()
		expect(
			(
				await getAccountHandler(client)({
					address: to,
				})
			).balance,
		).toEqual(420n)
	})

	it('should not mine existing transactions when using addToBlockchain', async () => {
		const client = createTevmNode()
		const to1 = `0x${'69'.repeat(20)}` as const
		const to2 = `0x${'42'.repeat(20)}` as const

		await setAccountHandler(client)({
			address: to1,
			nonce: 2n,
		})

		await setAccountHandler(client)({
			address: to2,
			nonce: 2n,
		})

		await setAccountHandler(client)({
			address: createAddress(1234).toString(),
			balance: parseEther('25'),
		})

		await setAccountHandler(client)({
			address: createAddress(4321).toString(),
			balance: parseEther('25'),
		})

		await callHandler(client)({
			addToMempool: true,
			from: createAddress(1234).toString(),
			to: to1,
			value: 100n,
		})

		await callHandler(client)({
			addToBlockchain: true,
			from: createAddress(4321).toString(),
			to: to2,
			value: 200n,
		})

		expect(
			(
				await getAccountHandler(client)({
					address: to2,
				})
			).balance,
		).toEqual(200n) // Mined

		// First account should NOT be updated because addToBlockchain only mines its own transaction
		expect(
			(
				await getAccountHandler(client)({
					address: to1,
				})
			).balance,
		).toEqual(0n) // Not mined yet

		// Now mine everything
		await mineHandler(client)()

		// First balance should now be updated after mining
		expect(
			(
				await getAccountHandler(client)({
					address: to1,
				})
			).balance,
		).toEqual(100n) // Now mined
	})
	it('should handle errors returned during contract call', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		// deploy contract
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()
		await vm.evm.stateManager.checkpoint()
		await vm.evm.stateManager.commit()
		const caller = `0x${'23'.repeat(20)}` as const
		const callRes = await callHandler(client)({
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'transferFrom',
				args: [caller, caller, 1n],
			}),
			skipBalance: true,
			from: caller,
			to: ERC20_ADDRESS,
			throwOnFail: false,
		})
		expect(callRes.errors).toBeDefined()
		expect(callRes.errors).toMatchSnapshot()
	})

	it('should be able to send multiple tx from same account and then mine it', async () => {
		const client = createTevmNode()
		const from = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)
		const to = `0x${'42'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: from.toString() as Address,
			nonce: 69n,
			balance: parseEther('1000'),
		})
		expect(errors).toBeUndefined()
		// send value
		expect(
			await callHandler(client)({
				createTransaction: true,
				to,
				value: 1n,
				skipBalance: true,
				from: from.toString() as Address,
			}),
		).toEqual({
			executionGasUsed: 0n,
			rawData: '0x',
			txHash: '0xa5be8692fbb39d79a9d2aa2e87333d6620ceeec3cf52da8bef4d3dec3743145e',
			amountSpent: 147000n,
			totalGasSpent: 21000n,
		})
		expect(
			await callHandler(client)({
				createTransaction: true,
				to,
				value: 2n,
				skipBalance: true,
				from: from.toString() as Address,
			}),
		).toEqual({
			executionGasUsed: 0n,
			rawData: '0x',
			txHash: '0xc4b3576c1bbdda23cf40aa5b6efe08d4c881d569820b6d996cfd611e323af6a9',
			amountSpent: 147000n,
			totalGasSpent: 21000n,
		})
		expect(
			await callHandler(client)({
				createTransaction: true,
				to,
				value: 3n,
				skipBalance: true,
				from: from.toString() as Address,
			}),
		).toEqual({
			executionGasUsed: 0n,
			rawData: '0x',
			txHash: '0x27a596c1e6c26b8fc84f4dc07337b75300e29ab0ba5918fe7509414e62ff9fe9',
			amountSpent: 147000n,
			totalGasSpent: 21000n,
		})
		const txPool = await client.getTxPool()
		// ts hashes are in pool
		expect((await txPool.getBySenderAddress(from)).map((tx) => tx.hash)).toEqual([
			'a5be8692fbb39d79a9d2aa2e87333d6620ceeec3cf52da8bef4d3dec3743145e',
			'c4b3576c1bbdda23cf40aa5b6efe08d4c881d569820b6d996cfd611e323af6a9',
			'27a596c1e6c26b8fc84f4dc07337b75300e29ab0ba5918fe7509414e62ff9fe9',
		])
		await mineHandler(client)()
		// the value should be sent
		expect(
			(
				await getAccountHandler(client)({
					address: to,
				})
			).balance,
		).toEqual(1n + 2n + 3n)
		// nonce should be increased by 3
		expect(
			(
				await getAccountHandler(client)({
					address: from.toString() as Address,
				})
			).nonce,
		).toEqual(69n + 3n)
	})

	it.todo('should return error when deploying contract with insufficient balance', async () => {
		const client = createTevmNode()
		const from = EthjsAddress.fromString(`0x${'00'.repeat(20)}`)
		const to = `0x${'42'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: from.toString() as Address,
			nonce: 0n,
			balance: 0n,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			createTransaction: true,
			throwOnFail: false,
			to,
			value: parseEther('1'),
			from: from.toString() as Address,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it.todo('should return error for invalid contract call data', async () => {
		const client = createTevmNode()
		const invalidData = '0x1234' // invalid function data
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			data: invalidData,
			to,
		})
		expect(result.errors).toContainEqual(
			expect.objectContaining({
				name: 'UnexpectedError',
				message: expect.any(String),
			}),
		)
	})

	it.todo('should handle gas limit exceeded error', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toContainEqual(
			expect.objectContaining({
				name: 'GasLimitExceeded',
				message: expect.any(String),
			}),
		)
	})

	it('should handle gas price too low error', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
			maxFeePerGas: 1n,
		})
		expect(result.errors).toContainEqual(expect.any(InvalidGasPriceError))
	})

	it.todo('should return correct result for read-only call', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.rawData).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		expect(result.executionGasUsed).toBeGreaterThan(0n)
		expect(result.errors).toBeUndefined()
	})

	it('should return error for invalid contract call data', async () => {
		const client = createTevmNode()
		const invalidData = '0x1234' // invalid function data
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			data: invalidData,
			to,
			throwOnFail: false,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle unexpected errors during param conversion', async () => {
		const client = createTevmNode()
		const invalidParams = {
			throwOnFail: false,
			data: '0x1234',
			gas: -1n, // Invalid gas value
		}

		const result = await callHandler(client)(invalidParams as any)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle unexpected errors during script creation', async () => {
		const client = createTevmNode()
		const invalidScriptParams = {
			throwOnFail: false,
			to: `0x${'12'.repeat(20)}`,
			data: '0x1234',
			value: 1000n,
			code: '0x1234', // Invalid code
		}

		const result = await callHandler(client)(invalidScriptParams as any)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should return correct result for read-only call', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.rawData).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		expect(result.executionGasUsed).toBeGreaterThan(0n)
		expect(result.errors).toBeUndefined()
	})

	it('should handle error during VM cloning', async () => {
		const client = createTevmNode()
		const invalidParams = {
			throwOnFail: false,
			data: '0x1234',
			gas: 1000000n,
			blockTag: 'invalid-block-tag', // Invalid block tag to trigger VM cloning error
		}

		const result = await callHandler(client)(invalidParams as any)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle error during script creation', async () => {
		const client = createTevmNode()
		const invalidScriptParams = {
			throwOnFail: false,
			to: `0x${'12'.repeat(20)}`,
			data: '0x1234',
			value: 1000n,
			code: '0x1234', // Invalid code
		}

		const result = await callHandler(client)(invalidScriptParams as any)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle error during EVM execution', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			data: '0x1234', // Invalid function data to trigger EVM execution error
			to,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should create transaction when createTransaction is true', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const
		// Set up account with enough balance
		await setAccountHandler(client)({
			address: to,
			balance: parseEther('1'),
			nonce: 0n,
		})
		const result = await callHandler(client)({
			createTransaction: true,
			to,
			value: parseEther('0.1'),
		})
		expect(result.txHash).toBeDefined()
		expect(result.txHash).toMatchSnapshot()
	})

	it('should handle insufficient balance error', async () => {
		const client = createTevmNode()
		const from = `0x${'69'.repeat(20)}` as const
		const to = `0x${'42'.repeat(20)}` as const
		// Set up account with zero balance
		await setAccountHandler(client)({
			address: from,
			balance: 0n,
			nonce: 0n,
		})
		const result = await callHandler(client)({
			createTransaction: true,
			from,
			to,
			value: parseEther('1'),
			throwOnFail: false,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle error during transaction creation', async () => {
		const client = createTevmNode()
		const txPool = await client.getTxPool()
		// Mock the add method to throw an error
		txPool.add = () => {
			throw new Error('Error adding transaction to pool')
		}
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toHaveLength(1)
		expect(result.errors).toMatchSnapshot()
	})

	it('should return op stack info if forking', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 122606365n,
			},
			common: optimism,
		})
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toBeUndefined()
		expect(result.l1Fee).toBeDefined()
		expect(result.l1BaseFee).toBeDefined()
		expect(result.l1BlobFee).toBeDefined()
		expect(result.l1GasUsed).toBeDefined()
		expect(result.l1Fee).toBeGreaterThan(0n)
		expect(result.l1BaseFee).toBeGreaterThan(0n)
		expect(result.l1BlobFee).toBeGreaterThan(0n)
		expect(result.l1GasUsed).toBeGreaterThan(0n)
	})

	it('should handle opstack throwing unexpectedly', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 122606365n,
			},
			common: {
				...optimism,
				contracts: {
					...optimism.contracts,
					gasPriceOracle: {
						address: '0xbadaddress',
					},
				},
			},
		})
		const originalWarn = client.logger.warn
		const mockWarn = vi.fn()
		client.logger.warn = mockWarn

		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()

		// Reset the mock before our test to avoid counting previous warnings
		mockWarn.mockReset()

		const result = await callHandler(client)({
			throwOnFail: false,
			// Use addToMempool instead of createTransaction to avoid deprecation warning
			addToMempool: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})

		// Restore original warn function
		client.logger.warn = originalWarn

		expect(mockWarn.mock.calls).toHaveLength(1)
		expect(result.errors).toBeUndefined()
		expect(result.l1Fee).toBeUndefined()
		expect(result.l1BaseFee).toBeUndefined()
		expect(result.l1BlobFee).toBeUndefined()
		expect(result.l1GasUsed).toBeUndefined()
	})

	it('should handle vm cloning throwing unexpectedly', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 122606365n,
			},
			common: {
				...optimism,
				contracts: {
					...optimism.contracts,
					gasPriceOracle: {
						address: '0xbadaddress',
					},
				},
			},
		})
		const vm = await client.getVm()
		vm.deepCopy = () => {
			throw new Error('Error cloning VM')
		}
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toHaveLength(1)
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle being unable to get options', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 122606365n,
			},
			common: {
				...optimism,
				contracts: {
					...optimism.contracts,
					gasPriceOracle: {
						address: '0xbadaddress',
					},
				},
			},
		})
		const vm = await client.getVm()
		// this will break if something in callHandler calls getBlock first in future
		vm.blockchain.getBlock = () => {
			throw new Error('Error cloning VM')
		}
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await callHandler(client)({
			throwOnFail: false,
			blockTag: 23n,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [to],
			}),
			to,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toHaveLength(1)
		expect(result.errors).toMatchSnapshot()
	})

	it('should submit a transaction and read the result with pending blockTag', async () => {
		const client = createTevmNode()
		const from = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)

		// Set up account with enough balance
		await setAccountHandler(client)({
			address: from.toString() as Address,
			balance: parseEther('1'),
			nonce: 0n,
		})

		const simpleContract = SimpleContract.withAddress(`0x${'42'.repeat(20)}` as const)
		const setValue = 42n

		// Deploy SimpleContract
		await setAccountHandler(client)({
			address: simpleContract.address,
			deployedBytecode: simpleContract.deployedBytecode,
		})

		// Send transaction to set value
		const setResult = await callHandler(client)({
			createTransaction: true,
			to: simpleContract.address,
			from: from.toString() as Address,
			data: encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [setValue],
			}),
			gas: 16784800n,
		})
		expect(setResult.txHash).toBeDefined()
		expect(setResult.txHash).toMatchSnapshot()

		// Check the result with pending blockTag
		const getResult = await callHandler(client)({
			to: simpleContract.address,
			blockTag: 'pending',
			data: encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'get',
			}),
		})

		expect(
			decodeFunctionResult({
				functionName: 'get',
				abi: simpleContract.abi,
				data: getResult.rawData,
			}),
		).toBe(setValue)

		// Mine the transaction and verify the state change
		await mineHandler(client)()
		const stateResult = await callHandler(client)({
			to: simpleContract.address,
			data: encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'get',
			}),
		})
		expect(stateResult.rawData).toBe(`0x${setValue.toString(16).padStart(64, '0')}`)
	})

	it('should be able to process pending transactions', async () => {
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)
		const contractAddress = createContractAddress(from, 0n)
		const contract = SimpleContract.withAddress(contractAddress.toString())

		const client = createTevmNode()

		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: PREFUNDED_ACCOUNTS[0].address,
			data: encodeDeployData(SimpleContract.deploy(2n)),
			throwOnFail: false,
		})

		// deploy contract using transaction
		expect(deployResult).toEqual({
			amountSpent: 1117613n,
			createdAddress: createContractAddress(from, 0n).toString(),
			createdAddresses: new Set([contractAddress.toString()]),
			executionGasUsed: 98137n,
			gas: 29915941n,
			logs: [],
			rawData: SimpleContract.deployedBytecode,
			selfdestruct: new Set(),
			totalGasSpent: 159659n,
			txHash: '0x8f656a85084ae373ac42a63a2f2186e683107d753cd9509574f314f3c97b923e',
		})

		if (!deployResult.createdAddress) throw new Error('No created address')

		// cannot read from contract using latest because we haven't mined
		expect(
			await callHandler(client)({
				blockTag: 'latest',
				throwOnFail: false,
				...contract.read.get(),
			}),
		).toEqual({
			amountSpent: 147000n,
			executionGasUsed: 0n,
			// rawData is 0x because the contract hasn't been mined yet
			rawData: '0x',
			totalGasSpent: 21000n,
		})

		// can read from contract if we using pending though
		expect(
			await callHandler(client)({
				blockTag: 'pending',
				throwOnFail: false,
				data: encodeFunctionData(contract.read.get()),
				to: contract.address,
			}),
		).toEqual({
			// it works with pending tag
			rawData: '0x0000000000000000000000000000000000000000000000000000000000000002',
			amountSpent: 164472n,
			createdAddresses: new Set(),
			executionGasUsed: 2432n,
			gas: 29976504n,
			logs: [],
			selfdestruct: new Set(),
			totalGasSpent: 23496n,
		})

		// can also submit tx using pending
		expect(
			await callHandler(client)({
				blockTag: 'pending',
				throwOnFail: false,
				createTransaction: true,
				createAccessList: true,
				to: contract.address,
				data: encodeFunctionData(contract.write.set(42n)),
			}),
		).toEqual({
			amountSpent: 194488n,
			createdAddresses: new Set(),
			executionGasUsed: 6580n,
			gas: 29972216n,
			logs: [
				{
					address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
					data: '0x000000000000000000000000000000000000000000000000000000000000002a',
					topics: ['0x012c78e2b84325878b1bd9d250d772cfe5bda7722d795f45036fa5e1e6e303fc'],
				},
			],
			accessList: {
				'0x5fbdb2315678afecb367f032d93f642f64180aa3': new Set([
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				]),
			},
			preimages: {
				'0x44e659e60b21cc961f64ad47f20523c1d329d4bbda245ef3940a76dc89d0911b':
					'0x5fbdb2315678afecb367f032d93f642f64180aa3',
				'0x5380c7b7ae81a58eb98d9c78de4a1fd7fd9535fc953ed2be602daaa41767312a':
					'0x0000000000000000000000000000000000000000',
				'0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9':
					'0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
			},
			rawData: '0x',
			selfdestruct: new Set(),
			totalGasSpent: 27784n,
			txHash: '0x837ec20cf75b4fbac2da3b8efc547b9683af8afa5a54e9d2975b32224ea4ae86',
		})
	})

	it('should handle mining failing', async () => {
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)
		const contractAddress = createContractAddress(from, 0n)
		const contract = SimpleContract.withAddress(contractAddress.toString())

		const client = createTevmNode()

		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: PREFUNDED_ACCOUNTS[0].address,
			data: encodeDeployData(SimpleContract.deploy(2n)),
			throwOnFail: false,
		})

		// deploy contract using transaction
		expect(deployResult).toEqual({
			amountSpent: 1117613n,
			createdAddress: createContractAddress(from, 0n).toString(),
			createdAddresses: new Set([contractAddress.toString()]),
			executionGasUsed: 98137n,
			gas: 29915941n,
			logs: [],
			rawData: SimpleContract.deployedBytecode,
			selfdestruct: new Set(),
			totalGasSpent: 159659n,
			txHash: '0x8f656a85084ae373ac42a63a2f2186e683107d753cd9509574f314f3c97b923e',
		})

		if (!deployResult.createdAddress) throw new Error('No created address')

		// make it so an error happens while mining
		const originalDeepCopy = client.deepCopy.bind(client)
		;(client as any).deepCopy = async () => {
			const copy = await originalDeepCopy()
			return {
				...copy,
				// This will cause the mine handler to throw an error for not being ready
				status: 'SYNCING',
			}
		}

		const { errors } = await callHandler(client)({
			blockTag: 'pending',
			throwOnFail: false,
			...contract.read.get(),
			to: contract.address,
		})
		expect(errors?.[0]).toBeInstanceOf(MisconfiguredClientError)
		expect(errors).toMatchSnapshot()
	})
})
