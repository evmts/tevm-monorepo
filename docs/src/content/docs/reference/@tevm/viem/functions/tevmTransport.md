---
editUrl: false
next: false
prev: false
title: "tevmTransport"
---

> **tevmTransport**(`tevm`, `options`?): `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

## Parameters

• **tevm**: `Pick`\<[`MemoryClient`](/reference/memory-client/type-aliases/memoryclient/), `"request"`\>

The Tevm instance

• **options?**: `Pick`\<`TransportConfig`\<`string`, `EIP1193RequestFn`\>, `"name"` \| `"key"`\>

## Returns

`Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

The transport function

## Source

[tevmTransport.js:8](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmTransport.js#L8)
