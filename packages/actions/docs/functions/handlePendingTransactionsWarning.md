[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / handlePendingTransactionsWarning

# Function: handlePendingTransactionsWarning()

> **handlePendingTransactionsWarning**(`client`, `params`, `code`, `deployedBytecode`): `Promise`\<`void`\>

Defined in: [packages/actions/src/Call/handlePendingTransactionsWarning.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handlePendingTransactionsWarning.js#L14)

Handles warning for pending transactions in the transaction pool.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

The TEVM base client instance.

### params

[`CallParams`](../type-aliases/CallParams.md)\<`boolean`\>

The call parameters.

### code

The code to execute.

`undefined` | `string`

### deployedBytecode

The deployed bytecode to use.

`undefined` | `string`

## Returns

`Promise`\<`void`\>

A promise that resolves when the check is complete.

## Throws

This function does not throw errors.
