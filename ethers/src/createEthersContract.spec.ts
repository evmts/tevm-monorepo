import { createEthersContract } from './createEthersContract'
import { evmtsContractFactory } from '@evmts/core'
import { Contract, JsonRpcProvider } from 'ethers'
import { describe, expect, test } from 'vitest'

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

const evmtsContract = evmtsContractFactory({
	abi,
	name: 'test',
	addresses: { 420: '0x32307adfFE088e383AFAa721b06436aDaBA47DBE' },
})

const provider = new JsonRpcProvider('https://goerli.optimism.io', 420)

describe(createEthersContract.name, () => {
	test('should work with chainId and evmts contract addresses', async () => {
		const c = createEthersContract(evmtsContract, {
			chainId: 420,
			runner: provider,
		})
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
		const c = createEthersContract(evmtsContract, {
			address: evmtsContract.addresses[420],
			runner: provider,
		})
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

	test('should work with custom address with chainId supplied even though the chainId is unnecessary', async () => {
		const c = createEthersContract(evmtsContract, {
			address: evmtsContract.addresses[420],
			chainId: 420,
			runner: provider,
		})
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

	test('should throw an error if no chainId or address provided', () => {
		expect(() =>
			// @ts-expect-error
			createEthersContract(evmtsContract, { runner: provider }),
		).toThrowErrorMatchingInlineSnapshot('"No chainId or address provided"')
		expect(() =>
			createEthersContract(evmtsContract, {
				runner: provider,
				address: undefined,
				// @ts-expect-error
				chainId: undefined,
			}),
		).toThrowErrorMatchingInlineSnapshot('"No chainId or address provided"')
	})

	test('should throw an error if not a valid ethereum address', () => {
		const invalidContract = {
			abi,
			name: 'test',
			addresses: { 420: '0xnot an ethereum address' },
		} as const
		expect(() =>
			createEthersContract(invalidContract, { runner: provider, chainId: 420 }),
		).toThrowErrorMatchingInlineSnapshot(
			'"\\"0xnot an ethereum address\\" is not a valid ethereum address"',
		)
		expect(() =>
			createEthersContract(invalidContract, {
				runner: provider,
				address: invalidContract.addresses[420],
			}),
		).toThrowErrorMatchingInlineSnapshot(
			'"\\"0xnot an ethereum address\\" is not a valid ethereum address"',
		)
	})
	test('should throw an error if no address is supplied and no default exists for that chainId', () => {
		const invalidContract = {
			abi,
			name: 'test',
			addresses: { 420: '0xnot an ethereum address' },
		} as const
		expect(() =>
			// @ts-expect-error
			createEthersContract(invalidContract, { runner: provider, chainId: 1 }),
		).toThrowErrorMatchingInlineSnapshot(
			'"No address prop supplied and no default address exists for chainId 1"',
		)
	})
})
