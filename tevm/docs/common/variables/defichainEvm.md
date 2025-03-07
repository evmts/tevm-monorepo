[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / defichainEvm

# Variable: defichainEvm

> `const` **defichainEvm**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/defichainEvm.d.ts:21

Creates a common configuration for the defichainEvm chain.

## Description

Chain ID: 1130
Chain Name: DeFiChain EVM Mainnet
Default Block Explorer: https://meta.defiscan.live
Default RPC URL: https://eth.mainnet.ocean.jellyfishsdk.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { defichainEvm } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: defichainEvm,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
