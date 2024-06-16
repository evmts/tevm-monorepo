import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { InvalidGasPriceError } from '@tevm/errors'
import { TestERC20 } from '@tevm/test-utils'
import { type Address, EthjsAddress, encodeFunctionData, hexToBytes, parseEther } from '@tevm/utils'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { callHandler } from './callHandler.js'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('callHandler', () => {
	it('should execute a contract call', async () => {
		const client = createBaseClient()
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

	it('should be able to send value', async () => {
		const client = createBaseClient()
		const to = `0x${'69'.repeat(20)}` as const
		// send value
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
		await mineHandler(client)()
		expect(
			(
				await getAccountHandler(client)({
					address: to,
				})
			).balance,
		).toEqual(420n)
	})
	it('should handle errors returned during contract call', async () => {
		const client = createBaseClient()
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
		expect(
			await callHandler(client)({
				data: encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transferFrom',
					args: [caller, caller, 1n],
				}),
				skipBalance: true,
				from: caller,
				to: ERC20_ADDRESS,
				throwOnFail: false,
			}),
		).toMatchSnapshot()
	})

	it('should be able to send multiple tx from same account and then mine it', async () => {
		const client = createBaseClient()
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
		const client = createBaseClient()
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
			to,
			value: parseEther('1'),
			from: from.toString() as Address,
		})
		expect(result.errors).toContainEqual(
			expect.objectContaining({
				_tag: 'InsufficientBalance',
				name: 'InsufficientBalance',
				message: expect.any(String),
			}),
		)
	})

	it.todo('should return error for invalid contract call data', async () => {
		const client = createBaseClient()
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
		const client = createBaseClient()
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
		const client = createBaseClient()
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
		const client = createBaseClient()
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
})
