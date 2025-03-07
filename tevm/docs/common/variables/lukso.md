[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / lukso

# Variable: lukso

> `const` **lukso**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/lukso.d.ts:21

Creates a common configuration for the lukso chain.

## Description

Chain ID: 42
Chain Name: LUKSO
Default Block Explorer: https://explorer.execution.mainnet.lukso.network
Default RPC URL: https://rpc.mainnet.lukso.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lukso } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lukso,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
