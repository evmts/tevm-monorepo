'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.universalSignatureValidatorAbi =
	exports.smartAccountAbi =
	exports.addressResolverAbi =
	exports.textResolverAbi =
	exports.universalResolverReverseAbi =
	exports.universalResolverResolveAbi =
	exports.multicall3Abi =
		void 0
exports.multicall3Abi = [
	{
		inputs: [
			{
				components: [
					{
						name: 'target',
						type: 'address',
					},
					{
						name: 'allowFailure',
						type: 'bool',
					},
					{
						name: 'callData',
						type: 'bytes',
					},
				],
				name: 'calls',
				type: 'tuple[]',
			},
		],
		name: 'aggregate3',
		outputs: [
			{
				components: [
					{
						name: 'success',
						type: 'bool',
					},
					{
						name: 'returnData',
						type: 'bytes',
					},
				],
				name: 'returnData',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]
const universalResolverErrors = [
	{
		inputs: [],
		name: 'ResolverNotFound',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ResolverWildcardNotSupported',
		type: 'error',
	},
]
exports.universalResolverResolveAbi = [
	...universalResolverErrors,
	{
		name: 'resolve',
		type: 'function',
		stateMutability: 'view',
		inputs: [
			{ name: 'name', type: 'bytes' },
			{ name: 'data', type: 'bytes' },
		],
		outputs: [
			{ name: '', type: 'bytes' },
			{ name: 'address', type: 'address' },
		],
	},
]
exports.universalResolverReverseAbi = [
	...universalResolverErrors,
	{
		name: 'reverse',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ type: 'bytes', name: 'reverseName' }],
		outputs: [
			{ type: 'string', name: 'resolvedName' },
			{ type: 'address', name: 'resolvedAddress' },
			{ type: 'address', name: 'reverseResolver' },
			{ type: 'address', name: 'resolver' },
		],
	},
]
exports.textResolverAbi = [
	{
		name: 'text',
		type: 'function',
		stateMutability: 'view',
		inputs: [
			{ name: 'name', type: 'bytes32' },
			{ name: 'key', type: 'string' },
		],
		outputs: [{ name: '', type: 'string' }],
	},
]
exports.addressResolverAbi = [
	{
		name: 'addr',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: 'name', type: 'bytes32' }],
		outputs: [{ name: '', type: 'address' }],
	},
	{
		name: 'addr',
		type: 'function',
		stateMutability: 'view',
		inputs: [
			{ name: 'name', type: 'bytes32' },
			{ name: 'coinType', type: 'uint256' },
		],
		outputs: [{ name: '', type: 'bytes' }],
	},
]
exports.smartAccountAbi = [
	{
		name: 'isValidSignature',
		type: 'function',
		stateMutability: 'view',
		inputs: [
			{ name: 'hash', type: 'bytes32' },
			{ name: 'signature', type: 'bytes' },
		],
		outputs: [{ name: '', type: 'bytes4' }],
	},
]
exports.universalSignatureValidatorAbi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_signer',
				type: 'address',
			},
			{
				internalType: 'bytes32',
				name: '_hash',
				type: 'bytes32',
			},
			{
				internalType: 'bytes',
				name: '_signature',
				type: 'bytes',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
]
//# sourceMappingURL=abis.js.map
