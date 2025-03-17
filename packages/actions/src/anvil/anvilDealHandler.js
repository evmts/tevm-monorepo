import { ERC20 } from '@tevm/contract'
import { numberToHex } from '@tevm/utils'
import { encodeFunctionData, hexToBigInt } from 'viem'
import { contractHandler } from '../Contract/contractHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethCreateAccessListProcedure } from '../eth/ethCreateAccessListProcedure.js'
import { getStorageAtHandler } from '../eth/getStorageAtHandler.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvilSetStorageAtProcedure.js'

/**
 * Deals ERC20 tokens to an account by overriding the storage of balanceOf(account)
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./AnvilHandler.js').AnvilDealHandler}
 */
export const dealHandler =
	(node) =>
	async ({ erc20, account, amount }) => {
		if (!erc20) {
			return setAccountHandler(node)({
				address: account,
				balance: amount,
			})
		}

		const value = numberToHex(amount, { size: 32 })

		// Get storage slots accessed by balanceOf
		console.log('creating access list')
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
		console.log('created access list')

		if (!accessListResponse.result?.accessList) {
			throw new Error('Failed to get access list')
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

				console.log('checking balance', slot)
				// Check if balance updated correctly - with throwOnFail: false to handle errors
				const balanceResponse = await contractHandler(node)({
					to: erc20,
					abi: ERC20.abi,
					functionName: 'balanceOf',
					args: [account],
					throwOnFail: false,
				})
				console.log('checked', balanceResponse.errors, balanceResponse.data)

				// Check if the balance call succeeded and matches expected value
				if (!balanceResponse.errors && balanceResponse.data === hexToBigInt(value)) {
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
		return {
			errors: [
				{
					name: 'StorageSlotNotFound',
					message: 'Could not find correct storage slot for balanceOf',
				},
			],
		}
	}
