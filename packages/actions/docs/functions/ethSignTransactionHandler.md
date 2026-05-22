[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSignTransactionHandler

# Function: ethSignTransactionHandler()

> **ethSignTransactionHandler**(`options`): [`EthSignTransactionHandler`](../type-aliases/EthSignTransactionHandler.md)

Defined in: [packages/actions/src/eth/ethSignTransactionHandler.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignTransactionHandler.js#L13)

Creates a handler for the `eth_signTransaction` JSON-RPC method.
Signs but does not broadcast a transaction. The chain ID is resolved lazily.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `accounts`: readonly `object`[]; `getChainId`: () => `Promise`\<`number`\>; \} | - |
| `options.accounts` | readonly `object`[] | - |
| `options.getChainId` | () => `Promise`\<`number`\> | - |

## Returns

[`EthSignTransactionHandler`](../type-aliases/EthSignTransactionHandler.md)

## Throws

If `from` is not found in `accounts`.
