[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / syscoin

# Variable: syscoin

> `const` **syscoin**: `Common`

Creates a common configuration for the syscoin chain.

## Description

Chain ID: 57
Chain Name: Syscoin Mainnet
Default Block Explorer: https://explorer.syscoin.org
Default RPC URL: https://rpc.syscoin.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { syscoin } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: syscoin,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/syscoin.d.ts:21
