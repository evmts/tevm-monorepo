[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / requestProcedure

# Function: requestProcedure()

> **requestProcedure**(`client`): [`TevmJsonRpcRequestHandler`](../type-aliases/TevmJsonRpcRequestHandler.md)

Defined in: [packages/actions/src/requestProcedure.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/requestProcedure.js#L12)

Request handler for JSON-RPC requests to Tevm. Dispatches via the Tevm VM.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`TevmJsonRpcRequestHandler`](../type-aliases/TevmJsonRpcRequestHandler.md)

## See

createHandlers where handlers are defined
