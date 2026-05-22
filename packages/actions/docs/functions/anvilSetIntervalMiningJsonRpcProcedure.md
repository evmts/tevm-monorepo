[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilSetIntervalMiningJsonRpcProcedure

# Function: anvilSetIntervalMiningJsonRpcProcedure()

> **anvilSetIntervalMiningJsonRpcProcedure**(`client`): [`AnvilSetIntervalMiningProcedure`](../type-aliases/AnvilSetIntervalMiningProcedure.md)

Defined in: [packages/actions/src/anvil/anvilSetIntervalMiningProcedure.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilSetIntervalMiningProcedure.js#L7)

Request handler for anvil_setIntervalMining JSON-RPC requests.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilSetIntervalMiningProcedure`](../type-aliases/AnvilSetIntervalMiningProcedure.md)

Pass `0` as the interval to disable interval mining.
