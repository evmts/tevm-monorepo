[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / lineaTestnet

# Variable: lineaTestnet

> `const` **lineaTestnet**: `Common`

Creates a common configuration for the lineaTestnet chain.

## Description

Chain ID: 59140
Chain Name: Linea Goerli Testnet
Default Block Explorer: https://goerli.lineascan.build
Default RPC URL: https://rpc.goerli.linea.build

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lineaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lineaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/lineaTestnet.d.ts:21
