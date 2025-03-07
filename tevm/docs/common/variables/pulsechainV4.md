[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / pulsechainV4

# Variable: pulsechainV4

> `const` **pulsechainV4**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/pulsechainV4.d.ts:21

Creates a common configuration for the pulsechainV4 chain.

## Description

Chain ID: 943
Chain Name: PulseChain V4
Default Block Explorer: https://scan.v4.testnet.pulsechain.com
Default RPC URL: https://rpc.v4.testnet.pulsechain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { pulsechainV4 } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: pulsechainV4,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
