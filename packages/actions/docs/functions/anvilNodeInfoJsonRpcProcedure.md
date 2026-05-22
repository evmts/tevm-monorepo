[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilNodeInfoJsonRpcProcedure

# Function: anvilNodeInfoJsonRpcProcedure()

> **anvilNodeInfoJsonRpcProcedure**(`client`): [`AnvilNodeInfoProcedure`](../type-aliases/AnvilNodeInfoProcedure.md)

Defined in: [packages/actions/src/anvil/anvilNodeInfoProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilNodeInfoProcedure.js#L8)

Request handler for anvil_nodeInfo JSON-RPC requests.
Returns configuration information about the running Tevm node.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilNodeInfoProcedure`](../type-aliases/AnvilNodeInfoProcedure.md)
