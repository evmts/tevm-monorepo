[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilAutoImpersonateAccountJsonRpcProcedure

# Function: anvilAutoImpersonateAccountJsonRpcProcedure()

> **anvilAutoImpersonateAccountJsonRpcProcedure**(`client`): [`AnvilAutoImpersonateAccountProcedure`](../type-aliases/AnvilAutoImpersonateAccountProcedure.md)

Defined in: [packages/actions/src/anvil/anvilAutoImpersonateAccountProcedure.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilAutoImpersonateAccountProcedure.js#L7)

Request handler for anvil_autoImpersonateAccount JSON-RPC requests.
Enables or disables automatic impersonation of all transaction senders.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilAutoImpersonateAccountProcedure`](../type-aliases/AnvilAutoImpersonateAccountProcedure.md)
