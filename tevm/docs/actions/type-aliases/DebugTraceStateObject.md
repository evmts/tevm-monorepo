[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceStateObject

# Type Alias: DebugTraceStateObject

> **DebugTraceStateObject** = `object`

Complete state object structure

## Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="blockchain"></a> `blockchain` | `readonly` | `object` |
| `blockchain.blocksByNumber` | `readonly` | `Map`\<`bigint`, [`Block`](../../block/classes/Block.md) \| `undefined`\> |
| `blockchain.initOptions` | `readonly` | [`ChainOptions`](../../blockchain/type-aliases/ChainOptions.md) |
| <a id="evm"></a> `evm` | `readonly` | `object` |
| `evm.common` | `readonly` | `object` |
| `evm.common.consensus` | `readonly` | `object` |
| `evm.common.consensus.algorithm` | `readonly` | `string` \| [`ConsensusAlgorithm`](../../common/type-aliases/ConsensusAlgorithm.md) |
| `evm.common.consensus.type` | `readonly` | `string` \| [`ConsensusType`](../../common/type-aliases/ConsensusType.md) |
| `evm.common.eips` | `readonly` | `number`[] |
| `evm.common.hardfork` | `readonly` | `string` |
| `evm.opcodes` | `readonly` | `Map`\<`number`, \{ `code`: `number`; `dynamicGas`: `boolean`; `fee`: `number`; `feeBigInt`: `bigint`; `fullName`: `string`; `isAsync`: `boolean`; `isInvalid`: `boolean`; `name`: `string`; \}\> |
| `evm.precompiles` | `readonly` | `Map`\<`string`, (`input`) => `Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\> \| [`ExecResult`](../../evm/interfaces/ExecResult.md)\> |
| <a id="node"></a> `node` | `readonly` | `object` |
| `node.filters` | `readonly` | `Map`\<[`Hex`](Hex.md), [`Filter`](../../index/type-aliases/Filter.md)\> |
| `node.impersonatedAccount` | `readonly` | [`Address`](../../index/type-aliases/Address.md) \| `undefined` |
| `node.miningConfig` | `readonly` | [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"miningConfig"`\] |
| `node.mode` | `readonly` | [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"mode"`\] |
| `node.status` | `readonly` | [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"status"`\] |
| <a id="pool"></a> `pool` | `readonly` | `object` |
| `pool.pool` | `readonly` | `TxPool`\[`"pool"`\] |
| `pool.txsByHash` | `readonly` | `TxPool`\[`"txsByHash"`\] |
| `pool.txsByNonce` | `readonly` | `TxPool`\[`"txsByNonce"`\] |
| `pool.txsInNonceOrder` | `readonly` | `TxPool`\[`"txsInNonceOrder"`\] |
| `pool.txsInPool` | `readonly` | `TxPool`\[`"txsInPool"`\] |
| <a id="statemanager"></a> `stateManager` | `readonly` | `object` |
| `stateManager.stateRoots` | `readonly` | [`StateRoots`](../../state/type-aliases/StateRoots.md) |
| `stateManager.storage` | `readonly` | [`TevmState`](../../index/type-aliases/TevmState.md) |
