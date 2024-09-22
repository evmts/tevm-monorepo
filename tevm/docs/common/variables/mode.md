[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / mode

# Variable: mode

> `const` **mode**: `Common`

Creates a common configuration for the mode chain.

## Description

Chain ID: 34443
Chain Name: Mode Mainnet
Default Block Explorer: https://modescan.io
Default RPC URL: https://mainnet.mode.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mode } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mode,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/mode.d.ts:21
