[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / classic

# Variable: classic

> `const` **classic**: `Common`

Creates a common configuration for the classic chain.

## Description

Chain ID: 61
Chain Name: Ethereum Classic
Default Block Explorer: https://blockscout.com/etc/mainnet
Default RPC URL: https://etc.rivet.link

## Example

```ts
import { createMemoryClient } from 'tevm'
import { classic } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: classic,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/classic.d.ts:21
