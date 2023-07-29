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
	bytecode: '0x0',
})

const provider = new JsonRpcProvider('https://goerli.optimism.io', 420)

describe(createEthersContract.name, () => {
	test('should work with chainId and evmts contract addresses', async () => {
		const c = createEthersContract(evmtsContract, {
			chainId: 420,
			runner: provider,
		})
		expect(c).toBeInstanceOf(Contract)
		expect(await c.name()).toMatchInlineSnapshot('"OptimismUselessToken-1"')
		expect(await c.symbol()).toMatchInlineSnapshot('"OUT-1"')
		expect(await c.decimals()).toMatchInlineSnapshot('18n')
		expect(await c.totalSupply()).toMatchInlineSnapshot(
			'70000000000000000000000n',
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
		expect(await c.name()).toMatchInlineSnapshot('"OptimismUselessToken-1"')
		expect(await c.symbol()).toMatchInlineSnapshot('"OUT-1"')
		expect(await c.decimals()).toMatchInlineSnapshot('18n')
		expect(await c.totalSupply()).toMatchInlineSnapshot(
			'70000000000000000000000n',
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
})
