import { Contract } from './Contract.js'
import { JsonRpcProvider, ethers } from 'ethers'
import { assertType, describe, expect, expectTypeOf, test } from 'vitest'

const abi = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'usr', type: 'address' },
		],
		name: 'Deny',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'usr', type: 'address' },
		],
		name: 'Rely',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [],
		name: 'DOMAIN_SEPARATOR',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'PERMIT_TYPEHASH',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: '', type: 'address' },
			{ internalType: 'address', name: '', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'burn',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
		],
		name: 'decreaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'usr', type: 'address' }],
		name: 'deny',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'deploymentChainId',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'addedValue', type: 'uint256' },
		],
		name: 'increaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'nonces',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
			{ internalType: 'uint256', name: 'deadline', type: 'uint256' },
			{ internalType: 'uint8', name: 'v', type: 'uint8' },
			{ internalType: 'bytes32', name: 'r', type: 'bytes32' },
			{ internalType: 'bytes32', name: 's', type: 'bytes32' },
		],
		name: 'permit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'usr', type: 'address' }],
		name: 'rely',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'version',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'wards',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const

const provider = new JsonRpcProvider('https://mainnet.optimism.io', 10)
const addresses = { 10: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1' } as const

describe('ethers.Contract', () => {
	test('Should be typesafe with return types', async () => {
		const c = new Contract(addresses[10], abi, provider)

		assertType<ethers.Contract>(c)

		expectTypeOf(await c.name()).toBeString()
		expectTypeOf(await c.symbol()).toBeString()
		expectTypeOf(await c.decimals()).toBeNumber()
		assertType<BigInt>(await c.totalSupply({ blockTag: 4061226 }))
	})

	test('Should be typesafe with arguments', async () => {
		const c = new Contract(addresses[10], abi, provider)

		assertType<Parameters<typeof c.totalSupply>>([])
		assertType<Parameters<typeof c.totalSupply>>([
			{ blockTag: 4061226, chainId: 25 },
		])
		assertType<Parameters<typeof c.balanceOf>>([addresses[10]])
		assertType<Parameters<typeof c.balanceOf>>([
			addresses[10],
			{ blockTag: 4061226, chainId: 25 },
		])
		assertType<Parameters<typeof c.mint>>(['0x2342', 234234n])
		assertType<Parameters<typeof c.mint>>([
			'0x234234',
			234234n,
			{
				blockTag: 4061226,
				chainId: 25,
				gasLimit: BigInt(420),
				value: BigInt(420),
			},
		])

		// Types should throw
		// @ts-expect-error
		assertType<Parameters<typeof c.totalSupply>>(['0x234234'])
		// @ts-expect-error
		assertType<Parameters<typeof c.mint>>(['should be an address', BigInt(420)])
	})

	test('should work', async () => {
		const c = new Contract(addresses[10], abi, provider)
		expect(c).toBeInstanceOf(Contract)
		expect(await c.name()).toMatchInlineSnapshot('"Dai Stablecoin"')
		expect(await c.symbol()).toMatchInlineSnapshot('"DAI"')
		expect(await c.decimals()).toMatchInlineSnapshot('18n')
		expect(await c.totalSupply({ blockTag: 4061226 })).toMatchInlineSnapshot(
			'17275834779199905882210256n',
		)
		expect(
			await c.balanceOf('0x32307adfFE088e383AFAa721b06436aDaBA47DBE'),
		).toMatchInlineSnapshot('0n')
	})

	test('should work with custom address', async () => {
		const c = new Contract(addresses[10], abi, provider)
		expect(c).toBeInstanceOf(Contract)
		expect(await c.name()).toMatchInlineSnapshot('"Dai Stablecoin"')
		expect(await c.symbol()).toMatchInlineSnapshot('"DAI"')
		expect(await c.decimals()).toMatchInlineSnapshot('18n')
		expect(await c.totalSupply()).toMatchInlineSnapshot(
			'25806858761345420755837246n',
		)
		expect(
			await c.balanceOf('0x32307adfFE088e383AFAa721b06436aDaBA47DBE'),
		).toMatchInlineSnapshot('0n')
	})
})
