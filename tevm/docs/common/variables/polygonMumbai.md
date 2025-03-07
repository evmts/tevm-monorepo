[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / polygonMumbai

# Variable: polygonMumbai

> `const` **polygonMumbai**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/polygonMumbai.d.ts:21

Creates a common configuration for the polygonMumbai chain.

## Description

Chain ID: 80001
Chain Name: Polygon Mumbai
Default Block Explorer: https://mumbai.polygonscan.com
Default RPC URL: https://rpc.ankr.com/polygon_mumbai

## Example

```ts
import { createMemoryClient } from 'tevm'
import { polygonMumbai } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: polygonMumbai,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
