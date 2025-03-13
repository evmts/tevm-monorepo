// Import dynamically at runtime to avoid circular dependencies
// during build time
import { mainnet } from '@tevm/common'
import { PREFUNDED_ACCOUNTS, encodeFunctionData, parseEther } from '@tevm/utils'

// We'll use dynamic import for @tevm/node to avoid circular dependencies
// This file is only used at runtime so it's fine to use dynamic imports
let createTevmNodeFunc: any = null
import { TestERC20, TestERC721 } from './OZ.s.sol.js'
import { SimpleContract } from './SimpleContract.s.sol.js'

// Constants for predefined addresses
export const CONTRACT_ADDRESSES = {
	erc20: `0x${'3'.repeat(40)}`,
	erc721: `0x${'4'.repeat(40)}`,
	simpleContract: `0x${'5'.repeat(40)}`,
}

/**
 * Creates a memory client with predeployed contracts
 * This client doesn't fork any external network and is purely in-memory
 */
export const createMemoryClient = async (options = {}) => {
	// Dynamically import createTevmNode to avoid circular dependencies
	if (!createTevmNodeFunc) {
		const nodeModule = await import('@tevm/node')
		createTevmNodeFunc = nodeModule.createTevmNode
	}

	// Create a new tevm node with no forking
	const client = createTevmNodeFunc({
		common: mainnet,
		...options,
	})

	// Wait for the client to be ready
	await client.ready()

	// Wait for the client to initialize fully
	await client.getVm()

	// PREFUNDED_ACCOUNTS already exist in the tevm node by default
	// We'll use them rather than creating new accounts

	// Deploy the ERC20 token contract
	await client.setAccount({
		address: CONTRACT_ADDRESSES.erc20,
		deployedBytecode: TestERC20.deployedBytecode,
		nonce: 0n,
	})

	// Deploy the ERC721 token contract
	await client.setAccount({
		address: CONTRACT_ADDRESSES.erc721,
		deployedBytecode: TestERC721.deployedBytecode,
		nonce: 0n,
	})

	// Deploy the SimpleContract contract
	await client.setAccount({
		address: CONTRACT_ADDRESSES.simpleContract,
		deployedBytecode: SimpleContract.deployedBytecode,
		nonce: 0n,
	})

	// Mine a block to set the initial state
	await client.mine({ blocks: 1 })

	// Instead of minting tokens (which requires a mint function that's not exposed),
	// we'll set balances directly for each prefunded account via tevmSetAccount
	for (let i = 0; i < 3; i++) {
		// We'll set the balances via storage manipulation
		// This is a test environment where we have full control
		await client.tevmSetStorageAt({
			address: CONTRACT_ADDRESSES.erc20,
			// Storage slot for balances mapping
			storageSlot: `0x${(i + 1).toString().padStart(64, '0')}`,
			// Set a large balance for each account
			value: parseEther(`${(i + 1) * 1000}`).toString(),
		})
	}

	// Set a value in SimpleContract
	await client.sendTransaction({
		from: PREFUNDED_ACCOUNTS[0].address,
		to: CONTRACT_ADDRESSES.simpleContract,
		data: encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [1000n],
		}),
	})

	// Mine another block to include the transactions
	await client.mine({ blocks: 1 })

	// Create a few more empty blocks to have some history
	await client.mine({ blocks: 3 })

	return {
		client,
		accounts: PREFUNDED_ACCOUNTS,
		addresses: {
			...CONTRACT_ADDRESSES,
			// Include a diverse set of names for prefunded accounts
			alice: PREFUNDED_ACCOUNTS[0].address,
			bob: PREFUNDED_ACCOUNTS[1].address,
			chen: PREFUNDED_ACCOUNTS[2].address,
			deshawn: PREFUNDED_ACCOUNTS[3].address,
			eve: PREFUNDED_ACCOUNTS[4].address,
			fatima: PREFUNDED_ACCOUNTS[5].address,
			grace: PREFUNDED_ACCOUNTS[6].address,
			hiroshi: PREFUNDED_ACCOUNTS[7].address,
			imani: PREFUNDED_ACCOUNTS[8].address,
			jamal: PREFUNDED_ACCOUNTS[9].address,
		},
		contracts: {
			erc20: {
				address: CONTRACT_ADDRESSES.erc20,
				abi: TestERC20.abi,
				bytecode: TestERC20.bytecode,
				deployedBytecode: TestERC20.deployedBytecode,
			},
			erc721: {
				address: CONTRACT_ADDRESSES.erc721,
				abi: TestERC721.abi,
				bytecode: TestERC721.bytecode,
				deployedBytecode: TestERC721.deployedBytecode,
			},
			simpleContract: {
				address: CONTRACT_ADDRESSES.simpleContract,
				abi: SimpleContract.abi,
				bytecode: SimpleContract.bytecode,
				deployedBytecode: SimpleContract.deployedBytecode,
			},
		},
	}
}
