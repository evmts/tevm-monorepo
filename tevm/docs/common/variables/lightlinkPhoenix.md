[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / lightlinkPhoenix

# Variable: lightlinkPhoenix

> `const` **lightlinkPhoenix**: `Common`

Creates a common configuration for the lightlinkPhoenix chain.

## Description

Chain ID: 1890
Chain Name: LightLink Phoenix Mainnet
Default Block Explorer: https://phoenix.lightlink.io
Default RPC URL: https://replicator.phoenix.lightlink.io/rpc/v1

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lightlinkPhoenix } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lightlinkPhoenix,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/lightlinkPhoenix.d.ts:21
