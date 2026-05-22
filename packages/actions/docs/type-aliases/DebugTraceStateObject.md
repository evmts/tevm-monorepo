[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugTraceStateObject

# Type Alias: DebugTraceStateObject

> **DebugTraceStateObject** = `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L103)

Complete state object structure

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blockchain"></a> `blockchain` | `readonly` | `object` | [packages/actions/src/debug/DebugResult.ts:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L104) |
| `blockchain.blocksByNumber` | `readonly` | `Map`\<`bigint`, `Block` \| `undefined`\> | [packages/actions/src/debug/DebugResult.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L105) |
| `blockchain.initOptions` | `readonly` | `ChainOptions` | [packages/actions/src/debug/DebugResult.ts:106](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L106) |
| <a id="evm"></a> `evm` | `readonly` | `object` | [packages/actions/src/debug/DebugResult.ts:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L108) |
| `evm.common` | `readonly` | `object` | [packages/actions/src/debug/DebugResult.ts:123](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L123) |
| `evm.common.consensus` | `readonly` | `object` | [packages/actions/src/debug/DebugResult.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L126) |
| `evm.common.consensus.algorithm` | `readonly` | `string` \| `ConsensusAlgorithm` | [packages/actions/src/debug/DebugResult.ts:127](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L127) |
| `evm.common.consensus.type` | `readonly` | `string` \| `ConsensusType` | [packages/actions/src/debug/DebugResult.ts:128](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L128) |
| `evm.common.eips` | `readonly` | `number`[] | [packages/actions/src/debug/DebugResult.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L124) |
| `evm.common.hardfork` | `readonly` | `string` | [packages/actions/src/debug/DebugResult.ts:125](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L125) |
| `evm.opcodes` | `readonly` | `Map`\<`number`, \{ `code`: `number`; `dynamicGas`: `boolean`; `fee`: `number`; `feeBigInt`: `bigint`; `fullName`: `string`; `isAsync`: `boolean`; `isInvalid`: `boolean`; `name`: `string`; \}\> | [packages/actions/src/debug/DebugResult.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L109) |
| `evm.precompiles` | `readonly` | `Map`\<`string`, (`input`) => `Promise`\<`ExecResult`\> \| `ExecResult`\> | [packages/actions/src/debug/DebugResult.ts:122](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L122) |
| <a id="node"></a> `node` | `readonly` | `object` | [packages/actions/src/debug/DebugResult.ts:132](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L132) |
| `node.filters` | `readonly` | `Map`\<[`Hex`](Hex.md), `Filter`\> | [packages/actions/src/debug/DebugResult.ts:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L136) |
| `node.impersonatedAccount` | `readonly` | `Address` \| `undefined` | [packages/actions/src/debug/DebugResult.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L137) |
| `node.miningConfig` | `readonly` | `TevmNode`\[`"miningConfig"`\] | [packages/actions/src/debug/DebugResult.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L135) |
| `node.mode` | `readonly` | `TevmNode`\[`"mode"`\] | [packages/actions/src/debug/DebugResult.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L134) |
| `node.status` | `readonly` | `TevmNode`\[`"status"`\] | [packages/actions/src/debug/DebugResult.ts:133](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L133) |
| <a id="pool"></a> `pool` | `readonly` | `object` | [packages/actions/src/debug/DebugResult.ts:139](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L139) |
| `pool.pool` | `readonly` | `TxPool`\[`"pool"`\] | [packages/actions/src/debug/DebugResult.ts:140](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L140) |
| `pool.txsByHash` | `readonly` | `TxPool`\[`"txsByHash"`\] | [packages/actions/src/debug/DebugResult.ts:141](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L141) |
| `pool.txsByNonce` | `readonly` | `TxPool`\[`"txsByNonce"`\] | [packages/actions/src/debug/DebugResult.ts:142](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L142) |
| `pool.txsInNonceOrder` | `readonly` | `TxPool`\[`"txsInNonceOrder"`\] | [packages/actions/src/debug/DebugResult.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L143) |
| `pool.txsInPool` | `readonly` | `TxPool`\[`"txsInPool"`\] | [packages/actions/src/debug/DebugResult.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L144) |
| <a id="statemanager"></a> `stateManager` | `readonly` | `object` | [packages/actions/src/debug/DebugResult.ts:146](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L146) |
| `stateManager.stateRoots` | `readonly` | `StateRoots` | [packages/actions/src/debug/DebugResult.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L148) |
| `stateManager.storage` | `readonly` | `TevmState` | [packages/actions/src/debug/DebugResult.ts:147](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L147) |
