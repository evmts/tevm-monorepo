[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateObject

# Type Alias: DebugTraceStateObject

> **DebugTraceStateObject** = `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L65)

Complete state object structure

## Properties

### blockchain

> `readonly` **blockchain**: `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L66)

#### blocksByNumber

> `readonly` **blocksByNumber**: `Map`\<`bigint`, `Block` \| `undefined`\>

#### initOptions

> `readonly` **initOptions**: `ChainOptions`

***

### evm

> `readonly` **evm**: `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L70)

#### common

> `readonly` **common**: `object`

##### common.consensus

> `readonly` **consensus**: `object`

##### common.consensus.algorithm

> `readonly` **algorithm**: `string` \| `ConsensusAlgorithm`

##### common.consensus.type

> `readonly` **type**: `string` \| `ConsensusType`

##### common.eips

> `readonly` **eips**: `number`[]

##### common.hardfork

> `readonly` **hardfork**: `string`

#### opcodes

> `readonly` **opcodes**: `Map`\<`number`, \{ `code`: `number`; `dynamicGas`: `boolean`; `fee`: `number`; `feeBigInt`: `bigint`; `fullName`: `string`; `isAsync`: `boolean`; `isInvalid`: `boolean`; `name`: `string`; \}\>

#### precompiles

> `readonly` **precompiles**: `Map`\<`string`, (`input`) => `Promise`\<`ExecResult`\> \| `ExecResult`\>

***

### node

> `readonly` **node**: `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:94](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L94)

#### filters

> `readonly` **filters**: `Map`\<[`Hex`](Hex.md), `Filter`\>

#### impersonatedAccount

> `readonly` **impersonatedAccount**: `Address` \| `undefined`

#### miningConfig

> `readonly` **miningConfig**: `TevmNode`\[`"miningConfig"`\]

#### mode

> `readonly` **mode**: `TevmNode`\[`"mode"`\]

#### status

> `readonly` **status**: `TevmNode`\[`"status"`\]

***

### pool

> `readonly` **pool**: `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L101)

#### pool

> `readonly` **pool**: `TxPool`\[`"pool"`\]

#### txsByHash

> `readonly` **txsByHash**: `TxPool`\[`"txsByHash"`\]

#### txsByNonce

> `readonly` **txsByNonce**: `TxPool`\[`"txsByNonce"`\]

#### txsInNonceOrder

> `readonly` **txsInNonceOrder**: `TxPool`\[`"txsInNonceOrder"`\]

#### txsInPool

> `readonly` **txsInPool**: `TxPool`\[`"txsInPool"`\]

***

### stateManager

> `readonly` **stateManager**: `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L108)

#### stateRoots

> `readonly` **stateRoots**: `StateRoots`

#### storage

> `readonly` **storage**: `TevmState`
