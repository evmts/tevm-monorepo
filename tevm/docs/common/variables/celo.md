[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / celo

# Variable: celo

> `const` **celo**: `Common`

Creates a common configuration for the celo chain.

## Description

Chain ID: 42220
Chain Name: Celo
Default Block Explorer: https://celoscan.io
Default RPC URL: https://forno.celo.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { celo } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: celo,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/celo.d.ts:21
