[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / shibarium

# Variable: shibarium

> `const` **shibarium**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/shibarium.d.ts:21

Creates a common configuration for the shibarium chain.

## Description

Chain ID: 109
Chain Name: Shibarium
Default Block Explorer: https://shibariumscan.io
Default RPC URL: https://rpc.shibrpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { shibarium } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: shibarium,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
