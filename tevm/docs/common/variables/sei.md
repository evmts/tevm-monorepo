[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / sei

# Variable: sei

> `const` **sei**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/sei.d.ts:21

Creates a common configuration for the sei chain.

## Description

Chain ID: 1329
Chain Name: Sei Network
Default Block Explorer: https://seitrace.com
Default RPC URL: https://evm-rpc.sei-apis.com/

## Example

```ts
import { createMemoryClient } from 'tevm'
import { sei } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: sei,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
