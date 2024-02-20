---
editUrl: false
next: false
prev: false
title: "BaseClient"
---

> **BaseClient**\<`TMode`, `TExtended`\>: `object` & `TExtended`

The base client used by Tevm. Add extensions to add additional functionality

## Type declaration

### chainId

> **`readonly`** **chainId**: `number`

Gets the chainId of the current EVM

### extend

> **`readonly`** **extend**: \<`TExtension`\>(`decorator`) => [`BaseClient`](/reference/tevm/base-client/type-aliases/baseclient/)\<`TMode`, `TExtended` & `TExtension`\>

Extends the base client with additional functionality

Extends the base client with additional functionality

#### Type parameters

▪ **TExtension** extends `Record`\<`string`, `any`\>

#### Parameters

▪ **decorator**: (`client`) => `TExtension`

### forkUrl

> **`readonly`** **forkUrl**?: `string`

Fork url if the EVM is forked

### mode

> **`readonly`** **mode**: `TMode`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`proxy` mode will fetch all state from the latest block of the provided proxy URL
`normal` mode will not fetch any state and will only run the EVM in memory

### vm

> **`readonly`** **vm**: [`TevmVm`](/reference/tevm/vm/classes/tevmvm/)

Internal instance of the VM. Can be used for lower level operations

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TMode` extends `"fork"` \| `"proxy"` \| `"normal"` | `"fork"` \| `"proxy"` \| `"normal"` |
| `TExtended` | `object` |

## Source

[BaseClient.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/BaseClient.ts#L6)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
