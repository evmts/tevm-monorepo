import { ERC20 } from '@tevm/contract'
import { numberToHex } from '@tevm/utils'
import { encodeAbiParameters, encodeFunctionData, hexToBigInt, keccak256 } from 'viem'
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
		const zeroValue = numberToHex(0n, { size: 32 })
		const expectedBalance = hexToBigInt(value)

		/** @type {(address: `0x${string}`, slot: `0x${string}`, storageValue: `0x${string}`) => Promise<void>} */
		const setStorageAt = async (address, slot, storageValue) => {
			await anvilSetStorageAtJsonRpcProcedure(node)({
				method: 'anvil_setStorageAt',
				params: [address, slot, storageValue],
				id: 1,
				jsonrpc: '2.0',
			})
		}

		const readBalance = async () =>
			contractHandler(node)({
				to: erc20,
				abi: ERC20.abi,
				functionName: 'balanceOf',
				args: [account],
				throwOnFail: false,
			})

		// Fast path for common mapping slots. We intentionally avoid reading prior values
		// here since each storage read may trigger slow proof RPCs on forked state.
		/** @type {(storageKeys: readonly `0x${string}`[]) => Promise<boolean>} */
		const tryHashedSlotsWithoutReads = async (storageKeys) => {
			for (const slot of storageKeys) {
				await setStorageAt(erc20, slot, value)

				const balanceResponse = await readBalance()
				if (!balanceResponse.errors && balanceResponse.data === expectedBalance) {
					return true
				}

				await setStorageAt(erc20, slot, zeroValue)
			}
			return false
		}

		/**
		 * @type {(candidates: Array<{ address: `0x${string}`; storageKeys: readonly `0x${string}`[] }>) => Promise<boolean>}
		 */
		const tryStorageCandidates = async (candidates) => {
			// Track all storage slots we modify so we can reset them later if needed
			const modifiedSlots = []

			for (const { address, storageKeys } of candidates) {
				for (const slot of storageKeys) {
					// Get existing storage value
					let oldValue = zeroValue
					try {
						oldValue = await getStorageAtHandler(node)({
							address,
							position: slot,
							blockTag: 'latest',
						})
					} catch (error) {
						node.logger.warn(
							{ address, slot, error },
							'Failed to read previous storage value during dealErc20; defaulting reset value to zero',
						)
					}

					// Set new value
					await setStorageAt(address, slot, value)

					// Track modified slot
					modifiedSlots.push({ address, slot, oldValue })

					// Check if balance updated correctly - with throwOnFail: false to handle errors
					const balanceResponse = await readBalance()

					// Check if the balance call succeeded and matches expected value
					if (!balanceResponse.errors && balanceResponse.data === expectedBalance) {
						node.logger.debug({ erc20, account, amount, slot }, 'Successfully set ERC20 balance using storage slot')
						// Found correct slot, reset all other slots
						for (const { address: resetAddr, slot: resetSlot, oldValue: resetValue } of modifiedSlots) {
							// Skip the correct slot
							if (resetAddr === address && resetSlot === slot) continue

							// Reset any other modified slot
							await setStorageAt(resetAddr, resetSlot, resetValue)
						}
						return true
					}

					// This slot didn't work, revert it immediately
					await setStorageAt(address, slot, oldValue)

					// Also remove it from modifiedSlots since we've already reset it
					modifiedSlots.pop()
				}
			}
			return false
		}

		// Fast path: try common ERC20 mapping slots first. This avoids slow access-list probing on public RPCs.
		const commonMappingSlots = Array.from({ length: 8 }, (_, i) =>
			keccak256(encodeAbiParameters([{ type: 'address' }, { type: 'uint256' }], [account, BigInt(i)])),
		)
		if (await tryHashedSlotsWithoutReads(commonMappingSlots)) {
			return {}
		}

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
		if (await tryStorageCandidates(accessListResponse.result.accessList)) {
			return {}
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
