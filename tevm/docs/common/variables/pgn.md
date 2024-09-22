[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / pgn

# Variable: pgn

> `const` **pgn**: `Common`

Creates a common configuration for the pgn chain.

## Description

Chain ID: 424
Chain Name: PGN
Default Block Explorer: https://explorer.publicgoods.network
Default RPC URL: https://rpc.publicgoods.network

## Example

```ts
import { createMemoryClient } from 'tevm'
import { pgn } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: pgn,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/pgn.d.ts:21
