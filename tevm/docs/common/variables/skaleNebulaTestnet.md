[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleNebulaTestnet

# Variable: skaleNebulaTestnet

> `const` **skaleNebulaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleNebulaTestnet.d.ts:21

Creates a common configuration for the skaleNebulaTestnet chain.

## Description

Chain ID: 37084624
Chain Name: SKALE Nebula Testnet
Default Block Explorer: https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com
Default RPC URL: https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleNebulaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleNebulaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
