import { getContractFromEvmts } from './getContractFromEvmts'
import { evmtsContractFactory } from '@evmts/core'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { optimismGoerli } from 'viem/chains'
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

const transport = http('https://goerli.optimism.io')

const publicClient = createPublicClient({
	name: 'Optimism Goerli',
	chain: optimismGoerli,
	transport,
})
const walletClient = createWalletClient({
	name: 'Optimism Goerli',
	chain: optimismGoerli,
	transport,
	account: privateKeyToAccount(
		'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
	),
})

describe(getContractFromEvmts.name, () => {
	test('should work in basic case', async () => {
		const c = getContractFromEvmts({
			evmts: evmtsContract,
			publicClient,
			walletClient,
		})
		expect(Object.keys(c)).toMatchInlineSnapshot(`
			[
			  "read",
			  "simulate",
			  "createEventFilter",
			  "watchEvent",
			  "write",
			  "estimateGas",
			  "address",
			  "abi",
			]
		`)
		expect(
			await c.read.name({ blockNumber: BigInt(12865720) }),
		).toMatchInlineSnapshot('"OptimismUselessToken-1"')
		expect(
			await c.read.symbol({ blockNumber: BigInt(12865720) }),
		).toMatchInlineSnapshot('"OUT-1"')
		expect(
			await c.read.decimals({ blockNumber: BigInt(12865720) }),
		).toMatchInlineSnapshot('18')
		expect(
			await c.read.totalSupply({ blockNumber: BigInt(12865720) }),
		).toMatchInlineSnapshot('71000000000000000000000n')
		expect(
			await c.read.balanceOf(['0x32307adfFE088e383AFAa721b06436aDaBA47DBE'], {
				blockNumber: BigInt(12865720),
			}),
		).toMatchInlineSnapshot('0n')
	})

	test('should infer the address from the client when more than 1 exists', async () => {
		let c = getContractFromEvmts({
			evmts: {
				abi: evmtsContract.abi,
				addresses: {
					...evmtsContract.addresses,
					1: '0x1234567890123456789012345678901234567890',
				},
			},
			publicClient,
		})
		expect(c.address).toBe(evmtsContract.addresses[420])
		c = getContractFromEvmts({
			evmts: {
				abi: evmtsContract.abi,
				addresses: {
					...evmtsContract.addresses,
					1: '0x1234567890123456789012345678901234567890',
				},
			},
			walletClient,
		})
		expect(c.address).toBe(evmtsContract.addresses[420])
	})

	// Test when 'abi' is in options
	test('should work when abi is directly passed', async () => {
		const c = getContractFromEvmts({
			abi,
			address: '0x32307adfFE088e383AFAa721b06436aDaBA47DBE',
			publicClient,
			walletClient,
		})
		expect(Object.keys(c)).toMatchInlineSnapshot(`
				[
				  "read",
				  "simulate",
				  "createEventFilter",
				  "watchEvent",
				  "write",
				  "estimateGas",
				  "address",
				  "abi",
				]
			`)
		expect(
			await c.read.name({ blockNumber: BigInt(12865720) }),
		).toMatchInlineSnapshot('"OptimismUselessToken-1"')
	})

	test('should work when address is explicitly passed', async () => {
		const c = getContractFromEvmts({
			evmts: {
				abi: evmtsContract.abi,
				addresses: {},
			},
			address: evmtsContract.addresses[420],
			publicClient,
			walletClient,
		})
		expect(c.address).toBe(evmtsContract.addresses[420])
		expect(
			await c.read.name({ blockNumber: BigInt(12865720) }),
		).toMatchInlineSnapshot('"OptimismUselessToken-1"')
	})

	// Test with no addresses in evmts contract
	test('should throw error when no addresses are configured', async () => {
		const invalidContract = evmtsContractFactory({
			abi,
			name: 'test',
			addresses: {},
		})
		expect(() => {
			getContractFromEvmts({
				evmts: invalidContract,
				publicClient,
				walletClient,
			})
		}).toThrowErrorMatchingInlineSnapshot(
			'"No address configured on EVMts contract or passed in as options. Please pass in an address or configure an address globally in your EVMts config in tsconfig.json"',
		)
	})

	// Test with multiple addresses but no chain id inferred
	test('should throw error when no chain id can be inferred', async () => {
		const invalidContract = evmtsContractFactory({
			abi,
			name: 'test',
			addresses: {
				1: '0x1111111111111111111111111111111111111111',
				2: '0x2222222222222222222222222222222222222222',
			},
		})
		expect(() => {
			getContractFromEvmts({
				evmts: invalidContract,
				publicClient: { ...publicClient, chain: undefined },
				walletClient: { ...walletClient, chain: undefined },
			})
		}).toThrowErrorMatchingInlineSnapshot(
			'"chainId could not be found to infer address. Please pass in the contract address explicitly"',
		)
	})

	// Test with chain id inferred but no matching address
	test('should throw error when no address matches inferred chain id and more than one address exists', async () => {
		expect(() => {
			getContractFromEvmts({
				evmts: {
					...evmtsContract,
					addresses: { ...evmtsContract.addresses, 69: '0x420' },
				}, // It doesn't have address for chain id 1
				publicClient: { ...publicClient, chain: { ...optimismGoerli, id: 1 } },
				walletClient: { ...walletClient, chain: { ...optimismGoerli, id: 1 } },
			})
		}).toThrowErrorMatchingInlineSnapshot(
			'"No address configured for chainId 1 on EVMts contract. Valid chainIds are 69,420"',
		)
	})
})
