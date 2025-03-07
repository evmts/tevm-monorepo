[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / meterTestnet

# Variable: meterTestnet

> `const` **meterTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/meterTestnet.d.ts:21

Creates a common configuration for the meterTestnet chain.

## Description

Chain ID: 83
Chain Name: Meter Testnet
Default Block Explorer: https://scan-warringstakes.meter.io
Default RPC URL: https://rpctest.meter.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { meterTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: meterTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
