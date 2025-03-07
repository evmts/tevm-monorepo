[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / localhost

# Variable: localhost

> `const` **localhost**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/localhost.d.ts:21

Creates a common configuration for the localhost chain.

## Description

Chain ID: 1337
Chain Name: Localhost
Default Block Explorer: Not specified
Default RPC URL: http://127.0.0.1:8545

## Example

```ts
import { createMemoryClient } from 'tevm'
import { localhost } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: localhost,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
