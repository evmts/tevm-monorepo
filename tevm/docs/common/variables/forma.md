[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / forma

# Variable: forma

> `const` **forma**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/forma.d.ts:21

Creates a common configuration for the forma chain.

## Description

Chain ID: 984122
Chain Name: Forma
Default Block Explorer: https://explorer.forma.art
Default RPC URL: https://rpc.forma.art

## Example

```ts
import { createMemoryClient } from 'tevm'
import { forma } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: forma,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
