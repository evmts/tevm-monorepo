[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / btr

# Variable: btr

> `const` **btr**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/btr.d.ts:21

Creates a common configuration for the btr chain.

## Description

Chain ID: 200901
Chain Name: Bitlayer
Default Block Explorer: https://www.btrscan.com
Default RPC URL: https://rpc.bitlayer.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { btr } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: btr,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
