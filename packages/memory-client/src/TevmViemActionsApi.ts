import type { BaseClient } from '@tevm/base-client'
import type { Eip1193RequestProvider, TevmActionsApi } from '@tevm/decorators'

/**
 * A custom [viem extension](https://viem.sh/docs/clients/custom#extending-with-actions-or-configuration) for adding powerful
 * Tevm specific actions to the client. These actions come preloaded with [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
 * To add these actions use the `extend` method on a TevmClient with the tevmViemActions() extension.
 * Executes a call against the VM. It is similar to `eth_call` but has more
 * options for controlling the execution environment
 *
 * By default it does not modify the state after the call is complete but this can be configured.
 * @example
 * const res = tevm.call({
 *   to: '0x123...',
 *   data: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000,
 *   gasPrice: 1n,
 *   skipBalance: true,
 * }
 *
 * @example
 * ```typescript
 * import { createTevmClient, tevmViemActions } from 'tevm'
 *
 * const client = createTevmClient()
 *   .extend(tevmViemActions())
 * ```
 */
export type TevmViemActionsApi = {
	tevm: BaseClient & Eip1193RequestProvider
	tevmReady: BaseClient['ready']
	tevmCall: TevmActionsApi['call']
	tevmContract: TevmActionsApi['contract']
	tevmScript: TevmActionsApi['script']
	tevmDeploy: TevmActionsApi['deploy']
	tevmMine: TevmActionsApi['mine']
	tevmLoadState: TevmActionsApi['loadState']
	tevmDumpState: TevmActionsApi['dumpState']
	tevmSetAccount: TevmActionsApi['setAccount']
	tevmGetAccount: TevmActionsApi['getAccount']
}
