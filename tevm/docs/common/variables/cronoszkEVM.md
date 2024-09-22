[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / cronoszkEVM

# Variable: cronoszkEVM

> `const` **cronoszkEVM**: `Common`

Creates a common configuration for the cronoszkEVM chain.

## Description

Chain ID: 388
Chain Name: Cronos zkEVM Mainnet
Default Block Explorer: https://explorer.zkevm.cronos.org
Default RPC URL: https://mainnet.zkevm.cronos.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { cronoszkEVM } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: cronoszkEVM,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/cronoszkEVM.d.ts:21
