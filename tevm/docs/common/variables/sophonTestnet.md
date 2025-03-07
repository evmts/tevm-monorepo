[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / sophonTestnet

# Variable: sophonTestnet

> `const` **sophonTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/sophonTestnet.d.ts:21

Creates a common configuration for the sophonTestnet chain.

## Description

Chain ID: 531050104
Chain Name: Sophon Testnet
Default Block Explorer: https://explorer.testnet.sophon.xyz
Default RPC URL: https://rpc.testnet.sophon.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { sophonTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: sophonTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
