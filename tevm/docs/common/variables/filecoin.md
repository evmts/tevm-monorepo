[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / filecoin

# Variable: filecoin

> `const` **filecoin**: `Common`

Creates a common configuration for the filecoin chain.

## Description

Chain ID: 314
Chain Name: Filecoin Mainnet
Default Block Explorer: https://filfox.info/en
Default RPC URL: https://api.node.glif.io/rpc/v1

## Example

```ts
import { createMemoryClient } from 'tevm'
import { filecoin } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: filecoin,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/filecoin.d.ts:21
