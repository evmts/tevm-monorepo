[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / ekta

# Variable: ekta

> `const` **ekta**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/ekta.d.ts:21

Creates a common configuration for the ekta chain.

## Description

Chain ID: 1994
Chain Name: Ekta
Default Block Explorer: https://ektascan.io
Default RPC URL: https://main.ekta.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { ekta } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: ekta,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
