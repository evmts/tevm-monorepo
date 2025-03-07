[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / ronin

# Variable: ronin

> `const` **ronin**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/ronin.d.ts:21

Creates a common configuration for the ronin chain.

## Description

Chain ID: 2020
Chain Name: Ronin
Default Block Explorer: https://app.roninchain.com
Default RPC URL: https://api.roninchain.com/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { ronin } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: ronin,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
