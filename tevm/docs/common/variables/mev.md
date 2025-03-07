[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / mev

# Variable: mev

> `const` **mev**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/mev.d.ts:21

Creates a common configuration for the mev chain.

## Description

Chain ID: 7518
Chain Name: MEVerse Chain Mainnet
Default Block Explorer: https://www.meversescan.io
Default RPC URL: https://rpc.meversemainnet.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mev } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mev,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
