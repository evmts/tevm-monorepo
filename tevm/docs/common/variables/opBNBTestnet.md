[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / opBNBTestnet

# Variable: opBNBTestnet

> `const` **opBNBTestnet**: `Common`

Creates a common configuration for the opBNBTestnet chain.

## Description

Chain ID: 5611
Chain Name: opBNB Testnet
Default Block Explorer: https://testnet.opbnbscan.com
Default RPC URL: https://opbnb-testnet-rpc.bnbchain.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { opBNBTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: opBNBTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/opBNBTestnet.d.ts:21
