import { encodeFunctionData } from 'viem'
import { ERC20 } from '@tevm/contract'
import { numberToHex } from '@tevm/utils'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethCreateAccessListProcedure } from '../eth/ethCreateAccessListProcedure.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvilSetStorageAtProcedure.js'

/**
 * Deals ERC20 tokens to an account by overriding the storage of balanceOf(account)
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilHandler.js').AnvilDealHandler}
 */
export const dealHandler = (client) => async ({ erc20, account, amount }) => {
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
    params: [{
      to: erc20,
      data: encodeFunctionData({
        abi: ERC20.abi,
        functionName: 'balanceOf',
        args: [account],
      }),
    }],
    id: 1,
    jsonrpc: '2.0',
  })

  if (!accessListResponse.result?.accessList) {
    throw new Error('Failed to get access list')
  }

  // Try each storage slot until we find the right one
  for (const { address, storageKeys } of accessListResponse.result.accessList) {
    for (const slot of storageKeys) {
      await anvilSetStorageAtJsonRpcProcedure(client)({
        method: 'anvil_setStorageAt',
        params: [address, slot, value],
        id: 1,
        jsonrpc: '2.0'
      })
    }
  }

  return {}
}