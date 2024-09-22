[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / confluxESpaceTestnet

# Variable: confluxESpaceTestnet

> `const` **confluxESpaceTestnet**: `Common`

Creates a common configuration for the confluxESpaceTestnet chain.

## Description

Chain ID: 71
Chain Name: Conflux eSpace Testnet
Default Block Explorer: https://evmtestnet.confluxscan.io
Default RPC URL: https://evmtestnet.confluxrpc.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { confluxESpaceTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: confluxESpaceTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```

## Defined in

packages/common/types/presets/confluxESpaceTestnet.d.ts:21
