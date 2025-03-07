[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / beamTestnet

# Variable: beamTestnet

> `const` **beamTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/beamTestnet.d.ts:21

Creates a common configuration for the beamTestnet chain.

## Description

Chain ID: 13337
Chain Name: Beam Testnet
Default Block Explorer: https://subnets-test.avax.network/beam
Default RPC URL: https://build.onbeam.com/rpc/testnet

## Example

```ts
import { createMemoryClient } from 'tevm'
import { beamTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: beamTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
