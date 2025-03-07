[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / koi

# Variable: koi

> `const` **koi**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/koi.d.ts:21

Creates a common configuration for the koi chain.

## Description

Chain ID: 701
Chain Name: Koi Network
Default Block Explorer: https://koi-scan.darwinia.network
Default RPC URL: https://koi-rpc.darwinia.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { koi } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: koi,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
