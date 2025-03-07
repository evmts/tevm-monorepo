[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / gobi

# Variable: gobi

> `const` **gobi**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/gobi.d.ts:21

Creates a common configuration for the gobi chain.

## Description

Chain ID: 1663
Chain Name: Horizen Gobi Testnet
Default Block Explorer: https://gobi-explorer.horizen.io
Default RPC URL: https://gobi-testnet.horizenlabs.io/ethv1

## Example

```ts
import { createMemoryClient } from 'tevm'
import { gobi } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: gobi,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
