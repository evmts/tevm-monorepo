[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / satoshiVMTestnet

# Variable: satoshiVMTestnet

> `const` **satoshiVMTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/satoshiVMTestnet.d.ts:21

Creates a common configuration for the satoshiVMTestnet chain.

## Description

Chain ID: 3110
Chain Name: SatoshiVM Testnet
Default Block Explorer: https://testnet.svmscan.io
Default RPC URL: https://test-rpc-node-http.svmscan.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { satoshiVMTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: satoshiVMTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
