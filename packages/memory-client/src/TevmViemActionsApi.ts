import type { Eip1193RequestProvider, TevmActionsApi } from '@tevm/decorators'
import type { TevmNode } from '@tevm/node'

/**
 * Extended API interface for viem clients with TEVM-specific actions
 *
 * This type defines the complete set of TEVM-specific actions that are added to a viem client
 * when using the `tevmViemActions()` extension. These actions provide direct access to the
 * Ethereum Virtual Machine's full capabilities for testing, development, and simulation.
 *
 * The actions are prefixed with `tevm` to avoid conflicts with viem's built-in actions. The interface
 * includes methods for:
 *
 * - Low-level VM access (`tevm` property)
 * - EVM execution (`tevmCall`)
 * - Contract interaction with ABI handling (`tevmContract`)
 * - Contract deployment (`tevmDeploy`)
 * - Block mining (`tevmMine`)
 * - Account state management (`tevmGetAccount`, `tevmSetAccount`)
 * - State persistence (`tevmDumpState`, `tevmLoadState`)
 * - Initialization checking (`tevmReady`)
 *
 * These actions come preloaded with {@link MemoryClient} by default. For custom viem clients,
 * you can add them using the `extend` method with the `tevmViemActions()` extension.
 *
 * @example
 * ```typescript
 * import { createClient, http } from 'viem'
 * import { createTevmTransport, tevmViemActions } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * // Create a custom viem client with TEVM transport
 * const baseClient = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * // Add TEVM actions to the client
 * const client = baseClient.extend(tevmViemActions())
 *
 * // Now you can use all TEVM-specific actions
 * async function example() {
 *   // Wait for ready state
 *   await client.tevmReady()
 *
 *   // Use account management
 *   await client.tevmSetAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 10000000000000000000n // 10 ETH
 *   })
 *
 *   // Execute contract calls
 *   const result = await client.tevmCall({
 *     to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on mainnet
 *     data: '0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045', // balanceOf(vitalik.eth)
 *     createTrace: true // Generate execution trace
 *   })
 *
 *   // Access trace data
 *   if (result.trace) {
 *     console.log('Execution trace:', result.trace)
 *   }
 * }
 * ```
 *
 * @see {@link tevmViemActions} - Function to add these actions to a viem client
 * @see {@link MemoryClient} - Client that includes these actions by default
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/) - Complete documentation of TEVM actions
 */
export type TevmViemActionsApi = {
	tevm: TevmNode & Eip1193RequestProvider
	tevmReady: TevmNode['ready']
	tevmCall: TevmActionsApi['call']
	tevmContract: TevmActionsApi['contract']
	tevmDeploy: TevmActionsApi['deploy']
	tevmMine: TevmActionsApi['mine']
	tevmLoadState: TevmActionsApi['loadState']
	tevmDumpState: TevmActionsApi['dumpState']
	tevmSetAccount: TevmActionsApi['setAccount']
	tevmGetAccount: TevmActionsApi['getAccount']
}
