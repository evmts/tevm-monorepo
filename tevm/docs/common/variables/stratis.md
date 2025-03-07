[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / stratis

# Variable: stratis

> `const` **stratis**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/stratis.d.ts:21

Creates a common configuration for the stratis chain.

## Description

Chain ID: 105105
Chain Name: Stratis Mainnet
Default Block Explorer: https://explorer.stratisevm.com
Default RPC URL: https://rpc.stratisevm.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { stratis } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: stratis,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
