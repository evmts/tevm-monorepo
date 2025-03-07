[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / okc

# Variable: okc

> `const` **okc**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/okc.d.ts:21

Creates a common configuration for the okc chain.

## Description

Chain ID: 66
Chain Name: OKC
Default Block Explorer: https://www.oklink.com/okc
Default RPC URL: https://exchainrpc.okex.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { okc } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: okc,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
