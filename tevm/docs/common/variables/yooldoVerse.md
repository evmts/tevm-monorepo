[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / yooldoVerse

# Variable: yooldoVerse

> `const` **yooldoVerse**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/yooldoVerse.d.ts:21

Creates a common configuration for the yooldoVerse chain.

## Description

Chain ID: 50005
Chain Name: Yooldo Verse
Default Block Explorer: https://explorer.yooldo-verse.xyz
Default RPC URL: https://rpc.yooldo-verse.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { yooldoVerse } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: yooldoVerse,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
