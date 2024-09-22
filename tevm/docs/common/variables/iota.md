[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / iota

# Variable: iota

> `const` **iota**: `Common`

Creates a common configuration for the iota chain.

## Description

Chain ID: 8822
Chain Name: IOTA EVM
Default Block Explorer: https://explorer.evm.iota.org
Default RPC URL: https://json-rpc.evm.iotaledger.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { iota } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: iota,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/iota.d.ts:21
