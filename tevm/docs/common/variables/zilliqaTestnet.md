[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / zilliqaTestnet

# Variable: zilliqaTestnet

> `const` **zilliqaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/zilliqaTestnet.d.ts:21

Creates a common configuration for the zilliqaTestnet chain.

## Description

Chain ID: 33101
Chain Name: Zilliqa Testnet
Default Block Explorer: https://evmx.testnet.zilliqa.com
Default RPC URL: https://dev-api.zilliqa.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { zilliqaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: zilliqaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
