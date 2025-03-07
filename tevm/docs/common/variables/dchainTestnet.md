[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / dchainTestnet

# Variable: dchainTestnet

> `const` **dchainTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/dchainTestnet.d.ts:21

Creates a common configuration for the dchainTestnet chain.

## Description

Chain ID: 2713017997578000
Chain Name: Dchain Testnet
Default Block Explorer: https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io
Default RPC URL: https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { dchainTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: dchainTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
