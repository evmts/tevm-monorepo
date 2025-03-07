[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / xaiTestnet

# Variable: xaiTestnet

> `const` **xaiTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/xaiTestnet.d.ts:21

Creates a common configuration for the xaiTestnet chain.

## Description

Chain ID: 37714555429
Chain Name: Xai Testnet
Default Block Explorer: https://testnet-explorer-v2.xai-chain.net
Default RPC URL: https://testnet-v2.xai-chain.net/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { xaiTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: xaiTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
