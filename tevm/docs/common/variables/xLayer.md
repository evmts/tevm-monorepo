[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / xLayer

# Variable: xLayer

> `const` **xLayer**: `Common`

Creates a common configuration for the xLayer chain.

## Description

Chain ID: 196
Chain Name: X Layer Mainnet
Default Block Explorer: https://www.oklink.com/xlayer
Default RPC URL: https://rpc.xlayer.tech

## Example

```ts
import { createMemoryClient } from 'tevm'
import { xLayer } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: xLayer,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/xLayer.d.ts:21
