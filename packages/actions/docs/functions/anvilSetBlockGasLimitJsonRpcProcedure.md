[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetBlockGasLimitJsonRpcProcedure

# Function: anvilSetBlockGasLimitJsonRpcProcedure()

> **anvilSetBlockGasLimitJsonRpcProcedure**(`client`): [`AnvilSetBlockGasLimitProcedure`](../type-aliases/AnvilSetBlockGasLimitProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetBlockGasLimitProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetBlockGasLimitProcedure.js#L8)

Request handler for anvil_setBlockGasLimit JSON-RPC requests.
Sets the gas limit for all subsequent blocks (persists across blocks).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilSetBlockGasLimitProcedure`](../type-aliases/AnvilSetBlockGasLimitProcedure.md)
