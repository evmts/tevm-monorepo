import { Contract } from './Contract.js'
import { JsonRpcProvider, ethers } from 'ethers'
import { assertType, describe, expect, expectTypeOf, test } from 'vitest'

const abi = [
	{
		constant: true,
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'from', type: 'address' },
			{ name: 'to', type: 'address' },
			{ name: 'value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'spender', type: 'address' },
			{ name: 'addedValue', type: 'uint256' },
		],
		name: 'increaseAllowance',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'to', type: 'address' },
			{ name: 'value', type: 'uint256' },
		],
		name: 'mint',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: 'owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: false,
		inputs: [{ name: 'account', type: 'address' }],
		name: 'addMinter',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [],
		name: 'renounceMinter',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'spender', type: 'address' },
			{ name: 'subtractedValue', type: 'uint256' },
		],
		name: 'decreaseAllowance',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: 'to', type: 'address' },
			{ name: 'value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		constant: true,
		inputs: [{ name: 'account', type: 'address' }],
		name: 'isMinter',
		outputs: [{ name: '', type: 'bool' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		constant: true,
		inputs: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ name: '', type: 'uint256' }],
		payable: false,
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ name: 'name', type: 'string' },
			{ name: 'symbol', type: 'string' },
			{ name: 'decimals', type: 'uint8' },
		],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'account', type: 'address' }],
		name: 'MinterAdded',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, name: 'account', type: 'address' }],
		name: 'MinterRemoved',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: 'owner', type: 'address' },
			{ indexed: true, name: 'spender', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
		name: 'Approval',
		type: 'event',
	},
] as const

const provider = new JsonRpcProvider('https://goerli.optimism.io', 420)
const addresses = { 420: '0x32307adfFE088e383AFAa721b06436aDaBA47DBE' } as const

describe('ethers.Contract', () => {
	test('Should be typesafe with return types', async () => {
		const c = new Contract(addresses[420], abi, provider)

		assertType<ethers.Contract>(c)

		expectTypeOf(await c.name()).toBeString()
		expectTypeOf(await c.symbol()).toBeString()
		expectTypeOf(await c.decimals()).toBeNumber()
		assertType<BigInt>(await c.totalSupply())
	})

	test('Should be typesafe with arguments', async () => {
		const c = new Contract(addresses[420], abi, provider)

		assertType<Parameters<typeof c.totalSupply>>([])
		assertType<Parameters<typeof c.totalSupply>>([
			{ blockTag: 234324, chainId: 25 },
		])
		assertType<Parameters<typeof c.balanceOf>>([addresses[420]])
		assertType<Parameters<typeof c.balanceOf>>([
			addresses[420],
			{ blockTag: 234324, chainId: 25 },
		])
		assertType<Parameters<typeof c.mint>>(['0x2342', 234234n])
		assertType<Parameters<typeof c.mint>>([
			'0x234234',
			234234n,
			{
				blockTag: 234324,
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
		const c = new Contract(addresses[420], abi, provider)
		expect(c).toBeInstanceOf(Contract)
		expect(await c.name({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'"OptimismUselessToken-1"',
		)
		expect(await c.symbol({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'"OUT-1"',
		)
		expect(await c.decimals({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'18n',
		)
		expect(await c.totalSupply({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'71000000000000000000000n',
		)
		expect(
			await c.balanceOf('0x32307adfFE088e383AFAa721b06436aDaBA47DBE'),
		).toMatchInlineSnapshot('0n')
	})

	test('should work with custom address', async () => {
		const c = new Contract(addresses[420], abi, provider)
		expect(c).toBeInstanceOf(Contract)
		expect(await c.name({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'"OptimismUselessToken-1"',
		)
		expect(await c.symbol({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'"OUT-1"',
		)
		expect(await c.decimals({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'18n',
		)
		expect(await c.totalSupply({ blockTag: 12865720 })).toMatchInlineSnapshot(
			'71000000000000000000000n',
		)
		expect(
			await c.balanceOf('0x32307adfFE088e383AFAa721b06436aDaBA47DBE'),
		).toMatchInlineSnapshot('0n')
	})
})
