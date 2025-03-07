[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zilliqa

# Variable: zilliqa

> `const` **zilliqa**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zilliqa.d.ts:21

Creates a common configuration for the zilliqa chain.

## Description

Chain ID: 32769
Chain Name: Zilliqa
Default Block Explorer: https://evmx.zilliqa.com
Default RPC URL: https://api.zilliqa.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zilliqa } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zilliqa,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
