[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / nautilus

# Variable: nautilus

> `const` **nautilus**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/nautilus.d.ts:21

Creates a common configuration for the nautilus chain.

## Description

Chain ID: 22222
Chain Name: Nautilus Mainnet
Default Block Explorer: https://nautscan.com
Default RPC URL: https://api.nautilus.nautchain.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { nautilus } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: nautilus,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
