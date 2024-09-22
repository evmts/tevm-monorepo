[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / qMainnet

# Variable: qMainnet

> `const` **qMainnet**: `Common`

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

## Defined in

packages/common/types/presets/qMainnet.d.ts:21
