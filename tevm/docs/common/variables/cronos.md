[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / cronos

# Variable: cronos

> `const` **cronos**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/cronos.d.ts:21

Creates a common configuration for the cronos chain.

## Description

Chain ID: 25
Chain Name: Cronos Mainnet
Default Block Explorer: https://explorer.cronos.org
Default RPC URL: https://evm.cronos.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { cronos } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: cronos,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
