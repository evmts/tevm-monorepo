[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / etherlink

# Variable: etherlink

> `const` **etherlink**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/etherlink.d.ts:21

Creates a common configuration for the etherlink chain.

## Description

Chain ID: 42793
Chain Name: Etherlink
Default Block Explorer: https://explorer.etherlink.com
Default RPC URL: https://node.mainnet.etherlink.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { etherlink } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: etherlink,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
