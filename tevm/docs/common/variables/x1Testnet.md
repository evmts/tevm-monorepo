[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / x1Testnet

# Variable: x1Testnet

> `const` **x1Testnet**: `Common`

Creates a common configuration for the x1Testnet chain.

## Description

Chain ID: 195
Chain Name: X1 Testnet
Default Block Explorer: https://www.oklink.com/xlayer-test
Default RPC URL: https://xlayertestrpc.okx.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { x1Testnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: x1Testnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/x1Testnet.d.ts:21
