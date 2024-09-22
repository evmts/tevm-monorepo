[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / cronoszkEVMTestnet

# Variable: cronoszkEVMTestnet

> `const` **cronoszkEVMTestnet**: `Common`

Creates a common configuration for the cronoszkEVMTestnet chain.

## Description

Chain ID: 282
Chain Name: Cronos zkEVM Testnet
Default Block Explorer: https://explorer.zkevm.cronos.org/testnet
Default RPC URL: https://testnet.zkevm.cronos.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { cronoszkEVMTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: cronoszkEVMTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/cronoszkEVMTestnet.d.ts:21
