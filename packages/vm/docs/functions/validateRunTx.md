[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / validateRunTx

# Function: validateRunTx()

> **validateRunTx**(`vm`): (`opts`) => `Promise`\<\{ `block`: `Block`; `blockGasUsed?`: `bigint`; `preserveJournal`: `boolean`; `reportAccessList?`: `boolean`; `reportPreimages?`: `boolean`; `skipBalance?`: `boolean`; `skipBlockGasLimitValidation?`: `boolean`; `skipHardForkValidation?`: `boolean`; `skipNonce?`: `boolean`; `tx`: `TypedTransaction`; \}\>

Defined in: [packages/vm/src/actions/validateRunTx.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/validateRunTx.js#L10)

## Parameters

### vm

`BaseVm`

## Returns

> (`opts`): `Promise`\<\{ `block`: `Block`; `blockGasUsed?`: `bigint`; `preserveJournal`: `boolean`; `reportAccessList?`: `boolean`; `reportPreimages?`: `boolean`; `skipBalance?`: `boolean`; `skipBlockGasLimitValidation?`: `boolean`; `skipHardForkValidation?`: `boolean`; `skipNonce?`: `boolean`; `tx`: `TypedTransaction`; \}\>

### Parameters

#### opts

[`RunTxOpts`](../interfaces/RunTxOpts.md)

### Returns

`Promise`\<\{ `block`: `Block`; `blockGasUsed?`: `bigint`; `preserveJournal`: `boolean`; `reportAccessList?`: `boolean`; `reportPreimages?`: `boolean`; `skipBalance?`: `boolean`; `skipBlockGasLimitValidation?`: `boolean`; `skipHardForkValidation?`: `boolean`; `skipNonce?`: `boolean`; `tx`: `TypedTransaction`; \}\>
