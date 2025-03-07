[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / shouldCreateTransaction

# Function: shouldCreateTransaction()

> **shouldCreateTransaction**(`params`, `runTxResult`): `boolean`

Defined in: [packages/actions/src/Call/shouldCreateTransaction.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/shouldCreateTransaction.js#L8)

**`Internal`**

Determines if a transaction should be created based on the `createTransaction` parameter

## Parameters

### params

[`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

### runTxResult

`RunTxResult`

## Returns

`boolean`

## Throws

only if the `createTransaction` parameter is invalid based on ts type
