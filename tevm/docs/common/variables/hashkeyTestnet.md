[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / hashkeyTestnet

# Variable: hashkeyTestnet

> `const` **hashkeyTestnet**: `Common`

Creates a common configuration for the hashkeyTestnet chain.

## Description

Chain ID: 133
Chain Name: HashKey Chain Testnet
Default Block Explorer: https://hashkeychain-testnet-explorer.alt.technology
Default RPC URL: https://hashkeychain-testnet.alt.technology

## Example

```ts
import { createMemoryClient } from 'tevm'
import { hashkeyTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: hashkeyTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/hashkeyTestnet.d.ts:21
