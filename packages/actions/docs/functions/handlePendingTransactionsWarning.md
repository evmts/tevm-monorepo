[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / handlePendingTransactionsWarning

# Function: handlePendingTransactionsWarning()

> **handlePendingTransactionsWarning**(`client`, `params`, `code`, `deployedBytecode`): `Promise`\<`void`\>

Defined in: [packages/actions/src/Call/handlePendingTransactionsWarning.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/handlePendingTransactionsWarning.js#L14)

Handles warning for pending transactions in the transaction pool.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |
| `params` | [`CallParams`](../type-aliases/CallParams.md)\<`boolean`\> | - |
| `code` | `string` \| `undefined` | - |
| `deployedBytecode` | `string` \| `undefined` | - |

## Returns

`Promise`\<`void`\>

## Throws
