[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / createTestSnapshotClient

# Function: createTestSnapshotClient()

> **createTestSnapshotClient**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`): [`TestSnapshotClient`](../type-aliases/TestSnapshotClient.md)\<`TCommon`, `TAccountOrAddress`\>

Defined in: [extensions/test-node/src/createTestSnapshotClient.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/createTestSnapshotClient.ts#L32)

Creates a test snapshot client that automatically caches RPC responses

## Type Parameters

### TCommon

`TCommon` *extends* `object` & `object` & `ChainConfig`\<`undefined` \| `ChainFormatters`, `undefined` \| `Record`\<`string`, `unknown`\>\> = `object` & `object` & `ChainConfig`\<`undefined` \| `ChainFormatters`, `undefined` \| `Record`\<`string`, `unknown`\>\>

### TAccountOrAddress

`TAccountOrAddress` *extends* `undefined` \| `` `0x${string}` `` \| `Account` = `undefined`

### TRpcSchema

`TRpcSchema` *extends* `undefined` \| `RpcSchema` = \[\{ `Method`: `"web3_clientVersion"`; `Parameters?`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters?`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"net_version"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}\]

## Parameters

### options

[`TestSnapshotClientOptions`](../type-aliases/TestSnapshotClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

Configuration options for the client

## Returns

[`TestSnapshotClient`](../type-aliases/TestSnapshotClient.md)\<`TCommon`, `TAccountOrAddress`\>

A test snapshot client with automatic caching

## Example

```typescript
import { createTestSnapshotClient } from '@tevm/test-node'
import { http } from 'viem'

const client = createTestSnapshotClient({
  fork: { transport: http('https://mainnet.optimism.io')() },
  test: { cacheDir: '.tevm/test-snapshots' }
})

// Use the client in your tests
await client.server.start()
const block = await client.getBlock({ blockNumber: 123n })
await client.server.stop()
```
