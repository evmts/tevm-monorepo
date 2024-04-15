import { MOCKERC20_ABI, MOCKERC20_BYTECODE } from '../test/contractConstants.js'
import { contractHandler } from './contractHandler.js'
import { setAccountHandler } from './setAccountHandler.js'
import { createBaseClient } from '@tevm/base-client'
import type { ContractError } from '@tevm/errors'
import { hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'bun:test'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE =
	'0x608060405234801561001057600080fd5b50600436106101425760003560e01c806370a08231116100b8578063a457c2d71161007c578063a457c2d7146103b0578063a9059cbb146103dc578063bf353dbb14610408578063cd0d00961461042e578063d505accf14610436578063dd62ed3e1461048757610142565b806370a082311461030a5780637ecebe001461033057806395d89b41146103565780639c52a7f11461035e5780639dc29fac1461038457610142565b8063313ce5671161010a578063313ce5671461025c5780633644e5151461027a578063395093511461028257806340c10f19146102ae57806354fd4d50146102dc57806365fae35e146102e457610142565b806306fdde0314610147578063095ea7b3146101c457806318160ddd1461020457806323b872dd1461021e57806330adf81f14610254575b600080fd5b61014f6104b5565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610189578181015183820152602001610171565b50505050905090810190601f1680156101b65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101f0600480360360408110156101da57600080fd5b506001600160a01b0381351690602001356104df565b604080519115158252519081900360200190f35b61020c610534565b60408051918252519081900360200190f35b6101f06004803603606081101561023457600080fd5b506001600160a01b0381358116916020810135909116906040013561053a565b61020c610725565b610264610749565b6040805160ff9092168252519081900360200190f35b61020c61074e565b6101f06004803603604081101561029857600080fd5b506001600160a01b0381351690602001356107ae565b6102da600480360360408110156102c457600080fd5b506001600160a01b038135169060200135610835565b005b61014f610957565b6102da600480360360208110156102fa57600080fd5b50356001600160a01b0316610974565b61020c6004803603602081101561032057600080fd5b50356001600160a01b0316610a12565b61020c6004803603602081101561034657600080fd5b50356001600160a01b0316610a24565b61014f610a36565b6102da6004803603602081101561037457600080fd5b50356001600160a01b0316610a55565b6102da6004803603604081101561039a57600080fd5b506001600160a01b038135169060200135610af2565b6101f0600480360360408110156103c657600080fd5b506001600160a01b038135169060200135610c84565b6101f0600480360360408110156103f257600080fd5b506001600160a01b038135169060200135610d55565b61020c6004803603602081101561041e57600080fd5b50356001600160a01b0316610e7a565b61020c610e8c565b6102da600480360360e081101561044c57600080fd5b506001600160a01b03813581169160208101359091169060408101359060608101359060ff6080820135169060a08101359060c00135610eb0565b61020c6004803603604081101561049d57600080fd5b506001600160a01b0381358116916020013516611134565b6040518060400160405280600e81526020016d2230b49029ba30b13632b1b7b4b760911b81525081565b3360008181526003602090815260408083206001600160a01b03871680855290835281842086905581518681529151939490939092600080516020611259833981519152928290030190a35060015b92915050565b60015481565b60006001600160a01b0383161580159061055d57506001600160a01b0383163014155b6105a4576040805162461bcd60e51b81526020600482015260136024820152724461692f696e76616c69642d6164647265737360681b604482015290519081900360640190fd5b6001600160a01b0384166000908152600260205260409020548281101561060d576040805162461bcd60e51b81526020600482015260186024820152774461692f696e73756666696369656e742d62616c616e636560401b604482015290519081900360640190fd5b6001600160a01b03851633146106c7576001600160a01b038516600090815260036020908152604080832033845290915290205460001981146106c5578381101561069c576040805162461bcd60e51b815260206004820152601a6024820152794461692f696e73756666696369656e742d616c6c6f77616e636560301b604482015290519081900360640190fd5b6001600160a01b0386166000908152600360209081526040808320338452909152902084820390555b505b6001600160a01b038086166000818152600260209081526040808320888703905593881680835291849020805488019055835187815293519193600080516020611239833981519152929081900390910190a3506001949350505050565b7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b601281565b6000467f000000000000000000000000000000000000000000000000000000000000000a81146107865761078181611151565b6107a8565b7fc7bbf40a5fb081e6759d5d0ce2447e84427793536887332b932877b94ce51bd65b91505090565b3360009081526003602090815260408083206001600160a01b038616845290915281205481906107de9084611228565b3360008181526003602090815260408083206001600160a01b038a16808552908352928190208590558051858152905194955091936000805160206112598339815191529281900390910190a35060019392505050565b3360009081526020819052604090205460011461088e576040805162461bcd60e51b815260206004820152601260248201527111185a4bdb9bdd0b585d5d1a1bdc9a5e995960721b604482015290519081900360640190fd5b6001600160a01b038216158015906108af57506001600160a01b0382163014155b6108f6576040805162461bcd60e51b81526020600482015260136024820152724461692f696e76616c69642d6164647265737360681b604482015290519081900360640190fd5b6001600160a01b03821660009081526002602052604090208054820190556001546109219082611228565b6001556040805182815290516001600160a01b038416916000916000805160206112398339815191529181900360200190a35050565b604051806040016040528060018152602001601960f91b81525081565b336000908152602081905260409020546001146109cd576040805162461bcd60e51b815260206004820152601260248201527111185a4bdb9bdd0b585d5d1a1bdc9a5e995960721b604482015290519081900360640190fd5b6001600160a01b03811660008181526020819052604080822060019055517fdd0e34038ac38b2a1ce960229778ac48a8719bc900b6c4f8d0475c6e8b385a609190a250565b60026020526000908152604090205481565b60046020526000908152604090205481565b6040518060400160405280600381526020016244414960e81b81525081565b33600090815260208190526040902054600114610aae576040805162461bcd60e51b815260206004820152601260248201527111185a4bdb9bdd0b585d5d1a1bdc9a5e995960721b604482015290519081900360640190fd5b6001600160a01b038116600081815260208190526040808220829055517f184450df2e323acec0ed3b5c7531b81f9b4cdef7914dfd4c0a4317416bb5251b9190a250565b6001600160a01b03821660009081526002602052604090205481811015610b5b576040805162461bcd60e51b81526020600482015260186024820152774461692f696e73756666696369656e742d62616c616e636560401b604482015290519081900360640190fd5b6001600160a01b0383163314801590610b84575033600090815260208190526040902054600114155b15610c33576001600160a01b03831660009081526003602090815260408083203384529091529020546000198114610c315782811015610c08576040805162461bcd60e51b815260206004820152601a6024820152794461692f696e73756666696369656e742d616c6c6f77616e636560301b604482015290519081900360640190fd5b6001600160a01b0384166000908152600360209081526040808320338452909152902083820390555b505b6001600160a01b0383166000818152600260209081526040808320868603905560018054879003905580518681529051929392600080516020611239833981519152929181900390910190a3505050565b3360009081526003602090815260408083206001600160a01b038616845290915281205482811015610cfa576040805162461bcd60e51b815260206004820152601a6024820152794461692f696e73756666696369656e742d616c6c6f77616e636560301b604482015290519081900360640190fd5b3360008181526003602090815260408083206001600160a01b03891680855290835292819020948790039485905580518581529051929392600080516020611259833981519152929181900390910190a35060019392505050565b60006001600160a01b03831615801590610d7857506001600160a01b0383163014155b610dbf576040805162461bcd60e51b81526020600482015260136024820152724461692f696e76616c69642d6164647265737360681b604482015290519081900360640190fd5b3360009081526002602052604090205482811015610e1f576040805162461bcd60e51b81526020600482015260186024820152774461692f696e73756666696369656e742d62616c616e636560401b604482015290519081900360640190fd5b33600081815260026020908152604080832087860390556001600160a01b0388168084529281902080548801905580518781529051929392600080516020611239833981519152929181900390910190a35060019392505050565b60006020819052908152604090205481565b7f000000000000000000000000000000000000000000000000000000000000000a81565b83421115610efa576040805162461bcd60e51b815260206004820152601260248201527111185a4bdc195c9b5a5d0b595e1c1a5c995960721b604482015290519081900360640190fd5b4660007f000000000000000000000000000000000000000000000000000000000000000a8214610f3257610f2d82611151565b610f54565b7fc7bbf40a5fb081e6759d5d0ce2447e84427793536887332b932877b94ce51bd65b6001600160a01b03808b1660008181526004602090815260409182902080546001810190915582517f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981840152808401859052948e166060860152608085018d905260a085015260c08085018c90528251808603909101815260e08501835280519082012061190160f01b6101008601526101028501959095526101228085019590955281518085039095018552610142909301905282519290910191909120915015801590611098575060018186868660405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa158015611079573d6000803e3d6000fd5b505050602060405103516001600160a01b0316896001600160a01b0316145b6110de576040805162461bcd60e51b815260206004820152601260248201527111185a4bda5b9d985b1a590b5c195c9b5a5d60721b604482015290519081900360640190fd5b6001600160a01b03808a166000818152600360209081526040808320948d16808452948252918290208b905581518b815291516000805160206112598339815191529281900390910190a3505050505050505050565b600360209081526000928352604080842090915290825290205481565b604080518082018252600e81526d2230b49029ba30b13632b1b7b4b760911b6020918201528151808301835260018152601960f91b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527f0b1461ddc0c1d5ded79a1db0f74dae949050a7c0b28728c724b24958c27a328b818401527fad7c5bef027816a800da1736444fb58a807ef4c9603b7848673f7e3a68eb14a5606082015260808101939093523060a0808501919091528251808503909101815260c0909301909152815191012090565b8082018281101561052e57600080fdfeddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a26469706673582212204174ca7efe9461957e50debebcf436a7f5badaf0bd4b64389fd2735d2369a5b264736f6c63430007060033'
const ERC20_ABI = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_spender',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'approve',
		outputs: [
			{
				name: 'success',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_from',
				type: 'address',
			},
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [
			{
				name: 'success',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '',
				type: 'address',
			},
		],
		name: 'balances',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [
			{
				name: '',
				type: 'uint8',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '',
				type: 'address',
			},
			{
				name: '',
				type: 'address',
			},
		],
		name: 'allowed',
		outputs: [
			{
				name: '',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
		],
		name: 'balanceOf',
		outputs: [
			{
				name: 'balance',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{
				name: '_to',
				type: 'address',
			},
			{
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'transfer',
		outputs: [
			{
				name: 'success',
				type: 'bool',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{
				name: '_owner',
				type: 'address',
			},
			{
				name: '_spender',
				type: 'address',
			},
		],
		name: 'allowance',
		outputs: [
			{
				name: 'remaining',
				type: 'uint256',
			},
		],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				name: '_initialAmount',
				type: 'uint256',
			},
			{
				name: '_tokenName',
				type: 'string',
			},
			{
				name: '_decimalUnits',
				type: 'uint8',
			},
			{
				name: '_tokenSymbol',
				type: 'string',
			},
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_from',
				type: 'address',
			},
			{
				indexed: true,
				name: '_to',
				type: 'address',
			},
			{
				indexed: false,
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: '_owner',
				type: 'address',
			},
			{
				indexed: true,
				name: '_spender',
				type: 'address',
			},
			{
				indexed: false,
				name: '_value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
] as const

describe('contractHandler', () => {
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
		// test contract call
		expect(
			await contractHandler(client)({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [ERC20_ADDRESS],
				to: ERC20_ADDRESS,
				gas: 16784800n,
			}),
		).toEqual({
			data: 0n,
			rawData:
				'0x0000000000000000000000000000000000000000000000000000000000000000',
			executionGasUsed: 2447n,
			selfdestruct: new Set(),
			gas: 16782353n,
			logs: [],
			createdAddresses: new Set(),
		})
	})

	it('should handle errors returned during contract call', async () => {
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
		// test contract call that should fail from lack of owning any tokens
		const caller = `0x${'23'.repeat(20)}` as const
		expect(
			await contractHandler(client)({
				abi: ERC20_ABI,
				functionName: 'transferFrom',
				args: [caller, caller, 1n],
				to: ERC20_ADDRESS,
				throwOnFail: false,
			}),
		).toMatchSnapshot()
	})

	it('should handle a contract not existing', async () => {
		const client = createBaseClient()
		const caller = `0x${'23'.repeat(20)}` as const
		expect(
			await contractHandler(client)({
				abi: ERC20_ABI,
				functionName: 'transferFrom',
				args: [caller, caller, 1n],
				to: ERC20_ADDRESS,
				value: 420n,
				throwOnFail: false,
			}),
		).toEqual({
			...({} as { data: never }),
			errors: [
				{
					_tag: 'InvalidRequestError',
					message:
						'Contract at address 0x3333333333333333333333333333333333333333 does not exist',
					name: 'InvalidRequestError',
				},
			],
			executionGasUsed: 0n,
			rawData: '0x',
		})
	})

	it('should handle the EVM unexpectedly throwing', async () => {
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
		vm.evm.runCall = () => {
			throw new Error('Unexpected error')
		}
		const caller = `0x${'23'.repeat(20)}` as const
		expect(
			await contractHandler(client)({
				abi: ERC20_ABI,
				functionName: 'transferFrom',
				args: [caller, caller, 1n],
				to: ERC20_ADDRESS,
				value: 420n,
				createTransaction: true,
				throwOnFail: false,
			}),
		).toEqual({
			...({} as { data: never }),
			errors: [
				{
					_tag: 'UnexpectedError',
					message: 'Unexpected error',
					name: 'UnexpectedError',
				},
			],
			executionGasUsed: 0n,
			rawData: '0x',
		})
	})

	it('should handle the invalid contract params', async () => {
		const client = createBaseClient()
		// deploy contract
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
					throwOnFail: false,
				})
			).errors,
		).toBeUndefined()

		expect(
			await contractHandler(client)({
				throwOnFail: false,
			} as any),
		).toEqual({
			...({} as { data: never }),
			errors: [
				{
					_tag: 'InvalidAbiError',
					message: 'InvalidAbiError: Required',
					name: 'InvalidAbiError',
				},

				{
					_tag: 'InvalidFunctionNameError',
					...{ input: 'undefined' },
					message: 'InvalidFunctionNameError: Required',
					name: 'InvalidFunctionNameError',
				},
				{
					_tag: 'InvalidAddressError',
					message: 'InvalidAddressError: Required',
					name: 'InvalidAddressError',
				},
			],
			executionGasUsed: 0n,
			rawData: '0x',
		})
	})

	it('Handles the unlikely event the function data cannot be decoded', async () => {
		const client = createBaseClient()
		const vm = await client.getVm()
		const originalRunCall = vm.evm.runCall.bind(vm.evm)
		vm.evm.runCall = async function(args) {
			const originalResult = await originalRunCall(args)
			return {
				...originalResult,
				execResult: {
					...originalResult.execResult,
					returnValue: hexToBytes('0x42424242'),
				},
			}
		}
		// deploy contract
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()
		// test contract call
		expect(
			await contractHandler(client)({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [ERC20_ADDRESS],
				to: ERC20_ADDRESS,
				gas: 5000n,
				createTransaction: true,
				throwOnFail: false,
			}),
		).toMatchSnapshot()
	})

	it('Handls function data not being encodable', async () => {
		const client = createBaseClient()
		// deploy contract
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
					throwOnFail: false,
				})
			).errors,
		).toBeUndefined()
		// test contract call
		expect(
			await contractHandler(client)({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: ['not correct type' as any],
				to: ERC20_ADDRESS,
				gas: 16784800n,
				throwOnFail: false,
			}),
		).toMatchSnapshot()
	})
	it('should handle a rever with a helpful revert message', async () => {
		const caller = `0x${'1'.repeat(40)}` as const
		const recipient = `0x${'2'.repeat(40)}` as const
		const amount = BigInt(1e18)
		const token = `0x${'3'.repeat(40)}` as const
		const client = createBaseClient()

		const vm = await client.getVm()

		// Set the token contract
		await setAccountHandler({ getVm: async () => vm } as any)({
			address: token,
			deployedBytecode: MOCKERC20_BYTECODE,
		})

		// No matter if the transaction should succeed or fail, it will throw the same error:
		// `TypeError: Cannot read properties of undefined (reading 'join')`
		// at `@tevm/actions/src/tevm/contractHandler.js:37`
		const { errors } = await contractHandler(client)({
			caller,
			to: token,
			abi: MOCKERC20_ABI,
			// Replace this:
			functionName: 'transfer',
			// ...  with one of these and it should work:
			// functionName: 'mint',
			// functionName: 'approve',
			args: [recipient, amount],
			throwOnFail: false,
		})

		expect(errors).toHaveLength(1)
		const [error] = errors as [ContractError]
		expect(error._tag).toBe('revert')
		expect(error.name).toBe('revert')
		expect(error.message).toBe(
			'Revert: InsufficientBalance {"abiItem":{"inputs":[],"name":"InsufficientBalance","type":"error"},"errorName":"InsufficientBalance"}',
		)
	})
	it('should be able to debug a reverting call with a trace', async () => {
		const caller = `0x${'1'.repeat(40)}` as const
		const recipient = `0x${'2'.repeat(40)}` as const
		const amount = BigInt(1e18)
		const token = `0x${'3'.repeat(40)}` as const
		const client = createBaseClient()

		// Set the token contract
		await setAccountHandler(client)({
			address: token,
			deployedBytecode: MOCKERC20_BYTECODE,
		})

		const { errors, trace } = await contractHandler(client)({
			createTrace: true,
			caller,
			to: token,
			abi: MOCKERC20_ABI,
			// Replace this:
			functionName: 'transfer',
			// ...  with one of these and it should work:
			// functionName: 'mint',
			// functionName: 'approve',
			args: [recipient, amount],
			throwOnFail: false,
		})

		expect(errors).toHaveLength(1)
		const [error] = errors as [ContractError]
		expect(error._tag).toBe('revert')
		expect(error.name).toBe('revert')
		expect(error.message).toBe(
			'Revert: InsufficientBalance {"abiItem":{"inputs":[],"name":"InsufficientBalance","type":"error"},"errorName":"InsufficientBalance"}',
		)
		expect(trace).toEqual({
			"failed": true,
			"gas": 2563n,
			"returnValue": "0xf4d678b8",
			"structLogs": [
				{
					"depth": 0,
					"gas": 16777215n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 0,
					"stack": [],
				},
				{
					"depth": 0,
					"gas": 16777212n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 2,
					"stack": [
						"0x80",
					],
				},
				{
					"depth": 0,
					"gas": 16777209n,
					"gasCost": 15n,
					"op": "MSTORE",
					"pc": 4,
					"stack": [
						"0x80",
						"0x40",
					],
				},
				{
					"depth": 0,
					"gas": 16777197n,
					"gasCost": 4n,
					"op": "CALLVALUE",
					"pc": 5,
					"stack": [],
				},
				{
					"depth": 0,
					"gas": 16777195n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 6,
					"stack": [
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777192n,
					"gasCost": 6n,
					"op": "ISZERO",
					"pc": 7,
					"stack": [
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777189n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 8,
					"stack": [
						"0x0",
						"0x1",
					],
				},
				{
					"depth": 0,
					"gas": 16777186n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 11,
					"stack": [
						"0x0",
						"0x1",
						"0x10",
					],
				},
				{
					"depth": 0,
					"gas": 16777176n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 16,
					"stack": [
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777175n,
					"gasCost": 4n,
					"op": "POP",
					"pc": 17,
					"stack": [
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777173n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 18,
					"stack": [],
				},
				{
					"depth": 0,
					"gas": 16777170n,
					"gasCost": 4n,
					"op": "CALLDATASIZE",
					"pc": 20,
					"stack": [
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16777168n,
					"gasCost": 6n,
					"op": "LT",
					"pc": 21,
					"stack": [
						"0x4",
						"0x44",
					],
				},
				{
					"depth": 0,
					"gas": 16777165n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 22,
					"stack": [
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777162n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 25,
					"stack": [
						"0x0",
						"0xcf",
					],
				},
				{
					"depth": 0,
					"gas": 16777152n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 26,
					"stack": [],
				},
				{
					"depth": 0,
					"gas": 16777149n,
					"gasCost": 6n,
					"op": "CALLDATALOAD",
					"pc": 28,
					"stack": [
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777146n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 29,
					"stack": [
						"0xa9059cbb00000000000000000000000022222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16777143n,
					"gasCost": 6n,
					"op": "SHR",
					"pc": 31,
					"stack": [
						"0xa9059cbb00000000000000000000000022222222222222222222222222222222",
						"0xe0",
					],
				},
				{
					"depth": 0,
					"gas": 16777140n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 32,
					"stack": [
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777137n,
					"gasCost": 6n,
					"op": "PUSH4",
					"pc": 33,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777134n,
					"gasCost": 6n,
					"op": "GT",
					"pc": 38,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
						"0x40c10f19",
					],
				},
				{
					"depth": 0,
					"gas": 16777131n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 39,
					"stack": [
						"0xa9059cbb",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777128n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 42,
					"stack": [
						"0xa9059cbb",
						"0x0",
						"0x8c",
					],
				},
				{
					"depth": 0,
					"gas": 16777118n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 43,
					"stack": [
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777115n,
					"gasCost": 6n,
					"op": "PUSH4",
					"pc": 44,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777112n,
					"gasCost": 6n,
					"op": "GT",
					"pc": 49,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
						"0x95d89b41",
					],
				},
				{
					"depth": 0,
					"gas": 16777109n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 50,
					"stack": [
						"0xa9059cbb",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777106n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 53,
					"stack": [
						"0xa9059cbb",
						"0x0",
						"0x66",
					],
				},
				{
					"depth": 0,
					"gas": 16777096n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 54,
					"stack": [
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777093n,
					"gasCost": 6n,
					"op": "PUSH4",
					"pc": 55,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777090n,
					"gasCost": 6n,
					"op": "EQ",
					"pc": 60,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
						"0x95d89b41",
					],
				},
				{
					"depth": 0,
					"gas": 16777087n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 61,
					"stack": [
						"0xa9059cbb",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777084n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 64,
					"stack": [
						"0xa9059cbb",
						"0x0",
						"0x1ba",
					],
				},
				{
					"depth": 0,
					"gas": 16777074n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 65,
					"stack": [
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777071n,
					"gasCost": 6n,
					"op": "PUSH4",
					"pc": 66,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777068n,
					"gasCost": 6n,
					"op": "EQ",
					"pc": 71,
					"stack": [
						"0xa9059cbb",
						"0xa9059cbb",
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777065n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 72,
					"stack": [
						"0xa9059cbb",
						"0x1",
					],
				},
				{
					"depth": 0,
					"gas": 16777062n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 75,
					"stack": [
						"0xa9059cbb",
						"0x1",
						"0x1d9",
					],
				},
				{
					"depth": 0,
					"gas": 16777052n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 473,
					"stack": [
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777051n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 474,
					"stack": [
						"0xa9059cbb",
					],
				},
				{
					"depth": 0,
					"gas": 16777048n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 477,
					"stack": [
						"0xa9059cbb",
						"0x105",
					],
				},
				{
					"depth": 0,
					"gas": 16777045n,
					"gasCost": 4n,
					"op": "CALLDATASIZE",
					"pc": 480,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
					],
				},
				{
					"depth": 0,
					"gas": 16777043n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 481,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
					],
				},
				{
					"depth": 0,
					"gas": 16777040n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 483,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16777037n,
					"gasCost": 16n,
					"op": "JUMP",
					"pc": 486,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x6d4",
					],
				},
				{
					"depth": 0,
					"gas": 16777029n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 1748,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16777028n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1749,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16777025n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 1751,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777022n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1752,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777019n,
					"gasCost": 6n,
					"op": "DUP4",
					"pc": 1754,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x40",
					],
				},
				{
					"depth": 0,
					"gas": 16777016n,
					"gasCost": 6n,
					"op": "DUP6",
					"pc": 1755,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x40",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16777013n,
					"gasCost": 6n,
					"op": "SUB",
					"pc": 1756,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x40",
						"0x4",
						"0x44",
					],
				},
				{
					"depth": 0,
					"gas": 16777010n,
					"gasCost": 6n,
					"op": "SLT",
					"pc": 1757,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x40",
						"0x40",
					],
				},
				{
					"depth": 0,
					"gas": 16777007n,
					"gasCost": 6n,
					"op": "ISZERO",
					"pc": 1758,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16777004n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 1759,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x1",
					],
				},
				{
					"depth": 0,
					"gas": 16777001n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 1762,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x1",
						"0x6e7",
					],
				},
				{
					"depth": 0,
					"gas": 16776991n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 1767,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776990n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 1768,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776987n,
					"gasCost": 6n,
					"op": "DUP4",
					"pc": 1771,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
					],
				},
				{
					"depth": 0,
					"gas": 16776984n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 1772,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16776981n,
					"gasCost": 16n,
					"op": "JUMP",
					"pc": 1775,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x6b8",
					],
				},
				{
					"depth": 0,
					"gas": 16776973n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 1720,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16776972n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 1721,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16776969n,
					"gasCost": 6n,
					"op": "CALLDATALOAD",
					"pc": 1722,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16776966n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1723,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776963n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1725,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x1",
					],
				},
				{
					"depth": 0,
					"gas": 16776960n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1727,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x1",
						"0x1",
					],
				},
				{
					"depth": 0,
					"gas": 16776957n,
					"gasCost": 6n,
					"op": "SHL",
					"pc": 1729,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x1",
						"0x1",
						"0xa0",
					],
				},
				{
					"depth": 0,
					"gas": 16776954n,
					"gasCost": 6n,
					"op": "SUB",
					"pc": 1730,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x1",
						"0x10000000000000000000000000000000000000000",
					],
				},
				{
					"depth": 0,
					"gas": 16776951n,
					"gasCost": 6n,
					"op": "DUP2",
					"pc": 1731,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0xffffffffffffffffffffffffffffffffffffffff",
					],
				},
				{
					"depth": 0,
					"gas": 16776948n,
					"gasCost": 6n,
					"op": "AND",
					"pc": 1732,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0xffffffffffffffffffffffffffffffffffffffff",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776945n,
					"gasCost": 6n,
					"op": "DUP2",
					"pc": 1733,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776942n,
					"gasCost": 6n,
					"op": "EQ",
					"pc": 1734,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x2222222222222222222222222222222222222222",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776939n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 1735,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x1",
					],
				},
				{
					"depth": 0,
					"gas": 16776936n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 1738,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
						"0x1",
						"0x6cf",
					],
				},
				{
					"depth": 0,
					"gas": 16776926n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 1743,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776925n,
					"gasCost": 6n,
					"op": "SWAP2",
					"pc": 1744,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x6f0",
						"0x4",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776922n,
					"gasCost": 6n,
					"op": "SWAP1",
					"pc": 1745,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x2222222222222222222222222222222222222222",
						"0x4",
						"0x6f0",
					],
				},
				{
					"depth": 0,
					"gas": 16776919n,
					"gasCost": 4n,
					"op": "POP",
					"pc": 1746,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x2222222222222222222222222222222222222222",
						"0x6f0",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16776917n,
					"gasCost": 16n,
					"op": "JUMP",
					"pc": 1747,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x2222222222222222222222222222222222222222",
						"0x6f0",
					],
				},
				{
					"depth": 0,
					"gas": 16776909n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 1776,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776908n,
					"gasCost": 6n,
					"op": "SWAP5",
					"pc": 1777,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x1e7",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x2222222222222222222222222222222222222222",
					],
				},
				{
					"depth": 0,
					"gas": 16776905n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1778,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x1e7",
					],
				},
				{
					"depth": 0,
					"gas": 16776902n,
					"gasCost": 6n,
					"op": "SWAP4",
					"pc": 1780,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0x44",
						"0x4",
						"0x0",
						"0x0",
						"0x1e7",
						"0x20",
					],
				},
				{
					"depth": 0,
					"gas": 16776899n,
					"gasCost": 6n,
					"op": "SWAP1",
					"pc": 1781,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0x44",
						"0x20",
						"0x0",
						"0x0",
						"0x1e7",
						"0x4",
					],
				},
				{
					"depth": 0,
					"gas": 16776896n,
					"gasCost": 6n,
					"op": "SWAP4",
					"pc": 1782,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0x44",
						"0x20",
						"0x0",
						"0x0",
						"0x4",
						"0x1e7",
					],
				},
				{
					"depth": 0,
					"gas": 16776893n,
					"gasCost": 6n,
					"op": "ADD",
					"pc": 1783,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0x44",
						"0x1e7",
						"0x0",
						"0x0",
						"0x4",
						"0x20",
					],
				},
				{
					"depth": 0,
					"gas": 16776890n,
					"gasCost": 6n,
					"op": "CALLDATALOAD",
					"pc": 1784,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0x44",
						"0x1e7",
						"0x0",
						"0x0",
						"0x24",
					],
				},
				{
					"depth": 0,
					"gas": 16776887n,
					"gasCost": 6n,
					"op": "SWAP4",
					"pc": 1785,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0x44",
						"0x1e7",
						"0x0",
						"0x0",
						"0xde0b6b3a7640000",
					],
				},
				{
					"depth": 0,
					"gas": 16776884n,
					"gasCost": 4n,
					"op": "POP",
					"pc": 1786,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x1e7",
						"0x0",
						"0x0",
						"0x44",
					],
				},
				{
					"depth": 0,
					"gas": 16776882n,
					"gasCost": 4n,
					"op": "POP",
					"pc": 1787,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x1e7",
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776880n,
					"gasCost": 4n,
					"op": "POP",
					"pc": 1788,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x1e7",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776878n,
					"gasCost": 16n,
					"op": "JUMP",
					"pc": 1789,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x1e7",
					],
				},
				{
					"depth": 0,
					"gas": 16776870n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 487,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
					],
				},
				{
					"depth": 0,
					"gas": 16776869n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 488,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
					],
				},
				{
					"depth": 0,
					"gas": 16776866n,
					"gasCost": 16n,
					"op": "JUMP",
					"pc": 491,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x3e7",
					],
				},
				{
					"depth": 0,
					"gas": 16776858n,
					"gasCost": 2n,
					"op": "JUMPDEST",
					"pc": 999,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
					],
				},
				{
					"depth": 0,
					"gas": 16776857n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1000,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
					],
				},
				{
					"depth": 0,
					"gas": 16776854n,
					"gasCost": 6n,
					"op": "PUSH4",
					"pc": 1002,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776851n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1007,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x87a211a2",
					],
				},
				{
					"depth": 0,
					"gas": 16776848n,
					"gasCost": 6n,
					"op": "MSTORE",
					"pc": 1009,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x87a211a2",
						"0xc",
					],
				},
				{
					"depth": 0,
					"gas": 16776845n,
					"gasCost": 4n,
					"op": "CALLER",
					"pc": 1010,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776843n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1011,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x1111111111111111111111111111111111111111",
					],
				},
				{
					"depth": 0,
					"gas": 16776840n,
					"gasCost": 6n,
					"op": "MSTORE",
					"pc": 1013,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x1111111111111111111111111111111111111111",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776837n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1014,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16776834n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1016,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x20",
					],
				},
				{
					"depth": 0,
					"gas": 16776831n,
					"gasCost": 66n,
					"op": "KECCAK256",
					"pc": 1018,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x20",
						"0xc",
					],
				},
				{
					"depth": 0,
					"gas": 16776795n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 1019,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
					],
				},
				{
					"depth": 0,
					"gas": 16776792n,
					"gasCost": 2100n,
					"op": "SLOAD",
					"pc": 1020,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
					],
				},
				{
					"depth": 0,
					"gas": 16774692n,
					"gasCost": 6n,
					"op": "DUP1",
					"pc": 1021,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16774689n,
					"gasCost": 6n,
					"op": "DUP5",
					"pc": 1022,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16774686n,
					"gasCost": 6n,
					"op": "GT",
					"pc": 1023,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0x0",
						"0xde0b6b3a7640000",
					],
				},
				{
					"depth": 0,
					"gas": 16774683n,
					"gasCost": 6n,
					"op": "ISZERO",
					"pc": 1024,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0x1",
					],
				},
				{
					"depth": 0,
					"gas": 16774680n,
					"gasCost": 6n,
					"op": "PUSH2",
					"pc": 1025,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16774677n,
					"gasCost": 20n,
					"op": "JUMPI",
					"pc": 1028,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0x0",
						"0x412",
					],
				},
				{
					"depth": 0,
					"gas": 16774667n,
					"gasCost": 6n,
					"op": "PUSH4",
					"pc": 1029,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16774664n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1034,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0xf4d678b8",
					],
				},
				{
					"depth": 0,
					"gas": 16774661n,
					"gasCost": 6n,
					"op": "MSTORE",
					"pc": 1036,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0xf4d678b8",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16774658n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1037,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
					],
				},
				{
					"depth": 0,
					"gas": 16774655n,
					"gasCost": 6n,
					"op": "PUSH1",
					"pc": 1039,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0x4",
					],
				},
				{
					"depth": 0,
					"error": {
						"error": "revert",
						"errorType": "EvmError",
					},
					"gas": 16774652n,
					"gasCost": 0n,
					"op": "REVERT",
					"pc": 1041,
					"stack": [
						"0xa9059cbb",
						"0x105",
						"0x2222222222222222222222222222222222222222",
						"0xde0b6b3a7640000",
						"0x0",
						"0x9997d51b74a3fde17e56becb3912f358d0629006aafa83c01147270cff8b2254",
						"0x0",
						"0x4",
						"0x1c",
					],
				},
			],
		}
		)
	})
})
