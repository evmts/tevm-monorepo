[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / lightlinkPegasus

# Variable: lightlinkPegasus

> `const` **lightlinkPegasus**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/lightlinkPegasus.d.ts:21

Creates a common configuration for the lightlinkPegasus chain.

## Description

Chain ID: 1891
Chain Name: LightLink Pegasus Testnet
Default Block Explorer: https://pegasus.lightlink.io
Default RPC URL: https://replicator.pegasus.lightlink.io/rpc/v1

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lightlinkPegasus } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lightlinkPegasus,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
