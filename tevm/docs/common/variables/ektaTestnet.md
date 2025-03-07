[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / ektaTestnet

# Variable: ektaTestnet

> `const` **ektaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/ektaTestnet.d.ts:21

Creates a common configuration for the ektaTestnet chain.

## Description

Chain ID: 1004
Chain Name: Ekta Testnet
Default Block Explorer: https://test.ektascan.io
Default RPC URL: https://test.ekta.io:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { ektaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: ektaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
