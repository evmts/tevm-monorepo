[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateObject

# Type Alias: DebugTraceStateObject

> **DebugTraceStateObject**: `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:120](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L120)

Complete state object structure

## Type declaration

### blockchain

> `readonly` **blockchain**: `object`

#### blockchain.blocksByNumber

> `readonly` **blocksByNumber**: `Map`\<`bigint`, `Block` \| `undefined`\>

#### blockchain.initOptions

> `readonly` **initOptions**: `ChainOptions`

### evm

> `readonly` **evm**: `object`

#### evm.common

> `readonly` **common**: `object`

#### evm.common.consensus

> `readonly` **consensus**: `object`

#### evm.common.consensus.algorithm

> `readonly` **algorithm**: `string` \| `ConsensusAlgorithm`

#### evm.common.consensus.type

> `readonly` **type**: `string` \| `ConsensusType`

#### evm.common.eips

> `readonly` **eips**: `number`[]

#### evm.common.hardfork

> `readonly` **hardfork**: `string`

#### evm.opcodes

> `readonly` **opcodes**: `Map`\<`number`, \{ `code`: `number`; `dynamicGas`: `boolean`; `fee`: `number`; `feeBigInt`: `bigint`; `fullName`: `string`; `isAsync`: `boolean`; `isInvalid`: `boolean`; `name`: `string`; \}\>

#### evm.precompiles

> `readonly` **precompiles**: `Map`\<`string`, (`input`) => `Promise`\<`ExecResult`\> \| `ExecResult`\>

### node

> `readonly` **node**: `object`

#### node.filters

> `readonly` **filters**: `Map`\<[`Hex`](Hex.md), `Filter`\>

#### node.impersonatedAccount

> `readonly` **impersonatedAccount**: `Address` \| `undefined`

#### node.miningConfig

> `readonly` **miningConfig**: `TevmNode`\[`"miningConfig"`\]

#### node.mode

> `readonly` **mode**: `TevmNode`\[`"mode"`\]

#### node.status

> `readonly` **status**: `TevmNode`\[`"status"`\]

### pool

> `readonly` **pool**: `object`

#### pool.pool

> `readonly` **pool**: `TxPool`\[`"pool"`\]

#### pool.txsByHash

> `readonly` **txsByHash**: `TxPool`\[`"txsByHash"`\]

#### pool.txsByNonce

> `readonly` **txsByNonce**: `TxPool`\[`"txsByNonce"`\]

#### pool.txsInNonceOrder

> `readonly` **txsInNonceOrder**: `TxPool`\[`"txsInNonceOrder"`\]

#### pool.txsInPool

> `readonly` **txsInPool**: `TxPool`\[`"txsInPool"`\]

### stateManager

> `readonly` **stateManager**: `object`

#### stateManager.stateRoots

> `readonly` **stateRoots**: `StateRoots`

#### stateManager.storage

> `readonly` **storage**: `TevmState`
