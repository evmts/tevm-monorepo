[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / berachainTestnet

# Variable: berachainTestnet

> `const` **berachainTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/berachainTestnet.d.ts:21

Creates a common configuration for the berachainTestnet chain.

## Description

Chain ID: 80085
Chain Name: Berachain Artio
Default Block Explorer: https://artio.beratrail.io
Default RPC URL: https://artio.rpc.berachain.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { berachainTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: berachainTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
