[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / unreal

# Variable: unreal

> `const` **unreal**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/unreal.d.ts:21

Creates a common configuration for the unreal chain.

## Description

Chain ID: 18233
Chain Name: Unreal
Default Block Explorer: https://unreal.blockscout.com
Default RPC URL: https://rpc.unreal-orbit.gelato.digital

## Example

```ts
import { createMemoryClient } from 'tevm'
import { unreal } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: unreal,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
