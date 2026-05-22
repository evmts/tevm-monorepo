[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / anvilMetadataJsonRpcProcedure

# Function: anvilMetadataJsonRpcProcedure()

> **anvilMetadataJsonRpcProcedure**(`client`): [`AnvilMetadataProcedure`](../type-aliases/AnvilMetadataProcedure.md)

Defined in: [packages/actions/src/anvil/anvilMetadataProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/anvilMetadataProcedure.js#L8)

Request handler for anvil_metadata JSON-RPC requests.
Returns metadata about the running Tevm node including version and fork information.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`AnvilMetadataProcedure`](../type-aliases/AnvilMetadataProcedure.md)
