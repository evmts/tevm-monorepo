---
editUrl: false
next: false
prev: false
title: "requestProcedure"
---

> **requestProcedure**(`client`): `TevmJsonRpcRequestHandler`

Request handler for JSON-RPC requests.

This implementation of the Tevm requestProcedure spec
implements it via the ethereumjs VM.

Most users will want to use `Tevm.request` instead of
this method but this method may be desired if hyper optimizing
bundle size.

## Parameters

▪ **client**: `object`

▪ **client.extend**: \<`TExtension`\>(`decorator`) => [`BaseClient`](/reference/tevm/base-client/type-aliases/baseclient/)\<`"fork"` \| `"proxy"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

▪ **client.forkUrl?**: `string`

Fork url if the EVM is forked

**Example**

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

▪ **client.getChainId**: () => `Promise`\<`number`\>

Gets the chainId of the current EVM

**Example**

```ts
const client = createMemoryClient()
const chainId = await client.getChainId()
console.log(chainId)
```

▪ **client.getVm**: () => `Promise`\<[`TevmVm`](/reference/tevm/vm/classes/tevmvm/)\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

▪ **client.mode**: `"fork"` \| `"proxy"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`proxy` mode will fetch all state from the latest block of the provided proxy URL
`normal` mode will not fetch any state and will only run the EVM in memory

**Example**

```ts
let client = createMemoryClient()
console.log(client.mode) // 'normal'
client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.mode) // 'fork'
```

▪ **client.ready**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

**Example**

```ts
const client = createMemoryClient()
await client.ready()
```

## Returns

## Example

```typescript
const blockNumberResponse = await tevm.request({
 method: 'eth_blockNumber',
 params: []
 id: 1
 jsonrpc: '2.0'
})
const accountResponse = await tevm.request({
 method: 'tevm_getAccount',
 params: [{address: '0x123...'}]
 id: 1
 jsonrpc: '2.0'
})
```

## Source

[procedures/src/requestProcedure.js:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/requestProcedure.js#L51)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
