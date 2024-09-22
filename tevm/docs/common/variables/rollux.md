[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / rollux

# Variable: rollux

> `const` **rollux**: `Common`

Creates a common configuration for the rollux chain.

## Description

Chain ID: 570
Chain Name: Rollux Mainnet
Default Block Explorer: https://explorer.rollux.com
Default RPC URL: https://rpc.rollux.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { rollux } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: rollux,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/rollux.d.ts:21
