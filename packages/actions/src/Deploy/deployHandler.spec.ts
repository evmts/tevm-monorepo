import { createAddress } from '@tevm/address'
import { InvalidRequestError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { type Hex, bytesToHex, parseAbi } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { deployHandler } from './deployHandler.js'

// This contract exists as SimpleConstructor in bench package. Consider moving it to test utils
const simpleConstructorBytecode =
	'0x608060405234801561000f575f80fd5b506040516101ef3803806101ef83398181016040528101906100319190610074565b805f819055505061009f565b5f80fd5b5f819050919050565b61005381610041565b811461005d575f80fd5b50565b5f8151905061006e8161004a565b92915050565b5f602082840312156100895761008861003d565b5b5f61009684828501610060565b91505092915050565b610143806100ac5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea264697066735822122019e943356c89506511b952171a3b4724d3152e5f4029bbb0ecc836d1365fcce464736f6c63430008160033' as const
const simpleConstructorAbi = parseAbi([
	'constructor(uint256 _initialValue)',
	'function get() view returns (uint256)',
	'function set(uint256 x)',
])
describe('deployHandler', () => {
	it('should deploy a contract', async () => {
		const client = createTevmNode({ loggingLevel: 'warn' })
		const initialValue = 420n
		// TODO this type is fucked atm
		const deployResult = await deployHandler(client)({
			abi: simpleConstructorAbi,
			bytecode: simpleConstructorBytecode,
			args: [initialValue],
		})
		expect(deployResult).toEqual({
			createdAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
			createdAddresses: new Set(['0x5FbDB2315678afecb367f032d93F642f64180aa3']),
			executionGasUsed: 87131n,
			logs: [],
			rawData:
				'0x608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea264697066735822122019e943356c89506511b952171a3b4724d3152e5f4029bbb0ecc836d1365fcce464736f6c63430008160033',
			selfdestruct: new Set(),
			txHash: '0x2a872fc2c05d90cbbdfbed7a5c831533dc1d02c1be4ab374b7d9c66e9ccec0e8',
			amountSpent: 1034047n,
			gas: 29916879n,
			totalGasSpent: 147721n,
		})
		const mineResult = await mineHandler(client)()
		const vm = await client.getVm()
		expect(mineResult.errors).toBeUndefined()
		expect(mineResult.blockHashes).toHaveLength(1)

		// TODO this is broke
		// expect(await ethGetTransactionReceiptHandler(client)({ hash: deployResult.txHash as Hex })).toEqual({})

		expect(
			bytesToHex(await vm.stateManager.getCode(createAddress(deployResult.createdAddress as Hex))),
		).toEqual(
			'0x608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea264697066735822122019e943356c89506511b952171a3b4724d3152e5f4029bbb0ecc836d1365fcce464736f6c63430008160033',
		)
		// TODO this is broke too
		// expect((await vm.stateManager.getAccount(EthjsAddress.fromString(deployResult.createdAddress as Hex)))?.isContract()).toBe(true)
		expect(
			(
				await contractHandler(client)({
					abi: simpleConstructorAbi,
					functionName: 'get',
					to: deployResult.createdAddress as Hex,
				})
			).data,
		).toBe(initialValue)
	})

	it('should throw an InvalidRequestError when constructor args are incorrect', async () => {
		const client = createTevmNode({ loggingLevel: 'warn' })
		const deploy = deployHandler(client)

		// Attempt to deploy with incorrect argument type (string instead of uint256)
		await expect(
			deploy({
				abi: simpleConstructorAbi,
				bytecode: simpleConstructorBytecode,
				args: ['not a number'],
			}),
		).rejects.toThrow(InvalidRequestError)

		// Attempt to deploy with incorrect number of arguments
		await expect(
			deploy({
				abi: simpleConstructorAbi,
				bytecode: simpleConstructorBytecode,
				args: [420n, 'extra arg'],
			}),
		).rejects.toThrow(InvalidRequestError)
	})
})
