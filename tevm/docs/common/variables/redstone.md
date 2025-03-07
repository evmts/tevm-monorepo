[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / redstone

# Variable: redstone

> `const` **redstone**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/redstone.d.ts:21

Creates a common configuration for the redstone chain.

## Description

Chain ID: 690
Chain Name: Redstone
Default Block Explorer: 	https://explorer.redstone.xyz
Default RPC URL: https://rpc.redstonechain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { redstone } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: redstone,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
