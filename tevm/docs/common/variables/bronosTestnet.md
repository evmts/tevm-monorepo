[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / bronosTestnet

# Variable: bronosTestnet

> `const` **bronosTestnet**: `Common`

Creates a common configuration for the bronosTestnet chain.

## Description

Chain ID: 1038
Chain Name: Bronos Testnet
Default Block Explorer: https://tbroscan.bronos.org
Default RPC URL: https://evm-testnet.bronos.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { bronosTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: bronosTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/bronosTestnet.d.ts:21
