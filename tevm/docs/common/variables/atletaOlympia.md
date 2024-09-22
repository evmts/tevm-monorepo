[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / atletaOlympia

# Variable: atletaOlympia

> `const` **atletaOlympia**: `Common`

Creates a common configuration for the atletaOlympia chain.

## Description

Chain ID: 2340
Chain Name: Atleta Olympia
Default Block Explorer: https://blockscout.atleta.network
Default RPC URL: https://testnet-rpc.atleta.network:9944

## Example

```ts
import { createMemoryClient } from 'tevm'
import { atletaOlympia } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: atletaOlympia,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/atletaOlympia.d.ts:21
