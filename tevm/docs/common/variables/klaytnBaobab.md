[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / klaytnBaobab

# Variable: klaytnBaobab

> `const` **klaytnBaobab**: [`Common`](../type-aliases/Common.md)

Defined in: packages/common/types/presets/klaytnBaobab.d.ts:21

Creates a common configuration for the klaytnBaobab chain.

## Description

Chain ID: 1001
Chain Name: Klaytn Baobab Testnet
Default Block Explorer: https://baobab.klaytnscope.com
Default RPC URL: https://public-en-baobab.klaytn.net

## Example

```ts
import { createMemoryClient } from 'tevm'
import { klaytnBaobab } from 'tevm/common'
import { http } from 'tevm'

const client = createMemoryClient({
  common: klaytnBaobab,
  fork: {
    transport: http({ url: 'https://example.com' })({})
  },
})
```
