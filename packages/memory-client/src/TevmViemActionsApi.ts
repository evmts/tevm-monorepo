import type { BaseClient } from '@tevm/base-client'
import type { Eip1193RequestProvider, TevmActionsApi } from '@tevm/decorators'

/**
 * A custom [viem extension](https://viem.sh/docs/clients/custom#extending-with-actions-or-configuration) for adding powerful
 * Tevm specific actions to the client. These actions come preloaded with [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
 * To add these actions use the `extend` method on a TevmClient with the tevmViemActions() extension.
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
