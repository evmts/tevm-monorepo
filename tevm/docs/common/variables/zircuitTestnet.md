[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zircuitTestnet

# Variable: zircuitTestnet

> `const` **zircuitTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zircuitTestnet.d.ts:21

Creates a common configuration for the zircuitTestnet chain.

## Description

Chain ID: 48899
Chain Name: Zircuit Testnet
Default Block Explorer: https://explorer.zircuit.com
Default RPC URL: https://zircuit1.p2pify.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zircuitTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zircuitTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
