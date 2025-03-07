[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zoraSepolia

# Variable: zoraSepolia

> `const` **zoraSepolia**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zoraSepolia.d.ts:21

Creates a common configuration for the zoraSepolia chain.

## Description

Chain ID: 999999999
Chain Name: Zora Sepolia
Default Block Explorer: https://sepolia.explorer.zora.energy/
Default RPC URL: https://sepolia.rpc.zora.energy

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zoraSepolia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zoraSepolia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
