[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / curtis

# Variable: curtis

> `const` **curtis**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/curtis.d.ts:21

Creates a common configuration for the curtis chain.

## Description

Chain ID: 33111
Chain Name: Curtis
Default Block Explorer: https://explorer.curtis.apechain.com
Default RPC URL: https://rpc.curtis.apechain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { curtis } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: curtis,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
