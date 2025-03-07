[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / haqqTestedge2

# Variable: haqqTestedge2

> `const` **haqqTestedge2**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/haqqTestedge2.d.ts:21

Creates a common configuration for the haqqTestedge2 chain.

## Description

Chain ID: 54211
Chain Name: HAQQ Testedge 2
Default Block Explorer: https://explorer.testedge2.haqq.network
Default RPC URL: https://rpc.eth.testedge2.haqq.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { haqqTestedge2 } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: haqqTestedge2,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
