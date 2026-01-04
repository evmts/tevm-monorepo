import { ERC20 } from '@tevm/contract'
import { encodeFunctionData, hexToBigInt, numberToHex } from '@tevm/utils'
import { contractHandler } from '../Contract/contractHandler.js'
import { ethCreateAccessListProcedure } from '../eth/ethCreateAccessListProcedure.js'
import { getStorageAtHandler } from '../eth/getStorageAtHandler.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvilSetStorageAtProcedure.js'

/**
 * Sets ERC20 token balance for an account by overriding the storage of balanceOf(account)
 * This is a specialized version of anvil_deal for ERC20 tokens only
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./AnvilHandler.js').AnvilDealErc20Handler}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { dealErc20Handler } from '@tevm/actions'
 *
 * const client = createTevmNode()
 *
 * // Set USDC balance to 1000 tokens (6 decimals)
 * await dealErc20Handler(client)({
 *   erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   amount: 1000000000n
 * })
 * ```
 * @throws {Error} If the storage slot for balanceOf cannot be found
 * @throws {Error} If the access list cannot be created
 */
export const dealErc20Handler =
	(node) =>
	async ({ erc20, account, amount }) => {
		const value = numberToHex(amount, { size: 32 })

		// Get storage slots accessed by balanceOf
		const accessListResponse = await ethCreateAccessListProcedure(node)({
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
			node.logger.error(accessListResponse.error, 'Failed to get access list for dealErc20')
			return {
				errors: [
					{
						name: 'AccessListError',
						message: 'Failed to get access list for ERC20 token',
					},
				],
			}
		}

		// Track all storage slots we modify so we can reset them later if needed
		const modifiedSlots = []

		// Try each storage slot until we find the right one
		for (const { address, storageKeys } of accessListResponse.result.accessList) {
			for (const slot of storageKeys) {
				// Get existing storage value
				const oldValue = await getStorageAtHandler(node)({
					address,
					position: slot,
					blockTag: 'latest',
				})

				// Set new value
				await anvilSetStorageAtJsonRpcProcedure(node)({
					method: 'anvil_setStorageAt',
					params: [address, slot, value],
					id: 1,
					jsonrpc: '2.0',
				})

				// Track modified slot
				modifiedSlots.push({ address, slot, oldValue })

				// Check if balance updated correctly - with throwOnFail: false to handle errors
				const balanceResponse = await contractHandler(node)({
					to: erc20,
					abi: ERC20.abi,
					functionName: 'balanceOf',
					args: [account],
					throwOnFail: false,
				})

				// Check if the balance call succeeded and matches expected value
				if (!balanceResponse.errors && balanceResponse.data === hexToBigInt(value)) {
					node.logger.debug({ erc20, account, amount, slot }, 'Successfully set ERC20 balance using storage slot')
					// Found correct slot, reset all other slots
					for (const { address: resetAddr, slot: resetSlot, oldValue: resetValue } of modifiedSlots) {
						// Skip the correct slot
						if (resetAddr === address && resetSlot === slot) continue

						// Reset any other modified slot
						await anvilSetStorageAtJsonRpcProcedure(node)({
							method: 'anvil_setStorageAt',
							params: [resetAddr, resetSlot, resetValue],
							id: 1,
							jsonrpc: '2.0',
						})
					}
					// Found correct slot, return success
					return {}
				}

				// This slot didn't work, revert it immediately
				await anvilSetStorageAtJsonRpcProcedure(node)({
					method: 'anvil_setStorageAt',
					params: [address, slot, oldValue],
					id: 1,
					jsonrpc: '2.0',
				})

				// Also remove it from modifiedSlots since we've already reset it
				modifiedSlots.pop()
			}
		}

		// No valid storage slot found, but all slots should already be reset
		node.logger.error({ erc20, account }, 'Could not find correct storage slot for balanceOf')
		return {
			errors: [
				{
					name: 'StorageSlotNotFound',
					message: 'Could not find correct storage slot for balanceOf',
				},
			],
		}
	}
