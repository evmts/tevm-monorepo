[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DebugTraceStateObject

# Type Alias: DebugTraceStateObject

> **DebugTraceStateObject** = `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:43

Complete state object structure

## Properties

### blockchain

> `readonly` **blockchain**: `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:44

#### blocksByNumber

> `readonly` **blocksByNumber**: `Map`\<`bigint`, [`Block`](../../block/classes/Block.md) \| `undefined`\>

#### initOptions

> `readonly` **initOptions**: [`ChainOptions`](../../blockchain/type-aliases/ChainOptions.md)

***

### evm

> `readonly` **evm**: `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:48

#### common

> `readonly` **common**: `object`

##### common.consensus

> `readonly` **consensus**: `object`

##### common.consensus.algorithm

> `readonly` **algorithm**: `string` \| [`ConsensusAlgorithm`](../../common/type-aliases/ConsensusAlgorithm.md)

##### common.consensus.type

> `readonly` **type**: `string` \| [`ConsensusType`](../../common/type-aliases/ConsensusType.md)

##### common.eips

> `readonly` **eips**: `number`[]

##### common.hardfork

> `readonly` **hardfork**: `string`

#### opcodes

> `readonly` **opcodes**: `Map`\<`number`, \{ `code`: `number`; `dynamicGas`: `boolean`; `fee`: `number`; `feeBigInt`: `bigint`; `fullName`: `string`; `isAsync`: `boolean`; `isInvalid`: `boolean`; `name`: `string`; \}\>

#### precompiles

> `readonly` **precompiles**: `Map`\<`string`, (`input`) => `Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\> \| [`ExecResult`](../../evm/interfaces/ExecResult.md)\>

***

### node

> `readonly` **node**: `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:69

#### filters

> `readonly` **filters**: `Map`\<[`Hex`](Hex.md), [`Filter`](../../index/type-aliases/Filter.md)\>

#### impersonatedAccount

> `readonly` **impersonatedAccount**: [`Address`](../../index/type-aliases/Address.md) \| `undefined`

#### miningConfig

> `readonly` **miningConfig**: [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"miningConfig"`\]

#### mode

> `readonly` **mode**: [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"mode"`\]

#### status

> `readonly` **status**: [`TevmNode`](../../index/type-aliases/TevmNode.md)\[`"status"`\]

***

### pool

> `readonly` **pool**: `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:76

#### pool

> `readonly` **pool**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"pool"`\]

#### txsByHash

> `readonly` **txsByHash**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsByHash"`\]

#### txsByNonce

> `readonly` **txsByNonce**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsByNonce"`\]

#### txsInNonceOrder

> `readonly` **txsInNonceOrder**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsInNonceOrder"`\]

#### txsInPool

> `readonly` **txsInPool**: [`TxPool`](../../txpool/classes/TxPool.md)\[`"txsInPool"`\]

***

### stateManager

> `readonly` **stateManager**: `object`

Defined in: packages/actions/types/debug/DebugResult.d.ts:83

#### stateRoots

> `readonly` **stateRoots**: [`StateRoots`](../../state/type-aliases/StateRoots.md)

#### storage

> `readonly` **storage**: [`TevmState`](../../index/type-aliases/TevmState.md)
