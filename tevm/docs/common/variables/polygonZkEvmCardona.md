[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / polygonZkEvmCardona

# Variable: polygonZkEvmCardona

> `const` **polygonZkEvmCardona**: `Common`

Creates a common configuration for the polygonZkEvmCardona chain.

## Description

Chain ID: 2442
Chain Name: Polygon zkEVM Cardona
Default Block Explorer: https://cardona-zkevm.polygonscan.com
Default RPC URL: https://rpc.cardona.zkevm-rpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { polygonZkEvmCardona } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: polygonZkEvmCardona,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/polygonZkEvmCardona.d.ts:21
