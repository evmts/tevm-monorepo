---
editUrl: false
next: false
prev: false
title: "callProcedure"
---

> **callProcedure**(`client`): `CallJsonRpcProcedure`

Creates a Call JSON-RPC Procedure for handling call requests with Ethereumjs EVM

## Parameters

▪ **client**: `object`

▪ **client.chainId**: `number`

Gets the chainId of the current EVM

▪ **client.extend**: \<`TExtension`\>(`decorator`) => [`BaseClient`](/reference/tevm/base-client/type-aliases/baseclient/)\<`"fork"` \| `"proxy"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality

▪ **client.forkUrl?**: `string`

Fork url if the EVM is forked

▪ **client.mode**: `"fork"` \| `"proxy"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`proxy` mode will fetch all state from the latest block of the provided proxy URL
`normal` mode will not fetch any state and will only run the EVM in memory

▪ **client.vm**: [`TevmVm`](/reference/tevm/vm/classes/tevmvm/)

Internal instance of the VM. Can be used for lower level operations

## Returns

## Source

[procedures/src/tevm/callProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm/callProcedure.js#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
