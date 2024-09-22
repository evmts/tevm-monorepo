[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / xai

# Variable: xai

> `const` **xai**: `Common`

Creates a common configuration for the xai chain.

## Description

Chain ID: 660279
Chain Name: Xai Mainnet
Default Block Explorer: https://explorer.xai-chain.net
Default RPC URL: https://xai-chain.net/rpc

## Example

```ts
import { createMemoryClient } from 'tevm'
import { xai } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: xai,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/xai.d.ts:21
