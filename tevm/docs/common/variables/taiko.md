[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / taiko

# Variable: taiko

> `const` **taiko**: `Common`

Creates a common configuration for the taiko chain.

## Description

Chain ID: 167000
Chain Name: Taiko Mainnet
Default Block Explorer: https://taikoscan.io
Default RPC URL: https://rpc.mainnet.taiko.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { taiko } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: taiko,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/taiko.d.ts:21
