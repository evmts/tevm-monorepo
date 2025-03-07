[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zksyncInMemoryNode

# Variable: zksyncInMemoryNode

> `const` **zksyncInMemoryNode**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zksyncInMemoryNode.d.ts:21

Creates a common configuration for the zksyncInMemoryNode chain.

## Description

Chain ID: 260
Chain Name: ZKsync InMemory Node
Default Block Explorer: Not specified
Default RPC URL: http://localhost:8011

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zksyncInMemoryNode } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zksyncInMemoryNode,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
