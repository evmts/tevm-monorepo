[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / scroll

# Variable: scroll

> `const` **scroll**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/scroll.d.ts:21

Creates a common configuration for the scroll chain.

## Description

Chain ID: 534352
Chain Name: Scroll
Default Block Explorer: https://scrollscan.com
Default RPC URL: https://rpc.scroll.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { scroll } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: scroll,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
