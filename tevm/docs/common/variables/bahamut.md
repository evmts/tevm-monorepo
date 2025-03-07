[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / bahamut

# Variable: bahamut

> `const` **bahamut**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/bahamut.d.ts:21

Creates a common configuration for the bahamut chain.

## Description

Chain ID: 5165
Chain Name: Bahamut
Default Block Explorer: https://www.ftnscan.com
Default RPC URL: https://rpc1.bahamut.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bahamut } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bahamut,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
