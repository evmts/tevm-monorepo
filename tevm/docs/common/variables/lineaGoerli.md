[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / lineaGoerli

# Variable: lineaGoerli

> `const` **lineaGoerli**: `Common`

Creates a common configuration for the lineaGoerli chain.

## Description

Chain ID: 59140
Chain Name: Linea Goerli Testnet
Default Block Explorer: https://goerli.lineascan.build
Default RPC URL: https://rpc.goerli.linea.build

## Example

```ts
import { createMemoryClient } from 'tevm'
import { lineaGoerli } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: lineaGoerli,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/lineaGoerli.d.ts:21
