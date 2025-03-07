[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fluence

# Variable: fluence

> `const` **fluence**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fluence.d.ts:21

Creates a common configuration for the fluence chain.

## Description

Chain ID: 9999999
Chain Name: Fluence
Default Block Explorer: https://blockscout.mainnet.fluence.dev
Default RPC URL: https://rpc.mainnet.fluence.dev

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fluence } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fluence,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
