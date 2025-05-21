[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / validateRunTx

# Function: validateRunTx()

> **validateRunTx**(`vm`): (`opts`) => `Promise`\<\{ `block`: [`Block`](../../block/classes/Block.md); `blockGasUsed?`: `bigint`; `preserveJournal`: `boolean`; `reportAccessList?`: `boolean`; `reportPreimages?`: `boolean`; `skipBalance?`: `boolean`; `skipBlockGasLimitValidation?`: `boolean`; `skipHardForkValidation?`: `boolean`; `skipNonce?`: `boolean`; `tx`: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md); \}\>

Defined in: packages/vm/types/actions/validateRunTx.d.ts:1

## Parameters

### vm

`BaseVm`

## Returns

> (`opts`): `Promise`\<\{ `block`: [`Block`](../../block/classes/Block.md); `blockGasUsed?`: `bigint`; `preserveJournal`: `boolean`; `reportAccessList?`: `boolean`; `reportPreimages?`: `boolean`; `skipBalance?`: `boolean`; `skipBlockGasLimitValidation?`: `boolean`; `skipHardForkValidation?`: `boolean`; `skipNonce?`: `boolean`; `tx`: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md); \}\>

### Parameters

#### opts

[`RunTxOpts`](../interfaces/RunTxOpts.md)

### Returns

`Promise`\<\{ `block`: [`Block`](../../block/classes/Block.md); `blockGasUsed?`: `bigint`; `preserveJournal`: `boolean`; `reportAccessList?`: `boolean`; `reportPreimages?`: `boolean`; `skipBalance?`: `boolean`; `skipBlockGasLimitValidation?`: `boolean`; `skipHardForkValidation?`: `boolean`; `skipNonce?`: `boolean`; `tx`: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md); \}\>
