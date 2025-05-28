import { createAddress } from '@tevm/address'
import { Block } from '@tevm/block'
import { EvmError } from '@tevm/evm'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS, encodeDeployData, getAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { createScript } from './createScript.js'

describe('createScript', () => {
	const client = createTevmNode()
	const validCode = encodeDeployData({ args: ['Name', 'Symbol'], ...TestERC20 })
	const invalidCode = '0x6969696969' // invalid EVM bytecode
	const validDeployedBytecode = TestERC20.deployedBytecode

	it('should create a script with valid deployedBytecode', async () => {
		const result = await createScript(client, undefined, validDeployedBytecode)
		expect(result.errors).toBeUndefined()
		expect(getAddress(result.address as any)).toBeDefined()
		const account = await getAccountHandler(client)({ address: result.address as any })
		expect(account.deployedBytecode).toBe(validDeployedBytecode)
	})

	it('should create a script with valid code', async () => {
		const result = await createScript(client, validCode)
		expect(result.errors).toBeUndefined()
		expect(getAddress(result.address as any)).toBeDefined()
		const account = await getAccountHandler(client)({ address: result.address as any })
		expect(account.deployedBytecode).toBe(validDeployedBytecode)
	})

	it('should return an error for invalid bytecode', async () => {
		const result = await createScript(client, invalidCode)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should return an error when neither code nor deployed bytecode is provided', async () => {
		const result = await createScript(client)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle script creation failure due to EVM error', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		vm.evm.runCall = async () => {
			throw new Error('EVM error')
		}
		const result = await createScript(client, validCode)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle setAccount failing unexpecdedly', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		vm.stateManager.putAccount = async () => {
			throw new Error('Unexpected error')
		}
		const result = await createScript(client, undefined, validDeployedBytecode)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should succeed even if base fee higher than calcNextBaseFee', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const newBlock = Block.fromBlockData(
			{
				...(latest as any),
			},
			{ common: vm.common, freeze: false },
		)
		newBlock.header.calcNextBaseFee = () => 0n
		await vm.blockchain.putBlock(newBlock)
		const result = await createScript(client, validCode)
		expect(result.errors).toBeUndefined()
		expect(getAddress(result.address as any)).toBeDefined()
		const account = await getAccountHandler(client)({ address: result.address as any })
		expect(account.deployedBytecode).toBe(validDeployedBytecode)
	})

	it('should handle vm errors', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		vm.evm.runCall = () => {
			return Promise.resolve({
				execResult: {
					returnValue: Uint8Array.from([]),
					exceptionError: new EvmError('revert'),
					executionGasUsed: 420n,
				},
			})
		}
		await setAccountHandler(client)({
			address: PREFUNDED_ACCOUNTS[0].address,
			balance: 0n,
		})
		const result = await createScript(client, validCode)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle the case where the code property did not produce any bytecode', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		const originalRunCall = vm.evm.runCall.bind(vm.evm)
		vm.evm.runCall = async (params) => {
			const res = await originalRunCall(params)
			return {
				...res,
				createdAddress: undefined as any,
			}
		}
		const result = await createScript(client, validCode)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle the unlikely case we are unable to get the account after successful creation', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		const originalRunCall = vm.evm.runCall.bind(vm.evm)
		vm.evm.runCall = async (params) => {
			const res = await originalRunCall(params)
			return {
				...res,
				// set createdAddress to an account that does not exist
				createdAddress: createAddress(252525252525),
			}
		}
		const result = await createScript(client, validCode)
		expect(result.errors).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})
})
