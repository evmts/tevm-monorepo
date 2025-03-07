[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zora

# Variable: zora

> `const` **zora**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zora.d.ts:21

Creates a common configuration for the zora chain.

## Description

Chain ID: 7777777
Chain Name: Zora
Default Block Explorer: https://explorer.zora.energy
Default RPC URL: https://rpc.zora.energy

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zora } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zora,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
