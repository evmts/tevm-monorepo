[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / iotaTestnet

# Variable: iotaTestnet

> `const` **iotaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/iotaTestnet.d.ts:21

Creates a common configuration for the iotaTestnet chain.

## Description

Chain ID: 1075
Chain Name: IOTA EVM Testnet
Default Block Explorer: https://explorer.evm.testnet.iotaledger.net
Default RPC URL: https://json-rpc.evm.testnet.iotaledger.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { iotaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: iotaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
