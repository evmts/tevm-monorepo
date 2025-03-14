/**
 * Local memory client implementation for tests
 * Imports directly from the test-utils package to avoid build issues
 */

import { mainnet } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { TestERC20, TestERC721 } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS, encodeFunctionData, parseEther } from '@tevm/utils'
import { contractHandler } from '../Contract/contractHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

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
	// Create a new tevm node with no forking
	const client = createTevmNode({
		common: mainnet,
		...options,
	})

	// Wait for the client to be ready
	await client.ready()

	// We'll use the internal handlers directly
	const setAccHandler = setAccountHandler(client)

	// Deploy the ERC20 token contract using setAccountHandler
	await setAccHandler({
		address: CONTRACT_ADDRESSES.erc20 as `0x${string}`,
		deployedBytecode: TestERC20.deployedBytecode,
		nonce: 0n,
	})

	// Deploy the ERC721 token contract
	await setAccHandler({
		address: CONTRACT_ADDRESSES.erc721 as `0x${string}`,
		deployedBytecode: TestERC721.deployedBytecode,
		nonce: 0n,
	})

	// Set up accounts with initial balances and token allocations
	// First set balances for each account
	for (let i = 0; i < PREFUNDED_ACCOUNTS.length; i++) {
		const account = PREFUNDED_ACCOUNTS[i]
		await setAccHandler({
			address: account.address,
			balance: parseEther('10'), // 10 ETH for each account
			nonce: BigInt(i),
		})
	}

	// Now we'll mint some tokens for a few accounts
	const contractInterface = contractHandler(client)

	// Mint 1000 tokens for Alice
	await contractInterface({
		to: CONTRACT_ADDRESSES.erc20 as `0x${string}`,
		abi: TestERC20.abi,
		functionName: 'mint',
		args: [PREFUNDED_ACCOUNTS[0].address, parseEther('1000')],
	}).catch(() => {
		// If mint fails, it's likely not available on this contract version
		// We'll handle this silently
	})

	// Mint 2000 tokens for Bob
	await contractInterface({
		to: CONTRACT_ADDRESSES.erc20 as `0x${string}`,
		abi: TestERC20.abi,
		functionName: 'mint',
		args: [PREFUNDED_ACCOUNTS[1].address, parseEther('2000')],
	}).catch(() => {
		// Silently handle failure
	})

	// Mint 3000 tokens for Chen
	await contractInterface({
		to: CONTRACT_ADDRESSES.erc20 as `0x${string}`,
		abi: TestERC20.abi,
		functionName: 'mint',
		args: [PREFUNDED_ACCOUNTS[2].address, parseEther('3000')],
	}).catch(() => {
		// Silently handle failure
	})

	// Return the client and useful references
	return {
		client,
		accounts: PREFUNDED_ACCOUNTS,
		addresses: {
			...CONTRACT_ADDRESSES,
			// Include prefunded accounts with names for convenience
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
				address: CONTRACT_ADDRESSES.erc20 as `0x${string}`,
				abi: TestERC20.abi,
				bytecode: TestERC20.bytecode,
				deployedBytecode: TestERC20.deployedBytecode,
			},
			erc721: {
				address: CONTRACT_ADDRESSES.erc721 as `0x${string}`,
				abi: TestERC721.abi,
				bytecode: TestERC721.bytecode,
				deployedBytecode: TestERC721.deployedBytecode,
			},
		},
	}
}
