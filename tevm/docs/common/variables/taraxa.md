[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / taraxa

# Variable: taraxa

> `const` **taraxa**: `Common`

Creates a common configuration for the taraxa chain.

## Description

Chain ID: 841
Chain Name: Taraxa Mainnet
Default Block Explorer: https://explorer.mainnet.taraxa.io
Default RPC URL: https://rpc.mainnet.taraxa.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { taraxa } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: taraxa,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/taraxa.d.ts:21
