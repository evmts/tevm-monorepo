---
editUrl: false
next: false
prev: false
title: "tevmTransport"
---

> **tevmTransport**(`tevm`, `options`?): `Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

## Parameters

• **tevm**: `Pick`\<`Eip1193RequestProvider`, `"request"`\> \| `Pick`\<`object`, `"request"`\>

The Tevm instance

• **options?**: `Pick`\<`TransportConfig`\<`string`, `EIP1193RequestFn`\>, `"name"` \| `"key"` \| `"timeout"` \| `"retryCount"` \| `"retryDelay"`\>

## Returns

`Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>

The transport function

## Defined in

[extensions/viem/src/tevmTransport.js:8](https://github.com/qbzzt/tevm-monorepo/blob/main/extensions/viem/src/tevmTransport.js#L8)
