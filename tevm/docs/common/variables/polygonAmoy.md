[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / polygonAmoy

# Variable: polygonAmoy

> `const` **polygonAmoy**: `Common`

Creates a common configuration for the polygonAmoy chain.

## Description

Chain ID: 80002
Chain Name: Polygon Amoy
Default Block Explorer: https://amoy.polygonscan.com
Default RPC URL: https://rpc-amoy.polygon.technology

## Example

```ts
import { createMemoryClient } from 'tevm'
import { polygonAmoy } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: polygonAmoy,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/polygonAmoy.d.ts:21
