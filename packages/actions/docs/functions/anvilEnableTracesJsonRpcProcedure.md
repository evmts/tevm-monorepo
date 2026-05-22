[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilEnableTracesJsonRpcProcedure

# Function: anvilEnableTracesJsonRpcProcedure()

> **anvilEnableTracesJsonRpcProcedure**(`client`): [`AnvilEnableTracesProcedure`](../type-aliases/AnvilEnableTracesProcedure.md)

Defined in: [packages/actions/src/anvil/anvilEnableTracesProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilEnableTracesProcedure.js#L9)

Request handler for anvil_enableTraces JSON-RPC requests.
Enables or disables automatic trace collection for all transactions.
When enabled, all executed transactions include traces in their responses.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilEnableTracesProcedure`](../type-aliases/AnvilEnableTracesProcedure.md)
