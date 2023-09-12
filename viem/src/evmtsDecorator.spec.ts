import { evmtsDecorator } from '.'
import { evmtsContractFactory } from '@evmts/core'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { optimismGoerli } from 'viem/chains'
import { describe, expect, it } from 'vitest'

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
	name: 'TestContract',
	addresses: { 420: '0x32307adfFE088e383AFAa721b06436aDaBA47DBE' },
})

const transport = http('https://goerli.optimism.io')

describe(evmtsDecorator.name, () => {
	it('should decorate viem with a new getContract method', async () => {
		const decoratedClient = createPublicClient({
			name: 'Optimism Goerli',
			chain: optimismGoerli,
			transport,
		}).extend(evmtsDecorator)
		const testContract = decoratedClient.getContractFromEvmts(evmtsContract)
		expect(await testContract.read.symbol()).toMatchInlineSnapshot('"OUT-1"')
	})
	it('should work with wallet', () => {
		const decoratedClient = createWalletClient({
			name: 'Optimism Goerli',
			chain: optimismGoerli,
			transport,
			account: privateKeyToAccount(
				'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
			),
		}).extend(evmtsDecorator)
		const testContract = decoratedClient.getContractFromEvmts(evmtsContract)
		expect(testContract.write).toBeDefined()
		expect((testContract as any).read).not.toBeDefined()
	})
})
