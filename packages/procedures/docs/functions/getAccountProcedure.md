**@tevm/procedures** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > getAccountProcedure

# Function: getAccountProcedure()

> **getAccountProcedure**(`client`): `GetAccountJsonRpcProcedure`

Creates an GetAccount JSON-RPC Procedure for handling account requests with Ethereumjs VM

## Parameters

▪ **client**: `object`

▪ **client.chainId**: `number`

Gets the chainId of the current EVM

▪ **client.extend**: \<`TExtension`\>(`decorator`) => `BaseClient`\<`"fork"` \| `"proxy"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality

▪ **client.forkUrl?**: `string`

Fork url if the EVM is forked

▪ **client.mode**: `"fork"` \| `"proxy"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`proxy` mode will fetch all state from the latest block of the provided proxy URL
`normal` mode will not fetch any state and will only run the EVM in memory

▪ **client.vm**: `TevmVm`

Internal instance of the VM. Can be used for lower level operations

## Returns

## Source

[procedures/src/tevm/getAccountProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm/getAccountProcedure.js#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
