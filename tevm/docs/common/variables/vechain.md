[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / vechain

# Variable: vechain

> `const` **vechain**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/vechain.d.ts:21

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
