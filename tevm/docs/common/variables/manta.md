[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / manta

# Variable: manta

> `const` **manta**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/manta.d.ts:21

Creates a common configuration for the manta chain.

## Description

Chain ID: 169
Chain Name: Manta Pacific Mainnet
Default Block Explorer: https://pacific-explorer.manta.network
Default RPC URL: https://pacific-rpc.manta.network/http

## Example

```ts
import { createMemoryClient } from 'tevm'
import { manta } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: manta,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
