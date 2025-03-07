[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / wemixTestnet

# Variable: wemixTestnet

> `const` **wemixTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/wemixTestnet.d.ts:21

Creates a common configuration for the wemixTestnet chain.

## Description

Chain ID: 1112
Chain Name: WEMIX Testnet
Default Block Explorer: https://testnet.wemixscan.com
Default RPC URL: https://api.test.wemix.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { wemixTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: wemixTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
