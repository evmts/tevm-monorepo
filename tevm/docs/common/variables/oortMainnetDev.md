[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / oortMainnetDev

# Variable: oortMainnetDev

> `const` **oortMainnetDev**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/oortMainnetDev.d.ts:21

Creates a common configuration for the oortMainnetDev chain.

## Description

Chain ID: 9700
Chain Name: OORT MainnetDev
Default Block Explorer: https://dev-scan.oortech.com
Default RPC URL: https://dev-rpc.oortech.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { oortMainnetDev } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: oortMainnetDev,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
