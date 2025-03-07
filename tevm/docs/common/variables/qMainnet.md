[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / qMainnet

# Variable: qMainnet

> `const` **qMainnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/qMainnet.d.ts:21

Creates a common configuration for the qMainnet chain.

## Description

Chain ID: 35441
Chain Name: Q Mainnet
Default Block Explorer: https://explorer.q.org
Default RPC URL: https://rpc.q.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { qMainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: qMainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
