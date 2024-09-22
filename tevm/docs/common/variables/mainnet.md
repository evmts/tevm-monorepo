[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / mainnet

# Variable: mainnet

> `const` **mainnet**: `Common`

Creates a common configuration for the mainnet chain.

## Description

Chain ID: 1
Chain Name: Ethereum
Default Block Explorer: https://etherscan.io
Default RPC URL: https://cloudflare-eth.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { mainnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: mainnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/mainnet.d.ts:21
