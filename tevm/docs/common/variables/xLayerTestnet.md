[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / xLayerTestnet

# Variable: xLayerTestnet

> `const` **xLayerTestnet**: `Common`

Creates a common configuration for the xLayerTestnet chain.

## Description

Chain ID: 195
Chain Name: X1 Testnet
Default Block Explorer: https://www.oklink.com/xlayer-test
Default RPC URL: https://xlayertestrpc.okx.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { xLayerTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: xLayerTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/xLayerTestnet.d.ts:21
