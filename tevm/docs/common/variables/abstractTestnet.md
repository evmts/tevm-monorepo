[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / abstractTestnet

# Variable: abstractTestnet

> `const` **abstractTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/abstractTestnet.d.ts:21

Creates a common configuration for the abstractTestnet chain.

## Description

Chain ID: 11124
Chain Name: Abstract Testnet
Default Block Explorer: https://explorer.testnet.abs.xyz
Default RPC URL: https://api.testnet.abs.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { abstractTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: abstractTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
