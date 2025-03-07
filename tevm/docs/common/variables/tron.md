[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / tron

# Variable: tron

> `const` **tron**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/tron.d.ts:21

Creates a common configuration for the tron chain.

## Description

Chain ID: 728126428
Chain Name: Tron
Default Block Explorer: https://tronscan.org
Default RPC URL: https://api.trongrid.io/jsonrpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { tron } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: tron,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
