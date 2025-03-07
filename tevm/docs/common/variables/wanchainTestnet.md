[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / wanchainTestnet

# Variable: wanchainTestnet

> `const` **wanchainTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/wanchainTestnet.d.ts:21

Creates a common configuration for the wanchainTestnet chain.

## Description

Chain ID: 999
Chain Name: Wanchain Testnet
Default Block Explorer: https://wanscan.org
Default RPC URL: https://gwan-ssl.wandevs.org:46891

## Example

```ts
import { createMemoryClient } from 'tevm'
import { wanchainTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: wanchainTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
