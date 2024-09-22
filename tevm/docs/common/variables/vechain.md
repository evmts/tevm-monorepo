[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / vechain

# Variable: vechain

> `const` **vechain**: `Common`

Creates a common configuration for the vechain chain.

## Description

Chain ID: 100009
Chain Name: Vechain
Default Block Explorer: https://explore.vechain.org
Default RPC URL: https://mainnet.vechain.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { vechain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: vechain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/vechain.d.ts:21
