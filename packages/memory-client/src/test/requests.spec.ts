import type { CallJsonRpcRequest } from '@tevm/actions'
import { optimism } from '@tevm/common'
import { ERC20 } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { EthjsAddress, type Hex, bytesToHex, encodeDeployData, parseAbi } from '@tevm/utils'
import { decodeFunctionResult, encodeFunctionData, hexToBigInt, hexToBytes, toHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

const forkConfig = {
	transport: transports.optimism,
	blockTag: 120748268n,
}

describe('Tevm.request', async () => {
	const tevm = createMemoryClient()

	it('should execute a script request', async () => {
		const req = {
			params: [
				{
					data: encodeFunctionData(ERC20.read.balanceOf(contractAddress)),
					code: encodeDeployData(ERC20.deploy('Name', 'SYMBOL')),
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		} as const satisfies CallJsonRpcRequest
		const res = await tevm.transport.tevm.request(req)
		expect(
			decodeFunctionResult({
				abi: ERC20.abi,
				data: res.rawData,
				functionName: 'balanceOf',
			}) satisfies bigint,
		).toBe(0n)
		expect(res.executionGasUsed).toBe('0xb23')
		expect(res.logs).toEqual([])
	})

	it('should throw an error if attempting a tevm_contractCall request', async () => {
		const tevm = createMemoryClient()
		const req = {
			params: [
				{
					data: encodeFunctionData(ERC20.read.balanceOf(contractAddress)),
					to: contractAddress,
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_NotARequest' as any,
			id: 1,
		} as const satisfies CallJsonRpcRequest
		const error = await tevm.request(req).catch((e) => e)
		expect(error.code).toMatchSnapshot()
		expect(error.message).toMatchSnapshot()
	})

	it('should execute a contractCall request via using tevm_call', { timeout: 90_000 }, async () => {
		const tevm = createMemoryClient({
			common: optimism,
			loggingLevel: 'warn',
			fork: {
				...forkConfig,
			},
		})
		const req = {
			params: [
				{
					data: encodeFunctionData(ERC20.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d')),
					to: contractAddress,
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		} as const satisfies CallJsonRpcRequest
		const res = await tevm.transport.tevm.request(req)
		expect(
			decodeFunctionResult({
				data: res.rawData,
				abi: ERC20.abi,
				functionName: 'balanceOf',
			}) satisfies bigint,
		).toBe(1n)
		expect(hexToBigInt(res.executionGasUsed)).toBe(2447n)
		expect(res.logs).toEqual([])
	})

	it('should execute a call request', async () => {
		const tevm = createMemoryClient()
		const balance = 0x11111111n
		const address1 = '0x1f420000000000000000000000000000000000ff'
		const address2 = '0x2f420000000000000000000000000000000000ff'
		await tevm.tevmSetAccount({
			address: address1,
			balance,
		})
		const transferAmount = 0x420n
		const res = await tevm.transport.tevm.request({
			params: [
				{
					caller: address1,
					data: '0x0',
					to: address2,
					value: toHex(transferAmount),
					origin: address1,
					createTransaction: true,
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		})
		expect(res.rawData).toEqual('0x')
		await tevm.tevmMine()
		expect(
			(await (await tevm.transport.tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address2))))
				?.balance,
		).toBe(transferAmount)
		expect(
			(await (await tevm.transport.tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address1))))
				?.balance,
		).toBe(286183069n)
	})

	it('Should execute a putAccount request', async () => {
		const tevm = createMemoryClient()
		const balance = 0x11111111n
		const res = await tevm.transport.tevm.request({
			method: 'tevm_setAccount',
			params: [
				{
					address: '0xff420000000000000000000000000000000000ff',
					balance: toHex(balance),
					code: ERC20.deployedBytecode,
				},
			],
		})
		expect(res).not.toHaveProperty('error')
		const account = await (await tevm.transport.tevm.getVm()).stateManager.getAccount(
			EthjsAddress.fromString('0xff420000000000000000000000000000000000ff'),
		)
		expect(account?.balance).toEqual(balance)
		expect(account?.codeHash).toMatchSnapshot()
	})

	it('Should execute a deploy request', async () => {
		const simpleConstructorBytecode =
			'0x608060405234801561000f575f80fd5b506040516101ef3803806101ef83398181016040528101906100319190610074565b805f819055505061009f565b5f80fd5b5f819050919050565b61005381610041565b811461005d575f80fd5b50565b5f8151905061006e8161004a565b92915050565b5f602082840312156100895761008861003d565b5b5f61009684828501610060565b91505092915050565b610143806100ac5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea264697066735822122019e943356c89506511b952171a3b4724d3152e5f4029bbb0ecc836d1365fcce464736f6c63430008160033' as const
		const simpleConstructorAbi = parseAbi([
			'constructor(uint256 _initialValue)',
			'function get() view returns (uint256)',
			'function set(uint256 x)',
		])
		const initialValue = 420n
		const tevm = createMemoryClient()
		// TODO this type is fucked atm
		const deployResult = await tevm.tevmDeploy({
			abi: simpleConstructorAbi,
			bytecode: simpleConstructorBytecode,
			args: [initialValue],
		})
		expect(deployResult).toEqual({
			amountSpent: 1034047n,
			gas: 29916879n,
			totalGasSpent: 147721n,
			createdAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
			createdAddresses: new Set(['0x5FbDB2315678afecb367f032d93F642f64180aa3']),
			executionGasUsed: 87131n,
			logs: [],
			rawData:
				'0x608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea264697066735822122019e943356c89506511b952171a3b4724d3152e5f4029bbb0ecc836d1365fcce464736f6c63430008160033',
			selfdestruct: new Set(),
			txHash: '0x2a872fc2c05d90cbbdfbed7a5c831533dc1d02c1be4ab374b7d9c66e9ccec0e8',
		})
		const mineResult = await tevm.tevmMine()
		const vm = await tevm.transport.tevm.getVm()
		expect(mineResult.errors).toBeUndefined()
		expect(mineResult.blockHashes).toHaveLength(1)

		// TODO this is broke
		// expect(await ethGetTransactionReceiptHandler(client)({ hash: deployResult.txHash as Hex })).toEqual({})

		expect(
			bytesToHex(await vm.stateManager.getContractCode(EthjsAddress.fromString(deployResult.createdAddress as Hex))),
		).toEqual(
			'0x608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea264697066735822122019e943356c89506511b952171a3b4724d3152e5f4029bbb0ecc836d1365fcce464736f6c63430008160033',
		)
		// TODO this is broke too
		// expect((await vm.stateManager.getAccount(EthjsAddress.fromString(deployResult.createdAddress as Hex)))?.isContract()).toBe(true)
		expect(
			(
				await tevm.tevmContract({
					abi: simpleConstructorAbi,
					functionName: 'get',
					to: deployResult.createdAddress as Hex,
				})
			).data,
		).toBe(initialValue)
	})

	// repoing a reported bug
	it('Should be able to create a contract using these foundry artifacts', { timeout: 15_000 }, async () => {
		const memoryClient = createMemoryClient({ fork: forkConfig })
		// const account = await memoryClient.tevmGetAccount({ address: '0xF52CF539DcAc32507F348aa19eb5173EEA3D4e7c' })
		// expect(account).toBeUndefined()
		const res = await memoryClient.tevmCall({
			from: '0xef987cde72bc6a9e351d2460214d75f095b1b862',
			data: '0x608060405234801561001057600080fd5b5060405161012938038061012983398101604081905261002f91610037565b600055610050565b60006020828403121561004957600080fd5b5051919050565b60cb8061005e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806301339c211460375780638c59507c14603f575b600080fd5b603d6059565b005b604760005481565b60405190815260200160405180910390f35b7f7c84ba1c5769a0155145414f13e03f1d0d6a3a7e5d4f6d45262df4d9d48c32cd600054604051608b91815260200190565b60405180910390a156fea2646970667358221220dea4bdd87c9ec514fbd0563f520e4a0e34d2930f1a35ff63b903349d337010fe64736f6c634300081300330000000000000000000000000000000000000000000000000000000000000002',
			value: 0n,
			skipBalance: true,
			throwOnFail: false,
		})

		expect(res.errors).toBeUndefined()
		expect(res.createdAddress).toEqual('0xF52CF539DcAc32507F348aa19eb5173EEA3D4e7c')
	})

	it('Should get the same account in forked or not forked mode', async () => {
		const forkedClient = createMemoryClient({ fork: forkConfig })
		const nonForkedClient = createMemoryClient()
		const forkedAccount = await forkedClient.tevmGetAccount({
			address: '0xF52CF539DcAc32507F348aa19eb5173EEA3D4e7c',
			throwOnFail: false,
		})
		const nonForkedAccount = await nonForkedClient.tevmGetAccount({
			address: '0xF52CF539DcAc32507F348aa19eb5173EEA3D4e7c',
			throwOnFail: false,
		})
		expect(forkedAccount).toEqual(nonForkedAccount)
	})

	it('should execute eth_createAccessList request', async () => {
		const tevm = createMemoryClient()
		const req = {
			method: 'eth_createAccessList',
			params: [
				{
					from: '0x1f420000000000000000000000000000000000ff',
					to: contractAddress,
					data: encodeFunctionData(ERC20.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d')),
				},
			],
			id: 1,
			jsonrpc: '2.0',
		}
		// @ts-expect-error todo doesn't exist in viem yet https://github.com/wevm/viem/discussions/1060
		const res = await tevm.request(req)
		expect(res).toMatchObject({
			accessList: [],
			gasUsed: '0x53b8',
		})
	})
})
