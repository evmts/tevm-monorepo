**@tevm/procedures** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > setAccountProcedure

# Function: setAccountProcedure()

> **setAccountProcedure**(`client`): `SetAccountJsonRpcProcedure`

Creates an SetAccount JSON-RPC Procedure for handling tevm_setAccount requests with Ethereumjs VM

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

[procedures/src/tevm/setAccountProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm/setAccountProcedure.js#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
