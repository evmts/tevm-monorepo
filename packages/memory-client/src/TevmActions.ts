import type { BaseClient } from '@tevm/base-client'
import { type EIP1193RequestFn, type Eip1193RequestProvider, type TevmActionsApi } from '@tevm/decorators'
import type { TevmJsonRpcBulkRequestHandler, TevmJsonRpcRequestHandler } from '@tevm/procedures-types'

/**
* Custom powerful actions added to the client for interacting with the EVM
*/
export type TevmActions = {
_tevm: BaseClient &
Eip1193RequestProvider &
TevmActionsApi & {
send: TevmJsonRpcRequestHandler
sendBulk: TevmJsonRpcBulkRequestHandler
request: EIP1193RequestFn
}
tevmForkUrl?: string
tevmReady: () => Promise<true>
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
