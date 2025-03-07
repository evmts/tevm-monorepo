[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zksyncLocalNode

# Variable: zksyncLocalNode

> `const` **zksyncLocalNode**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zksyncLocalNode.d.ts:21

Creates a common configuration for the zksyncLocalNode chain.

## Description

Chain ID: 270
Chain Name: ZKsync CLI Local Node
Default Block Explorer: Not specified
Default RPC URL: http://localhost:3050

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zksyncLocalNode } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zksyncLocalNode,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
