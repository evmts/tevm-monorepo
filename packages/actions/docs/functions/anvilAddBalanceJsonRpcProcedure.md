[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilAddBalanceJsonRpcProcedure

# Function: anvilAddBalanceJsonRpcProcedure()

> **anvilAddBalanceJsonRpcProcedure**(`client`): [`AnvilAddBalanceProcedure`](../type-aliases/AnvilAddBalanceProcedure.md)

Defined in: [packages/actions/src/anvil/anvilAddBalanceProcedure.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilAddBalanceProcedure.js#L10)

Request handler for anvil_addBalance JSON-RPC requests.
Adds to an account's ETH balance (convenience method over anvil_setBalance).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilAddBalanceProcedure`](../type-aliases/AnvilAddBalanceProcedure.md)
