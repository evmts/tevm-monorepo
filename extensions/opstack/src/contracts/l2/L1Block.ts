/// Generated file. Do not edit.

import { createScript } from '@tevm/contract'
import { type Hex } from '@tevm/utils'

/**
 * Creates a L1Block contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1Block } from '@tevm/opstack'
 * const L1Block = createL1Block()
 */
export const createL1Block = (chainId: 10 = 10) =>
	createScript({
		name: 'L1Block',
		deployedBytecode: L1BlockDeployedBytecode,
		bytecode: L1BlockBytecode,
		humanReadableAbi: L1BlockHumanReadableAbi,
	}).withAddress(L1BlockAddresses[chainId])

export const L1BlockAddresses = {
	'10': '0x4200000000000000000000000000000000000015',
} as const

export const L1BlockBytecode =
	'0x608060405234801561001057600080fd5b5061053e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80638381f58a11610097578063c598591811610066578063c598591814610229578063e591b28214610249578063e81b2c6d14610289578063f82061401461029257600080fd5b80638381f58a146101e35780638b239f73146101f75780639e8c496614610200578063b80777ea1461020957600080fd5b806354fd4d50116100d357806354fd4d50146101335780635cf249691461017c57806364ca23ef1461018557806368d5dca6146101b257600080fd5b8063015d8eb9146100fa57806309bd5a601461010f578063440a5e201461012b575b600080fd5b61010d61010836600461044c565b61029b565b005b61011860025481565b6040519081526020015b60405180910390f35b61010d6103da565b61016f6040518060400160405280600581526020017f312e322e3000000000000000000000000000000000000000000000000000000081525081565b60405161012291906104be565b61011860015481565b6003546101999067ffffffffffffffff1681565b60405167ffffffffffffffff9091168152602001610122565b6003546101ce9068010000000000000000900463ffffffff1681565b60405163ffffffff9091168152602001610122565b6000546101999067ffffffffffffffff1681565b61011860055481565b61011860065481565b6000546101999068010000000000000000900467ffffffffffffffff1681565b6003546101ce906c01000000000000000000000000900463ffffffff1681565b61026473deaddeaddeaddeaddeaddeaddeaddeaddead000181565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610122565b61011860045481565b61011860075481565b3373deaddeaddeaddeaddeaddeaddeaddeaddead000114610342576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603b60248201527f4c31426c6f636b3a206f6e6c7920746865206465706f7369746f72206163636f60448201527f756e742063616e20736574204c3120626c6f636b2076616c7565730000000000606482015260840160405180910390fd5b6000805467ffffffffffffffff98891668010000000000000000027fffffffffffffffffffffffffffffffff00000000000000000000000000000000909116998916999099179890981790975560019490945560029290925560038054919094167fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000009190911617909255600491909155600555600655565b3373deaddeaddeaddeaddeaddeaddeaddeaddead00011461040357633cc50b456000526004601cfd5b60043560801c60035560143560801c600055602435600155604435600755606435600255608435600455565b803567ffffffffffffffff8116811461044757600080fd5b919050565b600080600080600080600080610100898b03121561046957600080fd5b6104728961042f565b975061048060208a0161042f565b9650604089013595506060890135945061049c60808a0161042f565b979a969950949793969560a0850135955060c08501359460e001359350915050565b600060208083528351808285015260005b818110156104eb578581018301518582016040015282016104cf565b818111156104fd576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01692909201604001939250505056fea164736f6c634300080f000a' as Hex

export const L1BlockDeployedBytecode =
	'0x608060405234801561001057600080fd5b50600436106100f55760003560e01c80638381f58a11610097578063c598591811610066578063c598591814610229578063e591b28214610249578063e81b2c6d14610289578063f82061401461029257600080fd5b80638381f58a146101e35780638b239f73146101f75780639e8c496614610200578063b80777ea1461020957600080fd5b806354fd4d50116100d357806354fd4d50146101335780635cf249691461017c57806364ca23ef1461018557806368d5dca6146101b257600080fd5b8063015d8eb9146100fa57806309bd5a601461010f578063440a5e201461012b575b600080fd5b61010d61010836600461044c565b61029b565b005b61011860025481565b6040519081526020015b60405180910390f35b61010d6103da565b61016f6040518060400160405280600581526020017f312e322e3000000000000000000000000000000000000000000000000000000081525081565b60405161012291906104be565b61011860015481565b6003546101999067ffffffffffffffff1681565b60405167ffffffffffffffff9091168152602001610122565b6003546101ce9068010000000000000000900463ffffffff1681565b60405163ffffffff9091168152602001610122565b6000546101999067ffffffffffffffff1681565b61011860055481565b61011860065481565b6000546101999068010000000000000000900467ffffffffffffffff1681565b6003546101ce906c01000000000000000000000000900463ffffffff1681565b61026473deaddeaddeaddeaddeaddeaddeaddeaddead000181565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610122565b61011860045481565b61011860075481565b3373deaddeaddeaddeaddeaddeaddeaddeaddead000114610342576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603b60248201527f4c31426c6f636b3a206f6e6c7920746865206465706f7369746f72206163636f60448201527f756e742063616e20736574204c3120626c6f636b2076616c7565730000000000606482015260840160405180910390fd5b6000805467ffffffffffffffff98891668010000000000000000027fffffffffffffffffffffffffffffffff00000000000000000000000000000000909116998916999099179890981790975560019490945560029290925560038054919094167fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000009190911617909255600491909155600555600655565b3373deaddeaddeaddeaddeaddeaddeaddeaddead00011461040357633cc50b456000526004601cfd5b60043560801c60035560143560801c600055602435600155604435600755606435600255608435600455565b803567ffffffffffffffff8116811461044757600080fd5b919050565b600080600080600080600080610100898b03121561046957600080fd5b6104728961042f565b975061048060208a0161042f565b9650604089013595506060890135945061049c60808a0161042f565b979a969950949793969560a0850135955060c08501359460e001359350915050565b600060208083528351808285015260005b818110156104eb578581018301518582016040015282016104cf565b818111156104fd576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01692909201604001939250505056fea164736f6c634300080f000a' as Hex

export const L1BlockHumanReadableAbi = [
	'function DEPOSITOR_ACCOUNT() view returns (address)',
	'function baseFeeScalar() view returns (uint32)',
	'function basefee() view returns (uint256)',
	'function batcherHash() view returns (bytes32)',
	'function blobBaseFee() view returns (uint256)',
	'function blobBaseFeeScalar() view returns (uint32)',
	'function hash() view returns (bytes32)',
	'function l1FeeOverhead() view returns (uint256)',
	'function l1FeeScalar() view returns (uint256)',
	'function number() view returns (uint64)',
	'function sequenceNumber() view returns (uint64)',
	'function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)',
	'function setL1BlockValuesEcotone()',
	'function timestamp() view returns (uint64)',
	'function version() view returns (string)',
] as const

export const L1BlockAbi = [
	{
		type: 'function',
		name: 'DEPOSITOR_ACCOUNT',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'baseFeeScalar',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint32',
				internalType: 'uint32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'basefee',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'batcherHash',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'blobBaseFee',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'blobBaseFeeScalar',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint32',
				internalType: 'uint32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'hash',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'bytes32',
				internalType: 'bytes32',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'l1FeeOverhead',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'l1FeeScalar',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'number',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint64',
				internalType: 'uint64',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'sequenceNumber',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint64',
				internalType: 'uint64',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'setL1BlockValues',
		inputs: [
			{
				name: '_number',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: '_timestamp',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: '_basefee',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '_hash',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: '_sequenceNumber',
				type: 'uint64',
				internalType: 'uint64',
			},
			{
				name: '_batcherHash',
				type: 'bytes32',
				internalType: 'bytes32',
			},
			{
				name: '_l1FeeOverhead',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: '_l1FeeScalar',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setL1BlockValuesEcotone',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'timestamp',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint64',
				internalType: 'uint64',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'version',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'string',
				internalType: 'string',
			},
		],
		stateMutability: 'view',
	},
] as const
