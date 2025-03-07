[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / moonbeamDev

# Variable: moonbeamDev

> `const` **moonbeamDev**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/moonbeamDev.d.ts:21

Creates a common configuration for the moonbeamDev chain.

## Description

Chain ID: 1281
Chain Name: Moonbeam Development Node
Default Block Explorer: Not specified
Default RPC URL: http://127.0.0.1:9944

## Example

```ts
import { createMemoryClient } from 'tevm'
import { moonbeamDev } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: moonbeamDev,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
