import { ERC20 } from '@tevm/contract'
import { numberToHex } from '@tevm/utils'
import { encodeFunctionData, hexToBigInt } from 'viem'
import { contractHandler } from '../Contract/contractHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethCreateAccessListProcedure } from '../eth/ethCreateAccessListProcedure.js'
import { getStorageAtHandler } from '../eth/getStorageAtHandler.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvilSetStorageAtProcedure.js'

/**
 * Deals tokens to an account, supporting both native ETH and ERC20 tokens
 *
 * This handler provides two modes of operation:
 * 1. For native ETH: When no `erc20` address is provided, it sets the account balance to the specified amount
 * 2. For ERC20 tokens: When an `erc20` address is provided, it finds the correct storage slot for the token balance and updates it
 *
 * The ERC20 token dealing works by:
 * - Using eth_createAccessList to find all storage slots accessed during a balanceOf call
 * - Testing each storage slot by updating it and checking if the balance is changed
 * - Resetting any incorrect slots and only keeping the correct balance update
 *
 * @param {import('@tevm/node').TevmNode} client - The Tevm node instance
 * @returns {import('./AnvilHandler.js').AnvilDealHandler} A function that handles dealing tokens and returns a Promise with either an empty object on success or an errors array if no valid storage slot is found
 *
 * @example Deal native ETH
 * ```typescript
 * import { createTevmNode } from 'tevm'
 * import { dealHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * await dealHandler(client)({
 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   amount: 1000000000000000000n // 1 ETH
 * })
 * ```
 *
 * @example Deal ERC20 tokens
 * ```typescript
 * import { createTevmNode } from 'tevm'
 * import { dealHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 * await dealHandler(client)({
 *   erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   amount: 1000000n // 1 USDC (6 decimals)
 * })
 * ```
 *
 * @throws {Error} If the access list cannot be retrieved
 */
export const dealHandler =
	(client) =>
	async ({ erc20, account, amount }) => {
		if (!erc20) {
			return setAccountHandler(client)({
				address: account,
				balance: amount,
			})
		}

		const value = numberToHex(amount, { size: 32 })

		// Get storage slots accessed by balanceOf
		const accessListResponse = await ethCreateAccessListProcedure(client)({
			method: 'eth_createAccessList',
			params: [
				{
					to: erc20,
					data: encodeFunctionData({
						abi: ERC20.abi,
						functionName: 'balanceOf',
						args: [account],
					}),
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		if (!accessListResponse.result?.accessList) {
			throw new Error('Failed to get access list')
		}

		// Track all storage slots we modify so we can reset them later if needed
		const modifiedSlots = []

		// Try each storage slot until we find the right one
		for (const { address, storageKeys } of accessListResponse.result.accessList) {
			for (const slot of storageKeys) {
				// Get existing storage value
				const oldValue = await getStorageAtHandler(client)({
					address,
					position: slot,
					blockTag: 'latest',
				})

				// Set new value
				await anvilSetStorageAtJsonRpcProcedure(client)({
					method: 'anvil_setStorageAt',
					params: [address, slot, value],
					id: 1,
					jsonrpc: '2.0',
				})

				// Track modified slot
				modifiedSlots.push({ address, slot, oldValue })

				// Check if balance updated correctly
				const balanceResponse = await contractHandler(client)({
					to: erc20,
					abi: ERC20.abi,
					functionName: 'balanceOf',
					args: [account],
				})

				if (balanceResponse.data === hexToBigInt(value)) {
					// Found correct slot, reset all other slots
					for (const { address: resetAddr, slot: resetSlot, oldValue: resetValue } of modifiedSlots) {
						// Skip the correct slot
						if (resetAddr === address && resetSlot === slot) continue

						// Reset any other modified slot
						await anvilSetStorageAtJsonRpcProcedure(client)({
							method: 'anvil_setStorageAt',
							params: [resetAddr, resetSlot, resetValue],
							id: 1,
							jsonrpc: '2.0',
						})
					}
					// Found correct slot, return success
					return {}
				}
			}
		}

		// No valid storage slot found, reset all slots
		for (const { address, slot, oldValue } of modifiedSlots) {
			await anvilSetStorageAtJsonRpcProcedure(client)({
				method: 'anvil_setStorageAt',
				params: [address, slot, oldValue],
				id: 1,
				jsonrpc: '2.0',
			})
		}

		// No valid storage slot found
		return {
			errors: [
				{
					name: 'StorageSlotNotFound',
					message: 'Could not find correct storage slot for balanceOf',
				},
			],
		}
	}
