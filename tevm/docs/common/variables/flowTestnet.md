[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / flowTestnet

# Variable: flowTestnet

> `const` **flowTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/flowTestnet.d.ts:21

Creates a common configuration for the flowTestnet chain.

## Description

Chain ID: 545
Chain Name: FlowEVM Testnet
Default Block Explorer: https://testnet.flowdiver.io
Default RPC URL: https://testnet.evm.nodes.onflow.org

## Example

```ts
import { createMemoryClient } from 'tevm'
import { flowTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: flowTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
