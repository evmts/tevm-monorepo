[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / kavaTestnet

# Variable: kavaTestnet

> `const` **kavaTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/kavaTestnet.d.ts:21

Creates a common configuration for the kavaTestnet chain.

## Description

Chain ID: 2221
Chain Name: Kava EVM Testnet
Default Block Explorer: https://testnet.kavascan.com/
Default RPC URL: https://evm.testnet.kava.io

## Example

```ts
import { createMemoryClient } from 'tevm'
import { kavaTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: kavaTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
