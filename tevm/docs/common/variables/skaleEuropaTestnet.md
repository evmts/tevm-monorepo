[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / skaleEuropaTestnet

# Variable: skaleEuropaTestnet

> `const` **skaleEuropaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/skaleEuropaTestnet.d.ts:21

Creates a common configuration for the skaleEuropaTestnet chain.

## Description

Chain ID: 1444673419
Chain Name: SKALE Europa Testnet
Default Block Explorer: https://juicy-low-small-testnet.explorer.testnet.skalenodes.com
Default RPC URL: https://testnet.skalenodes.com/v1/juicy-low-small-testnet

## Example

```ts
import { createMemoryClient } from 'tevm'
import { skaleEuropaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: skaleEuropaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
