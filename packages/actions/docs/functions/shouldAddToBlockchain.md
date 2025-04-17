[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / shouldAddToBlockchain

# Function: shouldAddToBlockchain()

> **shouldAddToBlockchain**(`params`, `runTxResult`): `boolean`

Defined in: [packages/actions/src/Call/shouldCreateTransaction.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/shouldCreateTransaction.js#L41)

**`Internal`**

Determines if a transaction should be added to the blockchain based on the `addToBlockchain` parameter

## Parameters

### params

[`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

### runTxResult

`RunTxResult`

## Returns

`boolean`

## Throws

only if the `addToBlockchain` parameter is invalid based on ts type
