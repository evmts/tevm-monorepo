import type { AbiEvent } from 'abitype'

import { describe, expect, test } from 'vitest'

import { usdcContractConfig, wagmiContractConfig } from '~test/src/abis.js'
import { accounts, address, forkBlockNumber } from '~test/src/constants.js'
import {
	publicClient,
	testClient,
	walletClient,
	walletClientWithAccount,
} from '~test/src/utils.js'

import {
	getContract,
	getEventParameters,
	getFunctionParameters,
} from './getContract.js'
import {
	impersonateAccount,
	mine,
	setBalance,
	stopImpersonatingAccount,
	writeContract,
} from './index.js'

const contract = getContract({
	...wagmiContractConfig,
	publicClient,
	walletClient,
})

test('address', () => {
	expect(contract.address).toBe(wagmiContractConfig.address)
})

test('abi', () => {
	expect(contract.abi).toEqual(wagmiContractConfig.abi)
})

test('createEventFilter', async () => {
	await expect(
		contract.createEventFilter.Transfer({
			from: accounts[0].address,
		}),
	).resolves.toBeDefined()

	await expect(
		contract.createEventFilter.Transfer(
			{
				from: accounts[0].address,
			},
			{
				fromBlock: forkBlockNumber - 5n,
			},
		),
	).resolves.toBeDefined()

	const contractNoIndexedEventArgs = getContract({
		...wagmiContractConfig,
		abi: [
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						type: 'address',
					},
					{ indexed: false, type: 'address' },
					{
						indexed: true,
						type: 'uint256',
					},
				],
				name: 'Transfer',
				type: 'event',
			},
		],
		publicClient,
	})
	await expect(
		contractNoIndexedEventArgs.createEventFilter.Transfer([
			accounts[0].address,
		]),
	).resolves.toBeDefined()
})

describe('estimateGas', async () => {
	test('account required', async () => {
		await expect(
			contract.estimateGas.mint({
				account: accounts[0].address,
			}),
		).resolves.toBeDefined()
	})

	test('account inherited from wallet client', async () => {
		const contract1 = getContract({
			...wagmiContractConfig,
			publicClient,
			walletClient: walletClientWithAccount,
		})
		await expect(contract1.estimateGas.mint()).resolves.toBeDefined()

		const contract2 = getContract({
			...wagmiContractConfig,
			walletClient: walletClientWithAccount,
		})
		await expect(contract2.estimateGas.mint()).resolves.toBeDefined()
	})
})

test('read', async () => {
	await expect(
		contract.read.balanceOf([accounts[0].address]),
	).resolves.toBeDefined()
})

test('simulate', async () => {
	const contract = getContract({
		...wagmiContractConfig,
		abi: wagmiContractConfig.abi.filter(
			(x) => (x as { name: string }).name === 'mint',
		),
		publicClient,
		walletClient,
	})
	await expect(
		contract.simulate.mint({
			account: accounts[0].address,
		}),
	).resolves.toMatchInlineSnapshot(`
    {
      "request": {
        "abi": [
          {
            "inputs": [],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
              },
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
        ],
        "account": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "address": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
        "args": [],
        "dataSuffix": undefined,
        "functionName": "mint",
      },
      "result": undefined,
    }
  `)
})

test('getEvents', async () => {
	await impersonateAccount(testClient, {
		address: address.usdcHolder,
	})
	await setBalance(testClient, {
		address: address.usdcHolder,
		value: 10000000000000000000000n,
	})

	await writeContract(walletClient, {
		...usdcContractConfig,
		functionName: 'transfer',
		args: [accounts[0].address, 1n],
		account: address.usdcHolder,
	})
	await writeContract(walletClient, {
		...usdcContractConfig,
		functionName: 'approve',
		args: [accounts[1].address, 1n],
		account: address.usdcHolder,
	})
	await mine(testClient, { blocks: 1 })

	const contract = getContract({
		...usdcContractConfig,
		publicClient,
	})
	const logs = await contract.getEvents.Transfer()

	expect(logs.length).toBe(1)

	await stopImpersonatingAccount(testClient, {
		address: address.usdcHolder,
	})
})

test('watchEvent', async () => {
	const unwatch = contract.watchEvent.Transfer(
		{},
		{
			onLogs: () => {},
		},
	)
	unwatch()
})

test('write', async () => {
	await expect(
		contract.write.mint({
			account: accounts[0].address,
		}),
	).resolves.toBeDefined()
})

test('js reserved keywords/prototype methods as abi item names', async () => {
	const contractNoIndexedEventArgs = getContract({
		...wagmiContractConfig,
		abi: [
			{
				name: 'constructor',
				type: 'function',
				stateMutability: 'view',
				inputs: [],
				outputs: [{ type: 'address' }],
			},
			{
				name: 'function',
				type: 'function',
				stateMutability: 'view',
				inputs: [{ type: 'string', name: 'function' }],
				outputs: [{ type: 'address' }],
			},
		],
		publicClient,
	})
	await expect(
		contractNoIndexedEventArgs.read.constructor(),
	).rejects.toThrowErrorMatchingInlineSnapshot(`
    "The contract function \\"constructor\\" reverted.

    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  constructor()

    Docs: https://viem.sh/docs/contract/readContract.html
    Version: viem@1.0.2"
  `)
	await expect(
		contractNoIndexedEventArgs.read.function(['function']),
	).rejects.toThrowErrorMatchingInlineSnapshot(`
    "The contract function \\"function\\" reverted.

    Contract Call:
      address:   0x0000000000000000000000000000000000000000
      function:  function(string function)
      args:              (function)

    Docs: https://viem.sh/docs/contract/readContract.html
    Version: viem@1.0.2"
  `)
})

test.each([
	// without options
	{
		values: [['0x']],
		expected: {
			args: ['0x'],
			options: {},
		},
	},
	// with options
	{
		values: [['0x'], { fromBlock: 10_000n }],
		expected: {
			args: ['0x'],
			options: { fromBlock: 10_000n },
		},
	},
	// only options
	{
		values: [{ fromBlock: 10_000n }],
		expected: {
			args: [],
			options: { fromBlock: 10_000n },
		},
	},
	// no args
	{
		values: [],
		expected: {
			args: [],
			options: {},
		},
	},
])(
	'getFunctionParameters($values) -> $expected',
	async ({ values, expected }) => {
		expect(getFunctionParameters(values as any)).toEqual(expected)
	},
)

test.each([
	// without options
	{
		values: [['0x']],
		abiEvent: { inputs: [{ type: 'address', indexed: true }] },
		expected: {
			args: ['0x'],
			options: {},
		},
	},
	{
		values: [{ from: '0x' }],
		abiEvent: { inputs: [{ name: 'from', type: 'address', indexed: true }] },
		expected: {
			args: { from: '0x' },
			options: {},
		},
	},
	// with options
	{
		values: [['0x'], { fromBlock: 10_000n }],
		abiEvent: { inputs: [{ type: 'address', indexed: true }] },
		expected: {
			args: ['0x'],
			options: { fromBlock: 10_000n },
		},
	},
	{
		values: [{ from: '0x' }, { fromBlock: 10_000n }],
		abiEvent: { inputs: [{ name: 'from', type: 'address', indexed: true }] },
		expected: {
			args: { from: '0x' },
			options: { fromBlock: 10_000n },
		},
	},
	// only options
	{
		values: [{ fromBlock: 10_000n }],
		abiEvent: { inputs: [{ name: 'from', type: 'address' }] },
		expected: {
			args: undefined,
			options: { fromBlock: 10_000n },
		},
	},
	// no args
	{
		values: [],
		abiEvent: { inputs: [{ name: 'from', type: 'address' }] },
		expected: {
			args: undefined,
			options: {},
		},
	},
])(
	'getEventParameters($values, $abiEvent) -> $expected',
	async ({ values, abiEvent, expected }) => {
		expect(
			getEventParameters(values as any, abiEvent as unknown as AbiEvent),
		).toEqual(expected)
	},
)
