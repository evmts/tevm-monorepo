[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / root

# Variable: root

> `const` **root**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/root.d.ts:21

Creates a common configuration for the root chain.

## Description

Chain ID: 7668
Chain Name: The Root Network
Default Block Explorer: https://rootscan.io
Default RPC URL: https://root.rootnet.live/archive

## Example

```ts
import { createMemoryClient } from 'tevm'
import { root } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: root,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
