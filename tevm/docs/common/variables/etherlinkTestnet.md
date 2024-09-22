[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / etherlinkTestnet

# Variable: etherlinkTestnet

> `const` **etherlinkTestnet**: `Common`

Creates a common configuration for the etherlinkTestnet chain.

## Description

Chain ID: 128123
Chain Name: Etherlink Testnet
Default Block Explorer: https://testnet-explorer.etherlink.com
Default RPC URL: https://node.ghostnet.etherlink.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { etherlinkTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: etherlinkTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/etherlinkTestnet.d.ts:21
