[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / fibo

# Variable: fibo

> `const` **fibo**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/fibo.d.ts:21

Creates a common configuration for the fibo chain.

## Description

Chain ID: 12306
Chain Name: Fibo Chain
Default Block Explorer: https://scan.fibochain.org
Default RPC URL: https://network.hzroc.art

## Example

```ts
import { createMemoryClient } from 'tevm'
import { fibo } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: fibo,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
