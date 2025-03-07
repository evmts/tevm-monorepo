[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / edgeware

# Variable: edgeware

> `const` **edgeware**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/edgeware.d.ts:21

Creates a common configuration for the edgeware chain.

## Description

Chain ID: 2021
Chain Name: Edgeware EdgeEVM Mainnet
Default Block Explorer: https://edgscan.live
Default RPC URL: https://edgeware-evm.jelliedowl.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { edgeware } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: edgeware,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
