import type { AnvilDealHandler, AnvilDealParams } from '@tevm/actions'
import type { TevmNode } from '@tevm/node'
import type { Hex } from 'viem'

/**
 * Creates a tevmDeal action for the client that lets you deal tokens to an account
 * 
 * Supports two modes:
 * 1. For native ETH: When no `erc20` address is provided, it sets the account balance
 * 2. For ERC20 tokens: When an `erc20` address is provided, it finds and updates the correct storage slot
 * 
 * @example Deal native ETH
 * ```typescript
 * import { createMemoryClient } from 'tevm'
 * 
 * const client = createMemoryClient()
 * await client.tevmDeal({
 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   amount: 1000000000000000000n // 1 ETH
 * })
 * ```
 * 
 * @example Deal ERC20 tokens
 * ```typescript
 * import { createMemoryClient } from 'tevm'
 * 
 * const client = createMemoryClient()
 * await client.tevmDeal({
 *   erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC address
 *   account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   amount: 1000000n // 1 USDC (6 decimals)
 * })
 * ```
 */
export const tevmDeal = (
  node: TevmNode,
): AnvilDealHandler => {
  return async (params) => {
    const result = await node.request({
      method: 'anvil_deal',
      params: [params],
    })
    
    return result as ReturnType<AnvilDealHandler>
  }
}

export type TevmDealParameters = AnvilDealParams
export type TevmDealReturnType = ReturnType<AnvilDealHandler>