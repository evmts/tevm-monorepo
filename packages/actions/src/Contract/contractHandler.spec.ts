import { createAddress } from '@tevm/address'
import { optimism } from '@tevm/common'
import { InvalidGasPriceError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { TestERC20, transports } from '@tevm/test-utils'
import { encodeFunctionData, hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { contractHandler } from './contractHandler.js'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('contractHandler', () => {
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
						to: createAddress(ERC20_ADDRESS),
						block: await vm.blockchain.getCanonicalHeadBlock(),
						origin: createAddress(0),
						caller: createAddress(0),
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
			await contractHandler(client)({
				createAccessList: true,
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [ERC20_ADDRESS],
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
			data: 0n,
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
		const callRes = await contractHandler(client)({
			abi: ERC20_ABI,
			functionName: 'transferFrom',
			args: [caller, caller, 1n],
			skipBalance: true,
			from: caller,
			to: ERC20_ADDRESS,
			throwOnFail: false,
		})
		expect(callRes.errors).toBeDefined()
		expect(callRes.errors).toMatchSnapshot()
	})

	it('should handle gas price too low error', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await contractHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [to],
			to,
			maxFeePerGas: 1n,
		})
		expect(result.errors).toContainEqual(expect.any(InvalidGasPriceError))
	})

	it('should return correct result for read-only call', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await contractHandler(client)({
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [to],
			to,
		})
		expect(result.rawData).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		expect(result.executionGasUsed).toBeGreaterThan(0n)
		expect(result.errors).toBeUndefined()
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
		const result = await contractHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [to],
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
				blockTag: 'latest',
			},
			common: optimism,
		})
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
		})
		expect(errors).toBeUndefined()
		const result = await contractHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [to],
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

	it('should handle invalid params', async () => {
		const client = createTevmNode()
		const result = await contractHandler(client)({
			to: '0x123', // invalid address
			abi: [],
			functionName: '',
			throwOnFail: false,
		} as any)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle missing contract', async () => {
		const client = createTevmNode()
		const result = await contractHandler(client)({
			to: `0x${'0'.repeat(40)}`, // address with no contract
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [ERC20_ADDRESS],
			throwOnFail: false,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle invalid function encoding', async () => {
		const client = createTevmNode()
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})
		const result = await contractHandler(client)({
			to: ERC20_ADDRESS,
			abi: ERC20_ABI,
			functionName: 'nonExistentFunction',
			throwOnFail: false,
		} as any)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle revert errors during contract call', async () => {
		const client = createTevmNode()
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})
		const result = await contractHandler(client)({
			abi: ERC20_ABI,
			functionName: 'transferFrom',
			args: [`0x${'0'.repeat(40)}`, `0x${'0'.repeat(40)}`, 1n],
			to: ERC20_ADDRESS,
			throwOnFail: false,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle error during EVM call', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		vm.evm.runCall = async () => {
			throw new Error('EVM error')
		}
		const result = await contractHandler(client)({
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [ERC20_ADDRESS],
			to: ERC20_ADDRESS,
			throwOnFail: false,
		})
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle unexpected errors during param conversion', async () => {
		const client = createTevmNode()
		const invalidParams = {
			throwOnFail: false,
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [ERC20_ADDRESS],
			gas: -1n, // Invalid gas value
		}

		const result = await contractHandler(client)(invalidParams as any)
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

		const result = await contractHandler(client)(invalidScriptParams as any)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle op stack info if forking', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 'latest',
			},
			common: optimism,
		})
		const to = `0x${'33'.repeat(20)}` as const
		const { errors } = await setAccountHandler(client)({
			address: to,
			deployedBytecode: ERC20_BYTECODE,
			throwOnFail: false,
		})
		expect(errors).toBeUndefined()
		const result = await contractHandler(client)({
			throwOnFail: false,
			createTransaction: true,
			abi: ERC20_ABI,
			functionName: 'balanceOf',
			args: [to],
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

	it('should handle contract revert errors', async () => {
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

		const from = `0x${'11'.repeat(20)}` as const
		const to = `0x${'22'.repeat(20)}` as const
		const amount = 1000n

		const result = await contractHandler(client)({
			abi: ERC20_ABI,
			functionName: 'transferFrom',
			args: [from, to, amount],
			to: ERC20_ADDRESS,
			throwOnFail: false,
		})

		expect(result.errors).toBeDefined()
		expect(result.errors?.length).toBe(1)
		expect(result.errors?.[0]?.name).toBe('Revert')
		expect(result.errors?.[0]).toMatchInlineSnapshot(`
			[Revert: The contract function "transferFrom" reverted.

			Error: ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)
			                                 (0x0000000000000000000000000000000000000000, 0, 1000)
			 
			Contract Call:
			  address:   0x3333333333333333333333333333333333333333
			  function:  transferFrom(address from, address to, uint256 value)
			  args:                  (0x1111111111111111111111111111111111111111, 0x2222222222222222222222222222222222222222, 1000)

			Docs: https://viem.sh/reference/tevm/errors/classes/reverterror/
			Version: viem@2.37.8

			Docs: https://tevm.sh/reference/tevm/errors/classes/reverterror/
			Details: The contract function "transferFrom" reverted.

			Error: ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)
			                                 (0x0000000000000000000000000000000000000000, 0, 1000)
			 
			Contract Call:
			  address:   0x3333333333333333333333333333333333333333
			  function:  transferFrom(address from, address to, uint256 value)
			  args:                  (0x1111111111111111111111111111111111111111, 0x2222222222222222222222222222222222222222, 1000)

			Docs: https://viem.sh/reference/tevm/errors/classes/reverterror/
			Version: viem@2.37.8
			Version: 1.1.0.next-73]
		`)
	})
})
