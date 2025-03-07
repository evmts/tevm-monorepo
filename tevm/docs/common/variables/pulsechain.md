[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / pulsechain

# Variable: pulsechain

> `const` **pulsechain**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/pulsechain.d.ts:21

Creates a common configuration for the pulsechain chain.

## Description

Chain ID: 369
Chain Name: PulseChain
Default Block Explorer: https://scan.pulsechain.com
Default RPC URL: https://rpc.pulsechain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { pulsechain } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: pulsechain,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
