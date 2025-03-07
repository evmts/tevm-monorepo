[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bob

# Variable: bob

> `const` **bob**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bob.d.ts:21

Creates a common configuration for the bob chain.

## Description

Chain ID: 60808
Chain Name: BOB
Default Block Explorer: https://explorer.gobob.xyz
Default RPC URL: https://rpc.gobob.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bob } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bob,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
