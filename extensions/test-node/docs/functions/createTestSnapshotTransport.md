[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / createTestSnapshotTransport

# Function: createTestSnapshotTransport()

> **createTestSnapshotTransport**\<`TTransportType`, `TRpcAttributes`, `TEip1193RequestFn`\>(`options`): [`TestSnapshotTransport`](../type-aliases/TestSnapshotTransport.md)\<`TEip1193RequestFn`\>

Defined in: [extensions/test-node/src/createTestSnapshotTransport.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/createTestSnapshotTransport.ts#L27)

Creates a test snapshot transport that automatically caches RPC responses

## Type Parameters

### TTransportType

`TTransportType` *extends* `string` = `string`

### TRpcAttributes

`TRpcAttributes` = `Record`\<`string`, `any`\>

### TEip1193RequestFn

`TEip1193RequestFn` *extends* `EIP1193RequestFn` = `EIP1193RequestFn`

## Parameters

### options

[`TestSnapshotTransportOptions`](../type-aliases/TestSnapshotTransportOptions.md)\<`TTransportType`, `TRpcAttributes`, `TEip1193RequestFn`\>

Configuration options for the transport

## Returns

[`TestSnapshotTransport`](../type-aliases/TestSnapshotTransport.md)\<`TEip1193RequestFn`\>

A test snapshot transport with automatic caching

## Example

```typescript
import { createTestSnapshotTransport } from '@tevm/test-node'
import { http } from 'viem'

const transport = createTestSnapshotTransport({
  transport: http('https://mainnet.optimism.io')(),
  test: { cacheDir: '.tevm/test-snapshots' }
})

// Use the transport in your tests
await transport.server.start()
const block = await transport.request({ method: 'eth_getBlockByNumber', params: [123n, false] })
await transport.server.stop()
```
