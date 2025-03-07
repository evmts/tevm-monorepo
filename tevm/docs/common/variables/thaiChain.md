[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / thaiChain

# Variable: thaiChain

> `const` **thaiChain**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/thaiChain.d.ts:21

Creates a common configuration for the thaiChain chain.

## Description

Chain ID: 7
Chain Name: ThaiChain
Default Block Explorer: https://exp.thaichain.org
Default RPC URL: https://rpc.thaichain.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { thaiChain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: thaiChain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
