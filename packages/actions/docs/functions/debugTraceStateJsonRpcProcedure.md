[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / debugTraceStateJsonRpcProcedure

# Function: debugTraceStateJsonRpcProcedure()

> **debugTraceStateJsonRpcProcedure**(`client`): `DebugTraceStateProcedure`\<readonly (`"blockchain"` \| `"blockchain.blocksByNumber"` \| `"blockchain.initOptions"` \| `"evm"` \| `"evm.opcodes"` \| `"evm.precompiles"` \| `"evm.common"` \| `"evm.common.eips"` \| `"evm.common.hardfork"` \| `"evm.common.consensus"` \| `"node"` \| `"node.status"` \| `"node.mode"` \| `"node.miningConfig"` \| `"node.filters"` \| `"node.impersonatedAccount"` \| `"pool"` \| `"pool.pool"` \| `"pool.txsByHash"` \| `"pool.txsByNonce"` \| `"pool.txsInNonceOrder"` \| `"pool.txsInPool"` \| `"stateManager"` \| `"stateManager.storage"` \| `"stateManager.stateRoots"`)[]\>

Defined in: [packages/actions/src/debug/debugTraceStateProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/debugTraceStateProcedure.js#L8)

Request handler for debug_traceState JSON-RPC requests.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{ \}\>

## Returns

`DebugTraceStateProcedure`\<readonly (`"blockchain"` \| `"blockchain.blocksByNumber"` \| `"blockchain.initOptions"` \| `"evm"` \| `"evm.opcodes"` \| `"evm.precompiles"` \| `"evm.common"` \| `"evm.common.eips"` \| `"evm.common.hardfork"` \| `"evm.common.consensus"` \| `"node"` \| `"node.status"` \| `"node.mode"` \| `"node.miningConfig"` \| `"node.filters"` \| `"node.impersonatedAccount"` \| `"pool"` \| `"pool.pool"` \| `"pool.txsByHash"` \| `"pool.txsByNonce"` \| `"pool.txsInNonceOrder"` \| `"pool.txsInPool"` \| `"stateManager"` \| `"stateManager.storage"` \| `"stateManager.stateRoots"`)[]\>
