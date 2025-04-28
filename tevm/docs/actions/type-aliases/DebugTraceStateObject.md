[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceStateObject

# Type Alias: DebugTraceStateObject

> **DebugTraceStateObject**: `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:89

Complete state object structure

## Type declaration

### blockchain

> `readonly` **blockchain**: `object`

#### blockchain.blocksByNumber

> `readonly` **blocksByNumber**: `Map`\<`bigint`, [`Block`](../../block/classes/Block.md) \| `undefined`\>

#### blockchain.initOptions

> `readonly` **initOptions**: [`ChainOptions`](../../blockchain/type-aliases/ChainOptions.md)

### evm

> `readonly` **evm**: `object`

#### evm.common

> `readonly` **common**: `object`

#### evm.common.consensus

> `readonly` **consensus**: `object`

#### evm.common.consensus.algorithm

> `readonly` **algorithm**: `string` \| [`ConsensusAlgorithm`](../../common/enumerations/ConsensusAlgorithm.md)

#### evm.common.consensus.type

> `readonly` **type**: `string` \| [`ConsensusType`](../../common/enumerations/ConsensusType.md)

#### evm.common.eips

> `readonly` **eips**: `number`[]

#### evm.common.hardfork

> `readonly` **hardfork**: `string`

#### evm.opcodes

> `readonly` **opcodes**: `Map`\<`number`, \{ `code`: `number`; `dynamicGas`: `boolean`; `fee`: `number`; `feeBigInt`: `bigint`; `fullName`: `string`; `isAsync`: `boolean`; `isInvalid`: `boolean`; `name`: `string`; \}\>

#### evm.precompiles

> `readonly` **precompiles**: `Map`\<`string`, (`input`) => `Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\> \| [`ExecResult`](../../evm/interfaces/ExecResult.md)\>

### node

> `readonly` **node**: `object`

#### node.filters

> `readonly` **filters**: `Map`\<[`Hex`](Hex.md), [`Filter`](../../index/type-aliases/Filter.md)\>

#### node.impersonatedAccount

> `readonly` **impersonatedAccount**: [`Address`](../../index/type-aliases/Address.md) \| `undefined`

#### node.miningConfig

> `readonly` **miningConfig**: [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"miningConfig"`\]

#### node.mode

> `readonly` **mode**: [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"mode"`\]

#### node.status

> `readonly` **status**: [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"status"`\]

### pool

> `readonly` **pool**: `object`

#### pool.pool

> `readonly` **pool**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"pool"`\]

#### pool.txsByHash

> `readonly` **txsByHash**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsByHash"`\]

#### pool.txsByNonce

> `readonly` **txsByNonce**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsByNonce"`\]

#### pool.txsInNonceOrder

> `readonly` **txsInNonceOrder**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsInNonceOrder"`\]

#### pool.txsInPool

> `readonly` **txsInPool**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsInPool"`\]

### stateManager

> `readonly` **stateManager**: `object`

#### stateManager.stateRoots

> `readonly` **stateRoots**: [`StateRoots`](../../state/type-aliases/StateRoots.md)

#### stateManager.storage

> `readonly` **storage**: [`TevmState`](../../index/type-aliases/TevmState.md)
