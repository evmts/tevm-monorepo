[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilGetIntervalMiningJsonRpcProcedure

# Function: anvilGetIntervalMiningJsonRpcProcedure()

> **anvilGetIntervalMiningJsonRpcProcedure**(`client`): [`AnvilGetIntervalMiningProcedure`](../type-aliases/AnvilGetIntervalMiningProcedure.md)

Defined in: [packages/actions/src/anvil/anvilGetIntervalMiningProcedure.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilGetIntervalMiningProcedure.js#L7)

Request handler for anvil_getIntervalMining JSON-RPC requests.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilGetIntervalMiningProcedure`](../type-aliases/AnvilGetIntervalMiningProcedure.md)

Returns 0 when interval mining is not configured.
