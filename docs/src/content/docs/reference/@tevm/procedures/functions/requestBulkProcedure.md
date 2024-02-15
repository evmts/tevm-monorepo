---
editUrl: false
next: false
prev: false
title: "requestBulkProcedure"
---

> **requestBulkProcedure**(`client`): `TevmJsonRpcBulkRequestHandler`

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

[procedures/src/requestBulkProcedure.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/requestBulkProcedure.js#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
