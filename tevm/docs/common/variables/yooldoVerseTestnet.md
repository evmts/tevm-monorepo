[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / yooldoVerseTestnet

# Variable: yooldoVerseTestnet

> `const` **yooldoVerseTestnet**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/yooldoVerseTestnet.d.ts:21

Creates a common configuration for the yooldoVerseTestnet chain.

## Description

Chain ID: 50006
Chain Name: Yooldo Verse Testnet
Default Block Explorer: https://explorer.testnet.yooldo-verse.xyz
Default RPC URL: https://rpc.testnet.yooldo-verse.xyz

## Example

```ts
import { createMemoryClient } from 'tevm'
import { yooldoVerseTestnet } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: yooldoVerseTestnet,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
