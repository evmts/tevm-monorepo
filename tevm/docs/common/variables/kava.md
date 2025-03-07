[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / kava

# Variable: kava

> `const` **kava**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/kava.d.ts:21

Creates a common configuration for the kava chain.

## Description

Chain ID: 2222
Chain Name: Kava EVM
Default Block Explorer: https://kavascan.com
Default RPC URL: https://evm.kava.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kava } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kava,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
