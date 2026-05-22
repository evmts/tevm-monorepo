[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetPrevRandaoJsonRpcProcedure

# Function: anvilSetPrevRandaoJsonRpcProcedure()

> **anvilSetPrevRandaoJsonRpcProcedure**(`client`): (`request`) => `Promise`\<\{ `error`: \{ `code`: `string`; `message`: `string`; \}; `id?`: `any`; `jsonrpc`: `string`; `method`: `any`; \} \| \{ `id?`: `any`; `jsonrpc`: `string`; `method`: `any`; `result`: `null`; \}\>

Defined in: [packages/actions/src/anvil/anvilSetPrevRandaoProcedure.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetPrevRandaoProcedure.js#L6)

JSON-RPC procedure for anvil_setPrevRandao

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

(`request`) => `Promise`\<\{ `error`: \{ `code`: `string`; `message`: `string`; \}; `id?`: `any`; `jsonrpc`: `string`; `method`: `any`; \} \| \{ `id?`: `any`; `jsonrpc`: `string`; `method`: `any`; `result`: `null`; \}\>
