import { ERC20 } from '@tevm/contract'
import { numberToHex } from '@tevm/utils'
import { encodeFunctionData, hexToBigInt } from 'viem'
import { contractHandler } from '../Contract/contractHandler.js'
import { ethCreateAccessListProcedure } from '../eth/ethCreateAccessListProcedure.js'
import { getStorageAtHandler } from '../eth/getStorageAtHandler.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvilSetStorageAtProcedure.js'

/**
 * Sets ERC20 allowance for a spender by overriding the storage of allowance(owner, spender)
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./AnvilHandler.js').AnvilSetErc20AllowanceHandler}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { setErc20AllowanceHandler } from '@tevm/actions'
 *
 * const client = createTevmNode()
 *
 * // Set USDC allowance for a spender to 1000 tokens (6 decimals)
 * await setErc20AllowanceHandler(client)({
 *   erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   spender: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
 *   amount: 1000000000n
 * })
 * ```
 * @throws {Error} If the storage slot for allowance cannot be found
 * @throws {Error} If the access list cannot be created
 */
export const setErc20AllowanceHandler =
	(node) =>
	async ({ erc20, owner, spender, amount }) => {
		const value = numberToHex(amount, { size: 32 })

		// Get storage slots accessed by allowance
		const accessListResponse = await ethCreateAccessListProcedure(node)({
			method: 'eth_createAccessList',
			params: [
				{
					to: erc20,
					data: encodeFunctionData({
						abi: ERC20.abi,
						functionName: 'allowance',
						args: [owner, spender],
					}),
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		if (!accessListResponse.result?.accessList) {
			node.logger.error(accessListResponse.error, 'Failed to get access list for setErc20Allowance')
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

				// Check if allowance updated correctly - with throwOnFail: false to handle errors
				const allowanceResponse = await contractHandler(node)({
					to: erc20,
					abi: ERC20.abi,
					functionName: 'allowance',
					args: [owner, spender],
					throwOnFail: false,
				})

				// Check if the allowance call succeeded and matches expected value
				if (!allowanceResponse.errors && allowanceResponse.data === hexToBigInt(value)) {
					node.logger.debug(
						{ erc20, owner, spender, amount, slot },
						'Successfully set ERC20 allowance using storage slot',
					)
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
		node.logger.error({ erc20, owner, spender }, 'Could not find correct storage slot for allowance')
		return {
			errors: [
				{
					name: 'StorageSlotNotFound',
					message: 'Could not find correct storage slot for allowance',
				},
			],
		}
	}
