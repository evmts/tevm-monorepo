[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / immutableZkEvmTestnet

# Variable: immutableZkEvmTestnet

> `const` **immutableZkEvmTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/immutableZkEvmTestnet.d.ts:21

Creates a common configuration for the immutableZkEvmTestnet chain.

## Description

Chain ID: 13473
Chain Name: Immutable zkEVM Testnet
Default Block Explorer: https://explorer.testnet.immutable.com/
Default RPC URL: https://rpc.testnet.immutable.com

## Example

```ts
import { createMemoryClient } from 'tevm'
import { immutableZkEvmTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: immutableZkEvmTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
