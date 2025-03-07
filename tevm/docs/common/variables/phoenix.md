[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / phoenix

# Variable: phoenix

> `const` **phoenix**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/phoenix.d.ts:21

Creates a common configuration for the phoenix chain.

## Description

Chain ID: 13381
Chain Name: Phoenix Blockchain
Default Block Explorer: https://phoenixplorer.com
Default RPC URL: https://rpc.phoenixplorer.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { phoenix } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: phoenix,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
